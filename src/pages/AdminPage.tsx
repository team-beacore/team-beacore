import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "../components/Button";
import { useSeo } from "../components/seo/Seo";
import { AdminClients } from "../components/admin/AdminClients";
import { AdminFeedbacks } from "../components/admin/AdminFeedbacks";
import { AdminLeads } from "../components/admin/AdminLeads";
import { AdminProjects } from "../components/admin/AdminProjects";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";
import { cn } from "../lib/utils";

type AdminTab = "leads" | "feedbacks" | "projects" | "clients";

const tabs: { id: AdminTab; label: string }[] = [
  { id: "leads", label: "Leads" },
  { id: "feedbacks", label: "Feedbacks" },
  { id: "projects", label: "Projetos" },
  { id: "clients", label: "Clientes" },
];

export function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [tab, setTab] = useState<AdminTab>("leads");

  // Rota privada: fora do índice e sem canonical (ver Seo). Também bloqueada no robots.txt.
  useSeo({
    path: "/admin",
    title: "Painel administrativo | Beacore",
    description: "Área restrita da Beacore.",
    robots: "noindex, nofollow",
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthReady(true);
      return;
    }

    let active = true;
    let unsubscribe: (() => void) | null = null;

    // O cliente agora chega por import dinâmico (ver lib/supabase.ts), então a
    // sessão e o listener são configurados depois que o chunk carrega.
    getSupabaseClient()
      .then(async (client) => {
        const { data } = await client.auth.getSession();
        if (!active) return;

        setSession(data.session);
        setAuthReady(true);

        const { data: subscription } = client.auth.onAuthStateChange((_event, nextSession) => {
          if (!active) return;
          setSession(nextSession);
        });
        unsubscribe = () => subscription.subscription.unsubscribe();

        // Desmontou enquanto o chunk carregava: cancela imediatamente.
        if (!active) unsubscribe();
      })
      .catch((err) => {
        console.error("[admin] Falha ao carregar o Supabase:", err);
        if (active) setAuthReady(true);
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  function handleSignIn() {
    if (signingIn) return;

    setSignInError(null);
    setSigningIn(true);

    getSupabaseClient()
      .then((client) => client.auth.signInWithPassword({ email: email.trim(), password }))
      .then(({ error }) => {
        setSigningIn(false);
        if (!error) return;
        console.error("[admin] Falha ao entrar:", error.message);
        setSignInError(
          error.message.includes("Invalid login credentials")
            ? "E-mail ou senha incorretos."
            : "Não foi possível entrar. Tente novamente.",
        );
      })
      .catch((err) => {
        setSigningIn(false);
        console.error("[admin] Erro inesperado ao entrar:", err);
        setSignInError("Não foi possível entrar. Tente novamente.");
      });
  }

  function handleSignOut() {
    getSupabaseClient()
      .then((client) => client.auth.signOut())
      .catch((err) => {
        console.error("[admin] Falha ao sair:", err);
      });
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white px-5">
        <div className="max-w-md rounded-2xl border border-ink-100 bg-white p-10 text-center">
          <h1 className="font-display text-xl font-bold text-ink-950">Painel administrativo</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            Supabase não está configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em
            .env.local.
          </p>
        </div>
      </div>
    );
  }

  if (!authReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white px-5">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-500">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white px-5">
        <div className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-8 sm:p-10">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">
            Beacore
          </p>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-950">
            Painel administrativo
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Entre com uma conta autorizada para gerenciar leads, projetos, clientes e feedbacks.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSignIn();
            }}
          >
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-ink-700">
                E-mail
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Senha
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
              />
            </div>

            {signInError && <p className="text-sm font-medium text-red-600">{signInError}</p>}

            <Button type="submit" size="lg" disabled={signingIn} className="w-full">
              {signingIn ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-ink-50 px-5 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              Beacore
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink-950">
              Painel administrativo
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-500">{session.user.email}</span>
            <Button variant="secondary" size="sm" onClick={handleSignOut}>
              Sair
            </Button>
          </div>
        </header>

        <nav
          role="tablist"
          aria-label="Seções do painel"
          className="mt-8 flex flex-wrap gap-2"
        >
          {tabs.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
                  active
                    ? "border-ink-950 bg-ink-950 text-white shadow-sm"
                    : "border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-950",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <main className="mt-8">
          {tab === "leads" && <AdminLeads />}
          {tab === "feedbacks" && <AdminFeedbacks />}
          {tab === "projects" && <AdminProjects />}
          {tab === "clients" && <AdminClients />}
        </main>
      </div>
    </div>
  );
}