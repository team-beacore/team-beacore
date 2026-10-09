import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { SectionIntro } from "../components/experience/SectionIntro";
import { Reveal } from "../components/motion/Reveal";
import { useProjects } from "../hooks/useProjects";
import { useProjectFeedbacks } from "../hooks/useProjectFeedbacks";
import { cn, initialsOf } from "../lib/utils";

/**
 * Prova social.
 *
 * Só renderiza se existir depoimento APROVADO no banco. Sem dado, a seção
 * não aparece — nada de placeholder ou depoimento fictício.
 *
 * Apresentação editorial: uma citação por vez, grande, com seletor. O autor é
 * representado por iniciais — nunca por um rosto que não seja dele.
 */
export function Testimonials() {
  const { projects, loading } = useProjects();
  const feedbacksByProject = useProjectFeedbacks(projects, !loading);
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  const entries = projects.flatMap((project) =>
    (feedbacksByProject[project.id] ?? []).map((feedback) => ({
      feedback,
      projectName: project.name,
    })),
  );

  if (entries.length === 0) return null;

  const safeIndex = Math.min(index, entries.length - 1);
  const { feedback, projectName } = entries[safeIndex];
  const author = feedback.authorName?.trim() || "Cliente";

  return (
    <section
      id="depoimentos"
      aria-labelledby="testimonials-title"
      className="relative scroll-mt-24 overflow-hidden bg-night-950"
    >
      <div aria-hidden="true" className="hairline absolute inset-x-0 top-0 h-px" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <Reveal>
          <SectionIntro
            index="08"
            eyebrow="Prova social"
            id="testimonials-title"
            title="O que dizem os clientes."
            description="Depoimentos enviados diretamente pelos clientes dos projetos."
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[1fr_18rem] lg:gap-16">
          <div aria-live="polite" className="relative min-h-[14rem]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 -top-16 select-none font-display text-[12rem] leading-none text-brand-500/15"
            >
              “
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <m.figure
                key={feedback.id}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <blockquote className="font-display text-2xl font-medium leading-snug tracking-[-0.02em] text-white text-balance sm:text-3xl lg:text-[2.4rem] lg:leading-[1.2]">
                  {feedback.content}
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-400/40 bg-brand-500/10 font-display text-sm font-semibold text-brand-200"
                  >
                    {initialsOf(feedback.company || author)}
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-white">{author}</span>
                    <span className="mt-0.5 block text-sm text-ink-400">
                      {feedback.company ? `${feedback.company} · ` : ""}
                      {projectName}
                    </span>
                  </span>
                </figcaption>
              </m.figure>
            </AnimatePresence>
          </div>

          {entries.length > 1 && (
            <div role="group" aria-label="Escolher depoimento" className="flex flex-col gap-2">
              {entries.map((entry, i) => {
                const active = i === safeIndex;
                const name = entry.feedback.authorName?.trim() || "Cliente";
                return (
                  <button
                    key={entry.feedback.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                      active
                        ? "border-white/20 bg-white/[0.06]"
                        : "border-white/[0.06] hover:border-white/15",
                    )}
                  >
                    <span className="font-mono text-xs text-brand-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className={cn("block truncate text-sm font-medium", active ? "text-white" : "text-ink-400")}>
                        {name}
                      </span>
                      <span className="block truncate text-xs text-ink-500">{entry.projectName}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
