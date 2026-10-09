import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Core } from "../components/core/Core";
import { SectionIntro } from "../components/experience/SectionIntro";
import { needs } from "../content/home";
import { getServiceBySlug, servicePath } from "../content/services";
import { ArrowRightIcon } from "../lib/icons";
import { cn } from "../lib/utils";

/**
 * "O que você precisa resolver?" — primeira bifurcação comercial da Home.
 *
 * Em vez de uma grade de cards iguais, uma lista editorial: o visitante se
 * reconhece em uma frase e o painel ao lado "acende" a solução que corresponde
 * a ela. Cada linha continua sendo o link para a oferta — o painel é um
 * complemento visual (desktop), nunca o único caminho até a informação.
 */
export function Needs() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const activeNeed = needs[active];
  const activeService = getServiceBySlug(activeNeed.serviceId);

  return (
    <section
      id="necessidades"
      aria-labelledby="needs-title"
      className="relative scroll-mt-24 overflow-hidden bg-night-900"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <SectionIntro
          id="needs-title"
          size="xl"
          title="O que você precisa resolver?"
          description="Escolha a frase que mais parece com a sua situação. Cada uma leva ao serviço que resolve esse caso."
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <ul className="border-t border-white/[0.08]">
            {needs.map((need, index) => {
              const service = getServiceBySlug(need.serviceId);
              const href = service ? servicePath(service) : "/#contato";
              const isRoute = href.startsWith("/servicos");
              const isActive = index === active;

              const body = (
                <>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block font-display text-xl font-medium tracking-[-0.02em] transition-colors duration-300 sm:text-2xl lg:text-[1.7rem]",
                        // Sem hover (toque), todas as frases ficam igualmente legíveis.
                        isActive ? "text-white" : "text-white lg:text-ink-300 lg:group-hover:text-white",
                      )}
                    >
                      {need.label}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-ink-400">
                      {need.detail}
                    </span>
                    {/* No toque/tablet o destino aparece na própria linha. */}
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 lg:hidden">
                      {service?.title}
                      <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
                    </span>
                  </span>
                  {/* Seta só no item ativo (desktop): indica o link sem repetir o ícone em toda linha. */}
                  <ArrowRightIcon
                    aria-hidden="true"
                    className={cn(
                      "mt-2 hidden h-5 w-5 shrink-0 text-brand-300 transition-[opacity,transform] duration-300 lg:block",
                      isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
                    )}
                  />
                </>
              );

              const linkClass =
                "group relative flex items-start gap-5 py-6 pl-1 pr-1 outline-none sm:gap-7 sm:py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400";

              const handlers = {
                onMouseEnter: () => setActive(index),
                onFocus: () => setActive(index),
              };

              return (
                <li key={need.id} className="relative border-b border-white/[0.08]">
                  {/* Sublinhado do item ativo: liga a frase escolhida ao painel. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-px left-0 hidden h-px w-full origin-left bg-brand-400 transition-transform duration-500 ease-out lg:block",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                  {isRoute ? (
                    <Link to={href} className={linkClass} {...handlers}>
                      {body}
                    </Link>
                  ) : (
                    <a href={href} className={linkClass} {...handlers}>
                      {body}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Painel da solução correspondente (desktop). */}
          <div className="hidden lg:block" aria-hidden="true">
            <div className="sticky top-28 border-l border-white/10 py-2 pl-10">
              <p className="text-sm text-ink-400">Para essa situação</p>

              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={activeNeed.id}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* O Core encena a situação escolhida — troca junto com o texto. */}
                  <Core pose={activeNeed.core} className="mb-6 mt-5 h-28 w-auto" />
                  <p className="font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
                    {activeService?.title}
                  </p>
                  <p className="mt-5 text-lg leading-relaxed text-ink-300">{activeService?.summary}</p>
                  {activeService && (
                    <dl className="mt-8 border-t border-white/10 pt-6 text-[15px] leading-relaxed">
                      <dt className="text-ink-400">O que você recebe</dt>
                      <dd className="mt-1.5 text-ink-100">{activeService.highlight}</dd>
                    </dl>
                  )}
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
