import type { Project, ProjectCategory } from "../data/projects";
import type { ApprovedFeedback } from "../lib/feedbacks";
import { ArrowUpRightIcon, GitHubIcon } from "../lib/icons";
import { cn, initialsOf } from "../lib/utils";
import { FeedbackQuote } from "./FeedbackQuote";
import { TechnologyBadge } from "./TechnologyBadge";

const categoryLabels: Record<ProjectCategory, string> = {
  site: "Site",
  aplicacao: "Aplicação",
  produto: "Produto",
  template: "Template",
};

function ProjectVisual({ project, large }: { project: Project; large: boolean }) {
  const visual = project.image ? (
    <img
      src={project.image}
      alt={`Prévia do projeto ${project.name}`}
      loading="lazy"
      className="h-full w-full object-cover"
    />
  ) : (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${project.accent} 0%, color-mix(in srgb, ${project.accent} 35%, #05050a) 100%)`,
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
      <span className="font-display text-5xl font-bold tracking-tight text-white/85 sm:text-6xl">
        {initialsOf(project.name)}
      </span>
      <span className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
        beacore — {categoryLabels[project.category]}
      </span>
    </div>
  );

  return (
    <div className={cn("relative overflow-hidden bg-ink-100", large ? "aspect-[16/10] md:aspect-auto md:min-h-72" : "aspect-[16/10]")}>
      {visual}
      {project.featured && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-950 backdrop-blur">
          Destaque
        </span>
      )}
    </div>
  );
}

type ProjectCardProps = {
  project: Project;
  large?: boolean;
  feedbacks?: ApprovedFeedback[];
};

export function ProjectCard({ project, large = false, feedbacks }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-glow",
        large && "md:grid md:grid-cols-2",
      )}
    >
      <ProjectVisual project={project} large={large} />

      <div className={cn("flex flex-1 flex-col p-6 sm:p-7", large && "md:p-8")}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
          {categoryLabels[project.category]}
        </p>
        <h3 className="mt-2 font-display text-xl font-bold text-ink-950 sm:text-2xl">{project.name}</h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-500">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <TechnologyBadge key={tech} name={tech} />
          ))}
        </div>

        {feedbacks && feedbacks.length > 0 && (
          <div className="mt-6 border-t border-ink-100 pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
              Depoimentos
            </p>
            <div className="mt-3 space-y-3">
              {feedbacks.map((feedback) => (
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Ver projeto
            <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Código no GitHub do projeto ${project.name}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}