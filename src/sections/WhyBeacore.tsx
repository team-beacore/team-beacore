import { SectionIntro } from "../components/experience/SectionIntro";
import { whyBeacore } from "../content/home";

/**
 * Diferenciais. Apenas argumentos sustentados pela forma de trabalho — nenhum
 * depende de número, prêmio ou cliente.
 *
 * Composição tipográfica, não grade de cards: cada argumento é uma linha com
 * a afirmação à esquerda e a justificativa à direita, separadas por filetes.
 * Os seis não são uma sequência, por isso não levam numeração; e ficam todos
 * legíveis o tempo todo — nada depende do scroll para aparecer.
 */
export function WhyBeacore() {
  return (
    <section
      id="por-que-beacore"
      aria-labelledby="why-title"
      className="relative scroll-mt-24 bg-night-950"
    >
      <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
          <SectionIntro id="why-title" title="O que muda ao trabalhar com a gente." />
          <p className="max-w-md text-base leading-relaxed text-ink-300 sm:text-lg lg:pb-2">
            Não temos prêmio para exibir nem número inflado para mostrar. Temos um jeito de
            trabalhar — e é ele que você contrata.
          </p>
        </div>

        <dl className="mt-14 border-t border-white/10 lg:mt-20">
          {whyBeacore.map((pillar) => (
            <div
              key={pillar.title}
              className="grid gap-3 border-b border-white/10 py-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20"
            >
              <dt className="font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[2rem]">
                {pillar.title}
              </dt>
              <dd className="max-w-md text-base leading-relaxed text-ink-300 lg:pt-1.5">
                {pillar.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
