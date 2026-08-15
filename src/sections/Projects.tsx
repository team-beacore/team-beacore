import { useState } from "react";
import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { ProjectCard } from "../components/ProjectCard";
import { projects, projectCategories, type ProjectCategory } from "../data/projects";
import { cn } from "../lib/utils";

type FilterId = "todos" | ProjectCategory;

const filters: { id: FilterId; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...projectCategories.map((category) => ({ id: category.id as FilterId, label: category.label })),
];

export function Projects() {
  const [filter, setFilter] = useState<FilterId>("todos");

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
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
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

        <div className="mt-10 grid gap-5 sm:gap-6 lg:mt-14 lg:grid-cols-2">
          {visibleProjects.map((project) => (
            <div key={project.id} className={cn(project.featured && "lg:col-span-2")}>
              <ProjectCard project={project} large={project.featured} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}