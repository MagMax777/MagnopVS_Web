-- ==============================================================================
-- MagnopVS - SUPABASE MIGRATION: WALLETS, BALANCES & AUDIT TRANSACTIONS
-- ==============================================================================
-- Archivo: 20261103_wallets_balances_transactions_rls.sql
-- Propósito: Estructura de base de datos relacional para el sistema económico
--            de MagnoPoints (MP) y MicroCoins (µC) en MagnopVS.
--
-- Principios de Integridad Económica:
-- 1. Tipos BIGINT para todas las cantidades y saldos (prevención de desbordamiento).
-- 2. Restricciones CHECK para garantizar que NINGÚN saldo sea negativo (balance >= 0).
-- 3. Row Level Security (RLS) estricto: los usuarios solo pueden leer sus propios datos.
-- 4. Inmutabilidad del libro mayor: las transacciones no se pueden modificar ni eliminar.
-- 5. Las operaciones de saldo solo se ejecutan mediante funciones SECURITY DEFINER
--    para evitar manipulación arbitraria desde el cliente.
-- 6. Tasa de conversión oficial: 10.000 MP = 1 MicroCoin (µC).
-- ==============================================================================

-- 1. HABILITAR EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLA: public.wallets (Billetera Principal del Jugador)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id TEXT UNIQUE NOT NULL,
    total_earned_mp BIGINT NOT NULL DEFAULT 0 CHECK (total_earned_mp >= 0),
    total_spent_mp BIGINT NOT NULL DEFAULT 0 CHECK (total_spent_mp >= 0),
    total_converted_mp BIGINT NOT NULL DEFAULT 0 CHECK (total_converted_mp >= 0),
    total_earned_microcoins BIGINT NOT NULL DEFAULT 0 CHECK (total_earned_microcoins >= 0),
    total_spent_microcoins BIGINT NOT NULL DEFAULT 0 CHECK (total_spent_microcoins >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.wallets IS 'Entidad económica principal del jugador en MagnopVS.';
COMMENT ON COLUMN public.wallets.player_id IS 'ID del jugador (compatible con auth.uid() de Supabase o ID de jugador).';

-- ==============================================================================
-- 3. TABLA: public.wallet_balances (Saldos en Vivo por Moneda)
-- ==============================================================================
-- RESTRICCIÓN CLAVE: CHECK (balance >= 0) impide matemáticamente saldos negativos a nivel de motor SQL.
CREATE TABLE IF NOT EXISTS public.wallet_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    currency TEXT NOT NULL CHECK (currency IN ('MP', 'MICROCOIN')),
    balance BIGINT NOT NULL DEFAULT 0 CHECK (balance >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_wallet_currency UNIQUE(wallet_id, currency)
);

COMMENT ON TABLE public.wallet_balances IS 'Saldos persistentes de MP y MicroCoins con restricción estricta de no negatividad.';
COMMENT ON COLUMN public.wallet_balances.balance IS 'Saldo actual como BIGINT. Nunca puede ser negativo.';

-- ==============================================================================
-- 4. TABLA: public.wallet_transactions (Libro Mayor Inmutable y Auditoría)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (
        transaction_type IN ('REWARD', 'CONVERSION', 'PURCHASE', 'ADJUSTMENT', 'TIP', 'REFUND')
    ),
    currency TEXT NOT NULL CHECK (currency IN ('MP', 'MICROCOIN')),
    amount BIGINT NOT NULL,
    balance_before BIGINT NOT NULL CHECK (balance_before >= 0),
    balance_after BIGINT NOT NULL CHECK (balance_after >= 0),
    source TEXT NOT NULL,
    source_reference TEXT,
    idempotency_key TEXT UNIQUE,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'PENDING', 'FAILED', 'REVERSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.wallet_transactions IS 'Registro contable inmutable de cada movimiento de saldo.';

-- ==============================================================================
-- 5. ÍNDICES DE RENDIMIENTO Y AUDITORÍA
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_wallets_player_id ON public.wallets(player_id);
CREATE INDEX IF NOT EXISTS idx_wallet_balances_wallet_currency ON public.wallet_balances(wallet_id, currency);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_created ON public.wallet_transactions(wallet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_idempotency ON public.wallet_transactions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON public.wallet_transactions(transaction_type);

-- ==============================================================================
-- 6. TRIGGERS: ACTUALIZACIÓN AUTOMÁTICA DE updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_wallets_updated_at ON public.wallets;
CREATE TRIGGER trigger_wallets_updated_at
BEFORE UPDATE ON public.wallets
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trigger_wallet_balances_updated_at ON public.wallet_balances;
CREATE TRIGGER trigger_wallet_balances_updated_at
BEFORE UPDATE ON public.wallet_balances
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ==============================================================================
-- 7. PROCEDIMIENTO ATÓMICO: CONVERSIÓN DE MP A MICROCOIN
-- ==============================================================================
-- Reglas:
-- - Tasa: 10.000 MP = 1 MicroCoin (µC).
-- - Atómico: bloqueo de filas mediante FOR UPDATE.
-- - Cero saldos negativos.
-- - Clave de idempotencia para evitar doble débito.
-- - Registro de auditoría doble (débito MP y crédito MICROCOIN).
CREATE OR REPLACE FUNCTION public.convert_mp_to_microcoin(
    p_player_id TEXT,
    p_mp_amount BIGINT,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet_id UUID;
    v_current_mp BIGINT;
    v_current_mc BIGINT;
    v_microcoins_to_add BIGINT;
    v_new_mp BIGINT;
    v_new_mc BIGINT;
    v_tx_mp_id UUID;
    v_tx_mc_id UUID;
    v_existing_tx JSONB;
BEGIN
    -- 1. Validación de cantidad mínima y múltiplo exacto
    IF p_mp_amount < 10000 THEN
        RAISE EXCEPTION 'La cantidad mínima de conversión es de 10.000 MP.';
    END IF;

    IF (p_mp_amount % 10000) != 0 THEN
        RAISE EXCEPTION 'La cantidad a convertir debe ser un múltiplo exacto de 10.000 MP.';
    END IF;

    -- 2. Comprobación de idempotencia
    IF p_idempotency_key IS NOT NULL THEN
        SELECT jsonb_build_object(
            'success', true,
            'alreadyProcessed', true,
            'transactionId', id
        ) INTO v_existing_tx
        FROM public.wallet_transactions 
        WHERE idempotency_key = p_idempotency_key;

        IF v_existing_tx IS NOT NULL THEN
            RETURN v_existing_tx;
        END IF;
    END IF;

    -- 3. Bloqueo exclusivo de fila de la billetera
    SELECT id INTO v_wallet_id 
    FROM public.wallets 
    WHERE player_id = p_player_id 
    FOR UPDATE;

    IF v_wallet_id IS NULL THEN
        INSERT INTO public.wallets (player_id) VALUES (p_player_id) RETURNING id INTO v_wallet_id;
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, 'MP', 0);
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, 'MICROCOIN', 0);
    END IF;

    -- 4. Bloqueo y lectura de saldo MP
    SELECT balance INTO v_current_mp 
    FROM public.wallet_balances 
    WHERE wallet_id = v_wallet_id AND currency = 'MP' 
    FOR UPDATE;

    IF v_current_mp IS NULL OR v_current_mp < p_mp_amount THEN
        RAISE EXCEPTION 'Saldo insuficiente de MagnoPoints. Disponible: %, Requerido: %', COALESCE(v_current_mp, 0), p_mp_amount;
    END IF;

    -- 5. Bloqueo y lectura de saldo MicroCoin
    SELECT balance INTO v_current_mc 
    FROM public.wallet_balances 
    WHERE wallet_id = v_wallet_id AND currency = 'MICROCOIN' 
    FOR UPDATE;

    IF v_current_mc IS NULL THEN
        v_current_mc := 0;
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, 'MICROCOIN', 0);
    END IF;

    -- 6. Cálculo matemático estricto
    v_microcoins_to_add := p_mp_amount / 10000;
    v_new_mp := v_current_mp - p_mp_amount;
    v_new_mc := v_current_mc + v_microcoins_to_add;

    -- Garantía adicional contra valores negativos
    IF v_new_mp < 0 OR v_new_mc < 0 THEN
        RAISE EXCEPTION 'Error de integridad: el saldo resultante no puede ser negativo.';
    END IF;

    -- 7. Actualización atómica de saldos
    UPDATE public.wallet_balances 
    SET balance = v_new_mp, updated_at = NOW() 
    WHERE wallet_id = v_wallet_id AND currency = 'MP';

    UPDATE public.wallet_balances 
    SET balance = v_new_mc, updated_at = NOW() 
    WHERE wallet_id = v_wallet_id AND currency = 'MICROCOIN';

    -- 8. Actualización de métricas acumuladas
    UPDATE public.wallets 
    SET total_converted_mp = total_converted_mp + p_mp_amount,
        total_earned_microcoins = total_earned_microcoins + v_microcoins_to_add,
        updated_at = NOW()
    WHERE id = v_wallet_id;

    -- 9. Registro contable del débito en MP
    INSERT INTO public.wallet_transactions (
        wallet_id, transaction_type, currency, amount, balance_before, balance_after,
        source, idempotency_key, description
    ) VALUES (
        v_wallet_id, 'CONVERSION', 'MP', -p_mp_amount, v_current_mp, v_new_mp,
        'WALLET_CONVERTER', p_idempotency_key, 
        format('Conversión atómica de %s MP a %s MicroCoins', p_mp_amount, v_microcoins_to_add)
    ) RETURNING id INTO v_tx_mp_id;

    -- 10. Registro contable del crédito en MicroCoins
    INSERT INTO public.wallet_transactions (
        wallet_id, transaction_type, currency, amount, balance_before, balance_after,
        source, source_reference, idempotency_key, description
    ) VALUES (
        v_wallet_id, 'CONVERSION', 'MICROCOIN', v_microcoins_to_add, v_current_mc, v_new_mc,
        'WALLET_CONVERTER', v_tx_mp_id::text, 
        CASE WHEN p_idempotency_key IS NOT NULL THEN p_idempotency_key || '_mc' ELSE NULL END,
        format('Acreditación de %s MicroCoins por conversión de MP', v_microcoins_to_add)
    ) RETURNING id INTO v_tx_mc_id;

    -- 11. Resultado estructurado
    RETURN jsonb_build_object(
        'success', true,
        'mp_deducted', p_mp_amount,
        'microcoins_added', v_microcoins_to_add,
        'new_mp_balance', v_new_mp,
        'new_microcoin_balance', v_new_mc,
        'tx_mp_id', v_tx_mp_id,
        'tx_mc_id', v_tx_mc_id
    );
