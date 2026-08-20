import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

export type ClientStatus = "active" | "inactive";

export type AdminClient = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  notes: string | null;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
  projectIds: string[];
};

type AdminClientRow = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  notes: string | null;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
  project_ids: string[];
};

function rowToAdminClient(row: AdminClientRow): AdminClient {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    avatar: row.avatar,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    projectIds: row.project_ids,
  };
}

export type AdminClientInput = {
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  notes: string;
  status: ClientStatus;
};

export type AdminClientResult =
  | { ok: true; id: string }
  | {
      ok: false;
      reason:
        | "invalid_name"
        | "invalid_email"
        | "invalid_status"
        | "duplicate_email"
        | "not_found"
        | "internal"
        | "error";
    };

export const adminClientErrorMessages: Record<
  Exclude<AdminClientResult, { ok: true }>["reason"],
  string
> = {
  invalid_name: "Informe um nome válido (2 a 120 caracteres).",
  invalid_email: "Informe um e-mail válido.",
  invalid_status: "Selecione um status válido.",
  duplicate_email: "Já existe um cliente com este e-mail.",
  not_found: "Cliente não encontrado.",
  internal: "Não foi possível salvar o cliente. Tente novamente.",
  error: "Não foi possível salvar o cliente. Tente novamente.",
};

export async function listAdminClients(): Promise<AdminClient[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await getSupabaseClient().rpc("admin_list_clients");

    if (error) {
      console.error("[adminClients] Falha ao listar clientes:", error.message);
      return [];
    }

    return (data ?? []).map(rowToAdminClient);
  } catch (err) {
    console.error("[adminClients] Erro inesperado ao listar clientes:", err);
    return [];
  }
}

export async function createAdminClient(
  input: AdminClientInput,
): Promise<AdminClientResult> {
  if (!isSupabaseConfigured) return { ok: false, reason: "error" };

  try {
    const { data, error } = await getSupabaseClient().rpc("admin_create_client", {
      p_name: input.name,
      p_company: input.company,
      p_email: input.email,
      p_phone: input.phone,
      p_avatar: input.avatar,
      p_notes: input.notes,
      p_status: input.status,
    });

    if (error) {
      console.error("[adminClients] Falha ao criar cliente:", error.message);
      return { ok: false, reason: "error" };
    }

    return clientResultFromResponse(data);
  } catch (err) {
    console.error("[adminClients] Erro inesperado ao criar cliente:", err);
    return { ok: false, reason: "error" };
  }
}

export async function updateAdminClient(
  id: string,
  input: AdminClientInput,
): Promise<AdminClientResult> {
  if (!isSupabaseConfigured) return { ok: false, reason: "error" };

  try {
    const { data, error } = await getSupabaseClient().rpc("admin_update_client", {
      p_client_id: id,
      p_name: input.name,
      p_company: input.company,
      p_email: input.email,
      p_phone: input.phone,
      p_avatar: input.avatar,
      p_notes: input.notes,
      p_status: input.status,
    });

    if (error) {
      console.error("[adminClients] Falha ao atualizar cliente:", error.message);
      return { ok: false, reason: "error" };
    }

    return clientResultFromResponse(data);
  } catch (err) {
    console.error("[adminClients] Erro inesperado ao atualizar cliente:", err);
    return { ok: false, reason: "error" };
  }
}

export type SetClientProjectsResult = { ok: true } | { ok: false; reason: string };

export async function setClientProjects(
  clientId: string,
  projectIds: string[],
): Promise<SetClientProjectsResult> {
  if (!isSupabaseConfigured) return { ok: false, reason: "error" };

  try {
    const { data, error } = await getSupabaseClient().rpc("admin_set_client_projects", {
      p_client_id: clientId,
      p_project_ids: projectIds,
    });

    if (error) {
      console.error("[adminClients] Falha ao salvar vínculos:", error.message);
      return { ok: false, reason: "error" };
    }

    const result = data as { success: boolean; reason?: string };

    if (!result.success) {
      return { ok: false, reason: result.reason ?? "internal" };
    }

    return { ok: true };
  } catch (err) {
    console.error("[adminClients] Erro inesperado ao salvar vínculos:", err);
    return { ok: false, reason: "error" };
  }
}

type AdminClientResponse = {
  success: boolean;
  id?: string;
  reason?: string;
};

function clientResultFromResponse(data: unknown): AdminClientResult {
  const result = data as AdminClientResponse;

  if (!result.success) {
    const reason = result.reason as Exclude<AdminClientResult, { ok: true }>["reason"];
    return { ok: false, reason: reason ?? "internal" };
  }

  return { ok: true, id: result.id ?? "" };
}