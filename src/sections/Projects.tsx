import { useEffect, useState } from "react";
import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { ProjectCard } from "../components/ProjectCard";
import { projectCategories, type ProjectCategory } from "../data/projects";
import { useProjects } from "../hooks/useProjects";
import { getApprovedProjectFeedbacks, type ApprovedFeedback } from "../lib/feedbacks";
import { cn } from "../lib/utils";

type FilterId = "todos" | ProjectCategory;

const filters: { id: FilterId; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...projectCategories.map((category) => ({ id: category.id as FilterId, label: category.label })),
];

export function Projects() {
  const { projects, loading, error } = useProjects();
  const [filter, setFilter] = useState<FilterId>("todos");
  const [feedbacksByProject, setFeedbacksByProject] = useState<
    Record<string, ApprovedFeedback[] | null>
  >({});

  useEffect(() => {
    if (loading) return;

    let active = true;

    Promise.all(
      projects.map(async (project) => {
        const feedbacks = await getApprovedProjectFeedbacks(project.id);
        return [project.id, feedbacks] as const;
      }),
    ).then((entries) => {
      if (!active) return;
      setFeedbacksByProject(Object.fromEntries(entries));
    });

    return () => {
      active = false;
    };
  }, [projects, loading]);

  const visibleProjects =
    filter === "todos" ? projects : projects.filter((project) => project.category === filter);

  return (
    <Section id="projetos" tone="neutral">
      <div className="py-20 sm:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Portfólio"
          title="O que já construímos."
          description="Projetos reais e templates que transformam presença digital em resultado."
        />

        <div
          role="group"
          aria-label="Filtrar projetos por categoria"
          className="mt-10 flex flex-wrap justify-center gap-2 lg:mt-12"
        >
          {filters.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
                  active
                    ? "border-ink-950 bg-ink-950 text-white shadow-sm"
                    : "border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-950",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div
          aria-busy={loading}
          className="mt-10 grid gap-5 sm:gap-6 lg:mt-14 lg:grid-cols-2"
        >
          {visibleProjects.map((project) => (
            <div key={project.id} className={cn(project.featured && "lg:col-span-2")}>
              <ProjectCard
                project={project}
                large={project.featured}
                feedbacks={feedbacksByProject[project.id] ?? undefined}
              />
            </div>
          ))}
        </div>

        {error && (
          <p role="status" className="sr-only">
            {error}
          </p>
        )}
      </div>
    </Section>
  );
}