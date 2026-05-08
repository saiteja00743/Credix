import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

/**
 * Server-side Supabase client.
 * Only used in API routes — never import this on the client side.
 * Falls back gracefully if env vars are missing (local dev without DB).
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Helper to check if Supabase is configured.
 * Use this in API routes to decide whether to persist data.
 */
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
