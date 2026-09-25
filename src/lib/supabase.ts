import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http"));

export const isSupabaseConfigured = isConfigured;

/**
 * O cliente é criado sob demanda, com `import()` dinâmico.
 *
 * Problema: `@supabase/supabase-js` é a maior dependência do projeto (auth +
 * postgrest + realtime + storage) e, importado estaticamente, entrava no chunk
 * inicial da Home — bloqueando a primeira renderização por algo que só é usado
 * depois dela (projetos e depoimentos são buscados em `useEffect`; leads, no submit).
 *
 * Solução: import dinâmico memoizado. O bundler passa a emitir o supabase-js em
 * um chunk próprio, carregado após a primeira pintura e compartilhado por
 * Home, /admin e /feedback.
 *
 * `isSupabaseConfigured` continua síncrono de propósito: é só leitura de env e
 * permite decidir sem tocar na rede nem baixar o chunk.
 */
let clientPromise: Promise<SupabaseClient> | null = null;

export function getSupabaseClient(): Promise<SupabaseClient> {
  if (!isConfigured) {
    return Promise.reject(
      new Error(
        "Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local.",
      ),
    );
  }

  if (!clientPromise) {
    clientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(supabaseUrl as string, supabaseAnonKey as string),
    );
  }

  return clientPromise;
}
