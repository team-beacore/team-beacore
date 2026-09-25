import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  need: string;
  goal: string;
  message: string;
  source: string;
  createdAt: string;
};

type AdminLeadRow = {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  need: string;
  goal: string;
  message: string;
  source: string;
  created_at: string;
};

function rowToAdminLead(row: AdminLeadRow): AdminLead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    whatsapp: row.whatsapp,
    need: row.need,
    goal: row.goal,
    message: row.message,
    source: row.source,
    createdAt: row.created_at,
  };
}

export type ListLeadsResult =
  | { ok: true; leads: AdminLead[] }
  | { ok: false; reason: "not_configured" | "not_authorized" | "error" };

export async function listLeads(): Promise<ListLeadsResult> {
  if (!isSupabaseConfigured) return { ok: false, reason: "not_configured" };

  try {
    const { data, error } = await (await getSupabaseClient()).rpc("admin_list_leads");

    if (error) {
      console.error("[leadsAdmin] Falha ao listar leads:", error.message);
      return {
        ok: false,
        reason: error.message.includes("not_authorized") ? "not_authorized" : "error",
      };
    }

    return { ok: true, leads: (data ?? []).map(rowToAdminLead) };
  } catch (err) {
    console.error("[leadsAdmin] Erro inesperado ao listar leads:", err);
    return { ok: false, reason: "error" };
  }
}
