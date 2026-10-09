import { SectionIntro } from "../components/experience/SectionIntro";
import { useGsapScene } from "../components/motion/useGsapScene";
import { whyBeacore } from "../content/home";

/**
 * Diferenciais. Apenas argumentos sustentados pela forma de trabalho — nenhum
 * depende de número, prêmio ou cliente.
 *
 * Cena GSAP: a coluna da esquerda fica fixa (desktop) e cada argumento acende
 * quando cruza o centro da tela, atualizando o contador "0X / 06". Lido assim,
 * um por vez, vira um argumento em sequência — não uma grade para escanear.
 * Sem a cena (sem JS, movimento reduzido), todos ficam acesos e legíveis.
 */
export function WhyBeacore() {
  const total = String(whyBeacore.length).padStart(2, "0");

  const ref = useGsapScene<HTMLElement>(({ q, gsap }) => {
    const rows = q("[data-why='row']");
    const counter = q("[data-why='counter']")[0];
    const bar = q("[data-why='bar']")[0];

    gsap.set(rows, { opacity: 0.22 });

    rows.forEach((row, index) => {
      const line = row.querySelector("[data-why='line']");
      gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

      gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            gsap.to(row, { opacity: self.isActive ? 1 : 0.22, duration: 0.45, ease: "power2.out" });
            gsap.to(line, { scaleX: self.isActive ? 1 : 0, duration: 0.6, ease: "power3.out" });
            if (self.isActive && counter) {
              counter.textContent = String(index + 1).padStart(2, "0");
              gsap.to(bar, { scaleX: (index + 1) / rows.length, duration: 0.5, ease: "power3.out" });
            }
          },
        },
      });
    });

    gsap.set(bar, { scaleX: 1 / rows.length, transformOrigin: "left center" });
  });

  return (
    <section
      ref={ref}
      id="por-que-beacore"
      aria-labelledby="why-title"
      className="relative scroll-mt-24 bg-night-950"
    >
      <div aria-hidden="true" className="hairline absolute inset-x-0 top-0 h-px" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-brand-700/[0.12] blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-5 py-24 sm:px-6 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8 lg:py-36">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionIntro
            index="05"
            eyebrow="Por que Beacore"
            id="why-title"
            title="O que muda ao trabalhar com a gente."
            description="Não temos prêmio para exibir nem número inflado para mostrar. Temos um jeito de trabalhar."
          />

          <div aria-hidden="true" className="mt-12 hidden lg:block">
            <p className="font-display text-[5.5rem] font-semibold leading-none tracking-[-0.06em] text-white">
              <span data-why="counter">01</span>
              <span className="text-3xl tracking-normal text-ink-600"> / {total}</span>
            </p>
            <div className="mt-6 h-px w-64 bg-white/10">
              <div data-why="bar" className="h-full bg-brand-400" />
            </div>
          </div>
        </div>

        <ol className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {whyBeacore.map((pillar, index) => (
            <li key={pillar.title} data-why="row" className="relative py-9 sm:py-11">
              <span
                data-why="line"
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-full bg-gradient-to-r from-brand-400 via-brand-400/40 to-transparent"
              />
              <article className="grid gap-3 sm:grid-cols-[4.5rem_1fr] sm:gap-6">
                <p className="font-mono text-sm text-brand-400">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.025em] text-white sm:text-[1.85rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-400">
                    {pillar.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
