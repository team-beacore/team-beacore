import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

export type LeadSource = "home" | "contact" | "service" | "unknown";

export type LeadInput = {
  name: string;
  email: string;
  whatsapp?: string;
  need: string;
  goal: string;
  message: string;
  source: LeadSource;
};

export type SubmitLeadResult = { ok: true } | { ok: false; reason: "not_configured" | "error" };

/**
 * Insere o lead diretamente na tabela `leads`.
 * A policy `leads_insert_public` permite apenas INSERT — nada é lido de volta,
 * por isso não há `.select()` encadeado aqui.
 */
export async function submitLead(input: LeadInput): Promise<SubmitLeadResult> {
  if (!isSupabaseConfigured) {
    console.error("[leads] Supabase não configurado: o lead não foi registrado.");
    return { ok: false, reason: "not_configured" };
  }

  const whatsapp = input.whatsapp?.trim();

  try {
    const { error } = await (await getSupabaseClient()).from("leads")
      .insert({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        whatsapp: whatsapp ? whatsapp : null,
        need: input.need,
        goal: input.goal,
        message: input.message.trim(),
        source: input.source,
      });

    if (error) {
      console.error("[leads] Falha ao registrar lead:", error.message);
      return { ok: false, reason: "error" };
    }

    return { ok: true };
  } catch (err) {
    console.error("[leads] Erro inesperado ao registrar lead:", err);
    return { ok: false, reason: "error" };
  }
}
