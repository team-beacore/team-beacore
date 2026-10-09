import { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "../components/Button";
import { Faq } from "../components/Faq";
import { SectionHeading } from "../components/SectionHeading";
import { Reveal } from "../components/motion/Reveal";
import { TrafficLeadForm } from "../components/traffic/TrafficLeadForm";
import { siteConfig } from "../config/site";
import type { Service } from "../content/services";
import {
  trafficAudience,
  trafficChannels,
  trafficDeliverables,
  trafficFaq,
  trafficMethod,
  trafficRequirements,
  type TrafficChannel,
} from "../content/trafficPage";
import { trackEvent } from "../lib/analytics";
import { ArrowRightIcon, CheckIcon, LayersIcon, MegaphoneIcon, SearchIcon, WhatsAppIcon } from "../lib/icons";
import { cn, whatsappUrl } from "../lib/utils";

const FORM_ID = "avaliacao";

/**
 * /servicos/gestao-de-trafego-pago — página com layout próprio.
 *
 * Usa as peças do site (Breadcrumbs, SectionHeading, Button, Faq, Reveal e as
 * superfícies card-surface / bg-surface-dark) no ritmo claro/escuro das outras
 * páginas de serviço. SiteLayout, Seo e dados estruturados vêm do ServicePage.
 *
 * O canal escolhido nos cards preenche o formulário (estado compartilhado).
 */
export function TrafficPage({ service }: { service: Service }) {
  const [channel, setChannel] = useState<TrafficChannel | null>(null);

  const selectChannel = (next: TrafficChannel) => {
    setChannel(next);
    trackEvent("traffic_channel_select", { channel: next });
  };

  return (
    <>
      <TrafficHero service={service} />
      <ChannelChoice selected={channel} onSelect={selectChannel} />
      <Deliverables />
      <Method />
      <Audience />
      <Requirements />
      <TrafficFaq />
      <Conversion channel={channel} onChannelChange={selectChannel} />
    </>
  );
}

/* -------------------------------------------------------------- Hero ----- */

function TrafficHero({ service }: { service: Service }) {
  return (
    <section className="relative overflow-hidden bg-white" aria-labelledby="traffic-title">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-fine [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36">
        <Breadcrumbs
          items={[
            { label: "Início", href: "/" },
            { label: "Serviços", href: "/servicos" },
            { label: service.title },
          ]}
        />

        <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-brand-700">{service.title}</p>
            <h1
              id="traffic-title"
              className="mt-4 font-display text-[2.1rem] font-bold leading-[1.06] tracking-tight text-ink-950 text-balance sm:text-[2.9rem] lg:text-[3.15rem]"
            >
              Transforme investimento em anúncios em oportunidades reais de negócio.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-600 lg:text-lg">
              Planejamos, gerenciamos e otimizamos campanhas de tráfego pago para ajudar sua empresa a
              alcançar o público certo, gerar oportunidades e tomar decisões com base em dados.
            </p>

            <ul aria-label="Canais" className="mt-7 flex flex-wrap gap-2.5">
              <li className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-700">
                <MegaphoneIcon aria-hidden="true" className="h-4 w-4 text-brand-600" />
                <span>
                  <strong className="font-semibold text-ink-950">Meta Ads</strong> — Facebook e Instagram
                </span>
              </li>
              <li className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-700">
                <SearchIcon aria-hidden="true" className="h-4 w-4 text-brand-600" />
                <span>
                  <strong className="font-semibold text-ink-950">Google Ads</strong> — Pesquisa e outros formatos
                </span>
              </li>
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={`#${FORM_ID}`} size="lg" className="max-sm:w-full">
                Solicitar uma avaliação estratégica
                <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button href="#o-que-fazemos" size="lg" variant="secondary" className="max-sm:w-full">
                Conhecer nossos serviços
              </Button>
            </div>
          </div>

          <CampaignPlan />
        </div>
      </div>
    </section>
  );
}

/**
 * Visual da primeira dobra: o plano que organiza uma campanha, do objetivo à
 * conversão medida. Esquemático — sem números, métricas ou resultados.
 */
function CampaignPlan() {
  const steps = [
    { label: "Objetivo", value: "O que o negócio precisa gerar" },
    { label: "Público", value: "Quem precisa ser alcançado — e onde" },
    { label: "Canal", value: "Meta Ads, Google Ads ou os dois", accent: true },
    { label: "Página de destino", value: "Para onde o clique leva" },
    { label: "Conversão", value: "O que é medido e acompanhado" },
  ];
  return (
    <figure aria-hidden="true" className="relative mx-auto w-full max-w-md">
      <div className="rounded-2xl card-surface p-6 sm:p-7">
        <figcaption className="flex items-center justify-between border-b border-ink-100 pb-4">
          <span className="font-display text-base font-semibold text-ink-950">Plano de campanha</span>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">Estratégia primeiro</span>
        </figcaption>
        <ol className="relative mt-5 space-y-4">
          <span className="absolute bottom-3 left-[0.6875rem] top-3 w-px bg-ink-100" />
          {steps.map((step) => (
            <li key={step.label} className="relative flex items-start gap-4">
              <span
                className={cn(
                  "relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-white",
                  step.accent ? "border-brand-500" : "border-ink-200",
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", step.accent ? "bg-brand-600" : "bg-ink-300")} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink-950">{step.label}</span>
                <span className="block text-sm text-ink-500">{step.value}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

/* ------------------------------------------------- Escolha seu canal ----- */

const channelIcon = { "meta-ads": MegaphoneIcon, "google-ads": SearchIcon, "meta-google": LayersIcon } as const;

function ChannelChoice({ selected, onSelect }: { selected: TrafficChannel | null; onSelect: (c: TrafficChannel) => void }) {
  return (
    <section id="canais" aria-labelledby="channels-title" className="scroll-mt-24 bg-surface">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <SectionHeading
          id="channels-title"
          align="left"
          title="Escolha por onde começar."
          description="Um canal, outro ou os dois em conjunto. A recomendação final vem depois de entender o seu negócio — e é possível começar por um e expandir depois."
        />

        <ul className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-3">
          {trafficChannels.map((option) => {
            const Icon = channelIcon[option.id];
            const isSelected = selected === option.id;
            return (
              <li key={option.id}>
                <article
                  aria-labelledby={`channel-${option.id}`}
                  className={cn(
                    "flex h-full flex-col rounded-2xl p-6 transition-[border-color,box-shadow] duration-300 sm:p-7",
                    option.id === "meta-google" ? "bg-ink-950 text-white" : "card-surface",
                    isSelected && "ring-2 ring-brand-500 ring-offset-2 ring-offset-[#fbfcfe]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon aria-hidden="true" className={cn("h-5 w-5", option.id === "meta-google" ? "text-brand-300" : "text-brand-600")} />
                    <p className={cn("text-sm font-semibold", option.id === "meta-google" ? "text-white" : "text-ink-950")}>
                      {option.name}
                      <span className={cn("font-normal", option.id === "meta-google" ? "text-ink-300" : "text-ink-500")}>
                        {" "}
                        · {option.platforms}
                      </span>
                    </p>
                  </div>
                  <h3
                    id={`channel-${option.id}`}
                    className={cn(
                      "mt-5 font-display text-xl font-semibold leading-snug tracking-[-0.01em] sm:text-2xl",
                      option.id === "meta-google" ? "text-white" : "text-ink-950",
                    )}
                  >
                    {option.title}
                  </h3>
                  <p className={cn("mt-3 text-sm leading-relaxed", option.id === "meta-google" ? "text-ink-300" : "text-ink-600")}>
                    {option.description}
                  </p>
                  <ul className={cn("mt-5 flex-1 space-y-2 border-t pt-5 text-sm", option.id === "meta-google" ? "border-white/10 text-ink-200" : "border-ink-100 text-ink-700")}>
                    {option.objectives.map((objective) => (
                      <li key={objective} className="flex items-start gap-2.5">
                        <CheckIcon aria-hidden="true" className={cn("mt-0.5 h-4 w-4 shrink-0", option.id === "meta-google" ? "text-brand-300" : "text-brand-600")} />
                        {objective}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    <Button
                      href={`#${FORM_ID}`}
                      onClick={() => onSelect(option.id)}
                      variant={option.id === "meta-google" ? "light" : "primary"}
                      className="w-full"
                    >
                      {option.cta}
                      <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------ O que a Beacore faz ---- */

function Deliverables() {
  return (
    <section id="o-que-fazemos" aria-labelledby="deliverables-title" className="relative scroll-mt-24 overflow-hidden bg-surface-dark">
      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading
            id="deliverables-title"
            align="left"
            tone="dark"
            title="O que a Beacore faz na gestão do seu tráfego."
          />
          <p className="max-w-md text-base leading-relaxed text-ink-300 lg:pb-1">
            Estas são as frentes do trabalho. O que entra em cada contratação é definido na proposta,
            de acordo com o objetivo, os canais e a estrutura do cliente.
          </p>
        </div>

        <ul className="mt-12 grid gap-x-12 gap-y-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {trafficDeliverables.map((group) => (
            <li key={group.title}>
              <h3 className="font-display text-lg font-semibold text-white">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-300">
                    <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Método ----- */

function Method() {
  return (
    <section aria-labelledby="method-title" className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <SectionHeading id="method-title" align="left" title="Nosso método." description="Um processo organizado em quatro etapas — da compreensão do negócio à otimização contínua." />
        <ol className="relative mt-12 grid gap-8 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          <span aria-hidden="true" className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-brand-500/50 via-brand-500/25 to-transparent lg:block" />
          {trafficMethod.map((step, index) => (
            <li key={step.title} className="relative">
              <span
                aria-hidden="true"
                className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-brand-500/25 bg-white font-mono text-xs font-bold text-brand-700"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Para quem ----- */

function Audience() {
  return (
    <section aria-labelledby="audience-title" className="bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <SectionHeading id="audience-title" align="left" title="Para quem é o serviço." />
          <p className="mt-6 rounded-xl border-l-2 border-brand-500/50 bg-white py-4 pl-5 pr-4 text-sm leading-relaxed text-ink-600 shadow-sm">
            A estratégia e o investimento adequados dependem do modelo de negócio, da concorrência, da
            oferta e da capacidade de atender os contatos gerados. Anúncios aumentam a visibilidade — eles
            não resolvem sozinhos questões de preço, produto, atendimento ou processo comercial.
          </p>
        </div>
        <dl className="grid gap-x-10 border-t border-ink-100 sm:grid-cols-2">
          {trafficAudience.map((item) => (
            <div key={item.title} className="border-b border-ink-100 py-5">
              <dt className="font-display text-base font-semibold text-ink-950">{item.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-600">{item.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------ O que precisamos para começar --- */

function Requirements() {
  return (
    <section aria-labelledby="requirements-title" className="bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <SectionHeading
            id="requirements-title"
            align="left"
            title="O que avaliamos para começar."
            description="Antes de recomendar canais e orçamento, olhamos para estes pontos. Não precisa ter tudo pronto — parte do diagnóstico é justamente identificar o que falta."
          />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {trafficRequirements.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-xl border border-ink-100 px-4 py-3 text-sm text-ink-800">
                <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside aria-labelledby="media-budget-title" className="self-start rounded-2xl bg-ink-950 p-7 text-white sm:p-8 lg:mt-16">
          <h3 id="media-budget-title" className="font-display text-xl font-semibold">
            Verba de mídia e gestão são valores separados.
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-ink-300">
            O orçamento dos anúncios é pago diretamente às plataformas — Meta e Google. O valor da gestão
            da Beacore é outro, definido na proposta de acordo com o escopo.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-300">
            Assim você sabe exatamente quanto vai para a mídia e quanto vai para o trabalho de planejar,
            executar e otimizar.
          </p>
        </aside>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- FAQ ----- */

function TrafficFaq() {
  return (
    <section aria-labelledby="traffic-faq-title" className="bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8 lg:py-28">
        <SectionHeading
          id="traffic-faq-title"
          align="left"
          title="Perguntas frequentes."
          description="Respostas diretas sobre canais, investimento e acompanhamento."
        />
        <Reveal>
          <Faq items={trafficFaq} className="border-y border-ink-100" />
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Conversão ----- */

function Conversion({
  channel,
  onChannelChange,
}: {
  channel: TrafficChannel | null;
  onChannelChange: (c: TrafficChannel) => void;
}) {
  const whatsapp = whatsappUrl(
    siteConfig.contact.whatsapp,
    "Olá! Gostaria de conversar com a Beacore sobre gestão de tráfego pago.",
  );
  return (
    <section id={FORM_ID} aria-labelledby="conversion-title" className="relative scroll-mt-20 overflow-hidden bg-surface-dark">
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <h2
            id="conversion-title"
            className="font-display text-3xl font-bold leading-tight tracking-tight text-white text-balance sm:text-4xl lg:text-[2.6rem]"
          >
            Vamos descobrir a melhor estratégia de anúncios para o seu negócio?
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-300">
            Conte um pouco sobre sua empresa e seus objetivos. Vamos avaliar o cenário e entender quais
            caminhos fazem sentido para você.
          </p>

          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/[0.05]"
          >
            <WhatsAppIcon aria-hidden="true" className="h-4 w-4 text-[#25d366]" />
            Prefere conversar pelo WhatsApp?
          </a>

          <nav aria-label="Serviços relacionados" className="mt-12 border-t border-white/10 pt-6">
            <p className="text-sm text-ink-400">Para onde o clique leva também importa:</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/servicos/landing-pages" className="font-semibold text-white underline decoration-white/25 underline-offset-4 hover:decoration-brand-400">
                  Landing pages para campanhas
                </Link>
              </li>
              <li>
                <Link to="/servicos/criacao-de-sites" className="font-semibold text-white underline decoration-white/25 underline-offset-4 hover:decoration-brand-400">
                  Criação de sites
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-ink-300 underline decoration-white/20 underline-offset-4 hover:text-white">
                  Ver todos os serviços
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <TrafficLeadForm channel={channel} onChannelChange={onChannelChange} />
      </div>
    </section>
  );
}
