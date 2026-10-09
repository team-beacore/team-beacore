import { useEffect, useState } from "react";
import { projects as fallbackProjects, type Project } from "../data/projects";
import { getProjects, type ProjectsResult } from "../lib/projects";

/**
 * Uma única consulta por carregamento de página: Hero, Cases e Prova Social
 * usam este hook ao mesmo tempo, e cada instância disparava a mesma requisição.
 * O portfólio público não muda durante a visita.
 */
let request: Promise<ProjectsResult> | null = null;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  // Sinal técnico para diagnóstico. NUNCA renderizado para o visitante:
  // detalhes de infraestrutura não devem ser anunciados (inclusive por leitores de tela).
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let active = true;

    request ??= getProjects();
    request.then((result) => {
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
