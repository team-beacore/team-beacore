import { Reveal } from "../components/Reveal";
import { Button } from "../components/Button";

function CodeCard() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-8 rounded-[2.5rem] bg-brand-500/10 blur-3xl" />
      <div className="absolute -left-6 -top-6 h-24 w-24 rotate-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 opacity-15" />

      <div className="relative animate-float rounded-2xl border border-ink-100 bg-white/85 shadow-xl shadow-ink-950/5 backdrop-blur">
        <div className="flex items-center gap-1.5 border-b border-ink-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
          <span className="ml-3 font-mono text-[11px] text-ink-400">beacore — produto em construção</span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 sm:text-[13px]">
          <code>
            <span className="text-emerald-600">$</span> beacore build <span className="text-ink-400">--prod</span>
            {"\n"}
            <span className="text-emerald-600">✓</span> <span className="text-ink-400">contexto analisado</span>
            {"\n"}
            <span className="text-emerald-600">✓</span> <span className="text-ink-400">solução planejada</span>
            {"\n"}
            <span className="text-emerald-600">✓</span> <span className="text-ink-400">produto construído</span>
            {"\n\n"}
            <span className="text-brand-600">const</span> <span className="text-ink-900">beacore</span> = {"{"}
            {"\n"}  ideia: <span className="text-emerald-600">"a sua ideia"</span>,
            {"\n"}  design: <span className="text-emerald-600">"moderno e premium"</span>,
            {"\n"}  stack: <span className="text-emerald-600">"react + typescript"</span>,
            {"\n"}
            {"}"};
            {"\n\n"}
            <span className="text-brand-600">beacore</span>
            <span className="text-ink-900">.build()</span> <span className="text-brand-600">→</span>{" "}
            <span className="text-ink-900">experiência digital que funciona</span>
            {"\n"}
            <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-brand-600" />
          </code>
        </pre>
      </div>

      <div className="absolute -right-3 -top-5 rounded-xl border border-ink-100 bg-white px-3 py-2 shadow-lg sm:-right-6">
        <span className="flex items-center gap-2 font-mono text-[11px] text-ink-700">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
          Performance 100
        </span>
      </div>

      <div className="absolute -bottom-5 left-6 rounded-xl border border-ink-100 bg-white px-3 py-2 shadow-lg">
        <span className="flex items-center gap-2 font-mono text-[11px] text-ink-700">
          <span className="text-emerald-600">✓</span> Deploy pronto
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-light [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-96 w-[44rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl"
      />
      <div aria-hidden="true" className="absolute right-[7%] top-32 hidden h-3 w-3 rotate-12 rounded-[2px] border border-brand-500/40 lg:block" />
      <div aria-hidden="true" className="absolute left-[5%] top-48 hidden h-2 w-2 rounded-full bg-brand-500/30 lg:block" />
      <div aria-hidden="true" className="absolute bottom-28 right-[11%] hidden h-2 w-2 rounded-full bg-ink-900/15 lg:block" />

      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <Reveal>
            <div className="max-w-xl lg:max-w-none">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-brand-500/20 bg-brand-50 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700 sm:text-[11px] sm:tracking-[0.2em]">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-brand-500" />
                Beacore — Digital Engineering
              </span>

              <h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-ink-950 text-balance sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem]">
                Construímos experiências digitais que{" "}
                <span className="bg-gradient-to-r from-brand-700 to-brand-400 bg-clip-text text-transparent">
                  funcionam.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 lg:text-lg">
                Desenvolvimento web, produtos digitais e soluções sob medida para transformar
                ideias em experiências reais.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="#projetos" size="lg">
                  Conheça nossos projetos
                </Button>
                <Button href="#contato" size="lg" variant="secondary">
                  Fale com a Beacore
                </Button>
              </div>

              <p className="mt-9 font-mono text-xs tracking-wide text-ink-400">
                React · TypeScript · Vite · Tailwind CSS · Spring Boot · AI
              </p>
            </div>
          </Reveal>

          <Reveal delay={150} className="mx-auto w-full max-w-md lg:max-w-none">
            <CodeCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}