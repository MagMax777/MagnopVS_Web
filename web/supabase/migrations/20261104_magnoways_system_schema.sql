-- ==============================================================================
-- MagnopVS - MAGNOWAYS MULTIVERSAL ROUTES & JOURNEYS ENGINE SCHEMA
-- Migration: 20261104_magnoways_system_schema.sql
-- ==============================================================================
-- Implements tables for routes, nodes, connections, user progression,
-- decisions, multiplayer lobbies, and ratings with strict Row Level Security (RLS).
-- All currencies adhere to BIGINT non-negative balance constraints.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. MAGNOWAYS CATEGORIES / MODALITIES
CREATE TABLE IF NOT EXISTS public.magnoways_categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    icon_name VARCHAR(64) NOT NULL,
    color_accent VARCHAR(32) DEFAULT '#00f0ff',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Categories
INSERT INTO public.magnoways_categories (id, name, description, icon_name, color_accent) VALUES
('story', 'Story Ways', 'Recorridos narrativos que conectan episodios, decisiones y universos.', 'BookOpen', '#ff007f'),
('quest', 'Quest Ways', 'Cadenas de misiones con objetivos secuenciales y recompensas.', 'Shield', '#00f0ff'),
('exploration', 'Exploration Ways', 'Descubrimiento de territorios, objetos ocultos y secretos cósmicos.', 'Compass', '#7fffd4'),
('game', 'Game Ways', 'Recorridos interactivos con minijuegos, combates y desafíos tácticos.', 'Gamepad2', '#8a2be2'),
('learning', 'Learning Ways', 'Rutas de formación, enigmas filosóficos y maestría transmedia.', 'GraduationCap', '#0072ff'),
('social', 'Social Ways', 'Expediciones cooperativas, desafíos colectivos y eventos comunitarios.', 'Users', '#ffabf3'),
('saga', 'Saga Ways', 'Rutas oficiales ambientadas en las 13 sagas cardinales de MagnopVS.', 'Sparkles', '#ffd700'),
('real', 'Real Ways', 'Inteligencia geoespacial táctica, satélites, tráfico naval y orbital.', 'Globe', '#00f0ff'),
('creator', 'Creator Ways', 'Rutas diseñadas y publicadas por creadores de la comunidad.', 'Palette', '#a0a5b5'),
('crossway', 'Crossways', 'Conexiones transmedia entre módulos de la Quantvm Matrix.', 'Layers', '#00ffff')
ON CONFLICT (id) DO NOTHING;

-- 3. MAGNOWAYS MASTER ROUTES
CREATE TABLE IF NOT EXISTS public.magnoways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    synopsis TEXT,
    modality VARCHAR(64) NOT NULL REFERENCES public.magnoways_categories(id) ON DELETE RESTRICT,
    saga_id VARCHAR(64),
    saga_title VARCHAR(128),
    cover_image TEXT NOT NULL,
    banner_image TEXT NOT NULL,
    difficulty VARCHAR(32) NOT NULL DEFAULT 'Intermedio',
    estimated_duration_min INT NOT NULL DEFAULT 30,
    recommended_level INT NOT NULL DEFAULT 1,
    participants_mode VARCHAR(32) NOT NULL DEFAULT 'SOLO',
    max_participants INT NOT NULL DEFAULT 1,
    creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    creator_name VARCHAR(128) NOT NULL DEFAULT 'Consejo MagnopVS',
    creator_avatar TEXT,
    is_official BOOLEAN NOT NULL DEFAULT false,
    is_seasonal BOOLEAN NOT NULL DEFAULT false,
    season_id VARCHAR(64),
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
    reviews_count INT NOT NULL DEFAULT 0,
    completion_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    total_plays INT NOT NULL DEFAULT 0,
    reward_mp BIGINT NOT NULL DEFAULT 0 CHECK (reward_mp >= 0),
    reward_micro_coins BIGINT NOT NULL DEFAULT 0 CHECK (reward_micro_coins >= 0),
    reward_xp BIGINT NOT NULL DEFAULT 0 CHECK (reward_xp >= 0),
    status VARCHAR(32) NOT NULL DEFAULT 'published',
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MAGNOWAYS NODES
CREATE TABLE IF NOT EXISTS public.magnoways_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES public.magnoways(id) ON DELETE CASCADE,
    name VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(64) NOT NULL DEFAULT 'STORY',
    icon_name VARCHAR(64) NOT NULL DEFAULT 'Circle',
    image_url TEXT,
    pos_x NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    pos_y NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    order_index INT NOT NULL DEFAULT 0,
    estimated_minutes INT NOT NULL DEFAULT 5,
    difficulty VARCHAR(32) NOT NULL DEFAULT 'Iniciación',
    min_level INT NOT NULL DEFAULT 1,
    required_item_id VARCHAR(128),
    required_item_name VARCHAR(128),
    required_faction VARCHAR(64),
    reward_mp BIGINT NOT NULL DEFAULT 0 CHECK (reward_mp >= 0),
    reward_micro_coins BIGINT NOT NULL DEFAULT 0 CHECK (reward_micro_coins >= 0),
    reward_xp BIGINT NOT NULL DEFAULT 0 CHECK (reward_xp >= 0),
    reward_badge VARCHAR(128),
    destination_type VARCHAR(64),
    destination_target_id VARCHAR(128),
    action_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MAGNOWAYS CONNECTIONS (PATHS)
