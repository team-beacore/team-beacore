import { siteConfig } from "../config/site";
import { whatsappUrl } from "../lib/utils";
import { GitHubIcon, InstagramIcon, LinkedInIcon, MailIcon, WhatsAppIcon } from "../lib/icons";

export function Footer() {
  const { nav, contact, social, slogan } = siteConfig;

  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-3 md:gap-8 lg:py-20">
          <div>
            <p className="font-display text-xl font-bold tracking-[0.18em] text-white">BEACORE</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">{slogan}</p>
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub da Beacore"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-ink-400 transition-colors hover:border-brand-500 hover:text-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <GitHubIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href={social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn da Beacore"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-ink-400 transition-colors hover:border-brand-500 hover:text-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <LinkedInIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram da Beacore"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-ink-400 transition-colors hover:border-brand-500 hover:text-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <InstagramIcon className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          <nav aria-label="Links do rodapé">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              Navegação
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-ink-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              Contato
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2.5 text-sm text-ink-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                >
                  <MailIcon className="h-4 w-4 shrink-0 text-ink-500" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl(contact.whatsapp, contact.whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-ink-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0 text-ink-500" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-ink-500">
            © 2026 Beacore
            <span aria-hidden="true" className="mx-2 text-ink-700">
              ·
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-600">
              Digital Engineering
            </span>
          </p>

          <a
            href={siteConfig.brandUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-ink-500 transition-colors hover:text-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <span>Desenvolvido por</span>
            <span className="font-display font-bold tracking-[0.18em] text-white transition-colors hover:text-brand-400">
              BEACORE
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}