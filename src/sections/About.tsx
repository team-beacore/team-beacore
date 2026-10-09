import { SectionIntro } from "../components/experience/SectionIntro";
import { MotionCard } from "../components/motion/MotionCard";
import { Reveal, Stagger, StaggerItem } from "../components/motion/Reveal";
import { services } from "../content/services";
import { team, type TeamMember } from "../data/team";
import { technologies } from "../data/technologies";
import { usePointerSpotlight } from "../hooks/usePointerSpotlight";
import { ArrowUpRightIcon, GitHubIcon, LinkedInIcon, WhatsAppIcon } from "../lib/icons";
import { initialsOf } from "../lib/utils";

const iconLink =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-400 transition-colors hover:border-brand-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

/**
 * Integrante da equipe.
 *
 * REGRA: só fotografia real, vinda de `data/team.ts`. Sem foto, um monograma
 * abstrato — nunca um rosto gerado.
 */
function Member({ member, index }: { member: TeamMember; index: number }) {
  const spotlight = usePointerSpotlight<HTMLElement>();

  return (
    <article
      ref={spotlight}
      className="spotlight group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-night-850 transition-colors duration-500 hover:border-white/20"
    >
      <div className="relative aspect-[4/4.2] overflow-hidden bg-night-800">
        {member.photo ? (
          <img
            src={member.photo}
            alt={`Foto de ${member.name}`}
            width={600}
            height={630}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover grayscale-[0.85] transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
          />
        ) : (
          <div aria-hidden="true" className="relative flex h-full w-full items-center justify-center">
            <div className="absolute inset-0 bg-grid-dark opacity-60 [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_70%)]" />
            <div className="absolute h-40 w-40 rounded-full bg-brand-600/25 blur-3xl transition-transform duration-700 group-hover:scale-125" />
            <span className="relative font-display text-7xl font-semibold tracking-[-0.05em] text-white/80">
              {initialsOf(member.name)}
            </span>
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night-850 via-night-850/40 to-transparent"
        />
        <span className="label-mono absolute left-5 top-5 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[10px] text-ink-200 backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative -mt-14 flex flex-1 flex-col px-6 pb-6">
        <h4 className="font-display text-2xl font-semibold tracking-[-0.03em] text-white">
          {member.name}
        </h4>
        <p className="mt-1 text-sm font-medium text-brand-300">{member.role}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-400">{member.description}</p>

        <div className="mt-5 flex items-center gap-2 border-t border-white/[0.08] pt-5">
          {member.whatsapp && (
            <a
              href={`https://wa.me/${member.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp de ${member.name}`}
              className={iconLink}
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`GitHub de ${member.name}`}
              className={iconLink}
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`LinkedIn de ${member.name}`}
              className={iconLink}
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
          )}
          {member.portfolio && (
            <a
              href={member.portfolio}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-brand-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
            >
              Portfólio
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Sobre + Tecnologias + Equipe: quem somos → com o que trabalhamos → quem faz.
 *
 * Os âncoras `#sobre` e `#equipe` continuam válidos para a navegação.
 * Os indicadores são CONTAGENS dos próprios dados do site (equipe, ofertas,
 * stack) — nenhum número de projeto, cliente ou resultado.
 */
export function About() {
  const indicators = [
    { value: String(team.length).padStart(2, "0"), label: "pessoas na equipe" },
    { value: String(services.length).padStart(2, "0"), label: "frentes de trabalho" },
    { value: String(technologies.length).padStart(2, "0"), label: "tecnologias na stack" },
  ];

  return (
    <section id="sobre" aria-labelledby="about-title" className="relative scroll-mt-24 overflow-hidden bg-night-950">
      <div aria-hidden="true" className="hairline absolute inset-x-0 top-0 h-px" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-[32rem] w-[32rem] rounded-full bg-brand-700/[0.12] blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        {/* --------------------------------------------- Tecnologia + pessoas */}
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
          <Reveal>
            <SectionIntro
              index="06"
              eyebrow="Sobre"
              id="about-title"
              size="xl"
              title={
                <>
                  Quem
                  <br />
                  constrói<span className="text-brand-400">.</span>
                </>
              }
            />
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-300">
              Uma equipe pequena e multidisciplinar de tecnologia. Reunimos desenvolvimento, design e
              visão de negócio para transformar necessidades, processos e ideias em soluções
              digitais que funcionam.
            </p>
            <p className="mt-5 max-w-xl border-l border-brand-400/60 pl-5 text-base leading-relaxed text-ink-400">
              Trabalhamos com contato direto: você fala com quem está construindo, não com uma
              camada de intermediários.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08]">
              {indicators.map((item) => (
                <div key={item.label} className="bg-night-900 p-5 sm:p-6">
                  <dt className="sr-only">{item.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                      {item.value}
                    </span>
                    <span aria-hidden="true" className="mt-2 block text-xs leading-snug text-ink-400">
                      {item.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* ------------------------------------------------------- Stack ---- */}
        <Reveal>
          <div className="mt-20 overflow-hidden rounded-3xl border border-white/[0.08] bg-night-900 sm:mt-24">
            <div className="flex flex-col gap-2 px-6 pt-7 sm:flex-row sm:items-end sm:justify-between sm:px-9 sm:pt-9">
              <div>
                <p className="label-mono text-[10px] text-brand-400">Stack</p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                  As tecnologias que usamos.
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink-400">
                A escolha da stack parte do problema do projeto, não do contrário.
              </p>
            </div>

            <div className="relative mt-8 border-t border-white/[0.08] py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
              <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
                {[0, 1].map((copy) => (
                  <ul
                    key={copy}
                    aria-hidden={copy === 1 ? true : undefined}
                    aria-label={copy === 0 ? "Tecnologias" : undefined}
                    className="flex shrink-0 gap-3"
                  >
                    {technologies.map((tech) => (
                      <li
                        key={tech}
                        className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-sm text-ink-200"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------ Equipe ---- */}
        <div id="equipe" className="scroll-mt-24">
          <Reveal>
            <div className="mt-24 flex flex-col gap-3 sm:mt-28 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label-mono text-[10px] text-brand-400">Equipe</p>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                  Por trás dos projetos.
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink-400">
                Uma equipe pequena, multidisciplinar e apaixonada por tecnologia.
              </p>
            </div>
          </Reveal>

          <Stagger as="ul" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <StaggerItem
                as="li"
                key={member.id}
                className={index % 3 === 1 ? "lg:translate-y-10" : undefined}
              >
                <MotionCard as="div" lift={6} className="h-full">
                  <Member member={member} index={index} />
                </MotionCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
