import { useEffect, useState } from "react";
import { Button } from "../Button";
import {
  approveFeedback,
  listFeedbacks,
  rejectFeedback,
  type AdminFeedback,
  type FeedbackStatus,
} from "../../lib/feedbackAdmin";
import { cn } from "../../lib/utils";
import { CheckIcon, CloseIcon } from "../../lib/icons";

type FilterId = "todos" | FeedbackStatus;

const filters: { id: FilterId; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pending", label: "Pendentes" },
  { id: "approved", label: "Aprovados" },
  { id: "rejected", label: "Rejeitados" },
];

const statusStyles: Record<FeedbackStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

const statusLabels: Record<FeedbackStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

const actionErrorMessages: Record<string, string> = {
  not_found: "Feedback não encontrado. A lista pode estar desatualizada.",
  already_approved: "Este feedback já está aprovado.",
  already_rejected: "Este feedback já está rejeitado.",
  error: "Não foi possível concluir a ação. Tente novamente.",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[] | null>(null);
  const [filter, setFilter] = useState<FilterId>("todos");
  const [busy, setBusy] = useState<{ id: string; action: "approve" | "reject" } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  function reload() {
    listFeedbacks().then((items) => setFeedbacks(items));
  }

  useEffect(() => {
    reload();
  }, []);

  function handleAction(feedback: AdminFeedback, action: "approve" | "reject") {
    if (busy) return;

    if (action === "reject") {
      const confirmed = window.confirm("Rejeitar este feedback? Esta ação não pode ser desfeita.");
      if (!confirmed) return;
    }

    setBusy({ id: feedback.id, action });
    setActionError(null);

    const run = action === "approve" ? approveFeedback : rejectFeedback;

    run(feedback.id).then((result) => {
      setBusy(null);
      if (result.ok) {
        reload();
        return;
      }
      setActionError(actionErrorMessages[result.reason] ?? actionErrorMessages.error);
    });
  }

  const visibleFeedbacks =
    filter === "todos"
      ? feedbacks ?? []
      : (feedbacks ?? []).filter((feedback) => feedback.status === filter);

  return (
    <div>
      <div
        role="group"
        aria-label="Filtrar feedbacks por status"
        className="flex flex-wrap gap-2"
      >
        {filters.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={active}
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
      </div>

      {actionError && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {actionError}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {visibleFeedbacks.length === 0 && (
          <p className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-sm text-ink-500">
            {filter === "todos"
              ? "Nenhum feedback para exibir."
              : `Nenhum feedback ${statusLabels[filter].toLowerCase()} para exibir.`}
          </p>
        )}

        {visibleFeedbacks.map((feedback) => {
          const isBusy = busy?.id === feedback.id;
          return (
            <article
              key={feedback.id}
              className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-7"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                  {feedback.projectName}
                </p>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                    statusStyles[feedback.status],
                  )}
                >
                  {statusLabels[feedback.status]}
                </span>
                <span className="ml-auto text-xs text-ink-400">
                  {formatDateTime(feedback.createdAt)}
                </span>
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                <div className="flex gap-1.5">
                  <dt className="text-ink-400">Cliente:</dt>
                  <dd className="font-medium text-ink-900">{feedback.authorName}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-ink-400">E-mail:</dt>
                  <dd className="text-ink-700">{feedback.authorEmail}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-ink-400">Projeto:</dt>
                  <dd className="text-ink-700">{feedback.projectName}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-ink-400">Consentimento para nome:</dt>
                  <dd
                    className={cn(
                      "font-semibold",
                      feedback.publishAuthorName ? "text-emerald-600" : "text-ink-400",
                    )}
                  >
                    {feedback.publishAuthorName ? "SIM" : "NÃO"}
                  </dd>
                </div>
              </dl>

              {feedback.clientCompany && (
                <p className="mt-1 text-xs text-ink-400">
                  Cliente cadastrado: {feedback.clientName} · {feedback.clientCompany}
                </p>
              )}

              <p className="mt-3 text-sm leading-relaxed text-ink-800">{feedback.content}</p>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-4">
                {feedback.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      disabled={busy !== null}
                      onClick={() => handleAction(feedback, "approve")}
                    >
                      <CheckIcon className="h-4 w-4" />
                      {isBusy && busy.action === "approve" ? "Aprovando..." : "Aprovar"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={busy !== null}
                      onClick={() => handleAction(feedback, "reject")}
                    >
                      <CloseIcon className="h-4 w-4" />
                      {isBusy && busy.action === "reject" ? "Rejeitando..." : "Rejeitar"}
                    </Button>
                  </>
                )}

                {feedback.moderatedAt && (
                  <p className="ml-auto text-xs text-ink-400">
                    {statusLabels[feedback.status]} em {formatDateTime(feedback.moderatedAt)}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}