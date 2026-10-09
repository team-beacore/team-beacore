import { Core } from "../components/core/Core";
import { SectionIntro } from "../components/experience/SectionIntro";
import { Faq } from "../components/Faq";
import { Reveal } from "../components/motion/Reveal";
import { siteConfig } from "../config/site";
import { homeFaq } from "../content/home";
import { WhatsAppIcon } from "../lib/icons";
import { whatsappUrl } from "../lib/utils";

/**
 * FAQ — as objeções antes do contato. Todas as perguntas e respostas ficam
 * acessíveis (acordeão com botões reais); o Core aparece cercado de
 * interrogações, como quem também está tirando dúvidas.
 */
export function HomeFaq() {
  const whatsapp = whatsappUrl(siteConfig.contact.whatsapp, siteConfig.contact.whatsappMessage);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative scroll-mt-24 overflow-hidden bg-night-900">
      <div aria-hidden="true" className="hairline absolute inset-x-0 top-0 h-px" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 py-24 sm:px-6 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8 lg:py-36">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <SectionIntro index="09" eyebrow="Dúvidas" id="faq-title" title="Perguntas frequentes." />
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-400">
              Não encontrou o que procurava? Pergunte direto — respondemos sem formulário longo e
              sem apresentação de vendas.
            </p>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/[0.05]"
            >
              <WhatsAppIcon aria-hidden="true" className="h-4 w-4 text-[#25d366]" />
              Perguntar pelo WhatsApp
            </a>
          </Reveal>

          <div className="relative mt-12 hidden w-40 lg:block">
            <div className="animate-bob">
              <Core pose="confused" className="w-full" />
            </div>
            <div aria-hidden="true" className="mx-auto -mt-2 h-3 w-24 rounded-[100%] bg-brand-500/40 blur-md" />
          </div>
        </div>

        <Reveal delay={100}>
          <Faq items={homeFaq} tone="dark" numbered className="border-y border-white/10" />
        </Reveal>
      </div>
    </section>
  );
}
