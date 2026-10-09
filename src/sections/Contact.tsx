import { siteConfig } from "../config/site";
import { Reveal } from "../components/motion/Reveal";
import { SectionIntro } from "../components/experience/SectionIntro";
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
    <section
      id="contato"
      aria-labelledby="contact-title"
      className="relative scroll-mt-24 overflow-hidden bg-night-900"
    >
      <div aria-hidden="true" className="hairline absolute inset-x-0 top-0 h-px" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-brand-700/[0.12] blur-[120px]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <div>
              <SectionIntro eyebrow="Contato" id="contact-title" title="Vamos conversar." />
              <p className="mt-5 max-w-md text-base leading-relaxed text-ink-400">
                Conte sobre o seu projeto ou ideia. Respondemos pelos canais que preferir.
              </p>

              <ul className="mt-10 space-y-3">
                {channels.map(({ label, value, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                      className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-ink-300 transition-colors group-hover:border-brand-400/40 group-hover:bg-brand-500/10 group-hover:text-brand-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="label-mono block text-[10px] text-ink-400">
                          {label}
                        </span>
                        <span className="mt-0.5 block truncate text-sm font-medium text-white">
                          {value}
                        </span>
                      </span>
                      <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-ink-500 transition-colors group-hover:text-white" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            {/* O formulário (e toda a lógica de leads) é o mesmo; só ganha moldura. */}
            <div className="relative rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-1.5 shadow-[0_40px_100px_-40px_rgb(47_114_255/0.45)]">
              <LeadForm source="home" tone="dark" className="rounded-[1.3rem] border-transparent" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
