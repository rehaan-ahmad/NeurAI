// Supabase persistence client — NeurAI
//
// Code-configured only; NOT provisioned. The client is created lazily and
// fails closed when Supabase credentials are absent, so the app never
// silently falls back to an unauthenticated or mock production path.
// Secrets are read exclusively from server-side environment variables.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { validateEnv } from "@/lib/env";

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (supabase) return supabase;

  const config = validateEnv(); // throws actionable error if DEMO_MODE=false and config missing

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and "
        + "NEXT_PUBLIC_SUPABASE_ANON_KEY, or run with DEMO_MODE=true for the "
        + "local synthetic-demo adaptor.",
    );
  }

  supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabase;
}

export function isSupabaseConfigured(): boolean {
  try {
    validateEnv();
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  } catch {
    return false;
  }
}

export { type SupabaseClient };
