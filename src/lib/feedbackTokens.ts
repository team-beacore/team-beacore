import type { Project } from "../data/projects";
import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

type ValidationResponse = {
  valid: boolean;
  reason?: "invalid" | "expired" | "used" | "revoked";
  client_name?: string;
  project?: {
    id: string;
    name: string;
    category: Project["category"];
    description: string;
    technologies: string[];
    demo_url: string;
    github_url: string | null;
    image: string | null;
    accent: string;
  };
};

export type FeedbackTokenValidation =
  | { valid: true; clientName: string; project: Project }
  | { valid: false; reason: "invalid" | "expired" | "used" | "revoked" | "error" };

export type SubmitFeedbackErrorReason =
  | "invalid"
  | "expired"
  | "revoked"
  | "used"
  | "already_submitted"
  | "invalid_author_name"
  | "invalid_author_email"
  | "invalid_content"
  | "internal"
  | "error";

export type SubmitFeedbackResult =
  | { success: true; feedbackId: string; status: "pending" }
  | { success: false; reason: SubmitFeedbackErrorReason };

function projectFromResponse(project: NonNullable<ValidationResponse["project"]>): Project {
  return {
    id: project.id,
    name: project.name,
    category: project.category,
    description: project.description,
    technologies: project.technologies,
    demoUrl: project.demo_url,
    githubUrl: project.github_url ?? undefined,
    image: project.image ?? undefined,
    accent: project.accent,
  };
}

export async function validateFeedbackToken(token: string): Promise<FeedbackTokenValidation> {
  if (!isSupabaseConfigured) {
    return { valid: false, reason: "error" };
  }

  try {
    const { data, error } = await getSupabaseClient().rpc("validate_feedback_token", {
      p_token: token,
    });

    if (error) {
      console.error("[feedbackTokens] Falha ao validar token:", error.message);
      return { valid: false, reason: "error" };
    }

    const result = data as ValidationResponse;

    if (!result.valid || !result.project || !result.client_name) {
      return { valid: false, reason: result.reason ?? "invalid" };
    }

    return {
      valid: true,
      clientName: result.client_name,
      project: projectFromResponse(result.project),
    };
  } catch (err) {
    console.error("[feedbackTokens] Erro inesperado ao validar token:", err);
    return { valid: false, reason: "error" };
  }
}

type SubmitResponse = {
  success: boolean;
  feedback_id?: string;
  status?: string;
  reason?: string;
};

export async function submitFeedback(
  token: string,
  authorName: string,
  authorEmail: string,
  content: string,
  publishAuthorName: boolean,
): Promise<SubmitFeedbackResult> {
  if (!isSupabaseConfigured) {
    return { success: false, reason: "error" };
  }

  try {
    const { data, error } = await getSupabaseClient().rpc("submit_feedback", {
      p_token: token,
      p_author_name: authorName,
      p_author_email: authorEmail,
      p_content: content,
      p_publish_author_name: publishAuthorName,
    });

    if (error) {
      console.error("[feedbackTokens] Falha ao enviar feedback:", error.message);
      return { success: false, reason: "error" };
    }

    const result = data as SubmitResponse;

    if (!result.success || !result.feedback_id) {
      return { success: false, reason: (result.reason as SubmitFeedbackErrorReason) ?? "invalid" };
    }

    return { success: true, feedbackId: result.feedback_id, status: "pending" };
  } catch (err) {
    console.error("[feedbackTokens] Erro inesperado ao enviar feedback:", err);
    return { success: false, reason: "error" };
  }
}