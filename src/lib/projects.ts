import { projects as fallbackProjects, type Project } from "../data/projects";
import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

type ProjectRow = {
  id: string;
  name: string;
  category: Project["category"];
  description: string;
  technologies: string[];
  demo_url: string;
  github_url: string | null;
  image: string | null;
  accent: string;
  featured: boolean;
};

export type ProjectsResult = {
  projects: Project[];
  source: "supabase" | "fallback";
};

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    technologies: row.technologies,
    demoUrl: row.demo_url,
    githubUrl: row.github_url ?? undefined,
    image: row.image ?? undefined,
    accent: row.accent,
    featured: row.featured,
  };
}

export async function getProjects(): Promise<ProjectsResult> {
  if (!isSupabaseConfigured) {
    return { projects: fallbackProjects, source: "fallback" };
  }

  try {
    const { data, error } = await getSupabaseClient()
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error("[projects] Falha ao consultar o Supabase:", error.message);
      return { projects: fallbackProjects, source: "fallback" };
    }

    return { projects: (data ?? []).map(rowToProject), source: "supabase" };
  } catch (err) {
    console.error("[projects] Erro inesperado ao consultar o Supabase:", err);
    return { projects: fallbackProjects, source: "fallback" };
  }
}