import type { Project, ProjectCategory } from "../data/projects";
import type { ApprovedFeedback } from "../lib/feedbacks";
import { MotionCard } from "./motion/MotionCard";
import { FeedbackQuote } from "./FeedbackQuote";
import { TechnologyBadge } from "./TechnologyBadge";
import { ArrowUpRightIcon, GitHubIcon } from "../lib/icons";
import { cn, initialsOf } from "../lib/utils";

const categoryLabels: Record<ProjectCategory, string> = {
  site: "Site",
  aplicacao: "Aplicação",
  produto: "Produto",
  template: "Template",
};

/**
 * Card de case.
 *
 * Só exibe o que existe de fato no registro do projeto. Enquanto a tabela
 * `projects` não tiver campos de desafio/solução/resultado, o card mostra a
 * descrição real — nenhum texto de "desafio" ou métrica é inferido.
 * O bloco de depoimento só aparece quando há feedback aprovado no banco.
 */
export function CaseCard({
  project,
  feedbacks,
  large = false,
  priority = false,
}: {
  project: Project;
  feedbacks?: ApprovedFeedback[];
  large?: boolean;
  priority?: boolean;
}) {
  const quotes = feedbacks ?? [];

  return (
    <MotionCard as="article" lift={5} className="h-full">
      <div
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-2xl card-surface transition-[border-color,box-shadow] duration-300 hover:card-accent",
          large && "md:grid md:grid-cols-2",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-ink-100",
            large ? "aspect-[16/10] md:aspect-auto md:min-h-[19rem]" : "aspect-[16/10]",
          )}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={`Prévia do projeto ${project.name}`}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="relative flex h-full w-full items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${project.accent} 0%, color-mix(in srgb, ${project.accent} 35%, #05050a) 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-grid-dark opacity-40" />
              <span className="font-display text-5xl font-bold tracking-tight text-white/85">
                {initialsOf(project.name)}
              </span>
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-950 backdrop-blur">
            {categoryLabels[project.category]}
          </span>
        </div>

        <div className={cn("flex flex-1 flex-col p-6 sm:p-7", large && "md:p-8")}>
          <h3 className="font-display text-xl font-bold leading-tight text-ink-950 sm:text-2xl">
            {project.name}
          </h3>

          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">{project.description}</p>

          {project.technologies.length > 0 && (
            <div className="mt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                Tecnologias
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <TechnologyBadge key={tech} name={tech} />
                ))}
              </div>
            </div>
          )}

          {quotes.length > 0 && (
            <div className="mt-6 border-t border-ink-100 pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                O que o cliente disse
              </p>
              <div className="mt-3 space-y-3">
                {quotes.map((feedback) => (
                  <FeedbackQuote
                    key={feedback.id}
                    content={feedback.content}
                    authorName={feedback.authorName}
                    company={feedback.company}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-5 border-t border-ink-100 pt-5">
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors hover:text-brand-700"
            >
              Ver projeto
              <ArrowUpRightIcon
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Código no GitHub do projeto ${project.name}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors hover:text-ink-900"
              >
                <GitHubIcon className="h-4 w-4" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </MotionCard>
  );
}
