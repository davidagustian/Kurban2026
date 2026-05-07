import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Will throw at runtime when env vars are missing, not at build time
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  { auth: { persistSession: true, autoRefreshToken: true } }
);

export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
