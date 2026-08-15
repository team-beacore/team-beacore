import { siteConfig } from "../config/site";
import { whatsappUrl } from "../lib/utils";
import { WhatsAppIcon } from "../lib/icons";

export function WhatsAppButton() {
  const href = whatsappUrl(siteConfig.contact.whatsapp, siteConfig.contact.whatsappMessage);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Conversar com a Beacore pelo WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-600/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25d366]"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink-950 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 sm:block"
      >
        Fale com a Beacore
      </span>
    </a>
  );
}