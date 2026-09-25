import { Link } from "react-router-dom";
import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { Stagger, StaggerItem } from "../components/motion/Reveal";
import { MotionCard } from "../components/motion/MotionCard";
import { services, servicePath } from "../content/services";
import { serviceIcon } from "../components/service/serviceIcon";
import { ArrowRightIcon } from "../lib/icons";

/**
 * Seis ofertas. As três com página própria linkam para ela; as demais
 * levam ao contato — nenhuma promete uma página que ainda não existe.
 */
export function Services() {
  return (
    <Section id="servicos">
      <div className="py-20 sm:py-24 lg:py-28">
        <SectionHeading
          eyebrow="Serviços"
          title="O que a Beacore faz."
          description="Seis frentes de trabalho. Cada uma resolve um tipo específico de problema."
        />

        <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = serviceIcon(service.icon);
            const href = servicePath(service);
            const hasPage = Boolean(service.page);

            return (
              <StaggerItem as="li" key={service.id}>
                <MotionCard as="article" className="h-full">
                  <div className="group flex h-full flex-col rounded-2xl card-surface p-6 transition-[border-color,box-shadow] duration-300 hover:card-accent sm:p-7">
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-100 bg-ink-50 text-ink-600 transition-colors duration-300 group-hover:border-brand-500/30 group-hover:bg-brand-50 group-hover:text-brand-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="font-display text-lg font-semibold text-ink-950">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{service.summary}</p>

                    <p className="mt-4 rounded-lg border-l-2 border-brand-500/40 bg-ink-50/60 py-2 pl-3 text-[13px] leading-relaxed text-ink-500">
                      {service.problem}
                    </p>

                    <p className="mt-4 flex-1 text-[13px] leading-relaxed text-ink-500">
                      <span className="font-semibold text-ink-700">Entrega: </span>
                      {service.highlight}
                    </p>

                    <div className="mt-6 border-t border-ink-100 pt-4">
                      {hasPage ? (
                        <Link
                          to={href}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors hover:text-brand-700"
                        >
                          {service.cta}
                          <ArrowRightIcon
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      ) : (
                        <a
                          href="/#contato"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors hover:text-brand-700"
                        >
                          {service.cta}
                          <ArrowRightIcon
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                </MotionCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
