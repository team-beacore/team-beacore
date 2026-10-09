import { useState, type PointerEvent as ReactPointerEvent } from "react";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Core } from "../components/core/Core";
import { SectionIntro } from "../components/experience/SectionIntro";
import { Reveal } from "../components/motion/Reveal";
import { useGsapScene } from "../components/motion/useGsapScene";
import { projectCategories, type Project, type ProjectCategory } from "../data/projects";
import { useProjects } from "../hooks/useProjects";
import { useProjectFeedbacks } from "../hooks/useProjectFeedbacks";
import type { ApprovedFeedback } from "../lib/feedbacks";
import { ArrowUpRightIcon, GitHubIcon } from "../lib/icons";
import { cn, initialsOf } from "../lib/utils";

type FilterId = "todos" | ProjectCategory;

const allFilters: { id: FilterId; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...projectCategories.map((category) => ({ id: category.id as FilterId, label: category.label })),
];

const categoryLabels: Record<ProjectCategory, string> = {
  site: "Site",
  aplicacao: "Aplicação",
  produto: "Produto",
  template: "Template",
};

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Prévia do projeto: screenshot real ou, sem imagem, a cor do projeto. */
function ProjectPreview({ project, priority }: { project: Project; priority?: boolean }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`Prévia do projeto ${project.name}`}
        width={1200}
        height={640}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover/mock:scale-[1.03]"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${project.accent} 0%, color-mix(in srgb, ${project.accent} 30%, #05050a) 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      <span className="font-display text-6xl font-semibold tracking-tight text-white/85">
        {initialsOf(project.name)}
      </span>
    </div>
  );
}

/**
 * Notebook em CSS com o screenshot real na tela. Inclina seguindo o cursor
 * (Motion, com mola) — o contêiner externo é animado pelo GSAP no scroll, então
 * as duas bibliotecas nunca atuam sobre o mesmo elemento.
 */
function LaptopMockup({ project, priority }: { project: Project; priority?: boolean }) {
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 140, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 140, damping: 18 });
  const glareX = useTransform(px, [-0.5, 0.5], ["15%", "85%"]);
  const glare = useTransform(
    glareX,
    (x) => `radial-gradient(520px circle at ${x} 0%, rgb(255 255 255 / 0.14), transparent 55%)`,
  );

  const onMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} className="group/mock relative [perspective:1800px]">
      {/* Valores ficam em 0 com movimento reduzido: onMove não os altera. */}
      <m.div style={{ rotateX, rotateY }} className="relative [transform-style:preserve-3d]">
        {/* tela */}
        <div className="relative rounded-t-[1.1rem] border border-white/15 bg-[#0b0d14] p-[1.6%] pb-[2.2%] shadow-[0_50px_120px_-40px_rgb(0_0_0/0.95)]">
          <span aria-hidden="true" className="absolute left-1/2 top-[0.55%] h-1 w-1 -translate-x-1/2 rounded-full bg-white/20" />
          <div className="overflow-hidden rounded-md bg-night-900">
            <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.03] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-brand-400/80" />
              <span className="ml-2 truncate rounded bg-white/[0.05] px-2.5 py-0.5 font-mono text-[10px] text-ink-400 sm:text-[11px]">
                {hostOf(project.demoUrl)}
              </span>
            </div>
            <div className="aspect-[1200/640] overflow-hidden">
              <ProjectPreview project={project} priority={priority} />
            </div>
          </div>
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-t-[1.1rem] mix-blend-overlay motion-reduce:hidden"
            style={{ background: glare }}
          />
        </div>
        {/* base */}
        <div
          aria-hidden="true"
          className="relative mx-[-4%] h-3.5 rounded-b-[1.2rem] rounded-t-sm bg-gradient-to-b from-[#2a2f3c] to-[#11141c] shadow-[0_20px_40px_-12px_rgb(0_0_0/0.9)]"
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-[14%] -translate-x-1/2 rounded-b-md bg-black/40" />
        </div>
      </m.div>

      <div
        aria-hidden="true"
        className="absolute -bottom-10 left-1/2 -z-10 h-24 w-3/4 -translate-x-1/2 rounded-[100%] bg-brand-600/25 blur-3xl transition-colors duration-700 group-hover/mock:bg-brand-500/40"
      />
    </div>
  );
}

