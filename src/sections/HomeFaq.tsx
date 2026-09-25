import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { Reveal } from "../components/motion/Reveal";
import { Faq } from "../components/Faq";
import { homeFaq } from "../content/home";
import { siteConfig } from "../config/site";
import { whatsappUrl } from "../lib/utils";
import { WhatsAppIcon } from "../lib/icons";

export function HomeFaq() {
  const whatsapp = whatsappUrl(siteConfig.contact.whatsapp, siteConfig.contact.whatsappMessage);

  return (
    <Section id="faq" className="bg-surface">
      <div className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Dúvidas" title="Perguntas frequentes." align="left" />
            <Reveal>
              <p className="mt-5 text-base leading-relaxed text-ink-600">
                Não encontrou o que procurava? Pergunte direto — respondemos sem formulário
                longo e sem apresentação de vendas.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 underline underline-offset-4 transition-colors hover:text-brand-800"
              >
                <WhatsAppIcon aria-hidden="true" className="h-4 w-4" />
                Perguntar pelo WhatsApp
              </a>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <Faq items={homeFaq} />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
