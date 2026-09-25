import { useCallback, useEffect, useState } from "react";
import { goalLabel, needLabel } from "../../data/leadOptions";
import { listLeads, type AdminLead } from "../../lib/leadsAdmin";
import { whatsappUrl } from "../../lib/utils";
import { MailIcon, WhatsAppIcon } from "../../lib/icons";
import { Button } from "../Button";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

const errorMessages = {
  not_configured: "Supabase não está configurado.",
  not_authorized: "Sua conta não tem permissão para ver os leads.",
  error: "Não foi possível carregar os leads. Tente novamente.",
} as const;

export function AdminLeads() {
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    listLeads().then((result) => {
      setLoading(false);
      if (result.ok) {
        setLeads(result.leads);
        setError(null);
        return;
      }
      setLeads([]);
      setError(errorMessages[result.reason]);
    });
  }, []);

  useEffect(load, [load]);

  return (
    <section aria-labelledby="admin-leads-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="admin-leads-title" className="font-display text-lg font-semibold text-ink-950">
            Leads
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Contatos recebidos pelo formulário do site, do mais recente para o mais antigo.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={load} disabled={loading}>
          {loading ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}

      {!error && !loading && leads.length === 0 && (
        <p className="mt-6 rounded-xl border border-ink-100 bg-white p-6 text-sm text-ink-500">
          Nenhum lead recebido até agora.
        </p>
      )}

      <ul aria-busy={loading} className="mt-6 space-y-3">
        {leads.map((lead) => (
          <li key={lead.id} className="rounded-2xl border border-ink-100 bg-white p-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-base font-semibold text-ink-950">{lead.name}</h3>
              <span className="rounded-full border border-ink-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
                {lead.source}
              </span>
              <time
                dateTime={lead.createdAt}
                className="ml-auto font-mono text-xs text-ink-500"
              >
                {formatDate(lead.createdAt)}
              </time>
            </div>

            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div className="flex gap-2">
                <dt className="shrink-0 text-ink-500">Precisa de:</dt>
                <dd className="font-medium text-ink-900">{needLabel(lead.need)}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-ink-500">Objetivo:</dt>
                <dd className="font-medium text-ink-900">{goalLabel(lead.goal)}</dd>
              </div>
            </dl>

            <p className="mt-4 whitespace-pre-line rounded-xl bg-ink-50 p-4 text-sm leading-relaxed text-ink-700">
              {lead.message}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-ink-100 pt-4">
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <MailIcon className="h-4 w-4 text-ink-500" />
                {lead.email}
              </a>
              {lead.whatsapp && (
                <a
                  href={whatsappUrl(lead.whatsapp, `Olá, ${lead.name}! Aqui é da Beacore.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <WhatsAppIcon className="h-4 w-4 text-ink-500" />
                  {lead.whatsapp}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
