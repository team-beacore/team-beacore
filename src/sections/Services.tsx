import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Core } from "../components/core/Core";
import { SectionIntro } from "../components/experience/SectionIntro";
import { ServiceDemo } from "../components/service/ServiceDemo";
import { serviceIcon } from "../components/service/serviceIcon";
import { services, servicePath, type Service } from "../content/services";
import { ArrowRightIcon } from "../lib/icons";
import { cn } from "../lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** CTA de cada oferta: página própria quando existe; senão, o contato. */
function ServiceCta({ service }: { service: Service }) {
  const className =
    "group/cta inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-night-950 transition-colors hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";
  const content = (
    <>
      {service.cta}
      <ArrowRightIcon
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1"
      />
    </>
  );
  return service.page ? (
    <Link to={servicePath(service)} className={className}>
      {content}
    </Link>
  ) : (
    <a href="/#contato" className={className}>
      {content}
    </a>
  );
}

/** Conteúdo textual do painel — o mesmo para o painel ativo e os ocultos. */
function ServiceDetails({ service }: { service: Service }) {
  return (
    <>
      <h3 className="font-display text-3xl font-semibold tracking-[-0.035em] text-white sm:text-[2.6rem] sm:leading-[1.05]">
        {service.title}
      </h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-ink-300 sm:text-lg">{service.summary}</p>

      <dl className="mt-7 grid gap-5 border-t border-white/10 pt-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink-400">O problema</dt>
          <dd className="mt-2 leading-relaxed text-ink-300">{service.problem}</dd>
        </div>
        <div>
          <dt className="text-ink-400">O que você recebe</dt>
          <dd className="mt-2 leading-relaxed text-white">{service.highlight}</dd>
        </div>
      </dl>

      <div className="mt-8">
        <ServiceCta service={service} />
      </div>
    </>
  );
}

/**
 * Serviços — lista selecionável + painel principal.
 *
 * Padrão de abas acessível (WAI-ARIA Tabs): setas, Home e End navegam; cada
 * aba controla seu painel. TODOS os painéis existem no DOM (os inativos com
 * `hidden`), então o conteúdo completo das seis ofertas continua no HTML
 * pré-renderizado e disponível para leitores de tela.
 *
 * O painel ativo traz uma pequena demonstração visual da solução
 * (ServiceDemo) — o único elemento animado da seção. No mobile, as abas viram uma
 * faixa rolável de toque logo acima do painel.
 */
export function Services() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const reduced = useReducedMotion();

  const select = (index: number, focus = false) => {
    const next = (index + services.length) % services.length;
    setActive(next);
    if (focus) {
      const tab = tabsRef.current[next];
      tab?.focus();
      tab?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => select(active + 1, true),
      ArrowRight: () => select(active + 1, true),
      ArrowUp: () => select(active - 1, true),
      ArrowLeft: () => select(active - 1, true),
      Home: () => select(0, true),
      End: () => select(services.length - 1, true),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  return (
    <section
      id="servicos"
      aria-labelledby="services-title"
      className="relative scroll-mt-24 overflow-hidden bg-night-900"
    >
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 sm:px-6 sm:pb-28 lg:px-8 lg:pb-36">
        <SectionIntro
          id="services-title"
          title="O que a Beacore faz."
          description="Seis frentes de trabalho. Cada uma resolve um tipo específico de problema — escolha uma para ver o que ela entrega."
        />

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[19rem_1fr] lg:gap-8">
          {/* ------------------------------------------------------- abas */}
          <div
            role="tablist"
            aria-label="Serviços da Beacore"
            aria-orientation="vertical"
            className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {services.map((service, index) => {
              const Icon = serviceIcon(service.icon);
              const selected = index === active;
              return (
                <button
                  key={service.id}
                  ref={(node) => {
                    tabsRef.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`service-tab-${service.id}`}
                  aria-selected={selected}
                  aria-controls={`service-panel-${service.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(index)}
                  onKeyDown={onKeyDown}
                  className={cn(
                    "group relative flex shrink-0 snap-start items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-colors duration-300 lg:w-full lg:rounded-none lg:border-0 lg:border-l-2 lg:py-4 lg:pl-5",
                    selected
                      ? "border-white/15 bg-white/[0.06] lg:border-brand-400 lg:bg-transparent"
                      : "border-white/[0.06] lg:border-white/[0.08] lg:hover:border-white/25",
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 transition-colors duration-300",
                      selected ? "text-brand-300" : "text-ink-500 group-hover:text-ink-300",
                    )}
                  />
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block whitespace-nowrap text-[15px] font-medium transition-colors lg:whitespace-normal",
                        selected ? "text-white" : "text-ink-300 group-hover:text-white",
                      )}
                    >
                      {service.title}
                    </span>
                    <span className="mt-0.5 hidden text-xs leading-snug text-ink-400 lg:line-clamp-1">
                      {service.highlight}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* ---------------------------------------------------- painéis */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-night-850">

            {services.map((service, index) => {
              const selected = index === active;
              const panelProps = {
                role: "tabpanel" as const,
                id: `service-panel-${service.id}`,
                "aria-labelledby": `service-tab-${service.id}`,
                tabIndex: 0,
                className: "relative outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400",
              };

              if (!selected) {
                return (
                  <div key={service.id} {...panelProps} hidden>
                    <div className="p-7 sm:p-10">
                      <ServiceDetails service={service} />
                    </div>
                  </div>
                );
              }

              return (
                <div key={service.id} {...panelProps}>
                  <AnimatePresence mode="wait" initial={false}>
                    <m.div
                      key={service.id}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="grid gap-8 p-7 sm:p-10 xl:grid-cols-[1fr_1.05fr] xl:items-center xl:gap-10"
                    >
                      <div>
                        <ServiceDetails service={service} />
                      </div>
                      <m.div
                        initial={reduced ? false : { opacity: 0, scale: 0.96, rotateX: 8 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.08 }}
                        className="h-60 [perspective:1000px] sm:h-72 xl:h-[22rem]"
                      >
                        <ServiceDemo serviceId={service.id} />
                      </m.div>
                    </m.div>
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Saída para quem ainda não sabe qual escolher — o Core pensa junto. */}
        <div className="mt-10 flex items-center gap-5 lg:ml-[21rem]">
        <Core pose="thinking-2" className="h-24 w-auto shrink-0 sm:h-28" />
        <p className="max-w-2xl text-base leading-relaxed text-ink-300">
          Não sabe qual das frentes resolve o seu caso?{" "}
          <Link
            to="/servicos"
            className="font-semibold text-white underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-brand-400"
          >
            Veja cada oferta em detalhe
          </Link>{" "}
          ou{" "}
          <a
            href="#contato"
            className="font-semibold text-white underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-brand-400"
          >
            conte o problema direto pra gente
          </a>
          .
        </p>
        </div>
      </div>
    </section>
  );
}
