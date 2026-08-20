import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

export type ApprovedFeedback = {
  id: string;
  content: string;
  authorName: string | null;
  company: string | null;
  createdAt: string;
};

type ApprovedFeedbackRow = {
  id: string;
  content: string;
  author_name: string | null;
  company: string | null;
  created_at: string;
};

export async function getApprovedProjectFeedbacks(
  projectId: string,
): Promise<ApprovedFeedback[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await getSupabaseClient().rpc("get_approved_project_feedbacks", {
      p_project_id: projectId,
    });

    if (error) {
      console.error("[feedbacks] Falha ao consultar feedbacks aprovados:", error.message);
      return null;
    }

    return (data ?? []).map((row: ApprovedFeedbackRow) => ({
      id: row.id,
      content: row.content,
      authorName: row.author_name,
      company: row.company,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("[feedbacks] Erro inesperado ao consultar feedbacks aprovados:", err);
    return null;
  }
}