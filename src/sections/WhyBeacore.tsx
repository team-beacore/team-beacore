import { SectionHeading } from "../components/SectionHeading";
import { Stagger, StaggerItem } from "../components/motion/Reveal";
import { useGsapScene } from "../components/motion/useGsapScene";
import { whyBeacore } from "../content/home";

/**
 * Seção escura de diferenciais. Apenas argumentos sustentados pela forma de
 * trabalho — nenhum depende de número, prêmio ou cliente.
 *
 * Cena GSAP: parallax discreto dos dois halos de fundo durante o scroll.
 * Os cards ficam com o Motion (entrada escalonada), sem sobreposição entre
 * as duas bibliotecas no mesmo elemento.
 */
export function WhyBeacore() {
  const ref = useGsapScene<HTMLElement>(({ q, gsap }) => {
    gsap.to(q("[data-why='halo-a']"), {
      yPercent: 22,
      ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
    });
    gsap.to(q("[data-why='halo-b']"), {
      yPercent: -18,
      ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
    });
  }, { disableOnCompact: true });

  return (
    <section
      ref={ref}
      id="por-que-beacore"
      className="relative overflow-hidden bg-surface-dark"
      aria-labelledby="why-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,black,transparent)]"
      />
      <div
        data-why="halo-a"
        aria-hidden="true"
        className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl"
      />
      <div
        data-why="halo-b"
        aria-hidden="true"
        className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-500/12 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Por que Beacore"
          title="O que muda ao trabalhar com a gente."
          description="Não temos prêmio para exibir nem número inflado para mostrar. Temos um jeito de trabalhar."
          tone="dark"
          id="why-title"
        />

        <Stagger as="ul" className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {whyBeacore.map((pillar, index) => (
            <StaggerItem as="li" key={pillar.title}>
              <article className="h-full bg-[#08080d] p-6 transition-colors duration-300 hover:bg-white/[0.03] sm:p-7">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-400">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-lg font-semibold text-white">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-400">{pillar.description}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
