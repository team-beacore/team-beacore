import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { useGsapScene } from "../components/motion/useGsapScene";
import { processSteps } from "../content/home";

/**
 * Processo em 5 etapas concretas, do ponto de vista do cliente.
 *
 * Cena GSAP: a linha que conecta as etapas se desenha conforme o scroll
 * (scaleY/scaleX), e cada etapa entra em sequência amarrada ao mesmo gatilho.
 * É uma animação coordenada de múltiplos elementos — o caso em que GSAP
 * rende mais que o Motion.
 */
export function Process() {
  const ref = useGsapScene<HTMLDivElement>(({ q, gsap }) => {
    const line = q("[data-process='line']");
    const steps = q("[data-process='step']");

    gsap.set(line, { transformOrigin: "top center" });
    gsap.from(line, {
      scaleY: 0,
      ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 70%", scrub: 0.4 },
    });

    gsap.from(steps, {
      opacity: 0,
      y: 22,
      duration: 0.55,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: ref.current, start: "top 72%", once: true },
    });
  });

  return (
    <Section id="processo" className="bg-surface">
      <div ref={ref} className="py-20 sm:py-24 lg:py-28">
        <SectionHeading
          eyebrow="Processo"
          title="Como um projeto acontece."
          description="Cinco etapas, do primeiro contato até a solução no ar."
        />

        <div className="relative mt-14 lg:mt-16">
          <div
            data-process="line"
            aria-hidden="true"
            className="absolute bottom-6 left-[19px] top-2 w-px bg-gradient-to-b from-brand-500/60 via-brand-500/30 to-transparent lg:hidden"
          />

          <ol className="space-y-5 lg:grid lg:grid-cols-5 lg:gap-4 lg:space-y-0">
            {processSteps.map((step) => (
              <li key={step.number} data-process="step" className="relative lg:flex">
                <div className="flex gap-5 rounded-2xl card-surface p-5 transition-[border-color,box-shadow] duration-300 hover:card-accent lg:h-full lg:flex-col lg:gap-0 lg:p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-500/25 bg-brand-50 font-mono text-xs font-bold text-brand-700"
                  >
                    {step.number}
                  </span>
                  <div className="lg:mt-5">
                    <h3 className="font-display text-base font-semibold leading-snug text-ink-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600 lg:text-[13px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
