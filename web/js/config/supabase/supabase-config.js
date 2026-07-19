//=========================================================
// Supabase Configuration
// MagnopVS
//=========================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

//=========================================================
// Project Configuration
//=========================================================

const SUPABASE_URL =
    "https://jlckakyftkzgfgkmmdmc.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_DThzH9SY--ocKqMnn_hCNg_8EKYIP1p";

//=========================================================
// Create Client
//=========================================================

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);