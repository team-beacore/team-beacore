import { siteConfig } from "../config/site";
import { Reveal } from "../components/motion/Reveal";
import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { LeadForm } from "../components/LeadForm";
import { whatsappUrl } from "../lib/utils";
import {
  ArrowUpRightIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  WhatsAppIcon,
} from "../lib/icons";

type Channel = {
  label: string;
  value: string;
  href: string;
  Icon: typeof MailIcon;
};

/**
 * Só são renderizados canais com destino real.
 * Redes sem URL em `siteConfig.social` simplesmente não aparecem.
 */
const channels: Channel[] = [
  {
    label: "WhatsApp",
    value: siteConfig.contact.whatsapp,
    href: whatsappUrl(siteConfig.contact.whatsapp, siteConfig.contact.whatsappMessage),
    Icon: WhatsAppIcon,
  },
  {
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    Icon: MailIcon,
  },
  ...(siteConfig.social.instagram
    ? [
        {
          label: "Instagram",
          value: "@equipebeacore",
          href: siteConfig.social.instagram,
          Icon: InstagramIcon,
        },
      ]
    : []),
  ...(siteConfig.social.linkedin
    ? [
        {
          label: "LinkedIn",
          value: "Beacore",
          href: siteConfig.social.linkedin,
          Icon: LinkedInIcon,
        },
      ]
    : []),
];

export function Contact() {
  return (
    <Section id="contato">
      <div className="py-20 sm:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <div>
              <SectionHeading eyebrow="Contato" title="Vamos conversar." align="left" />
              <p className="mt-5 max-w-md text-base leading-relaxed text-ink-500">
                Conte sobre o seu projeto ou ideia. Respondemos pelos canais que preferir.
              </p>

              <ul className="mt-10 space-y-3">
                {channels.map(({ label, value, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                      className="group flex items-center gap-4 rounded-xl border border-ink-100 bg-white p-4 transition-all duration-200 hover:border-brand-200 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink-100 bg-ink-50 text-ink-600 transition-colors group-hover:border-brand-500/30 group-hover:bg-brand-50 group-hover:text-brand-600">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                          {label}
                        </span>
                        <span className="block truncate text-sm font-medium text-ink-900">
                          {value}
                        </span>
                      </span>
                      <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-ink-400 transition-colors group-hover:text-brand-600" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <LeadForm source="home" />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
