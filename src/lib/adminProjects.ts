import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

export type ProjectCategory = "site" | "aplicacao" | "produto" | "template";

export const projectCategoryOptions: { id: ProjectCategory; label: string }[] = [
  { id: "site", label: "Site" },
  { id: "aplicacao", label: "Aplicação" },
  { id: "produto", label: "Produto" },
  { id: "template", label: "Template" },
];

export type AdminProject = {
  id: string;
  name: string;
  category: ProjectCategory;
  description: string;
  technologies: string[];
  demoUrl: string;
  githubUrl: string | null;
  image: string | null;
  accent: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type AdminProjectRow = {
  id: string;
  name: string;
  category: ProjectCategory;
  description: string;
  technologies: string[];
  demo_url: string;
  github_url: string | null;
  image: string | null;
  accent: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function rowToAdminProject(row: AdminProjectRow): AdminProject {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    technologies: row.technologies,
    demoUrl: row.demo_url,
    githubUrl: row.github_url,
    image: row.image,
    accent: row.accent,
    featured: row.featured,
    published: row.published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type AdminProjectInput = {
  id: string;
  name: string;
  category: ProjectCategory;
  description: string;
  technologies: string[];
  demoUrl: string;
  githubUrl: string;
  image: string;
  accent: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export type AdminProjectResult =
  | { ok: true; id: string }
  | {
      ok: false;
      reason:
        | "invalid_id"
        | "invalid_name"
        | "invalid_category"
        | "invalid_description"
        | "invalid_demo_url"
        | "invalid_accent"
        | "invalid_technologies"
        | "duplicate_id"
        | "not_found"
        | "internal"
        | "error";
    };

export const adminProjectErrorMessages: Record<
  Exclude<AdminProjectResult, { ok: true }>["reason"],
  string
> = {
  invalid_id: "O id deve conter apenas letras minúsculas, números e hífens.",
  invalid_name: "Informe um nome válido (máximo 160 caracteres).",
  invalid_category: "Selecione uma categoria válida.",
  invalid_description: "Informe uma descrição válida (máximo 4000 caracteres).",
  invalid_demo_url: "Informe uma URL de demonstração válida.",
  invalid_accent: "A cor deve estar no formato #RRGGBB (ex.: #0a5cff).",
  invalid_technologies: "A lista de tecnologias é inválida.",
  duplicate_id: "Já existe um projeto com este id. Escolha outro slug.",
  not_found: "Projeto não encontrado.",
  internal: "Não foi possível salvar o projeto. Tente novamente.",
  error: "Não foi possível salvar o projeto. Tente novamente.",
};

export async function listAdminProjects(): Promise<AdminProject[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await getSupabaseClient().rpc("admin_list_projects");

    if (error) {
      console.error("[adminProjects] Falha ao listar projetos:", error.message);
      return [];
    }

    return (data ?? []).map(rowToAdminProject);
  } catch (err) {
    console.error("[adminProjects] Erro inesperado ao listar projetos:", err);
    return [];
  }
}

export async function createAdminProject(
  input: AdminProjectInput,
): Promise<AdminProjectResult> {
  if (!isSupabaseConfigured) return { ok: false, reason: "error" };

  try {
    const { data, error } = await getSupabaseClient().rpc("admin_create_project", {
      p_id: input.id,
      p_name: input.name,
      p_category: input.category,
      p_description: input.description,
      p_technologies: input.technologies,
      p_demo_url: input.demoUrl,
      p_github_url: input.githubUrl,
      p_image: input.image,
      p_accent: input.accent,
      p_featured: input.featured,
      p_published: input.published,
      p_sort_order: input.sortOrder,
    });

    if (error) {
      console.error("[adminProjects] Falha ao criar projeto:", error.message);
      return { ok: false, reason: "error" };
    }

    return projectResultFromResponse(data);
  } catch (err) {
    console.error("[adminProjects] Erro inesperado ao criar projeto:", err);
    return { ok: false, reason: "error" };
  }
}

export async function updateAdminProject(
  id: string,
  input: Omit<AdminProjectInput, "id">,
): Promise<AdminProjectResult> {
  if (!isSupabaseConfigured) return { ok: false, reason: "error" };

  try {
    const { data, error } = await getSupabaseClient().rpc("admin_update_project", {
      p_id: id,
      p_name: input.name,
      p_category: input.category,
      p_description: input.description,
      p_technologies: input.technologies,
      p_demo_url: input.demoUrl,
      p_github_url: input.githubUrl,
      p_image: input.image,
      p_accent: input.accent,
      p_featured: input.featured,
      p_published: input.published,
      p_sort_order: input.sortOrder,
    });

    if (error) {
      console.error("[adminProjects] Falha ao atualizar projeto:", error.message);
      return { ok: false, reason: "error" };
    }

    return projectResultFromResponse(data);
  } catch (err) {
    console.error("[adminProjects] Erro inesperado ao atualizar projeto:", err);
    return { ok: false, reason: "error" };
  }
}

type AdminProjectResponse = {
  success: boolean;
  id?: string;
  reason?: string;
};

function projectResultFromResponse(data: unknown): AdminProjectResult {
  const result = data as AdminProjectResponse;

  if (!result.success) {
    const reason = result.reason as Exclude<AdminProjectResult, { ok: true }>["reason"];
    return { ok: false, reason: reason ?? "internal" };
  }

  return { ok: true, id: result.id ?? "" };
}