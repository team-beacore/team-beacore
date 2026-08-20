import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

export type FeedbackStatus = "pending" | "approved" | "rejected";

export type AdminFeedback = {
  id: string;
  content: string;
  status: FeedbackStatus;
  createdAt: string;
  moderatedAt: string | null;
  authorName: string;
  authorEmail: string;
  publishAuthorName: boolean;
  clientName: string;
  clientCompany: string | null;
  projectId: string;
  projectName: string;
  projectImage: string | null;
};

type AdminFeedbackRow = {
  id: string;
  content: string;
  status: FeedbackStatus;
  created_at: string;
  moderated_at: string | null;
  author_name: string;
  author_email: string;
  publish_author_name: boolean;
  client_name: string;
  client_company: string | null;
  project_id: string;
  project_name: string;
  project_image: string | null;
};

function rowToAdminFeedback(row: AdminFeedbackRow): AdminFeedback {
  return {
    id: row.id,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    moderatedAt: row.moderated_at,
    authorName: row.author_name,
    authorEmail: row.author_email,
    publishAuthorName: row.publish_author_name,
    clientName: row.client_name,
    clientCompany: row.client_company,
    projectId: row.project_id,
    projectName: row.project_name,
    projectImage: row.project_image,
  };
}

export async function listFeedbacks(status?: FeedbackStatus): Promise<AdminFeedback[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await getSupabaseClient().rpc("admin_list_feedbacks", {
      p_status: status ?? null,
    });

    if (error) {
      console.error("[feedbackAdmin] Falha ao listar feedbacks:", error.message);
      return [];
    }

    return (data ?? []).map(rowToAdminFeedback);
  } catch (err) {
    console.error("[feedbackAdmin] Erro inesperado ao listar feedbacks:", err);
    return [];
  }
}

export type AdminActionErrorReason = "not_found" | "already_approved" | "already_rejected" | "error";

export type AdminActionResult = { ok: true } | { ok: false; reason: AdminActionErrorReason };

type AdminActionResponse = {
  success: boolean;
  status?: string;
  reason?: string;
};

async function runAdminAction(
  rpc: "admin_approve_feedback" | "admin_reject_feedback",
  feedbackId: string,
): Promise<AdminActionResult> {
  if (!isSupabaseConfigured) return { ok: false, reason: "error" };

  try {
    const { data, error } = await getSupabaseClient().rpc(rpc, {
      p_feedback_id: feedbackId,
    });

    if (error) {
      console.error(`[feedbackAdmin] Falha na ação ${rpc}:`, error.message);
      return { ok: false, reason: "error" };
    }

    const result = data as AdminActionResponse;

    if (!result.success) {
      const reason = result.reason as AdminActionErrorReason | undefined;
      return { ok: false, reason: reason ?? "error" };
    }

    return { ok: true };
  } catch (err) {
    console.error(`[feedbackAdmin] Erro inesperado na ação ${rpc}:`, err);
    return { ok: false, reason: "error" };
  }
}

export function approveFeedback(feedbackId: string): Promise<AdminActionResult> {
  return runAdminAction("admin_approve_feedback", feedbackId);
}

export function rejectFeedback(feedbackId: string): Promise<AdminActionResult> {
  return runAdminAction("admin_reject_feedback", feedbackId);
}