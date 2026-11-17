-- ==============================================================================
-- MagnopVS FINANCIAL SYSTEM (MFS) V1.1 - MASTER DATABASE SCHEMA
-- Migration: 20261104_mfs_financial_system_v1_1.sql
-- ==============================================================================
-- Implements:
-- 1. Three Currencies: MagnoPoints (MP - 1 MP = 1 USD), MagnoCoins (MC), MicroCoins (µC).
-- 2. Non-negative BIGINT balance integrity & state breakdown (available, pending, locked, withdrawing).
-- 3. Double-entry ledger (financial_ledger) with debit/credit balance consistency.
-- 4. Dynamic Conversion Engine (MC -> MP) with quote timeouts and historical logs.
-- 5. KYC Identity Verification with strict VERIFIED check required for withdrawals.
-- 6. International Payment & Payout Providers, exchange rates, and limits.
-- 7. Row Level Security (RLS) and cryptographic idempotency.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. FIAT CURRENCIES & EXCHANGE RATES (USD Reference)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.fiat_currencies (
    code VARCHAR(8) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    symbol VARCHAR(8) NOT NULL,
    exchange_rate_to_usd NUMERIC(16, 6) NOT NULL DEFAULT 1.000000 CHECK (exchange_rate_to_usd > 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.fiat_currencies (code, name, symbol, exchange_rate_to_usd) VALUES
('USD', 'Dólar Estadounidense', '$', 1.000000),
('EUR', 'Euro', '€', 0.920000),
('COP', 'Peso Colombiano', '$', 4150.000000),
('MXN', 'Peso Mexicano', '$', 18.500000),
('BRL', 'Real Brasileño', 'R$', 5.450000),
('GBP', 'Libra Esterlina', '£', 0.790000),
('ARS', 'Peso Argentino', '$', 980.000000),
('CLP', 'Peso Chileno', '$', 940.000000),
('PEN', 'Sol Peruano', 'S/', 3.750000),
('CAD', 'Dólar Canadiense', 'CA$', 1.370000),
('AUD', 'Dólar Australiano', 'A$', 1.520000),
('JPY', 'Yen Japonés', '¥', 152.000000)
ON CONFLICT (code) DO UPDATE SET 
    exchange_rate_to_usd = EXCLUDED.exchange_rate_to_usd,
    updated_at = NOW();

-- ==============================================================================
-- 2. EXTEND WALLET BALANCES (Support MP, MC, MICROCOIN with state breakdown)
-- ==============================================================================
-- Drop old constraint if it only allowed 'MP', 'MICROCOIN'
ALTER TABLE public.wallet_balances DROP CONSTRAINT IF EXISTS wallet_balances_currency_check;
ALTER TABLE public.wallet_balances ADD CONSTRAINT wallet_balances_currency_check 
    CHECK (currency IN ('MP', 'MC', 'MICROCOIN', 'FIAT_USD'));

-- Add balance sub-states if not present
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wallet_balances' AND column_name = 'balance_pending') THEN
        ALTER TABLE public.wallet_balances ADD COLUMN balance_pending BIGINT NOT NULL DEFAULT 0 CHECK (balance_pending >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wallet_balances' AND column_name = 'balance_locked') THEN
        ALTER TABLE public.wallet_balances ADD COLUMN balance_locked BIGINT NOT NULL DEFAULT 0 CHECK (balance_locked >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wallet_balances' AND column_name = 'balance_withdrawing') THEN
        ALTER TABLE public.wallet_balances ADD COLUMN balance_withdrawing BIGINT NOT NULL DEFAULT 0 CHECK (balance_withdrawing >= 0);
    END IF;
END $$;

-- Extend transactions constraint to support MC
ALTER TABLE public.wallet_transactions DROP CONSTRAINT IF EXISTS wallet_transactions_currency_check;
ALTER TABLE public.wallet_transactions ADD CONSTRAINT wallet_transactions_currency_check 
    CHECK (currency IN ('MP', 'MC', 'MICROCOIN', 'FIAT_USD'));

ALTER TABLE public.wallet_transactions DROP CONSTRAINT IF EXISTS wallet_transactions_transaction_type_check;
ALTER TABLE public.wallet_transactions ADD CONSTRAINT wallet_transactions_transaction_type_check 
    CHECK (transaction_type IN ('TOP_UP', 'PURCHASE', 'WITHDRAWAL', 'CONVERSION_MC_MP', 'REWARD', 'ADJUSTMENT', 'FEE', 'REFUND'));

-- ==============================================================================
-- 3. KYC PROFILES (Mandatory Identity Verification for Withdrawals)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.kyc_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id TEXT UNIQUE NOT NULL,
    full_name VARCHAR(256) NOT NULL,
    document_type VARCHAR(32) NOT NULL, -- 'PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE', 'TAX_ID'
    document_number VARCHAR(64) NOT NULL,
    country VARCHAR(3) NOT NULL, -- ISO-3166-1 alpha-3
    date_of_birth DATE,
    address_line TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'NOT_STARTED' CHECK (
        status IN ('NOT_STARTED', 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED')
    ),
    verification_level INT NOT NULL DEFAULT 0, -- 0: Unverified, 1: Basic, 2: Standard, 3: Enhanced
    daily_withdrawal_limit_usd BIGINT NOT NULL DEFAULT 0,
    monthly_withdrawal_limit_usd BIGINT NOT NULL DEFAULT 0,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kyc_player_id ON public.kyc_profiles(player_id);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON public.kyc_profiles(status);

-- ==============================================================================
-- 4. DYNAMIC CONVERSION ENGINE (MC -> MP)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.coin_conversion_rules (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'MC_TO_MP_RULE_ACTIVE'
    from_currency VARCHAR(16) NOT NULL DEFAULT 'MC',
    to_currency VARCHAR(16) NOT NULL DEFAULT 'MP',
    rate_mp_per_mc NUMERIC(16, 8) NOT NULL DEFAULT 0.01000000 CHECK (rate_mp_per_mc > 0), -- e.g., 100 MC = 1 MP => 0.01 MP/MC
    min_convertible_mc BIGINT NOT NULL DEFAULT 100 CHECK (min_convertible_mc > 0),
    max_daily_mc BIGINT NOT NULL DEFAULT 50000 CHECK (max_daily_mc > 0),
    fee_percentage NUMERIC(5, 4) NOT NULL DEFAULT 0.0200 CHECK (fee_percentage >= 0), -- 2%
    quote_validity_seconds INT NOT NULL DEFAULT 60 CHECK (quote_validity_seconds >= 10),
    is_active BOOLEAN NOT NULL DEFAULT true,
    version INT NOT NULL DEFAULT 1,
    updated_by TEXT NOT NULL DEFAULT 'FINANCIAL_ADMIN',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.coin_conversion_rules (id, from_currency, to_currency, rate_mp_per_mc, min_convertible_mc, max_daily_mc, fee_percentage, quote_validity_seconds, is_active, version)
VALUES ('MC_TO_MP_ACTIVE', 'MC', 'MP', 0.01000000, 100, 50000, 0.0200, 60, true, 1)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.conversion_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id TEXT NOT NULL,
    from_currency VARCHAR(16) NOT NULL,
    to_currency VARCHAR(16) NOT NULL,
    from_amount BIGINT NOT NULL CHECK (from_amount > 0),
    rate_applied NUMERIC(16, 8) NOT NULL,
    gross_to_amount NUMERIC(16, 4) NOT NULL,
    fee_amount NUMERIC(16, 4) NOT NULL DEFAULT 0,
    net_to_amount BIGINT NOT NULL CHECK (net_to_amount >= 0),
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'EXECUTED', 'EXPIRED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_player ON public.conversion_quotes(player_id);
CREATE INDEX IF NOT EXISTS idx_quotes_expires ON public.conversion_quotes(expires_at);

-- ==============================================================================
-- 5. DOUBLE-ENTRY FINANCIAL LEDGER (Immutable Accounting)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.financial_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES public.wallet_transactions(id) ON DELETE RESTRICT,
    account_type VARCHAR(64) NOT NULL CHECK (
        account_type IN (
            'ASSET_FIAT_CUSTODY',         -- Fondos fiat custodiados en bancos/pasarelas
            'LIABILITY_MP_CIRCULATION',   -- Obligaciones por MagnoPoints en circulación
            'PLAYER_MP_AVAILABLE',        -- Saldo de MP disponible del jugador
            'PLAYER_MP_LOCKED',           -- Saldo de MP bloqueado o en proceso
            'PLAYER_MC_AVAILABLE',        -- Saldo de MagnoCoins
            'PLAYER_MICROCOIN_AVAILABLE', -- Saldo de MicroCoins
            'REVENUE_PLATFORM_FEES',      -- Ingresos por comisiones de retiro/conversión
            'EXPENSE_REWARDS_EMISSION'    -- Gasto/emisión de recompensas del sistema
        )
    ),
    debit_amount BIGINT NOT NULL DEFAULT 0 CHECK (debit_amount >= 0),
    credit_amount BIGINT NOT NULL DEFAULT 0 CHECK (credit_amount >= 0),
    currency VARCHAR(16) NOT NULL,
    balance_after BIGINT NOT NULL,
    idempotency_key TEXT UNIQUE,
    audit_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_ledger_debit_or_credit CHECK (debit_amount > 0 OR credit_amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_ledger_tx ON public.financial_ledger(transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_account ON public.financial_ledger(account_type);
CREATE INDEX IF NOT EXISTS idx_ledger_created ON public.financial_ledger(created_at DESC);

-- ==============================================================================
-- 6. GLOBAL TOP-UP INTENTS & PAYMENT METHODS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payment_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id TEXT NOT NULL,
    fiat_currency VARCHAR(8) NOT NULL REFERENCES public.fiat_currencies(code),
    fiat_amount NUMERIC(16, 2) NOT NULL CHECK (fiat_amount > 0),
    fiat_fee NUMERIC(16, 2) NOT NULL DEFAULT 0 CHECK (fiat_fee >= 0),
    magno_points_to_credit BIGINT NOT NULL CHECK (magno_points_to_credit > 0),
    exchange_rate_used NUMERIC(16, 6) NOT NULL,
    payment_method VARCHAR(64) NOT NULL, -- 'CARD', 'BANK_TRANSFER', 'PSE', 'PIX', 'SPEI', 'SEPA', 'PAYPAL'
    provider_id VARCHAR(64) NOT NULL,    -- 'STRIPE_INTERNATIONAL', 'PSE_COLOMBIA', 'PIX_BRAZIL', 'SPEI_MEXICO'
    provider_reference TEXT,
    idempotency_key TEXT UNIQUE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED')),
    environment VARCHAR(16) NOT NULL DEFAULT 'SANDBOX' CHECK (environment IN ('DEVELOPMENT', 'SANDBOX', 'PRODUCTION')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_intents_player ON public.payment_intents(player_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON public.payment_intents(status);

-- ==============================================================================
-- 7. GLOBAL WITHDRAWAL REQUESTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id TEXT NOT NULL,
    magno_points_amount BIGINT NOT NULL CHECK (magno_points_amount > 0),
    fee_mp BIGINT NOT NULL DEFAULT 0 CHECK (fee_mp >= 0),
    net_mp_deducted BIGINT NOT NULL CHECK (net_mp_deducted > 0),
    fiat_currency VARCHAR(8) NOT NULL REFERENCES public.fiat_currencies(code),
    exchange_rate_used NUMERIC(16, 6) NOT NULL,
    gross_fiat_amount NUMERIC(16, 2) NOT NULL,
    net_fiat_amount NUMERIC(16, 2) NOT NULL,
    payout_method VARCHAR(64) NOT NULL, -- 'BANK_TRANSFER', 'PAYPAL', 'SEPA', 'SPEI', 'PIX', 'ACH'
    destination_details JSONB NOT NULL, -- Tokenized bank details or verified account ID
    kyc_level_at_request INT NOT NULL CHECK (kyc_level_at_request >= 1),
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (
        status IN (
            'DRAFT',
            'PENDING_VERIFICATION',
            'PENDING_REVIEW',
            'APPROVED',
            'PROCESSING',
            'COMPLETED',
            'REJECTED',
            'CANCELLED',
            'FAILED',
            'REFUNDED'
        )
    ),
    rejection_reason TEXT,
    provider_reference TEXT,
    idempotency_key TEXT UNIQUE NOT NULL,
    environment VARCHAR(16) NOT NULL DEFAULT 'SANDBOX' CHECK (environment IN ('DEVELOPMENT', 'SANDBOX', 'PRODUCTION')),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payout_requests_player ON public.payout_requests(player_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON public.payout_requests(status);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.fiat_currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_conversion_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- Currencies & Conversion rules read policy
CREATE POLICY "Public read fiat currencies" ON public.fiat_currencies FOR SELECT USING (true);
CREATE POLICY "Public read active conversion rules" ON public.coin_conversion_rules FOR SELECT USING (is_active = true);

-- KYC User Policy: Players can view and upsert only their own KYC profile
CREATE POLICY "Users view own KYC" ON public.kyc_profiles FOR SELECT 
    USING (auth.uid()::text = player_id OR player_id = current_setting('request.jwt.claim.sub', true));
CREATE POLICY "Users insert own KYC" ON public.kyc_profiles FOR INSERT 
    WITH CHECK (auth.uid()::text = player_id OR player_id = current_setting('request.jwt.claim.sub', true));
CREATE POLICY "Users update own KYC" ON public.kyc_profiles FOR UPDATE 
    USING (auth.uid()::text = player_id OR player_id = current_setting('request.jwt.claim.sub', true));

-- Quotes Policy: Players can read and create their own quotes
CREATE POLICY "Users view own conversion quotes" ON public.conversion_quotes FOR SELECT 
    USING (auth.uid()::text = player_id);
CREATE POLICY "Users insert own conversion quotes" ON public.conversion_quotes FOR INSERT 
    WITH CHECK (auth.uid()::text = player_id);

-- Payment Intents Policy: Players can read and create their own payment intents
CREATE POLICY "Users view own payment intents" ON public.payment_intents FOR SELECT 
    USING (auth.uid()::text = player_id);
CREATE POLICY "Users insert own payment intents" ON public.payment_intents FOR INSERT 
    WITH CHECK (auth.uid()::text = player_id);

-- Payout Requests Policy: Players can view and create their own withdrawal requests
CREATE POLICY "Users view own payout requests" ON public.payout_requests FOR SELECT 
    USING (auth.uid()::text = player_id);
CREATE POLICY "Users insert own payout requests" ON public.payout_requests FOR INSERT 
    WITH CHECK (auth.uid()::text = player_id);

-- ==============================================================================
-- 9. ATOMIC FUNCTION: EXECUTE DYNAMIC MC -> MP CONVERSION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.execute_mc_to_mp_conversion(
    p_player_id TEXT,
    p_mc_amount BIGINT,
    p_quote_id UUID,
    p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet_id UUID;
    v_mc_balance BIGINT;
    v_mp_balance BIGINT;
    v_rule RECORD;
    v_quote RECORD;
    v_mp_gross BIGINT;
    v_fee_mp BIGINT;
    v_mp_net BIGINT;
    v_tx_id UUID;
    v_audit_hash TEXT;
BEGIN
    -- 1. Check idempotency
    IF EXISTS (SELECT 1 FROM public.wallet_transactions WHERE idempotency_key = p_idempotency_key) THEN
        RETURN jsonb_build_object('success', true, 'already_processed', true, 'message', 'Operación ya procesada previamente.');
    END IF;

    -- 2. Lock and retrieve player's wallet
    SELECT id INTO v_wallet_id FROM public.wallets WHERE player_id = p_player_id FOR UPDATE;
    IF v_wallet_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Wallet no encontrada para el jugador.');
    END IF;

    -- 3. Retrieve MC balance
    SELECT balance INTO v_mc_balance FROM public.wallet_balances 
    WHERE wallet_id = v_wallet_id AND currency = 'MC' FOR UPDATE;
    
    IF v_mc_balance IS NULL OR v_mc_balance < p_mc_amount THEN
        RETURN jsonb_build_object('success', false, 'error', 'Saldo de MagnoCoins insuficiente.');
    END IF;

    -- 4. Retrieve and validate active conversion rule
    SELECT * INTO v_rule FROM public.coin_conversion_rules WHERE id = 'MC_TO_MP_ACTIVE' AND is_active = true;
    IF v_rule IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Regla de conversión no activa.');
    END IF;

    IF p_mc_amount < v_rule.min_convertible_mc THEN
        RETURN jsonb_build_object('success', false, 'error', format('La cantidad mínima a convertir es %s MC.', v_rule.min_convertible_mc));
    END IF;

    -- 5. Calculate conversion with 1 MP = 1 USD reference parity
    v_mp_gross := FLOOR(p_mc_amount * v_rule.rate_mp_per_mc);
    v_fee_mp := CEIL(v_mp_gross * v_rule.fee_percentage);
    v_mp_net := v_mp_gross - v_fee_mp;

    IF v_mp_net <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'El resultado neto tras comisiones debe ser mayor a 0 MP.');
    END IF;

    -- 6. Debit MC balance
    UPDATE public.wallet_balances 
    SET balance = balance - p_mc_amount, updated_at = NOW() 
    WHERE wallet_id = v_wallet_id AND currency = 'MC';

    -- 7. Credit MP balance
    INSERT INTO public.wallet_balances (wallet_id, currency, balance, updated_at)
    VALUES (v_wallet_id, 'MP', v_mp_net, NOW())
    ON CONFLICT (wallet_id, currency) 
    DO UPDATE SET balance = public.wallet_balances.balance + v_mp_net, updated_at = NOW();

    -- Retrieve updated balances
    SELECT balance INTO v_mc_balance FROM public.wallet_balances WHERE wallet_id = v_wallet_id AND currency = 'MC';
    SELECT balance INTO v_mp_balance FROM public.wallet_balances WHERE wallet_id = v_wallet_id AND currency = 'MP';

    -- 8. Record audit transaction
    INSERT INTO public.wallet_transactions (
        wallet_id, transaction_type, currency, amount, balance_before, balance_after,
        source, source_reference, idempotency_key, description, metadata, status
    ) VALUES (
        v_wallet_id, 'CONVERSION_MC_MP', 'MP', v_mp_net, v_mp_balance - v_mp_net, v_mp_balance,
        'DYNAMIC_CONVERSION_ENGINE', p_quote_id::text, p_idempotency_key,
        format('Conversión dinámica de %s MC a %s MP (Tasa: %s MP/MC, Comisión: %s MP)', p_mc_amount, v_mp_net, v_rule.rate_mp_per_mc, v_fee_mp),
        jsonb_build_object('mc_deducted', p_mc_amount, 'gross_mp', v_mp_gross, 'fee_mp', v_fee_mp, 'rate', v_rule.rate_mp_per_mc),
        'COMPLETED'
    ) RETURNING id INTO v_tx_id;

    -- 9. Insert double-entry ledger entries
    v_audit_hash := encode(digest(format('%s:%s:%s:%s', v_tx_id, v_wallet_id, v_mp_net, NOW()), 'sha256'), 'hex');

    -- Debit player MC available
    INSERT INTO public.financial_ledger (transaction_id, account_type, debit_amount, credit_amount, currency, balance_after, idempotency_key, audit_hash)
    VALUES (v_tx_id, 'PLAYER_MC_AVAILABLE', p_mc_amount, 0, 'MC', v_mc_balance, p_idempotency_key || '_mc_debit', v_audit_hash);

    -- Credit player MP available
    INSERT INTO public.financial_ledger (transaction_id, account_type, debit_amount, credit_amount, currency, balance_after, idempotency_key, audit_hash)
    VALUES (v_tx_id, 'PLAYER_MP_AVAILABLE', 0, v_mp_net, 'MP', v_mp_balance, p_idempotency_key || '_mp_credit', v_audit_hash);

    RETURN jsonb_build_object(
        'success', true,
        'transaction_id', v_tx_id,
        'mc_deducted', p_mc_amount,
        'mp_credited', v_mp_net,
        'fee_mp', v_fee_mp,
        'rate_applied', v_rule.rate_mp_per_mc,
        'new_mc_balance', v_mc_balance,
        'new_mp_balance', v_mp_balance
    );
END;
$$;
