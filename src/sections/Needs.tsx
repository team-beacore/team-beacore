import { Link } from "react-router-dom";
import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { Stagger, StaggerItem } from "../components/motion/Reveal";
import { MotionCard } from "../components/motion/MotionCard";
import { needs } from "../content/home";
import { getServiceBySlug, servicePath } from "../content/services";
import { ArrowRightIcon } from "../lib/icons";

/**
 * "O que você precisa resolver?" — primeira bifurcação comercial da Home.
 * O visitante se reconhece em uma frase e é levado à oferta correspondente.
 */
export function Needs() {
  return (
    <Section id="necessidades" className="bg-surface">
      <div className="py-20 sm:py-24 lg:py-28">
        <SectionHeading
          eyebrow="Ponto de partida"
          title="O que você precisa resolver?"
          description="Escolha o que mais parece com a sua situação. Cada caminho leva ao que fazemos por ele."
        />

        <Stagger as="ul" className="mt-12 grid gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {needs.map((need) => {
            const service = getServiceBySlug(need.serviceId);
            const href = service ? servicePath(service) : "/#contato";
            const isRoute = href.startsWith("/servicos");

            const body = (
              <>
                <span className="flex items-start justify-between gap-4">
                  <span className="font-display text-base font-semibold leading-snug text-ink-950 sm:text-[17px]">
                    {need.label}
                  </span>
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-ink-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-600"
                  />
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-ink-500">
                  {need.detail}
                </span>
                <span className="mt-5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-600">
                  {service?.title}
                </span>
              </>
            );

            const cardClass =
              "group flex h-full flex-col rounded-2xl card-surface p-6 transition-[border-color,box-shadow] duration-300 hover:card-accent";

            return (
              <StaggerItem as="li" key={need.id}>
                <MotionCard as="div" lift={3} className="h-full">
                  {isRoute ? (
                    <Link to={href} className={cardClass}>
                      {body}
                    </Link>
                  ) : (
                    <a href={href} className={cardClass}>
                      {body}
                    </a>
                  )}
                </MotionCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
