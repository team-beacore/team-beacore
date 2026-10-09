import { Core } from "../components/core/Core";
import { SectionIntro } from "../components/experience/SectionIntro";
import { team, type TeamMember } from "../data/team";
import { technologies } from "../data/technologies";
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
function Member({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-night-850">
      <div className="relative aspect-[4/4.2] overflow-hidden bg-night-800">
        {member.photo ? (
          <img
            src={member.photo}
            alt={`Foto de ${member.name}`}
            width={600}
            height={630}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div aria-hidden="true" className="flex h-full w-full items-center justify-center">
            <span className="font-display text-7xl font-semibold tracking-[-0.05em] text-white/70">
              {initialsOf(member.name)}
            </span>
          </div>
        )}
      </div>

      {/* Nome abaixo da foto, não sobre ela: a foto aparece inteira e com as cores reais. */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
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
 * Sem indicadores numéricos: a equipe aparece logo abaixo, com nome e foto
 * reais, e a stack é uma lista de texto — não uma faixa em movimento.
 */
export function About() {
  return (
    <section id="sobre" aria-labelledby="about-title" className="relative scroll-mt-24 overflow-hidden bg-night-950">
      <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        {/* --------------------------------------------- Quem somos + stack */}
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <SectionIntro id="about-title" size="xl" title="Quem constrói." />
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-200">
              A Beacore é uma equipe pequena de tecnologia: desenvolvimento full stack e atendimento
              comercial trabalhando juntos, do primeiro contato até a solução publicada.
            </p>
          </div>

          <div className="lg:pt-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-white">
                  Com o que trabalhamos
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
                  A stack parte do problema do projeto, não o contrário.
                </p>
              </div>
              <Core pose="presenting" className="-mb-6 h-24 w-auto shrink-0" />
            </div>
            <ul
              aria-label="Tecnologias"
              className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-6 font-mono text-[15px] text-ink-200"
            >
              {technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ------------------------------------------------------ Equipe ---- */}
        <div id="equipe" className="scroll-mt-24">
          <h3 className="mt-24 font-display text-3xl font-semibold tracking-[-0.035em] text-white sm:mt-28 sm:text-4xl">
            Por trás dos projetos.
          </h3>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <li key={member.id}>
                <Member member={member} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
