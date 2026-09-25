import { useEffect, useState } from "react";
import { projects as fallbackProjects, type Project } from "../data/projects";
import { getProjects } from "../lib/projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  // Sinal técnico para diagnóstico. NUNCA renderizado para o visitante:
  // detalhes de infraestrutura não devem ser anunciados (inclusive por leitores de tela).
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let active = true;

    getProjects().then((result) => {
      if (!active) return;
      setProjects(result.projects);
      setUsingFallback(result.source === "fallback");
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return { projects, loading, usingFallback };
}
