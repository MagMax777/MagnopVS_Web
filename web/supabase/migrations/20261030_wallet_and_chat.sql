-- ==============================================================================
-- MagnopVS - SUPABASE MIGRATION: WALLET, ECONOMIC LEDGER & LIVE CHAT
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id TEXT UNIQUE NOT NULL,
    total_earned_mp BIGINT NOT NULL DEFAULT 0,
    total_spent_mp BIGINT NOT NULL DEFAULT 0,
    total_converted_mp BIGINT NOT NULL DEFAULT 0,
    total_earned_microcoins BIGINT NOT NULL DEFAULT 0,
    total_spent_microcoins BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WALLET BALANCES TABLE
CREATE TABLE IF NOT EXISTS public.wallet_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    currency TEXT NOT NULL CHECK (currency IN ('MP', 'MICROCOIN')),
    balance BIGINT NOT NULL DEFAULT 0 CHECK (balance >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(wallet_id, currency)
);

-- 4. WALLET TRANSACTIONS AUDIT LEDGER
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (
        transaction_type IN ('REWARD', 'CONVERSION', 'PURCHASE', 'ADJUSTMENT', 'TIP', 'REFUND')
    ),
    currency TEXT NOT NULL CHECK (currency IN ('MP', 'MICROCOIN')),
    amount BIGINT NOT NULL,
    balance_before BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    source TEXT NOT NULL,
    source_reference TEXT,
    idempotency_key TEXT UNIQUE,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'PENDING', 'FAILED', 'REVERSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CHAT ROOMS TABLE (LIVE STREAMS & PUBLIC CHANNELS)
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL DEFAULT 'public' CHECK (type IN ('public', 'live', 'private')),
    description TEXT,
    active_streamer TEXT,
    stream_title TEXT,
    viewer_count INT DEFAULT 0,
    is_live BOOLEAN DEFAULT true,
    banner_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id TEXT NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_avatar TEXT,
    sender_role TEXT DEFAULT 'player' CHECK (sender_role IN ('player', 'vip', 'mod', 'streamer', 'cosmic')),
    sender_level INT DEFAULT 1,
    sender_faction TEXT,
    content TEXT NOT NULL,
    tip_amount BIGINT DEFAULT 0,
    tip_currency TEXT CHECK (tip_currency IN ('MP', 'MICROCOIN', NULL)),
    reactions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DIRECT MESSAGES TABLE (WHISPERS / PRIVATE CHAT)
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_avatar TEXT,
    recipient_name TEXT NOT NULL,
    recipient_avatar TEXT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. INDEXES FOR HIGH-THROUGHPUT PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_wallets_player_id ON public.wallets(player_id);
