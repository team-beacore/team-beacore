import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { TechnologyBadge } from "../components/TechnologyBadge";
import { technologies } from "../data/technologies";

export function Technologies() {
  return (
    <Section>
      <div className="py-16 lg:py-20">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
              Tecnologias que utilizamos.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Ferramentas modernas e consolidadas para construir produtos rápidos e confiáveis.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              {technologies.map((tech) => (
                <TechnologyBadge key={tech} name={tech} className="px-3 py-1.5 text-xs" />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}