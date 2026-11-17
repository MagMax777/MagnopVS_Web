-- ==============================================================================
-- MagnopVS - SUPABASE MIGRATION: WALLETS, BALANCES & ATOMIC ECONOMIC TRANSACTIONS
-- ==============================================================================
-- Designed for high concurrency, zero negative balances, and atomic operations.
-- Official Exchange Rate: 10,000 MagnoPoints (MP) = 1 MicroCoin (µC).

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. WALLETS TABLE
-- Represents the primary economic entity for a player in the MagnopVS multiversal ecosystem.
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

-- 3. WALLET BALANCES TABLE
-- Holds the live, persistent balance per currency (MP and MICROCOIN).
-- STRICT CHECK: balance >= 0 guarantees that balances can NEVER be negative.
CREATE TABLE IF NOT EXISTS public.wallet_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    currency TEXT NOT NULL CHECK (currency IN ('MP', 'MICROCOIN')),
    balance BIGINT NOT NULL DEFAULT 0 CHECK (balance >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_wallet_currency UNIQUE(wallet_id, currency)
);

-- 4. WALLET TRANSACTIONS AUDIT LEDGER
-- Immutable ledger recording every debit, credit, conversion, and reward with before/after balances.
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

-- 5. PERFORMANCE & AUDIT INDEXES
CREATE INDEX IF NOT EXISTS idx_wallets_player_id ON public.wallets(player_id);
CREATE INDEX IF NOT EXISTS idx_wallet_balances_wallet_currency ON public.wallet_balances(wallet_id, currency);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_wallet_created ON public.wallet_transactions(wallet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_idempotency ON public.wallet_transactions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_type ON public.wallet_transactions(transaction_type);

-- 6. TRIGGER: AUTOMATIC UPDATED_AT TIMESTAMP
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

-- 7. ATOMIC CONVERSION PROCEDURE (10,000 MP = 1 MICROCOIN)
-- Guaranteed atomic transaction with row locking, idempotency check, and zero negative balances.
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
    -- 1. Validation: Must be multiple of 10,000 MP
    IF p_mp_amount < 10000 OR (p_mp_amount % 10000) != 0 THEN
        RAISE EXCEPTION 'La cantidad debe ser un múltiplo de 10.000 MP (10.000 MP = 1 MicroCoin).';
    END IF;

    -- 2. Check Idempotency Key
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

    -- 3. Acquire exclusive lock on the wallet row
    SELECT id INTO v_wallet_id 
    FROM public.wallets 
    WHERE player_id = p_player_id 
    FOR UPDATE;

    IF v_wallet_id IS NULL THEN
        -- Initialize wallet if not present
        INSERT INTO public.wallets (player_id) VALUES (p_player_id) RETURNING id INTO v_wallet_id;
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, 'MP', 0);
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, 'MICROCOIN', 0);
    END IF;

    -- 4. Lock & read MP balance
    SELECT balance INTO v_current_mp 
    FROM public.wallet_balances 
    WHERE wallet_id = v_wallet_id AND currency = 'MP' 
    FOR UPDATE;

    IF v_current_mp IS NULL OR v_current_mp < p_mp_amount THEN
        RAISE EXCEPTION 'Saldo insuficiente de MagnoPoints. Disponible: %, Requerido: %', COALESCE(v_current_mp, 0), p_mp_amount;
    END IF;

    -- 5. Lock & read MicroCoin balance
    SELECT balance INTO v_current_mc 
    FROM public.wallet_balances 
    WHERE wallet_id = v_wallet_id AND currency = 'MICROCOIN' 
    FOR UPDATE;

    IF v_current_mc IS NULL THEN
        v_current_mc := 0;
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, 'MICROCOIN', 0);
    END IF;

    -- 6. Compute new balances
    v_microcoins_to_add := p_mp_amount / 10000;
    v_new_mp := v_current_mp - p_mp_amount;
    v_new_mc := v_current_mc + v_microcoins_to_add;

    -- Ensure no negative balance invariants
    IF v_new_mp < 0 THEN
        RAISE EXCEPTION 'Operación rechazada: el saldo resultante de MP no puede ser negativo.';
    END IF;

    -- 7. Update balances atomically
    UPDATE public.wallet_balances SET balance = v_new_mp, updated_at = NOW() WHERE wallet_id = v_wallet_id AND currency = 'MP';
    UPDATE public.wallet_balances SET balance = v_new_mc, updated_at = NOW() WHERE wallet_id = v_wallet_id AND currency = 'MICROCOIN';

    -- 8. Update wallet stats
    UPDATE public.wallets 
    SET total_converted_mp = total_converted_mp + p_mp_amount,
        total_earned_microcoins = total_earned_microcoins + v_microcoins_to_add,
        updated_at = NOW()
    WHERE id = v_wallet_id;

    -- 9. Insert audit log for MP deduction
    INSERT INTO public.wallet_transactions (
        wallet_id, transaction_type, currency, amount, balance_before, balance_after,
        source, source_reference, idempotency_key, description
    ) VALUES (
        v_wallet_id, 'CONVERSION', 'MP', -p_mp_amount, v_current_mp, v_new_mp,
        'WALLET_CONVERTER', NULL, p_idempotency_key, 
        format('Conversión atómica de %s MP a %s MicroCoins', p_mp_amount, v_microcoins_to_add)
    ) RETURNING id INTO v_tx_mp_id;

    -- 10. Insert audit log for MicroCoin credit
    INSERT INTO public.wallet_transactions (
        wallet_id, transaction_type, currency, amount, balance_before, balance_after,
        source, source_reference, idempotency_key, description
    ) VALUES (
        v_wallet_id, 'CONVERSION', 'MICROCOIN', v_microcoins_to_add, v_current_mc, v_new_mc,
        'WALLET_CONVERTER', v_tx_mp_id::text, 
        CASE WHEN p_idempotency_key IS NOT NULL THEN p_idempotency_key || '_mc' ELSE NULL END,
        format('Acreditación de %s MicroCoins por conversión atómica', v_microcoins_to_add)
    ) RETURNING id INTO v_tx_mc_id;

    RETURN jsonb_build_object(
        'success', true,
        'mpDeducted', p_mp_amount,
        'microCoinsAdded', v_microcoins_to_add,
        'newMagnoPoints', v_new_mp,
        'newMicroCoins', v_new_mc,
        'mpTransactionId', v_tx_mp_id,
        'microCoinTransactionId', v_tx_mc_id
    );
