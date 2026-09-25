import { Button } from "../components/Button";
import { useGsapScene } from "../components/motion/useGsapScene";
import { ArrowRightIcon } from "../lib/icons";

/**
 * Terminal do Hero — restaurado na íntegra a partir do layout anterior.
 *
 * Os atributos `data-hero` foram acrescentados apenas como alvos da timeline
 * do GSAP; nenhuma classe ou conteúdo original foi alterado. É decorativo
 * (`aria-hidden`), então nada aqui precisa ser lido por leitor de tela.
 */
function CodeCard() {
  return (
    <div className="relative" aria-hidden="true">
      <div
        data-hero="glow"
        className="absolute -inset-8 rounded-[2.5rem] bg-brand-500/10 blur-3xl"
      />
      <div
        data-hero="chip"
        className="absolute -left-6 -top-6 h-24 w-24 rotate-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 opacity-15"
      />

      <div
        data-hero="panel"
        className="relative animate-float rounded-2xl border border-ink-100 bg-white/85 shadow-xl shadow-ink-950/5 backdrop-blur"
      >
        <div className="flex items-center gap-1.5 border-b border-ink-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
          <span className="ml-3 font-mono text-[11px] text-ink-500">
            beacore — produto em construção
          </span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 sm:text-[13px]">
          <code>
            <span className="text-emerald-600">$</span> beacore build{" "}
            <span className="text-ink-500">--prod</span>
            {"\n"}
            <span className="text-emerald-600">✓</span>{" "}
            <span className="text-ink-500">contexto analisado</span>
            {"\n"}
            <span className="text-emerald-600">✓</span>{" "}
            <span className="text-ink-500">solução planejada</span>
            {"\n"}
            <span className="text-emerald-600">✓</span>{" "}
            <span className="text-ink-500">produto construído</span>
            {"\n\n"}
            <span className="text-brand-600">const</span>{" "}
            <span className="text-ink-900">beacore</span> = {"{"}
            {"\n"}  ideia: <span className="text-emerald-600">"a sua ideia"</span>,
            {"\n"}  design: <span className="text-emerald-600">"moderno e premium"</span>,
            {"\n"}  stack: <span className="text-emerald-600">"react + typescript"</span>,
            {"\n"}
            {"}"};
            {"\n\n"}
            <span className="text-brand-600">beacore</span>
            <span className="text-ink-900">.build()</span>{" "}
            <span className="text-brand-600">→</span>{" "}
            <span className="text-ink-900">experiência digital que funciona</span>
            {"\n"}
            <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-brand-600" />
          </code>
        </pre>
      </div>

      <div
        data-hero="satellite"
        className="absolute -right-3 -top-5 rounded-xl border border-ink-100 bg-white px-3 py-2 shadow-lg sm:-right-6"
      >
        <span className="flex items-center gap-2 font-mono text-[11px] text-ink-700">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
          Performance 100
        </span>
      </div>

      <div
        data-hero="satellite"
        className="absolute -bottom-5 left-6 rounded-xl border border-ink-100 bg-white px-3 py-2 shadow-lg"
      >
        <span className="flex items-center gap-2 font-mono text-[11px] text-ink-700">
          <span className="text-emerald-600">✓</span> Deploy pronto
        </span>
      </div>

      {/*
        Slot reservado do mascote (Fase 3, item 10). O personagem ainda não
        existe; posição e escala já definidas para inserção futura.
      */}
      <div className="mascot-slot-hero" data-mascot-slot="hero" />
    </div>
  );
}

