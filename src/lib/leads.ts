import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

export type LeadSource = "home" | "contact" | "service" | "unknown" | `trafego-pago:${string}`;

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

export type TrafficLeadInput = {
  name: string;
  company: string;
  email: string;
  whatsapp?: string;
  site?: string;
  /** "meta-ads" | "google-ads" | "meta-google" — gravado em `source`. */
  channel: string;
  channelLabel: string;
  goal: string;
  goalLabel: string;
  /** Valor de `goal` já aceito pelo banco antes da migration 0012. */
  fallbackGoal: string;
  context?: string;
};

/** Violação de CHECK constraint no Postgres (via PostgREST). */
const CHECK_VIOLATION = "23514";

/**
 * Lead da página de Gestão de Tráfego Pago — mesma tabela `leads`.
 *
 * A tabela não tem colunas de empresa, site ou canal: empresa, site, canal e
 * objetivo vão no início de `message` (o painel /admin mostra a mensagem
 * inteira) e o canal também vai em `source` ("trafego-pago:meta-ads").
 *
 * `need = "trafego-pago"` e os novos objetivos só são aceitos depois da
 * migration 0012. Enquanto ela não for aplicada, o banco recusa com violação de
 * CHECK e o envio é repetido UMA vez com valores já aceitos ("nao-sei" e o
 * objetivo equivalente) — nenhum dado se perde, porque tudo está na mensagem.
 */
export async function submitTrafficLead(input: TrafficLeadInput): Promise<SubmitLeadResult> {
  if (!isSupabaseConfigured) {
    console.error("[leads] Supabase não configurado: o lead não foi registrado.");
    return { ok: false, reason: "not_configured" };
  }

  const whatsapp = input.whatsapp?.trim();
  const header = [
    "[Gestão de tráfego pago]",
    `Canal: ${input.channelLabel}`,
    `Empresa: ${input.company.trim()}`,
    `Site: ${input.site?.trim() || "não informado"}`,
    `Objetivo: ${input.goalLabel}`,
  ].join("\n");
  const context = input.context?.trim();
  const message = `${header}\n\n${context || "(sem contexto adicional)"}`.slice(0, 2000);

  const row = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    whatsapp: whatsapp ? whatsapp : null,
    need: "trafego-pago",
    goal: input.goal,
    message,
    source: `trafego-pago:${input.channel}`.slice(0, 64),
  };

  try {
    const client = await getSupabaseClient();
    let { error } = await client.from("leads").insert(row);

    if (error?.code === CHECK_VIOLATION) {
      console.warn("[leads] Banco sem a migration 0012: registrando com need/goal compatíveis.");
      ({ error } = await client.from("leads").insert({ ...row, need: "nao-sei", goal: input.fallbackGoal }));
    }

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
