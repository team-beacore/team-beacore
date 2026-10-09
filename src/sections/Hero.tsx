import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Core, coreSrc } from "../components/core/Core";
import { HeroCanvas } from "../components/three/HeroCanvas";
import { useGsapScene } from "../components/motion/useGsapScene";
import { useProjects } from "../hooks/useProjects";
import { ArrowRightIcon } from "../lib/icons";
import { cn } from "../lib/utils";

/** A narrativa que a cena 3D encena: da ideia ao resultado. */
const STAGES = ["Ideia", "Estratégia", "Design", "Tecnologia", "Resultado"] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  // Estado inicial = última etapa: é o que o HTML pré-renderizado (e quem não
  // tem WebGL ou pediu menos movimento) deve ver — a história completa.
  const [stage, setStage] = useState(STAGES.length - 1);
  // Quando a cena 3D já tem o Core, a versão HTML (fallback) sai de cena.
  const [coreIn3D, setCoreIn3D] = useState(false);
  const bubbleRef = useRef<HTMLParagraphElement | null>(null);
  // Prova social real: os projetos publicados (Supabase, ou o fallback local).
  const { projects } = useProjects();

  /**
   * Entrada (≈1s, só transform/opacity). A interação com o cursor fica toda na
   * cena 3D — o texto e o painel não se mexem com o ponteiro, para não
   * competir com a leitura. Desligado em telas compactas e com movimento
   * reduzido — o conteúdo já está no estado final no HTML.
   */
  const ref = useGsapScene<HTMLElement>(
    ({ q, gsap }) => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
      timeline
        .from(q("[data-hero='headline-line']"), { opacity: 0, yPercent: 40, stagger: 0.09, duration: 0.9 }, 0.1)
        .from(q("[data-hero='lede']"), { opacity: 0, y: 16 }, 0.4)
        .from(q("[data-hero='cta']"), { opacity: 0, y: 14, stagger: 0.08 }, 0.5)
        .from(q("[data-hero='meta']"), { opacity: 0 }, 0.7)
        .from(q("[data-hero='core']"), { opacity: 0, y: 40, scale: 0.9, duration: 1.1 }, 0.55)
        .from(q("[data-hero='panel']"), { opacity: 0, y: 12, duration: 0.9 }, 0.8);

      // O conteúdo sobe e esmaece enquanto a cena assume a transição.
      gsap.to(q("[data-hero='copy']"), {
        yPercent: -12,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.4 },
      });
    },
    { disableOnCompact: true, entry: true },
  );

  const setRefs = (node: HTMLElement | null) => {
    sectionRef.current = node;
    ref.current = node;
  };

  return (
    <section
      ref={setRefs}
      id="inicio"
      className="relative isolate overflow-hidden bg-night-950"
      aria-labelledby="hero-title"
    >
      {/* Ambiente: uma única fonte de luz fria sobre a cena 3D, e grão. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-[-10%] h-[42rem] w-[42rem] rounded-full bg-brand-600/[0.13] blur-[120px]" />
        <div className="absolute inset-0 bg-grid-dark opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_70%_40%,black,transparent)]" />
        <div className="grain absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night-900" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-5 pb-16 pt-28 sm:px-6 sm:pt-32 lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:px-8 lg:pb-20 lg:pt-28">
        {/* ----------------------------------------------------- Mensagem ---- */}
        <div data-hero="copy" className="relative z-10 max-w-2xl">
          <h1
            id="hero-title"
            className="font-display text-[2.55rem] font-semibold leading-[1.0] tracking-[-0.045em] text-white sm:text-[3.6rem] lg:text-[3.7rem] xl:text-[4.4rem]"
          >
            <span className="-mb-[0.14em] block overflow-hidden">
              <span data-hero="headline-line" className="block pb-[0.14em]">
                Transformamos
              </span>
            </span>
            <span className="-mb-[0.14em] block overflow-hidden">
              <span data-hero="headline-line" className="block pb-[0.14em]">
                necessidades em
              </span>
            </span>
            <span className="-mb-[0.14em] block overflow-hidden">
              <span data-hero="headline-line" className="block pb-[0.14em]">
                soluções digitais.
              </span>
            </span>
          </h1>

          <p
            data-hero="lede"
            className="mt-7 max-w-lg text-base leading-relaxed text-ink-300 sm:text-lg lg:max-w-md xl:max-w-lg"
          >
            Sites, landing pages, sistemas, automações e produtos digitais desenvolvidos sob
            medida — do entendimento do problema até a solução publicada e funcionando.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <span data-hero="cta">
              <Button href="#contato" size="lg" variant="light" className="group max-sm:w-full">
                Falar sobre meu projeto
                <ArrowRightIcon
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </span>
            <span data-hero="cta">
              <Button href="#servicos" size="lg" variant="outline-light" className="max-sm:w-full">
                Ver o que fazemos
              </Button>
            </span>
          </div>

          {/* Prova concreta logo na abertura: o que já está publicado. */}
          {projects.length > 0 && (
            <p data-hero="meta" className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-400">
              <span>No ar:</span>
              {projects.map((project, index) => (
                <span key={project.id} className="inline-flex items-center gap-3">
                  {index > 0 && <span aria-hidden="true" className="text-ink-600">·</span>}
                  <a
                    href="#projetos"
                    className="text-ink-200 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-brand-400"
                  >
                    {project.name}
                  </a>
                </span>
              ))}
            </p>
          )}
        </div>

        {/* ----------------------------------------------------- Experiência --- */}
        <div className="relative h-[400px] sm:h-[500px] lg:h-[min(720px,82svh)]">
          <HeroCanvas
            scrollRoot={sectionRef}
            onStage={setStage}
            coreSrc={coreSrc("waving")}
            onCoreReady={() => setCoreIn3D(true)}
            anchorRef={bubbleRef}
            className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_86%,transparent),linear-gradient(to_right,transparent,black_8%)] [mask-composite:intersect] lg:-right-24 xl:left-[-10%]"
          />

          {/* Balão do Core 3D: posicionado a cada quadro pela própria cena. */}
          <p
            ref={bubbleRef}
            aria-hidden={!coreIn3D}
            className={cn(
              "glass pointer-events-none absolute left-0 top-0 hidden whitespace-nowrap rounded-xl rounded-bl-sm px-3 py-2 text-xs text-ink-200 will-change-transform",
              coreIn3D && "sm:block",
            )}
            style={{ opacity: 0 }}
          >
            Oi, eu sou o <span className="font-semibold text-white">Core</span>.
          </p>


          {/* Painel de etapas: a mesma história da cena, em texto. */}
          <div
            data-hero="panel"
            className="absolute bottom-0 right-0 w-[min(100%,26rem)] sm:w-[30rem] lg:bottom-8 lg:w-[31rem]"
          >
            <p className="text-xs text-ink-400 sm:text-[13px]">
              Da ideia ao resultado
              <span className="hidden text-ink-400 [@media(hover:hover)]:lg:inline">
                {" — "}mova o cursor sobre a cena
              </span>
            </p>
            <div className="relative mt-4">
              <div aria-hidden="true" className="absolute left-0 right-0 top-[5px] h-px bg-white/10">
                <div
                  className="h-full bg-brand-400 transition-[width] duration-700 ease-out"
                  style={{ width: `${(stage / (STAGES.length - 1)) * 100}%` }}
                />
              </div>
              <ol className="relative grid grid-cols-5">
                {STAGES.map((label, index) => {
                  const reached = index <= stage;
                  const current = index === stage;
                  return (
                    <li
                      key={label}
                      aria-current={current ? "step" : undefined}
                      className={cn(
                        "flex flex-col gap-2.5",
                        index === 0 ? "items-start" : index === STAGES.length - 1 ? "items-end" : "items-center",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-[11px] w-[11px] rounded-full border transition-all duration-500",
                          current
                            ? "scale-125 border-brand-300 bg-brand-400 ring-4 ring-brand-400/20"
                            : reached
                              ? "border-brand-300/70 bg-night-900"
                              : "border-white/20 bg-night-900",
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs transition-colors duration-500 sm:text-[13px]",
                          current ? "font-medium text-white" : reached ? "text-ink-300" : "text-ink-400",
                        )}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Core: anfitrião da experiência, de pé sobre o piso de luz. */}
          <div
            className={cn(
              "transition-opacity duration-700",
              coreIn3D && "pointer-events-none opacity-0",
            )}
          >
          <div
            data-hero="core"
            className="absolute bottom-0 left-0 w-[8.5rem] sm:left-4 sm:w-40 lg:bottom-6 lg:left-0 lg:w-48"
          >
            <Core pose="waving" priority className="w-full drop-shadow-[0_24px_30px_rgb(0_0_0/0.55)]" />
            <div
              aria-hidden="true"
              className="mx-auto -mt-3 h-4 w-3/4 rounded-[100%] bg-brand-500/40 blur-md"
            />
            <p className="glass absolute -top-9 left-10 hidden whitespace-nowrap rounded-xl rounded-bl-sm px-3 py-2 text-xs text-ink-200 sm:block">
              Oi, eu sou o <span className="font-semibold text-white">Core</span>.
            </p>
          </div>
          </div>
        </div>
      </div>

    </section>
  );
}
