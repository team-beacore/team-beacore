import { Link } from "react-router-dom";
import { Section } from "../Section";
import { SectionHeading } from "../SectionHeading";
import { Button } from "../Button";
import { Faq } from "../Faq";
import { CaseCard } from "../CaseCard";
import { Reveal, Stagger, StaggerItem } from "../motion/Reveal";
import { MotionCard } from "../motion/MotionCard";
import { useGsapScene } from "../motion/useGsapScene";
import { serviceIcon } from "./serviceIcon";
import { Breadcrumbs } from "../Breadcrumbs";
import type { Service } from "../../content/services";
import { useProjects } from "../../hooks/useProjects";
import { useProjectFeedbacks } from "../../hooks/useProjectFeedbacks";
import { siteConfig } from "../../config/site";
import { whatsappUrl } from "../../lib/utils";
import { ArrowRightIcon, CheckIcon, WhatsAppIcon } from "../../lib/icons";

type WithPage = Service & { page: NonNullable<Service["page"]> };

function serviceWhatsapp(service: Service) {
  return whatsappUrl(
    siteConfig.contact.whatsapp,
    `Olá! Gostaria de conversar com a Beacore sobre ${service.whatsapp}.`,
  );
}

/* -------------------------------------------------------------- Hero ----- */

export function ServiceHero({ service }: { service: WithPage }) {
  const Icon = serviceIcon(service.icon);

  /**
   * Cena de entrada da página de serviço: mais curta que a da Home, porque
   * aqui o visitante já chegou decidido a ler. Uma sequência só, sem parallax.
   */
  const ref = useGsapScene<HTMLElement>(({ q, gsap }) => {
    gsap
      .timeline({ defaults: { ease: "power3.out", duration: 0.6 } })
      .from(q("[data-sh='crumb']"), { opacity: 0, y: 10 }, 0)
      .from(q("[data-sh='badge']"), { opacity: 0, y: 12 }, 0.06)
      .from(q("[data-sh='title']"), { opacity: 0, y: 24, duration: 0.7 }, 0.12)
      .from(q("[data-sh='lede']"), { opacity: 0, y: 16 }, 0.28)
      .from(q("[data-sh='cta']"), { opacity: 0, y: 14, stagger: 0.07 }, 0.38)
      .from(q("[data-sh='mark']"), { opacity: 0, scale: 0.9, duration: 0.8 }, 0.2);
  }, { entry: true });

  return (
    <section ref={ref} className="relative overflow-hidden bg-white" aria-labelledby="service-title">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-fine [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 right-[10%] h-80 w-80 rounded-full bg-brand-500/12 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-20 lg:pt-36">
        <div data-sh="crumb">
          <Breadcrumbs
            items={[
              { label: "Início", href: "/" },
              { label: "Serviços", href: "/servicos" },
              { label: service.title },
            ]}
          />
        </div>

        <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <span
              data-sh="badge"
              className="inline-flex items-center gap-2.5 rounded-full border border-brand-500/20 bg-brand-50 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700 sm:text-[11px]"
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {service.page.eyebrow}
            </span>

            <h1
              id="service-title"
              data-sh="title"
              className="mt-6 font-display text-[2rem] font-bold leading-[1.08] tracking-tight text-ink-950 text-balance sm:text-[2.75rem] lg:text-[3.25rem]"
            >
              {service.page.headline}
            </h1>

            <p
              data-sh="lede"
              className="mt-5 max-w-xl text-base leading-relaxed text-ink-600 lg:text-lg"
            >
              {service.page.subheadline}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <span data-sh="cta">
                <Button href="#contato-servico" size="lg" className="max-sm:w-full">
                  {service.page.ctaLabel}
                  <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
                </Button>
              </span>
              <span data-sh="cta">
                <Button
                  href={serviceWhatsapp(service)}
                  external
                  size="lg"
                  variant="secondary"
                  className="max-sm:w-full"
                >
                  <WhatsAppIcon aria-hidden="true" className="h-4 w-4" />
                  WhatsApp
                </Button>
              </span>
            </div>
          </div>

          {/* Marca gráfica da página: o ícone da oferta em escala, sobre o grid. */}
          <div data-sh="mark" aria-hidden="true" className="relative max-lg:hidden">
            <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
              <div className="absolute inset-[12%] rounded-[2rem] border border-ink-100" />
              <div className="absolute inset-[22%] rounded-[1.5rem] border border-ink-100" />
              <div className="absolute inset-[32%] rounded-[1rem] border border-brand-500/25" />
              <div className="absolute inset-[32%] rounded-[1rem] bg-brand-500/[0.04]" />
              <Icon className="relative h-20 w-20 text-brand-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Problema ---- */

export function ServiceProblem({ service }: { service: WithPage }) {
  const { problem } = service.page;

  return (
    <Section className="bg-surface">
      <div className="py-18 sm:py-22 lg:py-26">
        <div className="grid gap-10 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Contexto" title={problem.title} align="left" />
            <Reveal>
              <p className="mt-5 text-base leading-relaxed text-ink-600">{problem.description}</p>
            </Reveal>
          </div>

          <Stagger as="ul" className="space-y-3 self-center">
            {problem.points.map((point) => (
              <StaggerItem as="li" key={point}>
                <div className="flex items-start gap-3 rounded-xl card-surface p-4">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  />
                  <span className="text-sm leading-relaxed text-ink-700">{point}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------- Para quem ---- */

export function ServiceAudience({ service }: { service: WithPage }) {
  const { audience } = service.page;

  return (
    <Section>
      <div className="py-20 sm:py-24 lg:py-28">
        <SectionHeading
          eyebrow="Para quem é"
          title={audience.title}
          description={audience.description}
        />

        <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14">
          {audience.items.map((item) => (
            <StaggerItem as="li" key={item.title}>
              <MotionCard as="article" lift={3} className="h-full">
                <div className="h-full rounded-2xl card-surface p-6 transition-[border-color,box-shadow] duration-300 hover:card-accent sm:p-7">
                  <h3 className="font-display text-lg font-semibold text-ink-950">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{item.description}</p>
                </div>
              </MotionCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------- Entregáveis ---- */

export function ServiceDeliverables({ service }: { service: WithPage }) {
  const { deliverables } = service.page;

  return (
    <section className="relative overflow-hidden bg-surface-dark" aria-labelledby="deliverables-title">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Escopo"
              title={deliverables.title}
              description={deliverables.description}
              align="left"
              tone="dark"
              id="deliverables-title"
            />
          </div>

          <Stagger as="ul" className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {deliverables.items.map((item) => (
              <StaggerItem as="li" key={item}>
                <div className="flex h-full items-start gap-3 bg-[#08080d] p-5 transition-colors duration-300 hover:bg-white/[0.03]">
                  <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <span className="text-sm leading-relaxed text-ink-300">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Diferenciais ---- */

export function ServiceBenefits({ service }: { service: WithPage }) {
  const { benefits } = service.page;

  return (
    <Section>
      <div className="py-20 sm:py-24 lg:py-28">
        <SectionHeading eyebrow="Diferenciais" title={benefits.title} />

        <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14">
          {benefits.items.map((item, index) => (
            <StaggerItem as="li" key={item.title}>
              <MotionCard as="article" lift={3} className="h-full">
                <div className="h-full rounded-2xl card-surface p-6 transition-[border-color,box-shadow] duration-300 hover:card-accent sm:p-7">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{item.description}</p>
                </div>
              </MotionCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------ Como funciona ---- */

export function ServiceProcess({ service }: { service: WithPage }) {
  const steps = service.page.steps;

  const ref = useGsapScene<HTMLDivElement>(({ q, gsap }) => {
    gsap.set(q("[data-sp='line']"), { transformOrigin: "left center" });
    gsap.from(q("[data-sp='line']"), {
      scaleX: 0,
      ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 75%", scrub: 0.4 },
    });
    gsap.from(q("[data-sp='step']"), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: { trigger: ref.current, start: "top 72%", once: true },
    });
  }, { disableOnCompact: true });

  return (
    <Section className="bg-surface">
      <div ref={ref} className="py-20 sm:py-24 lg:py-28">
        <SectionHeading eyebrow="Como funciona" title="Do primeiro contato à entrega." />

        <div className="relative mt-14">
          <div
            data-sp="line"
            aria-hidden="true"
            className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-brand-500/50 via-brand-500/30 to-transparent lg:block"
          />
          <ol className="grid gap-4 lg:grid-cols-5">
            {steps.map((step, index) => (
              <li key={step.title} data-sp="step" className="relative">
                <span
                  aria-hidden="true"
                  className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-brand-500/25 bg-white font-mono text-xs font-bold text-brand-700"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold leading-snug text-ink-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 lg:text-[13px]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

/* --------------------------------------------- Projetos relacionados ----- */

export function ServiceProjects({ service }: { service: WithPage }) {
  const { projects, loading } = useProjects();
  const feedbacksByProject = useProjectFeedbacks(projects, !loading);

  const related = projects.filter((project) =>
    service.page.relatedCategories.includes(project.category),
  );

  // Sem projeto relacionado a seção não aparece — nada de estado vazio,
  // que comunicaria "não temos case" de forma mais ruidosa que a ausência.
  if (related.length === 0) return null;

  return (
    <Section>
      <div className="py-20 sm:py-24 lg:py-28">
        <SectionHeading
          eyebrow="Cases"
          title="Projetos relacionados."
          description="Trabalhos já publicados nesta frente."
        />

        <Stagger as="ul" className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-2">
          {related.map((project) => (
            <StaggerItem as="li" key={project.id}>
              <CaseCard project={project} feedbacks={feedbacksByProject[project.id]} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- FAQ ---- */

export function ServiceFaq({ service }: { service: WithPage }) {
  return (
    <Section className="bg-surface">
      <div className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="Dúvidas" title="Perguntas frequentes." align="left" />
          <Reveal>
            <Faq items={service.page.faq} />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- CTA ---- */

export function ServiceCTA({ service }: { service: WithPage }) {
  return (
    <section
      id="contato-servico"
      className="relative overflow-hidden bg-surface-dark"
      aria-labelledby="service-cta-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_55%_70%_at_50%_100%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-64 w-[34rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-brand-600/25 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="service-cta-title"
              className="font-display text-3xl font-bold leading-tight tracking-tight text-white text-balance sm:text-4xl lg:text-[2.75rem]"
            >
              {service.page.ctaLabel}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-300">
              Conte o que você precisa. A primeira conversa serve para entender o problema e
              definir o escopo — sem compromisso.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
              <Button href="/#contato" size="lg" variant="light" className="max-sm:w-full">
                Preencher o formulário
                <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button
                href={serviceWhatsapp(service)}
                external
                size="lg"
                variant="outline-light"
                className="max-sm:w-full"
              >
                <WhatsAppIcon aria-hidden="true" className="h-4 w-4" />
                WhatsApp
              </Button>
            </div>

            <p className="mt-8 text-sm text-ink-400">
              Precisa de outra coisa?{" "}
              <Link
                to="/servicos"
                className="font-semibold text-brand-300 underline underline-offset-4 transition-colors hover:text-brand-200"
              >
                Ver todos os serviços
              </Link>
            </p>

            {/* Slot do mascote (item 10). */}
            <div className="mascot-slot" data-mascot-slot="service-cta" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
