import { useEffect, useState } from "react";
import { projects as fallbackProjects, type Project } from "../data/projects";
import { getProjects } from "../lib/projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getProjects().then((result) => {
      if (!active) return;
      setProjects(result.projects);
      setError(
        result.source === "fallback"
          ? "Supabase indisponível ou não configurado. Exibindo projetos locais."
          : null,
      );
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return { projects, loading, error };
}