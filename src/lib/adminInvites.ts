import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

export type FeedbackTokenStatus = "active" | "used" | "revoked" | "expired";

export type FeedbackTokenInfo = {
  id: string;
  clientId: string;
  projectId: string;
  status: FeedbackTokenStatus;
  expiresAt: string;
  usedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

type FeedbackTokenRow = {
  id: string;
  client_id: string;
  project_id: string;
  status: FeedbackTokenStatus;
  expires_at: string;
  used_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

function rowToToken(row: FeedbackTokenRow): FeedbackTokenInfo {
  return {
    id: row.id,
    clientId: row.client_id,
    projectId: row.project_id,
    status: row.status,
    expiresAt: row.expires_at,
    usedAt: row.used_at,
    revokedAt: row.revoked_at,
    createdAt: row.created_at,
  };
}

export type GenerateInviteResult =
  | { ok: true; token: string }
  | { ok: false; reason: string };

export async function generateInvite(
  clientId: string,
  projectId: string,
): Promise<GenerateInviteResult> {
  if (!isSupabaseConfigured) return { ok: false, reason: "error" };

  try {
    const { data, error } = await getSupabaseClient().rpc("admin_generate_feedback_token", {
      p_client_id: clientId,
      p_project_id: projectId,
    });

    if (error) {
      console.error("[adminInvites] Falha ao gerar convite:", error.message);
      return { ok: false, reason: error.message || "error" };
    }

    if (typeof data !== "string" || data.length !== 64) {
      return { ok: false, reason: "internal" };
    }

    return { ok: true, token: data };
  } catch (err) {
    console.error("[adminInvites] Erro inesperado ao gerar convite:", err);
    return { ok: false, reason: "error" };
  }
}

export async function listFeedbackTokens(
  clientId: string,
  projectId: string | null,
): Promise<FeedbackTokenInfo[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await getSupabaseClient().rpc("admin_list_feedback_tokens", {
      p_client_id: clientId,
      p_project_id: projectId,
    });

    if (error) {
      console.error("[adminInvites] Falha ao listar tokens:", error.message);
      return [];
    }

    return (data ?? []).map(rowToToken);
  } catch (err) {
    console.error("[adminInvites] Erro inesperado ao listar tokens:", err);
    return [];
  }
}

export function feedbackInviteUrl(token: string): string {
  return `${window.location.origin}/feedback/${token}`;
}

export function whatsappInviteMessage(feedbackUrl: string): string {
  return (
    "Olá! 👋\n\n" +
    "Gostaríamos de saber sua opinião sobre o projeto que desenvolvemos para você.\n\n" +
    "Sua avaliação leva menos de 1 minuto:\n\n" +
    `${feedbackUrl}\n\n` +
    "Obrigado pelo seu feedback! 💙"
  );
}

export function whatsappInviteUrl(feedbackUrl: string): string {
  return `https://wa.me/?text=${encodeURIComponent(whatsappInviteMessage(feedbackUrl))}`;
}