CREATE TABLE IF NOT EXISTS public.magnoways_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES public.magnoways(id) ON DELETE CASCADE,
    from_node_id UUID NOT NULL REFERENCES public.magnoways_nodes(id) ON DELETE CASCADE,
    to_node_id UUID NOT NULL REFERENCES public.magnoways_nodes(id) ON DELETE CASCADE,
    label VARCHAR(128),
    is_branching BOOLEAN DEFAULT false,
    condition_text VARCHAR(256),
    is_locked_by_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MAGNOWAYS PLAYER PROGRESS
CREATE TABLE IF NOT EXISTS public.magnoways_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES public.magnoways(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'in_progress',
    current_node_id UUID REFERENCES public.magnoways_nodes(id) ON DELETE SET NULL,
    completed_node_ids UUID[] DEFAULT '{}',
    decisions_log JSONB DEFAULT '{}'::jsonb,
    earned_mp BIGINT NOT NULL DEFAULT 0 CHECK (earned_mp >= 0),
    earned_micro_coins BIGINT NOT NULL DEFAULT 0 CHECK (earned_micro_coins >= 0),
    earned_xp BIGINT NOT NULL DEFAULT 0 CHECK (earned_xp >= 0),
    earned_badges TEXT[] DEFAULT '{}',
    percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, route_id)
);

-- 7. MAGNOWAYS MULTIPLAYER LOBBIES
CREATE TABLE IF NOT EXISTS public.magnoways_lobbies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES public.magnoways(id) ON DELETE CASCADE,
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    host_name VARCHAR(128) NOT NULL,
    mode VARCHAR(32) NOT NULL DEFAULT 'COOP',
    max_players INT NOT NULL DEFAULT 4,
    is_private BOOLEAN NOT NULL DEFAULT false,
    room_code VARCHAR(16) NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL DEFAULT 'waiting',
    participants JSONB DEFAULT '[]'::jsonb,
    shared_state JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MAGNOWAYS REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS public.magnoways_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES public.magnoways(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name VARCHAR(128) NOT NULL,
    user_avatar TEXT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(route_id, user_id)
);

-- 9. INDEXES FOR HIGH-THROUGHPUT QUERIES
CREATE INDEX IF NOT EXISTS idx_magnoways_modality ON public.magnoways(modality);
CREATE INDEX IF NOT EXISTS idx_magnoways_saga ON public.magnoways(saga_id);
CREATE INDEX IF NOT EXISTS idx_magnoways_status ON public.magnoways(status);
CREATE INDEX IF NOT EXISTS idx_magnoways_nodes_route ON public.magnoways_nodes(route_id);
CREATE INDEX IF NOT EXISTS idx_magnoways_conns_route ON public.magnoways_connections(route_id);
CREATE INDEX IF NOT EXISTS idx_magnoways_progress_user ON public.magnoways_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_magnoways_progress_route ON public.magnoways_progress(route_id);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.magnoways_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magnoways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magnoways_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magnoways_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magnoways_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magnoways_lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magnoways_reviews ENABLE ROW LEVEL SECURITY;

-- Read policies for public catalog
CREATE POLICY "Public read published magnoways"
    ON public.magnoways FOR SELECT
    USING (status = 'published' OR (auth.uid() IS NOT NULL AND auth.uid() = creator_id));

CREATE POLICY "Public read categories"
    ON public.magnoways_categories FOR SELECT
    USING (true);

CREATE POLICY "Public read nodes of published routes"
    ON public.magnoways_nodes FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.magnoways m 
        WHERE m.id = magnoways_nodes.route_id 
        AND (m.status = 'published' OR m.creator_id = auth.uid())
    ));

CREATE POLICY "Public read connections of published routes"
    ON public.magnoways_connections FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.magnoways m 
        WHERE m.id = magnoways_connections.route_id 
        AND (m.status = 'published' OR m.creator_id = auth.uid())
    ));

-- Creator write policies
CREATE POLICY "Creators can insert routes"
    ON public.magnoways FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = creator_id);

CREATE POLICY "Creators can update own routes"
    ON public.magnoways FOR UPDATE
    USING (auth.uid() IS NOT NULL AND auth.uid() = creator_id);

-- User Progress policies: Users can only read and write their own progress
CREATE POLICY "Users can view own progress"
    ON public.magnoways_progress FOR SELECT
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
    ON public.magnoways_progress FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON public.magnoways_progress FOR UPDATE
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Lobby policies
CREATE POLICY "Public read active lobbies"
    ON public.magnoways_lobbies FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create lobbies"
    ON public.magnoways_lobbies FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = host_id);

CREATE POLICY "Host or participant can update lobby"
    ON public.magnoways_lobbies FOR UPDATE
    USING (auth.uid() IS NOT NULL);

-- Reviews policies
CREATE POLICY "Public read reviews"
    ON public.magnoways_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create own reviews"
    ON public.magnoways_reviews FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
