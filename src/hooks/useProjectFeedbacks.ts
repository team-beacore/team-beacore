import { useEffect, useState } from "react";
import type { Project } from "../data/projects";
import { getApprovedProjectFeedbacks, type ApprovedFeedback } from "../lib/feedbacks";

export type FeedbacksByProject = Record<string, ApprovedFeedback[]>;

/**
 * Busca os depoimentos aprovados de uma lista de projetos, uma vez só.
 *
 * Antes cada seção fazia a própria busca. Centralizar aqui evita que Cases e
 * Prova Social disparem o mesmo conjunto de chamadas duas vezes.
 * Nada é buscado durante o prerender — só após a montagem no navegador.
 */
export function useProjectFeedbacks(projects: Project[], ready: boolean) {
  const [byProject, setByProject] = useState<FeedbacksByProject>({});

  useEffect(() => {
    if (!ready || projects.length === 0) return;

    let active = true;

    Promise.all(
      projects.map(async (project) => {
        const feedbacks = await getApprovedProjectFeedbacks(project.id);
        return [project.id, feedbacks ?? []] as const;
      }),
    ).then((entries) => {
      if (!active) return;
      setByProject(Object.fromEntries(entries));
    });

    return () => {
      active = false;
    };
  }, [projects, ready]);

  return byProject;
}
