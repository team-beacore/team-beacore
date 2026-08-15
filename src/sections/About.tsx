import { siteConfig } from "../config/site";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";

const pillars = [
  {
    title: "Desenvolvimento",
    description: "Sites, aplicações e sistemas construídos para funcionar.",
  },
  {
    title: "Design",
    description: "Interfaces modernas pensadas para pessoas.",
  },
  {
    title: "Tecnologia",
    description: "Arquitetura e soluções adequadas para cada projeto.",
  },
] as const;

const stats = [
  { value: siteConfig.stats.projects, label: "Projetos desenvolvidos" },
  { value: siteConfig.stats.technologies, label: "Tecnologias utilizadas" },
  { value: siteConfig.stats.clients, label: "Clientes atendidos" },
] as const;

export function About() {
  return (
    <Section id="sobre">
      <div className="py-20 sm:py-24 lg:py-32">
        <SectionHeading eyebrow="Sobre nós" title="Somos a Beacore." align="left" />

        <Reveal>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-500 lg:text-lg">
            Uma equipe focada em transformar ideias em produtos digitais. Unimos desenvolvimento,
            design e tecnologia para criar experiências rápidas, modernas e funcionais.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 90}>
              <article className="h-full rounded-2xl border border-ink-100 bg-ink-50/50 p-6 transition-colors duration-300 hover:border-brand-200 sm:p-7">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink-950">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{pillar.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <dl className="mt-14 grid gap-8 border-t border-ink-100 pt-10 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 mt-1 text-sm text-ink-500">{stat.label}</dt>
                <dd className="order-1 font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
                  {stat.value}
                  <span className="text-brand-600">+</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}