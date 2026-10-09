import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { SectionIntro } from "../components/experience/SectionIntro";
import { Reveal } from "../components/motion/Reveal";
import { serviceIcon } from "../components/service/serviceIcon";
import { needs } from "../content/home";
import { getServiceBySlug, servicePath } from "../content/services";
import { usePointerSpotlight } from "../hooks/usePointerSpotlight";
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
  const spotlight = usePointerSpotlight<HTMLDivElement>();

  const activeNeed = needs[active];
  const activeService = getServiceBySlug(activeNeed.serviceId);
  const ActiveIcon = activeService ? serviceIcon(activeService.icon) : null;

  return (
    <section
      id="necessidades"
      aria-labelledby="needs-title"
      className="relative scroll-mt-24 overflow-hidden bg-night-900"
    >
      <div aria-hidden="true" className="hairline absolute inset-x-0 top-0 h-px" />

      <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <Reveal>
          <SectionIntro
            index="02"
            eyebrow="Ponto de partida"
            id="needs-title"
            title="O que você precisa resolver?"
            description="Escolha o que mais parece com a sua situação. Cada caminho leva ao que fazemos por ele."
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <ol className="border-t border-white/[0.08]">
            {needs.map((need, index) => {
              const service = getServiceBySlug(need.serviceId);
              const href = service ? servicePath(service) : "/#contato";
              const isRoute = href.startsWith("/servicos");
              const isActive = index === active;

              const body = (
                <>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "font-mono text-xs transition-colors duration-300",
                      isActive ? "text-brand-400" : "text-ink-600",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block font-display text-xl font-medium tracking-[-0.02em] transition-colors duration-300 sm:text-2xl lg:text-[1.7rem]",
                        isActive ? "text-white" : "text-ink-300 group-hover:text-white",
                      )}
                    >
                      {need.label}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-ink-400">
                      {need.detail}
                    </span>
                    {/* No toque/tablet o destino aparece na própria linha. */}
                    <span className="label-mono mt-3 block text-[10px] text-brand-400 lg:hidden">
                      {service?.title}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                      isActive
                        ? "border-brand-400/60 bg-brand-500/15 text-white"
                        : "border-white/10 text-ink-500 group-hover:border-white/25 group-hover:text-white",
                    )}
                  >
                    <ArrowRightIcon
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isActive ? "translate-x-0.5 -rotate-45" : "",
                      )}
                    />
                  </span>
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
                  {/* Barra de progresso do item ativo. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-px left-0 h-px origin-left bg-gradient-to-r from-brand-400 to-transparent transition-transform duration-700 ease-out",
                      isActive ? "w-full scale-x-100" : "w-full scale-x-0",
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
          </ol>

          {/* Painel da solução correspondente (desktop). */}
          <div className="hidden lg:block" aria-hidden="true">
            <div
              ref={spotlight}
              className="glass spotlight sticky top-28 overflow-hidden rounded-3xl p-9"
            >
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />
              <p className="label-mono relative text-[10px] text-ink-500">Caminho sugerido</p>

              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={activeNeed.id}
                  initial={reduced ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduced ? undefined : { opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  {ActiveIcon && (
                    <span className="mt-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-400/30 bg-brand-500/10 text-brand-300 shadow-[0_0_40px_-8px_rgb(47_114_255/0.6)]">
                      <ActiveIcon className="h-6 w-6" />
                    </span>
                  )}
                  <p className="mt-6 font-display text-3xl font-semibold tracking-[-0.03em] text-white">
                    {activeService?.title}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-ink-300">
                    {activeService?.summary}
                  </p>
                  {activeService && (
                    <p className="mt-6 border-l border-brand-400/50 pl-4 text-sm leading-relaxed text-ink-400">
                      <span className="text-ink-200">Entrega: </span>
                      {activeService.highlight}
                    </p>
                  )}
                </m.div>
              </AnimatePresence>

              <div className="relative mt-10 flex items-center gap-2">
                {needs.map((need, index) => (
                  <span
                    key={need.id}
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      index === active ? "w-8 bg-brand-400" : "w-2 bg-white/15",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
