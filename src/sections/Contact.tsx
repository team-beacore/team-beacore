import { siteConfig } from "../config/site";
import { SectionIntro } from "../components/experience/SectionIntro";
import { LeadForm } from "../components/LeadForm";
import { formatPhoneBR, whatsappUrl } from "../lib/utils";
import {
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
    value: formatPhoneBR(siteConfig.contact.whatsapp),
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
    <section
      id="contato"
      aria-labelledby="contact-title"
      className="relative scroll-mt-24 overflow-hidden bg-night-900"
    >
      <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionIntro id="contact-title" size="md" title="Vamos conversar." />
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-300">
              Conte sobre o seu projeto ou ideia pelo formulário, ou fale direto pelo canal que
              preferir.
            </p>

            {/* Lista simples: o contato em si (número, e-mail) é o protagonista. */}
            <ul className="mt-10 border-t border-white/10">
              {channels.map(({ label, value, href, Icon }) => (
                <li key={label} className="border-b border-white/10">
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="group flex items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-400 transition-colors group-hover:text-brand-300" />
                    <span className="w-20 shrink-0 text-sm text-ink-400">{label}</span>
                    <span className="min-w-0 flex-1 truncate text-base font-medium text-white underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-brand-400">
                      {value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* O formulário (e toda a lógica de leads) é o mesmo. */}
          <LeadForm source="home" tone="dark" />
        </div>
      </div>
    </section>
  );
}
