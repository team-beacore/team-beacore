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
   * Entrada (≈1s, só transform/opacity) + parallax do Core e do painel
   * acompanhando o cursor. Desligado em telas compactas e com movimento
   * reduzido — o conteúdo já está no estado final no HTML.
   */
  const ref = useGsapScene<HTMLElement>(
    ({ q, gsap }) => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
      timeline
        .from(q("[data-hero='badge']"), { opacity: 0, y: 12 }, 0.05)
        .from(q("[data-hero='headline-line']"), { opacity: 0, yPercent: 40, stagger: 0.09, duration: 0.9 }, 0.1)
        .from(q("[data-hero='lede']"), { opacity: 0, y: 16 }, 0.4)
        .from(q("[data-hero='cta']"), { opacity: 0, y: 14, stagger: 0.08 }, 0.5)
        .from(q("[data-hero='meta']"), { opacity: 0 }, 0.7)
        .from(q("[data-hero='core']"), { opacity: 0, y: 40, scale: 0.9, duration: 1.1 }, 0.55)
        .from(q("[data-hero='panel']"), { opacity: 0, x: 24, duration: 0.9 }, 0.8)
        .from(q("[data-hero='cue']"), { opacity: 0 }, 1.1);

      const coreX = gsap.quickTo(q("[data-hero='core']"), "x", { duration: 0.9, ease: "power3.out" });
      const coreY = gsap.quickTo(q("[data-hero='core']"), "y", { duration: 0.9, ease: "power3.out" });
      const panelX = gsap.quickTo(q("[data-hero='panel']"), "x", { duration: 1.1, ease: "power3.out" });
      const panelY = gsap.quickTo(q("[data-hero='panel']"), "y", { duration: 1.1, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        coreX(nx * 18);
        coreY(ny * 10);
        panelX(nx * -14);
        panelY(ny * -10);
      };

      // O conteúdo sobe e esmaece enquanto a cena assume a transição.
      gsap.to(q("[data-hero='copy']"), {
        yPercent: -12,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.4 },
      });

      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
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
      {/* Ambiente: luz fria vinda de cima, feixes verticais e grão. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-[-10%] h-[42rem] w-[42rem] rounded-full bg-brand-600/[0.13] blur-[120px]" />
        <div className="absolute left-[-15%] top-1/3 h-[28rem] w-[28rem] rounded-full bg-brand-800/20 blur-[120px]" />
        <div className="absolute inset-y-0 left-[58%] hidden w-px bg-gradient-to-b from-transparent via-white/[0.07] to-transparent lg:block" />
        <div className="absolute inset-y-0 left-[82%] hidden w-px bg-gradient-to-b from-transparent via-brand-400/[0.12] to-transparent lg:block" />
        <div className="absolute inset-0 bg-grid-dark opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_70%_40%,black,transparent)]" />
        <div className="grain absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night-900" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-5 pb-16 pt-28 sm:px-6 sm:pt-32 lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:px-8 lg:pb-20 lg:pt-28">
        {/* ----------------------------------------------------- Mensagem ---- */}
        <div data-hero="copy" className="relative z-10 max-w-2xl">
          <span
            data-hero="badge"
            className="label-mono inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[10px] text-ink-300 sm:text-[11px]"
          >
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-brand-400 shadow-[0_0_10px_2px_rgb(47_114_255/0.6)]" />
            Beacore — Digital Engineering
          </span>

          <h1
            id="hero-title"
            className="mt-7 font-display text-[2.55rem] font-semibold leading-[1.0] tracking-[-0.045em] text-white sm:text-[3.6rem] lg:text-[3.7rem] xl:text-[4.4rem]"
          >
            <span className="-mb-[0.14em] block overflow-hidden">
              <span data-hero="headline-line" className="block pb-[0.14em] text-silver">
                Transformamos
              </span>
            </span>
            <span className="-mb-[0.14em] block overflow-hidden">
              <span data-hero="headline-line" className="block pb-[0.14em] text-silver">
                necessidades em
              </span>
            </span>
            <span className="-mb-[0.14em] block overflow-hidden">
              <span data-hero="headline-line" className="block pb-[0.14em] text-brand-light">
                soluções digitais.
              </span>
            </span>
          </h1>

          <p
            data-hero="lede"
            className="mt-7 max-w-lg text-base leading-relaxed text-ink-300 sm:text-lg"
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

          <p
            data-hero="meta"
            className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-wide text-ink-500"
          >
            <span className="text-ink-400">Stack</span>
            <span aria-hidden="true" className="h-px w-6 bg-white/15" />
            React · TypeScript · Node.js · Tailwind · WordPress · Supabase
          </p>

          {projects.length > 0 && (
            <p data-hero="meta" className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-400">
              <span className="font-mono text-[11px] tracking-wide text-ink-400">No ar</span>
              <span aria-hidden="true" className="h-px w-6 bg-white/15" />
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
            className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_86%,transparent),linear-gradient(to_right,transparent,black_8%)] [mask-composite:intersect] lg:-right-24 lg:left-[-10%]"
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
            <p className="label-mono text-[9px] text-ink-400 sm:text-[10px]">
              Da ideia ao resultado
              <span className="hidden text-ink-500 [@media(hover:hover)]:lg:inline">
                {"  ·  "}explore com o cursor
              </span>
            </p>
            <div className="relative mt-4">
              <div aria-hidden="true" className="absolute left-0 right-0 top-[5px] h-px bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-300 shadow-[0_0_10px_rgb(47_114_255/0.7)] transition-[width] duration-700 ease-out"
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
                            ? "scale-125 border-brand-300 bg-brand-400 shadow-[0_0_12px_3px_rgb(47_114_255/0.7)]"
                            : reached
                              ? "border-brand-300/70 bg-night-900"
                              : "border-white/20 bg-night-900",
                        )}
                      />
                      <span
                        className={cn(
                          "text-[11px] transition-colors duration-500 sm:text-[13px]",
                          current ? "font-medium text-white" : reached ? "text-ink-300" : "text-ink-500",
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
            <div className="animate-bob">
              <Core pose="waving" priority className="w-full drop-shadow-[0_24px_30px_rgb(0_0_0/0.55)]" />
            </div>
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

      {/* Indicação de rolagem. */}
      <div
        data-hero="cue"
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
      >
        <span className="label-mono text-[10px] text-ink-500">Role para explorar</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scan bg-brand-400" />
        </span>
      </div>
    </section>
  );
}
