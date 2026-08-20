import { useEffect, useState } from "react";
import { Button } from "../Button";
import {
  feedbackInviteUrl,
  generateInvite,
  listFeedbackTokens,
  whatsappInviteUrl,
  type FeedbackTokenInfo,
} from "../../lib/adminInvites";
import { CopyIcon, SendIcon, WhatsAppIcon } from "../../lib/icons";
import { cn } from "../../lib/utils";

type InvitePanelProps = {
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  projectPublished: boolean;
};

const statusLabels: Record<FeedbackTokenInfo["status"], string> = {
  active: "Ativo",
  used: "Usado",
  revoked: "Revogado",
  expired: "Expirado",
};

const statusStyles: Record<FeedbackTokenInfo["status"], string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  used: "border-ink-200 bg-ink-50 text-ink-600",
  revoked: "border-red-200 bg-red-50 text-red-700",
  expired: "border-amber-200 bg-amber-50 text-amber-700",
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

export function InvitePanel({
  clientId,
  clientName,
  projectId,
  projectName,
  projectPublished,
}: InvitePanelProps) {
  const [token, setToken] = useState<string | null>(null);
  const [tokens, setTokens] = useState<FeedbackTokenInfo[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function reloadTokens() {
    listFeedbackTokens(clientId, projectId).then(setTokens);
  }

  useEffect(() => {
    listFeedbackTokens(clientId, projectId).then(setTokens);
  }, [clientId, projectId]);

  function handleGenerate() {
    if (generating) return;

    setGenerating(true);
    setError(null);
    setCopied(false);

    generateInvite(clientId, projectId).then((result) => {
      setGenerating(false);
      if (result.ok) {
        setToken(result.token);
        reloadTokens();
        return;
      }
      setError(
        result.reason === "projeto não publicado"
          ? "Este projeto não está publicado. Publique-o antes de gerar convites."
          : result.reason === "cliente inativo"
            ? "Este cliente está inativo. Ative-o antes de gerar convites."
            : result.reason === "cliente não vinculado ao projeto"
              ? "Este cliente não está vinculado a este projeto."
              : result.reason === "not_authorized"
                ? "Sua conta não possui permissão de administrador."
                : "Não foi possível gerar o convite. Tente novamente.",
      );
    });
  }

  async function handleCopy() {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(feedbackInviteUrl(token));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não foi possível copiar o link. Copie manualmente.");
    }
  }

  const link = token ? feedbackInviteUrl(token) : null;

  return (
    <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-900">Convite de avaliação</p>
        <Button
          size="sm"
          disabled={generating || !projectPublished}
          onClick={handleGenerate}
        >
          <SendIcon className="h-4 w-4" />
          {generating ? "Gerando..." : "Gerar convite"}
        </Button>
      </div>

      {!projectPublished && (
        <p className="mt-2 text-xs text-amber-700">
          Este projeto está despublicado — não é possível gerar novos convites.
        </p>
      )}

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}

      {token && link && (
        <div className="mt-3 rounded-xl border border-ink-200 bg-white p-4">
          <dl className="space-y-1 text-sm">
            <div className="flex gap-1.5">
              <dt className="text-ink-400">Cliente:</dt>
              <dd className="font-medium text-ink-900">{clientName}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-ink-400">Projeto:</dt>
              <dd className="text-ink-700">{projectName}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-ink-400">Link:</dt>
              <dd className="min-w-0 break-all font-mono text-xs text-ink-700">{link}</dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              <CopyIcon className="h-4 w-4" />
              {copied ? "Copiado!" : "Copiar link"}
            </Button>
            <Button variant="secondary" size="sm" href={whatsappInviteUrl(link)} external>
              <WhatsAppIcon className="h-4 w-4" />
              Enviar pelo WhatsApp
            </Button>
          </div>
        </div>
      )}

      {tokens.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
            Histórico de convites
          </p>
          <ul className="mt-2 space-y-1.5">
            {tokens.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                    statusStyles[item.status],
                  )}
                >
                  {statusLabels[item.status]}
                </span>
                <span>Criado em {formatDateTime(item.createdAt)}</span>
                <span className="text-ink-400">
                  Expira em {formatDateTime(item.expiresAt)}
                  {item.revokedAt && ` · Revogado em ${formatDateTime(item.revokedAt)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}