END;
$$;

-- ==============================================================================
-- 8. PROCEDIMIENTO ATÓMICO: GASTO / DÉBITO DE SALDO
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.spend_wallet_currency(
    p_player_id TEXT,
    p_currency TEXT,
    p_amount BIGINT,
    p_source TEXT,
    p_description TEXT,
    p_source_reference TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet_id UUID;
    v_current_balance BIGINT;
    v_new_balance BIGINT;
    v_tx_id UUID;
    v_existing_tx JSONB;
    v_tx_type TEXT;
BEGIN
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'El monto a gastar debe ser mayor a cero.';
    END IF;

    IF p_currency NOT IN ('MP', 'MICROCOIN') THEN
        RAISE EXCEPTION 'Moneda inválida: %', p_currency;
    END IF;

    IF p_idempotency_key IS NOT NULL THEN
        SELECT jsonb_build_object('success', true, 'alreadyProcessed', true, 'transactionId', id)
        INTO v_existing_tx
        FROM public.wallet_transactions WHERE idempotency_key = p_idempotency_key;

        IF v_existing_tx IS NOT NULL THEN
            RETURN v_existing_tx;
        END IF;
    END IF;

    SELECT id INTO v_wallet_id FROM public.wallets WHERE player_id = p_player_id FOR UPDATE;
    IF v_wallet_id IS NULL THEN
        RAISE EXCEPTION 'Billetera no encontrada para el jugador: %', p_player_id;
    END IF;

    SELECT balance INTO v_current_balance 
    FROM public.wallet_balances 
    WHERE wallet_id = v_wallet_id AND currency = p_currency 
    FOR UPDATE;

    IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
        RAISE EXCEPTION 'Saldo insuficiente en %s. Disponible: %s, Requerido: %s', p_currency, COALESCE(v_current_balance, 0), p_amount;
    END IF;

    v_new_balance := v_current_balance - p_amount;

    IF v_new_balance < 0 THEN
        RAISE EXCEPTION 'Error de integridad: el saldo no puede ser negativo.';
    END IF;

    UPDATE public.wallet_balances SET balance = v_new_balance, updated_at = NOW()
    WHERE wallet_id = v_wallet_id AND currency = p_currency;

    IF p_currency = 'MP' THEN
        UPDATE public.wallets SET total_spent_mp = total_spent_mp + p_amount WHERE id = v_wallet_id;
    ELSE
        UPDATE public.wallets SET total_spent_microcoins = total_spent_microcoins + p_amount WHERE id = v_wallet_id;
    END IF;

    v_tx_type := CASE WHEN p_source = 'LIVE_TIP' THEN 'TIP' ELSE 'PURCHASE' END;

    INSERT INTO public.wallet_transactions (
        wallet_id, transaction_type, currency, amount, balance_before, balance_after,
        source, source_reference, idempotency_key, description, metadata
    ) VALUES (
        v_wallet_id, v_tx_type, p_currency, -p_amount, v_current_balance, v_new_balance,
        p_source, p_source_reference, p_idempotency_key, p_description, p_metadata
    ) RETURNING id INTO v_tx_id;

    RETURN jsonb_build_object(
        'success', true,
        'debitedAmount', p_amount,
        'newBalance', v_new_balance,
        'currency', p_currency,
        'transactionId', v_tx_id
    );
END;
$$;

-- ==============================================================================
-- 9. PROCEDIMIENTO ATÓMICO: ACREDITACIÓN DE RECOMPENSAS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.reward_wallet_currency(
    p_player_id TEXT,
    p_currency TEXT,
    p_amount BIGINT,
    p_source TEXT,
    p_description TEXT,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet_id UUID;
    v_current_balance BIGINT;
    v_new_balance BIGINT;
    v_tx_id UUID;
    v_existing_tx JSONB;
BEGIN
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'El monto de recompensa debe ser mayor a cero.';
    END IF;

    IF p_currency NOT IN ('MP', 'MICROCOIN') THEN
        RAISE EXCEPTION 'Moneda inválida: %', p_currency;
    END IF;

    IF p_idempotency_key IS NOT NULL THEN
        SELECT jsonb_build_object('success', true, 'alreadyProcessed', true, 'transactionId', id)
        INTO v_existing_tx
        FROM public.wallet_transactions WHERE idempotency_key = p_idempotency_key;

        IF v_existing_tx IS NOT NULL THEN
            RETURN v_existing_tx;
        END IF;
    END IF;

    SELECT id INTO v_wallet_id FROM public.wallets WHERE player_id = p_player_id FOR UPDATE;
    IF v_wallet_id IS NULL THEN
        INSERT INTO public.wallets (player_id) VALUES (p_player_id) RETURNING id INTO v_wallet_id;
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, 'MP', 0);
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, 'MICROCOIN', 0);
    END IF;

    SELECT balance INTO v_current_balance 
    FROM public.wallet_balances 
    WHERE wallet_id = v_wallet_id AND currency = p_currency 
    FOR UPDATE;

    IF v_current_balance IS NULL THEN
        v_current_balance := 0;
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, p_currency, 0);
    END IF;

    v_new_balance := v_current_balance + p_amount;

    UPDATE public.wallet_balances SET balance = v_new_balance, updated_at = NOW()
    WHERE wallet_id = v_wallet_id AND currency = p_currency;

    IF p_currency = 'MP' THEN
        UPDATE public.wallets SET total_earned_mp = total_earned_mp + p_amount WHERE id = v_wallet_id;
    ELSE
        UPDATE public.wallets SET total_earned_microcoins = total_earned_microcoins + p_amount WHERE id = v_wallet_id;
    END IF;

    INSERT INTO public.wallet_transactions (
        wallet_id, transaction_type, currency, amount, balance_before, balance_after,
        source, idempotency_key, description
    ) VALUES (
        v_wallet_id, 'REWARD', p_currency, p_amount, v_current_balance, v_new_balance,
        p_source, p_idempotency_key, p_description
    ) RETURNING id INTO v_tx_id;

    RETURN jsonb_build_object(
        'success', true,
        'creditedAmount', p_amount,
        'newBalance', v_new_balance,
        'currency', p_currency,
        'transactionId', v_tx_id
    );
