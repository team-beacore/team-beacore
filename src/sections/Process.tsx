import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { ProcessStep } from "../components/ProcessStep";

const steps = [
  {
    number: "01",
    title: "Entendemos",
    description: "Entendemos o objetivo, o público e o problema.",
  },
  {
    number: "02",
    title: "Planejamos",
    description: "Definimos estrutura, experiência e tecnologia.",
  },
  {
    number: "03",
    title: "Construímos",
    description: "Desenvolvemos, testamos e refinamos.",
  },
  {
    number: "04",
    title: "Entregamos",
    description: "Publicamos o projeto e acompanhamos a entrega.",
  },
] as const;

export function Process() {
  return (
    <Section id="processo" tone="dark" className="overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div aria-hidden="true" className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-600/15 blur-3xl" />

      <div className="relative py-20 sm:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Processo"
          title="Da ideia ao produto."
          description="Um fluxo claro e colaborativo, do primeiro entendimento à entrega."
          tone="dark"
        />

        <div className="relative mt-14 lg:mt-20">
          <div aria-hidden="true" className="absolute bottom-4 left-6 top-4 w-px bg-white/10 lg:hidden" />
          <div aria-hidden="true" className="absolute left-6 right-6 top-6 hidden h-px bg-white/10 lg:block" />

          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <Reveal key={step.number} as="li" delay={index * 100}>
                <ProcessStep {...step} />
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}