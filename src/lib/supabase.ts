import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http"),
);

const client: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

export const isSupabaseConfigured = isConfigured;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    throw new Error(
      "Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local.",
    );
  }
  return client;
}