CREATE INDEX IF NOT EXISTS idx_wallet_balances_wallet_currency ON public.wallet_balances(wallet_id, currency);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_wallet_created ON public.wallet_transactions(wallet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_idempotency ON public.wallet_transactions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_created ON public.chat_messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_direct_messages_participants ON public.direct_messages(sender_id, recipient_id, created_at DESC);

-- 9. ATOMIC CONVERSION STORED PROCEDURE (10,000 MP = 1 MICROCOIN)
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
    v_current_microcoin BIGINT;
    v_microcoins_to_add BIGINT;
    v_new_mp BIGINT;
    v_new_microcoin BIGINT;
    v_tx_mp_id UUID;
    v_tx_mc_id UUID;
BEGIN
    -- Validation: Minimum 10,000 MP and multiple of 10,000
    IF p_mp_amount < 10000 OR (p_mp_amount % 10000) != 0 THEN
        RAISE EXCEPTION 'La cantidad debe ser múltiplo de 10.000 MP.';
    END IF;

    -- Check idempotency
    IF p_idempotency_key IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM public.wallet_transactions WHERE idempotency_key = p_idempotency_key) THEN
            RAISE EXCEPTION 'Operación de conversión ya procesada con esta clave de idempotencia.';
        END IF;
    END IF;

    -- Find wallet
    SELECT id INTO v_wallet_id FROM public.wallets WHERE player_id = p_player_id FOR UPDATE;
    IF v_wallet_id IS NULL THEN
        RAISE EXCEPTION 'Wallet no encontrada para el jugador especificado.';
    END IF;

    -- Fetch MP balance
    SELECT balance INTO v_current_mp FROM public.wallet_balances 
    WHERE wallet_id = v_wallet_id AND currency = 'MP' FOR UPDATE;

    IF v_current_mp IS NULL OR v_current_mp < p_mp_amount THEN
        RAISE EXCEPTION 'Saldo insuficiente de MagnoPoints para la conversión.';
    END IF;

    -- Fetch MicroCoin balance
    SELECT balance INTO v_current_microcoin FROM public.wallet_balances 
    WHERE wallet_id = v_wallet_id AND currency = 'MICROCOIN' FOR UPDATE;

    IF v_current_microcoin IS NULL THEN
        v_current_microcoin := 0;
        INSERT INTO public.wallet_balances (wallet_id, currency, balance) VALUES (v_wallet_id, 'MICROCOIN', 0);
    END IF;

    -- Compute atomic updates
    v_microcoins_to_add := p_mp_amount / 10000;
    v_new_mp := v_current_mp - p_mp_amount;
    v_new_microcoin := v_current_microcoin + v_microcoins_to_add;

    -- Update balances
    UPDATE public.wallet_balances SET balance = v_new_mp, updated_at = NOW() WHERE wallet_id = v_wallet_id AND currency = 'MP';
    UPDATE public.wallet_balances SET balance = v_new_microcoin, updated_at = NOW() WHERE wallet_id = v_wallet_id AND currency = 'MICROCOIN';

    -- Update wallet stats
    UPDATE public.wallets 
    SET total_converted_mp = total_converted_mp + p_mp_amount,
        total_earned_microcoins = total_earned_microcoins + v_microcoins_to_add,
        updated_at = NOW()
    WHERE id = v_wallet_id;

    -- Log MP deduction transaction
    INSERT INTO public.wallet_transactions (
        wallet_id, transaction_type, currency, amount, balance_before, balance_after,
        source, source_reference, idempotency_key, description
    ) VALUES (
        v_wallet_id, 'CONVERSION', 'MP', -p_mp_amount, v_current_mp, v_new_mp,
        'WALLET_CONVERTER', NULL, p_idempotency_key, 
        format('Conversión atómica de %s MP a %s MicroCoins', p_mp_amount, v_microcoins_to_add)
    ) RETURNING id INTO v_tx_mp_id;

    -- Log MicroCoin addition transaction
    INSERT INTO public.wallet_transactions (
        wallet_id, transaction_type, currency, amount, balance_before, balance_after,
        source, source_reference, idempotency_key, description
    ) VALUES (
        v_wallet_id, 'CONVERSION', 'MICROCOIN', v_microcoins_to_add, v_current_microcoin, v_new_microcoin,
        'WALLET_CONVERTER', v_tx_mp_id::text, 
        CASE WHEN p_idempotency_key IS NOT NULL THEN p_idempotency_key || '_mc' ELSE NULL END,
        format('Acreditación de %s MicroCoins por conversión de MP', v_microcoins_to_add)
    ) RETURNING id INTO v_tx_mc_id;

    RETURN jsonb_build_object(
        'success', true,
        'mpDeducted', p_mp_amount,
        'microCoinsAdded', v_microcoins_to_add,
        'newMagnoPoints', v_new_mp,
        'newMicroCoins', v_new_microcoin,
        'mpTransactionId', v_tx_mp_id,
        'microCoinTransactionId', v_tx_mc_id
    );
END;
$$;

-- 10. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read chat rooms" ON public.chat_rooms FOR SELECT USING (true);
CREATE POLICY "Public read chat messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Insert chat messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read wallet" ON public.wallets FOR SELECT USING (true);
CREATE POLICY "Public read wallet balances" ON public.wallet_balances FOR SELECT USING (true);
CREATE POLICY "Public read wallet transactions" ON public.wallet_transactions FOR SELECT USING (true);
CREATE POLICY "Read direct messages" ON public.direct_messages FOR SELECT USING (true);
CREATE POLICY "Insert direct messages" ON public.direct_messages FOR INSERT WITH CHECK (true);