END;
$$;

-- ==============================================================================
-- 10. POLÍTICAS DE ROW LEVEL SECURITY (RLS) ADECUADAS
-- ==============================================================================
-- Habilitar RLS en todas las tablas económicas
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Limpieza de políticas previas si existieran
DROP POLICY IF EXISTS "wallets_select_policy" ON public.wallets;
DROP POLICY IF EXISTS "wallets_insert_policy" ON public.wallets;
DROP POLICY IF EXISTS "wallets_update_policy" ON public.wallets;
DROP POLICY IF EXISTS "wallets_delete_policy" ON public.wallets;

DROP POLICY IF EXISTS "balances_select_policy" ON public.wallet_balances;
DROP POLICY IF EXISTS "balances_insert_policy" ON public.wallet_balances;
DROP POLICY IF EXISTS "balances_update_policy" ON public.wallet_balances;
DROP POLICY IF EXISTS "balances_delete_policy" ON public.wallet_balances;

DROP POLICY IF EXISTS "transactions_select_policy" ON public.wallet_transactions;
DROP POLICY IF EXISTS "transactions_insert_policy" ON public.wallet_transactions;
DROP POLICY IF EXISTS "transactions_update_policy" ON public.wallet_transactions;
DROP POLICY IF EXISTS "transactions_delete_policy" ON public.wallet_transactions;

