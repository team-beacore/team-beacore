import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { Stagger, StaggerItem } from "../components/motion/Reveal";
import { MotionCard } from "../components/motion/MotionCard";
import { useProjects } from "../hooks/useProjects";
import { useProjectFeedbacks } from "../hooks/useProjectFeedbacks";
import { QuoteIcon } from "../lib/icons";

/**
 * Prova social.
 *
 * Só renderiza se existir depoimento APROVADO no banco. Sem dado, a seção
 * simplesmente não aparece — nada de placeholder, "em breve" ou depoimento
 * fictício, que comunicariam pior do que a ausência.
 *
 * A estrutura visual já está pronta para receber os depoimentos assim que a
 * equipe emitir os tokens de feedback aos clientes.
 */
export function Testimonials() {
  const { projects, loading } = useProjects();
  const feedbacksByProject = useProjectFeedbacks(projects, !loading);

  const entries = projects.flatMap((project) =>
    (feedbacksByProject[project.id] ?? []).map((feedback) => ({
      feedback,
      projectName: project.name,
    })),
  );

  if (entries.length === 0) return null;

  return (
    <Section id="depoimentos" className="bg-surface">
      <div className="py-20 sm:py-24 lg:py-28">
        <SectionHeading
          eyebrow="Prova social"
          title="O que dizem os clientes."
          description="Depoimentos enviados diretamente pelos clientes dos projetos."
        />

        <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {entries.map(({ feedback, projectName }) => (
            <StaggerItem as="li" key={feedback.id}>
              <MotionCard as="article" lift={3} className="h-full">
                <figure className="flex h-full flex-col rounded-2xl card-surface p-6 transition-[border-color,box-shadow] duration-300 hover:card-accent">
                  <QuoteIcon aria-hidden="true" className="h-6 w-6 text-brand-500/40" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                    {feedback.content}
                  </blockquote>
                  <figcaption className="mt-5 border-t border-ink-100 pt-4">
                    <span className="block text-sm font-semibold text-ink-950">
                      {feedback.authorName ?? "Cliente"}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-500">
                      {feedback.company ? `${feedback.company} · ` : ""}
                      {projectName}
                    </span>
                  </figcaption>
                </figure>
              </MotionCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
