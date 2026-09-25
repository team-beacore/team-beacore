import { useState } from "react";
import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { CaseCard } from "../components/CaseCard";
import { Stagger, StaggerItem } from "../components/motion/Reveal";
import { projectCategories, type ProjectCategory } from "../data/projects";
import { useProjects } from "../hooks/useProjects";
import { useProjectFeedbacks } from "../hooks/useProjectFeedbacks";
import { cn } from "../lib/utils";

type FilterId = "todos" | ProjectCategory;

const allFilters: { id: FilterId; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...projectCategories.map((category) => ({ id: category.id as FilterId, label: category.label })),
];

export function Cases() {
  const { projects, loading } = useProjects();
  const feedbacksByProject = useProjectFeedbacks(projects, !loading);
  const [filter, setFilter] = useState<FilterId>("todos");

  // Só oferece o filtro que tem projeto. Evita botão que leva ao vazio —
  // era o caso na versão anterior, com 5 filtros para 2 projetos.
  const filters = allFilters.filter(
    (item) => item.id === "todos" || projects.some((project) => project.category === item.id),
  );

  const visible =
    filter === "todos" ? projects : projects.filter((project) => project.category === filter);

  return (
    <Section id="projetos">
      <div className="py-20 sm:py-24 lg:py-28">
        <SectionHeading
          eyebrow="Cases"
          title="O que já colocamos no ar."
          description="Projetos reais, com o que foi construído e as tecnologias usadas em cada um."
        />

        {filters.length > 2 && (
          <div
            role="group"
            aria-label="Filtrar cases por tipo"
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
                    "rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200",
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
        )}

        <Stagger as="ul" className="mt-10 grid gap-5 sm:gap-6 lg:mt-14 lg:grid-cols-2">
          {visible.map((project, index) => (
            <StaggerItem
              as="li"
              key={project.id}
              className={cn(project.featured && "lg:col-span-2")}
            >
              <CaseCard
                project={project}
                large={project.featured}
                priority={index === 0}
                feedbacks={feedbacksByProject[project.id]}
              />
            </StaggerItem>
          ))}
        </Stagger>

        {!loading && visible.length === 0 && (
          <p className="mt-12 text-center text-sm text-ink-500">
            Nenhum projeto nesta categoria por enquanto.
          </p>
        )}
      </div>
    </Section>
  );
}