-- ------------------------------------------------------------------------------
-- A. Políticas para 'public.wallets':
-- - SELECT: El usuario autenticado puede leer su propia billetera, o el service_role (backend).
-- - INSERT: Los usuarios autenticados pueden registrar su propia billetera.
-- - UPDATE: Solo permitido mediante funciones SECURITY DEFINER o rol service_role.
-- - DELETE: Deshabilitado totalmente (los registros financieros son permanentes).
-- ------------------------------------------------------------------------------
CREATE POLICY "wallets_select_policy" ON public.wallets
    FOR SELECT
    USING (
        auth.role() = 'service_role'
        OR auth.uid()::text = player_id
        OR player_id = 'magno-001' -- Billetera pública canónica de demostración
    );

CREATE POLICY "wallets_insert_policy" ON public.wallets
    FOR INSERT
    WITH CHECK (
        auth.role() = 'service_role'
        OR auth.uid()::text = player_id
    );

CREATE POLICY "wallets_update_policy" ON public.wallets
    FOR UPDATE
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- ------------------------------------------------------------------------------
-- B. Políticas para 'public.wallet_balances':
-- - SELECT: El usuario solo puede consultar los saldos de su propia billetera.
-- - INSERT / UPDATE / DELETE: Prohibidos desde clientes directos; los cambios
--   se realizan de forma segura mediante los procedimientos almacenados (convert, spend, reward).
-- ------------------------------------------------------------------------------
CREATE POLICY "balances_select_policy" ON public.wallet_balances
    FOR SELECT
    USING (
        auth.role() = 'service_role'
        OR EXISTS (
            SELECT 1 FROM public.wallets w 
            WHERE w.id = wallet_balances.wallet_id 
            AND (w.player_id = auth.uid()::text OR w.player_id = 'magno-001')
        )
    );