export function Hero() {
  /**
   * Cena de entrada: fundo → badge → headline → texto → CTAs → terminal.
   * Curta de propósito (≈0,9s) para não atrasar o acesso ao conteúdo.
   * Só transform e opacity. Não roda com prefers-reduced-motion.
   */
  const ref = useGsapScene<HTMLElement>(
    ({ q, gsap }) => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });

      timeline
        .from(q("[data-hero='grid']"), { opacity: 0, duration: 0.9 }, 0)
        .from(q("[data-hero='badge']"), { opacity: 0, y: 12 }, 0.05)
        .from(
          q("[data-hero='headline-line']"),
          { opacity: 0, y: 26, stagger: 0.08, duration: 0.75 },
          0.12,
        )
        .from(q("[data-hero='lede']"), { opacity: 0, y: 16 }, 0.34)
        .from(q("[data-hero='cta']"), { opacity: 0, y: 14, stagger: 0.07 }, 0.44)
        .from(q("[data-hero='meta']"), { opacity: 0 }, 0.56)
        .from(q("[data-hero='glow']"), { opacity: 0, scale: 0.85, duration: 1 }, 0.1)
        .from(q("[data-hero='chip']"), { opacity: 0, scale: 0.8, rotate: 0 }, 0.3)
        .from(q("[data-hero='panel']"), { opacity: 0, y: 28, scale: 0.97, duration: 0.8 }, 0.2)
        .from(q("[data-hero='satellite']"), { opacity: 0, scale: 0.9, stagger: 0.12 }, 0.6);

      // Parallax discreto — desligado em telas compactas pelo hook.
      gsap.to(q("[data-hero='panel']"), {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    },
    { disableOnCompact: true, entry: true },
  );

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative overflow-hidden bg-white"
      aria-labelledby="hero-title"
    >
      <div
        data-hero="grid"
        aria-hidden="true"
        className="absolute inset-0 bg-grid-fine [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-48 left-1/2 h-[26rem] w-[48rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute right-[7%] top-32 hidden h-3 w-3 rotate-12 rounded-[2px] border border-brand-500/40 lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute left-[5%] top-48 hidden h-2 w-2 rounded-full bg-brand-500/30 lg:block"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-2xl max-lg:mx-auto max-lg:text-center">
            <span
              data-hero="badge"
              className="inline-flex items-center gap-2.5 rounded-full border border-brand-500/20 bg-brand-50 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700 sm:text-[11px] sm:tracking-[0.18em]"
            >
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-brand-500" />
              Beacore — Digital Engineering
            </span>

            <h1
              id="hero-title"
              className="mt-7 font-display text-[2.15rem] font-bold leading-[1.06] tracking-tight text-ink-950 text-balance sm:text-5xl lg:text-[3.6rem] xl:text-[4rem]"
            >
              <span data-hero="headline-line" className="block">
                Transformamos necessidades{" "}
              </span>
              <span data-hero="headline-line" className="block">
                em <span className="text-brand-gradient">soluções digitais.</span>
              </span>
            </h1>

            <p
              data-hero="lede"
              className="mt-6 max-w-xl text-base leading-relaxed text-ink-600 max-lg:mx-auto lg:text-lg"
            >
              Sites, landing pages, sistemas, automações e produtos digitais desenvolvidos sob
              medida — do entendimento do problema até a solução publicada e funcionando.
            </p>

            <div className="mt-9 flex flex-col gap-3 max-lg:items-center sm:flex-row sm:items-center max-lg:sm:justify-center">
              <span data-hero="cta">
                <Button href="#contato" size="lg" className="max-sm:w-full">
                  Falar sobre meu projeto
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </span>
              <span data-hero="cta">
                <Button href="#servicos" size="lg" variant="secondary" className="max-sm:w-full">
                  Ver o que fazemos
                </Button>
              </span>
            </div>

            <p
              data-hero="meta"
              className="mt-9 font-mono text-xs leading-relaxed tracking-wide text-ink-500"
            >
              React · TypeScript · Node.js · Tailwind · WordPress · Supabase
            </p>
          </div>

          {/*
            Oculto abaixo de 1024px: é exatamente onde o grid vira uma coluna só.
            Mantendo-o visível no tablet, o terminal empilharia em largura total e
            os dois cartões flutuantes ficariam deslocados.
          */}
          <div className="w-full max-lg:hidden">
            <CodeCard />
          </div>
        </div>
      </div>
    </section>
  );
}
