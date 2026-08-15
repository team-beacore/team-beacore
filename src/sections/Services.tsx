import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceCard } from "../components/ServiceCard";
import { services } from "../data/services";

export function Services() {
  return (
    <Section id="servicos" tone="neutral">
      <div className="py-20 sm:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Serviços"
          title="O que construímos."
          description="Do site institucional ao produto digital completo — soluções que combinam estratégia, design, engenharia e automação."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={(index % 4) * 90}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}