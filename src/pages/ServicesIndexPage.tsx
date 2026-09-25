import { Link } from "react-router-dom";
import { SiteLayout } from "../layouts/SiteLayout";
import { Seo } from "../components/seo/Seo";
import { Section } from "../components/Section";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "../components/Button";
import { Stagger, StaggerItem } from "../components/motion/Reveal";
import { MotionCard } from "../components/motion/MotionCard";
import { serviceIcon } from "../components/service/serviceIcon";
import { services, servicePath } from "../content/services";
import { ArrowRightIcon } from "../lib/icons";

export function ServicesIndexPage() {
  return (
    <SiteLayout>
      <Seo
        path="/servicos"
        title="Serviços | Beacore"
        description="Sites, landing pages, sistemas web, automações, e-commerce e produtos digitais desenvolvidos sob medida pela Beacore."
      />

      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-grid-fine [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-40 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
          <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Serviços" }]} />

          <h1 className="mt-8 max-w-3xl font-display text-[2rem] font-bold leading-[1.08] tracking-tight text-ink-950 text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
            Seis frentes para transformar necessidades em{" "}
            <span className="text-brand-gradient">soluções digitais.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600 lg:text-lg">
            Cada frente resolve um tipo específico de problema. Se não souber qual é o seu caso,
            comece pela conversa — ajudamos a identificar.
          </p>
        </div>
      </section>

      <Section className="bg-surface">
        <div className="py-16 sm:py-20 lg:py-24">
          <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

                      <h2 className="font-display text-lg font-semibold text-ink-950">
                        {service.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">{service.summary}</p>
                      <p className="mt-4 flex-1 rounded-lg border-l-2 border-brand-500/40 bg-ink-50/60 py-2 pl-3 text-[13px] leading-relaxed text-ink-500">
                        {service.problem}
                      </p>

                      <div className="mt-6 border-t border-ink-100 pt-4">
                        {hasPage ? (
                          <Link
                            to={href}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors hover:text-brand-700"
                          >
                            Ver detalhes
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

          <div className="mt-14 rounded-2xl card-surface p-8 text-center sm:p-10">
            <h2 className="font-display text-xl font-bold text-ink-950 sm:text-2xl">
              Não sabe em qual dessas o seu caso se encaixa?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-600">
              Descreva o problema. A primeira conversa serve exatamente para isso.
            </p>
            <div className="mt-7">
              <Button href="/#contato" size="lg">
                Falar sobre meu projeto
                <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
