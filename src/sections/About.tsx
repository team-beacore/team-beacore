import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "../components/motion/Reveal";
import { MotionCard } from "../components/motion/MotionCard";
import { TeamCard } from "../components/TeamCard";
import { team } from "../data/team";
import { technologies } from "../data/technologies";

/**
 * Sobre + Tecnologias + Equipe, em uma seção só.
 *
 * As duas seções separadas ("Quem constrói" e "Equipe") diziam a mesma coisa em
 * momentos diferentes da página. Unificadas, o bloco institucional conta uma
 * história única: quem somos → com o que trabalhamos → quem faz.
 *
 * Os dois âncoras continuam válidos: `#sobre` na seção e `#equipe` no bloco da
 * equipe, para que os links de navegação existentes não quebrem.
 */
export function About() {
  return (
    <Section id="sobre">
      <div className="py-20 sm:py-24 lg:py-28">
        <SectionHeading
          eyebrow="Sobre"
          title="Quem constrói."
          description="Uma equipe pequena e multidisciplinar de tecnologia. Reunimos desenvolvimento, design e visão de negócio para transformar necessidades, processos e ideias em soluções digitais que funcionam."
        />

        <Reveal delay={60}>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-ink-600">
            Trabalhamos com contato direto: você fala com quem está construindo, não com uma
            camada de intermediários.
          </p>
        </Reveal>

        {/* ------------------------------------------------ Tecnologias ---- */}
        <Reveal delay={120}>
          <div className="relative mt-14 overflow-hidden rounded-2xl card-surface p-7 sm:mt-16 sm:p-9">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/[0.07] blur-3xl"
            />

            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                  Stack
                </p>
                <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-ink-950 sm:text-2xl">
                  As tecnologias que usamos.
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink-500">
                A escolha da stack parte do problema do projeto, não do contrário.
              </p>
            </div>

            <Stagger
              as="ul"
              step={0.045}
              className="relative mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5"
            >
              {technologies.map((tech) => (
                <StaggerItem as="li" key={tech}>
                  <MotionCard as="div" lift={2} className="h-full">
                    <div className="flex h-full items-center justify-center rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-3.5 text-center transition-colors duration-300 hover:border-brand-500/30 hover:bg-brand-50">
                      <span className="font-mono text-[13px] font-medium text-ink-700">
                        {tech}
                      </span>
                    </div>
                  </MotionCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>

        {/* ----------------------------------------------------- Equipe ---- */}
        <div id="equipe" className="scroll-mt-24">
          <Reveal>
            <div className="mt-16 flex flex-col gap-3 sm:mt-20 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                  Equipe
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
                  Por trás dos projetos.
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink-500">
                Uma equipe pequena, multidisciplinar e apaixonada por tecnologia.
              </p>
            </div>
          </Reveal>

          <Stagger as="ul" className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {team.map((member) => (
              <StaggerItem as="li" key={member.id}>
                <MotionCard as="div" lift={4} className="h-full">
                  <TeamCard member={member} />
                </MotionCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
