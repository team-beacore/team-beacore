import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { services, servicePath } from "../content/services";
import { whatsappUrl } from "../lib/utils";
import { GitHubIcon, InstagramIcon, LinkedInIcon, MailIcon, WhatsAppIcon } from "../lib/icons";

type SocialLink = {
  label: string;
  href: string;
  Icon: typeof GitHubIcon;
};

export function Footer() {
  const { nav, contact, social, slogan } = siteConfig;

  // Redes sem URL configurada não são renderizadas — nunca um link para "#".
  const socialLinks: SocialLink[] = [
    social.github ? { label: "GitHub", href: social.github, Icon: GitHubIcon } : null,
    social.linkedin ? { label: "LinkedIn", href: social.linkedin, Icon: LinkedInIcon } : null,
    social.instagram ? { label: "Instagram", href: social.instagram, Icon: InstagramIcon } : null,
  ].filter((item): item is SocialLink => item !== null);

  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-4 md:gap-8 lg:py-20">
          <div>
            <p className="font-display text-xl font-bold tracking-[0.18em] text-white">BEACORE</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">{slogan}</p>
            {socialLinks.length > 0 && (
              <div className="mt-6 flex items-center gap-2.5">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${label} da Beacore`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-ink-400 transition-colors hover:border-brand-500 hover:text-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-label="Serviços">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              Serviços
            </h3>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => {
                const href = servicePath(service);
                const cls =
                  "text-sm text-ink-400 transition-colors hover:text-white";
                return (
                  <li key={service.id}>
                    {href.startsWith("/servicos") ? (
                      <Link to={href} className={cls}>
                        {service.title}
                      </Link>
                    ) : (
                      <a href={href} className={cls}>
                        {service.title}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

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
            href={siteConfig.siteUrl}
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