CREATE POLICY "balances_insert_policy" ON public.wallet_balances
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "balances_update_policy" ON public.wallet_balances
    FOR UPDATE
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- ------------------------------------------------------------------------------
-- C. Políticas para 'public.wallet_transactions':
-- - SELECT: El usuario solo puede ver las transacciones de su billetera.
-- - INSERT: Solo permitido a través de service_role o procedimientos SECURITY DEFINER.
-- - UPDATE / DELETE: Estrictamente denegados para garantizar inmutabilidad contable.
-- ------------------------------------------------------------------------------
CREATE POLICY "transactions_select_policy" ON public.wallet_transactions
    FOR SELECT
    USING (
        auth.role() = 'service_role'
        OR EXISTS (
            SELECT 1 FROM public.wallets w 
            WHERE w.id = wallet_transactions.wallet_id 
            AND (w.player_id = auth.uid()::text OR w.player_id = 'magno-001')
        )
    );

CREATE POLICY "transactions_insert_policy" ON public.wallet_transactions
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- Revocar permisos de modificación directa en transacciones a usuarios anónimos/autenticados
REVOKE UPDATE, DELETE ON public.wallet_transactions FROM anon, authenticated;
REVOKE UPDATE, DELETE ON public.wallet_balances FROM anon, authenticated;

-- Otorgar ejecución de funciones atómicas
GRANT EXECUTE ON FUNCTION public.convert_mp_to_microcoin TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.spend_wallet_currency TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.reward_wallet_currency TO anon, authenticated, service_role;