END;
$$;

-- 8. ATOMIC SPEND PROCEDURE (PURCHASES & LIVE TIPS)
-- Debits currency while enforcing balance >= amount and recording transaction atomically.
CREATE OR REPLACE FUNCTION public.spend_wallet_currency(
    p_player_id TEXT,
    p_currency TEXT,
    p_amount BIGINT,
    p_source TEXT,
    p_description TEXT,
    p_reference TEXT DEFAULT NULL,
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
    v_tx_type TEXT;
    v_tx_id UUID;
    v_existing_tx JSONB;
BEGIN
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'El monto a debitar debe ser mayor a cero.';
    END IF;

    IF p_currency NOT IN ('MP', 'MICROCOIN') THEN
        RAISE EXCEPTION 'Moneda inválida: %', p_currency;
    END IF;

    -- Idempotency check
    IF p_idempotency_key IS NOT NULL THEN
        SELECT jsonb_build_object('success', true, 'alreadyProcessed', true, 'transactionId', id)
        INTO v_existing_tx
        FROM public.wallet_transactions WHERE idempotency_key = p_idempotency_key;

        IF v_existing_tx IS NOT NULL THEN
            RETURN v_existing_tx;
        END IF;
    END IF;

    -- Lock wallet
    SELECT id INTO v_wallet_id FROM public.wallets WHERE player_id = p_player_id FOR UPDATE;
    IF v_wallet_id IS NULL THEN
        RAISE EXCEPTION 'Wallet no encontrada para el jugador: %', p_player_id;
    END IF;

    -- Lock & read balance
    SELECT balance INTO v_current_balance 
    FROM public.wallet_balances 
    WHERE wallet_id = v_wallet_id AND currency = p_currency 
    FOR UPDATE;

    IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
        RAISE EXCEPTION 'Saldo insuficiente de %. Saldo actual: %, Monto requerido: %', p_currency, COALESCE(v_current_balance, 0), p_amount;
    END IF;

    v_new_balance := v_current_balance - p_amount;

    -- Invariant: balance must never be negative
    IF v_new_balance < 0 THEN
        RAISE EXCEPTION 'Violación de restricción: saldo no puede ser negativo.';
    END IF;

    -- Update balance
    UPDATE public.wallet_balances SET balance = v_new_balance, updated_at = NOW()
    WHERE wallet_id = v_wallet_id AND currency = p_currency;

    -- Update wallet spent stats
    IF p_currency = 'MP' THEN
        UPDATE public.wallets SET total_spent_mp = total_spent_mp + p_amount WHERE id = v_wallet_id;
    ELSE
        UPDATE public.wallets SET total_spent_microcoins = total_spent_microcoins + p_amount WHERE id = v_wallet_id;
    END IF;

    v_tx_type := CASE WHEN p_source = 'LIVE_TIP' THEN 'TIP' ELSE 'PURCHASE' END;

    -- Record transaction
    INSERT INTO public.wallet_transactions (
        wallet_id, transaction_type, currency, amount, balance_before, balance_after,
        source, source_reference, idempotency_key, description
    ) VALUES (
        v_wallet_id, v_tx_type, p_currency, -p_amount, v_current_balance, v_new_balance,
        p_source, p_reference, p_idempotency_key, p_description
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

-- 9. ATOMIC REWARD PROCEDURE (QUESTS, CHECK-IN, ACHIEVEMENTS)
-- Credits currency safely with idempotency guarantee.
CREATE OR REPLACE FUNCTION public.reward_wallet_currency(
    p_player_id TEXT,
    p_currency TEXT,
    p_amount BIGINT,
    p_source TEXT,
    p_description TEXT,
    p_idempotency_key TEXT
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

    -- Anti-duplication idempotency check
    IF p_idempotency_key IS NOT NULL THEN
        SELECT jsonb_build_object('success', true, 'alreadyProcessed', true, 'transactionId', id)
        INTO v_existing_tx
        FROM public.wallet_transactions WHERE idempotency_key = p_idempotency_key;

        IF v_existing_tx IS NOT NULL THEN
            RETURN v_existing_tx;
        END IF;
    END IF;

    -- Lock or create wallet
    SELECT id INTO v_wallet_id FROM public.wallets WHERE player_id = p_player_id FOR UPDATE;
    IF v_wallet_id IS NULL THEN
        INSERT INTO public.wallets (player_id) VALUES (p_player_id) RETURNING id INTO v_wallet_id;
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, 'MP', 0);
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, 'MICROCOIN', 0);
    END IF;

    -- Lock & read balance
    SELECT balance INTO v_current_balance 
    FROM public.wallet_balances 
    WHERE wallet_id = v_wallet_id AND currency = p_currency 
    FOR UPDATE;

    IF v_current_balance IS NULL THEN
        v_current_balance := 0;
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, p_currency, 0);
    END IF;

    v_new_balance := v_current_balance + p_amount;

    -- Update balance
    UPDATE public.wallet_balances SET balance = v_new_balance, updated_at = NOW()
    WHERE wallet_id = v_wallet_id AND currency = p_currency;

    -- Update earned stats
    IF p_currency = 'MP' THEN
        UPDATE public.wallets SET total_earned_mp = total_earned_mp + p_amount WHERE id = v_wallet_id;
    ELSE
        UPDATE public.wallets SET total_earned_microcoins = total_earned_microcoins + p_amount WHERE id = v_wallet_id;
    END IF;

    -- Record transaction
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

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on wallets" ON public.wallets FOR SELECT USING (true);
CREATE POLICY "Allow public read on balances" ON public.wallet_balances FOR SELECT USING (true);
CREATE POLICY "Allow public read on transactions" ON public.wallet_transactions FOR SELECT USING (true);
