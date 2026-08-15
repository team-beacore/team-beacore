import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { Button } from "../components/Button";
import { ArrowRightIcon } from "../lib/icons";

export function CTA() {
  return (
    <Section tone="dark" className="overflow-hidden border-t border-white/5">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_55%_70%_at_50%_100%,black,transparent)]"
      />
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-72 w-[36rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-brand-600/25 blur-3xl" />

      <div className="relative py-24 sm:py-28 lg:py-36">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-brand-400" />
              Beacore
            </span>

            <h2 className="mt-7 font-display text-4xl font-bold tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
              Tem uma ideia?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-300 lg:text-xl">
              Vamos transformar ela em algo real.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
              <Button href="#contato" size="lg">
                Falar com a Beacore
              </Button>
              <Button href="#projetos" size="lg" variant="outline-light">
                Ver portfólio
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}