function Quotes({ feedbacks }: { feedbacks: ApprovedFeedback[] }) {
  if (feedbacks.length === 0) return null;
  return (
    <div className="mt-7 space-y-3 border-t border-white/10 pt-6">
      <p className="label-mono text-[10px] text-ink-400">O que o cliente disse</p>
      {feedbacks.map((feedback) => (
        <figure key={feedback.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <blockquote className="text-sm leading-relaxed text-ink-200">“{feedback.content}”</blockquote>
          <figcaption className="mt-3 text-xs font-semibold text-white">
            {feedback.authorName?.trim() || "Cliente"}
            {feedback.authorName?.trim() && feedback.company && (
              <span className="font-normal text-ink-400"> · {feedback.company}</span>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Um projeto = um capítulo: mockup grande de um lado, história do outro. */
function ProjectChapter({
  project,
  index,
  feedbacks,
}: {
  project: Project;
  index: number;
  feedbacks: ApprovedFeedback[];
}) {
  const flipped = index % 2 === 1;

  return (
    <article
      data-case="chapter"
      aria-labelledby={`case-title-${project.id}`}
      className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
    >
      <div data-case="mock" className={cn("lg:col-span-7", flipped && "lg:order-2")}>
        <LaptopMockup project={project} priority={index === 0} />
      </div>

      <div data-case="info" className={cn("lg:col-span-5", flipped && "lg:order-1")}>
        <p className="flex items-center gap-3">
          <span className="font-mono text-sm text-brand-400">{String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden="true" className="h-px w-8 bg-white/20" />
          <span className="label-mono text-[10px] text-ink-400">{categoryLabels[project.category]}</span>
        </p>
        <h3
          id={`case-title-${project.id}`}
          className="mt-4 font-display text-3xl font-semibold tracking-[-0.035em] text-white sm:text-[2.6rem] sm:leading-[1.05]"
        >
          {project.name}
        </h3>
        <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">{project.description}</p>

        {project.technologies.length > 0 && (
          <ul aria-label="Tecnologias" className="mt-6 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-ink-200"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <Quotes feedbacks={feedbacks} />

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Ver o projeto ${project.name} (abre em nova aba)`}
            className="group/link inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-night-950 transition-colors hover:bg-brand-100"
          >
            Ver projeto
            <ArrowUpRightIcon
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            />
          </a>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Código no GitHub do projeto ${project.name}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40"
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

export function Cases() {
  const { projects, loading } = useProjects();
  const feedbacksByProject = useProjectFeedbacks(projects, !loading);
  const [filter, setFilter] = useState<FilterId>("todos");

  // Só oferece o filtro que tem projeto — nenhum botão leva ao vazio.
  const filters = allFilters.filter(
    (item) => item.id === "todos" || projects.some((project) => project.category === item.id),
  );

  const visible =
    filter === "todos" ? projects : projects.filter((project) => project.category === filter);

  /**
   * Cena GSAP: cada notebook "abre" ao entrar (rotateX 16° → 0) e o texto
   * sobe — scrub, então acompanha o scroll nos dois sentidos. Refeita quando
   * a lista muda (dados do Supabase ou filtro).
   */
  const ref = useGsapScene<HTMLElement>(
    ({ q, gsap }) => {
      q("[data-case='chapter']").forEach((chapter) => {
        const mock = chapter.querySelector("[data-case='mock']");
        const info = chapter.querySelector("[data-case='info']");
        gsap.fromTo(
          mock,
          { rotateX: 16, y: 60, opacity: 0.4, transformPerspective: 1600, transformOrigin: "50% 100%" },
          {
            rotateX: 0,
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: chapter, start: "top 90%", end: "top 35%", scrub: 0.6 },
          },
        );
        gsap.fromTo(
          info,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: chapter, start: "top 80%", end: "top 45%", scrub: 0.6 },
          },
        );
      });
    },
    { disableOnCompact: true, deps: [visible.map((project) => project.id).join(",")] },
  );

  return (
    <section
      ref={ref}
      id="projetos"
      aria-labelledby="cases-title"
      className="relative scroll-mt-24 overflow-hidden bg-night-900"
    >
      <div aria-hidden="true" className="hairline absolute inset-x-0 top-0 h-px" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-1/4 h-[34rem] w-[34rem] rounded-full bg-brand-600/[0.1] blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionIntro
              index="04"
              eyebrow="Cases"
              id="cases-title"
              title="O que já colocamos no ar."
              description="Projetos reais, com o que foi construído e as tecnologias usadas em cada um."
            />
          </Reveal>

          <div className="flex flex-col items-start gap-6 lg:items-end">
            {/* Detalhe discreto: o Core examinando os projetos. */}
            <Core pose="search" className="hidden w-20 lg:block lg:w-24" />
            {filters.length > 2 && (
              <div role="group" aria-label="Filtrar cases por tipo" className="flex flex-wrap gap-2">
                {filters.map((item) => {
                  const pressed = filter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilter(item.id)}
                      aria-pressed={pressed}
                      className={cn(
                        "rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        pressed
                          ? "border-white bg-white text-night-950"
                          : "border-white/15 text-ink-300 hover:border-white/40 hover:text-white",
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="mt-16 space-y-24 sm:space-y-28 lg:mt-24 lg:space-y-36">
            {visible.map((project, index) => (
              <ProjectChapter
                key={project.id}
                project={project}
                index={index}
                feedbacks={feedbacksByProject[project.id] ?? []}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <p className="mt-12 text-center text-sm text-ink-400">
              Nenhum projeto nesta categoria por enquanto.
            </p>
          )
        )}
      </div>
    </section>
  );
}
