import { Button } from "../components/Button";
import { useGsapScene } from "../components/motion/useGsapScene";
import { ArrowRightIcon, WhatsAppIcon } from "../lib/icons";
import { siteConfig } from "../config/site";
import { whatsappUrl } from "../lib/utils";

/**
 * CTA final.
 *
 * Substitui "Tem uma ideia?" — que excluía quem tem um problema, não uma ideia.
 * Cena GSAP: as linhas do fundo deslizam durante o scroll e o bloco de texto
 * sobe levemente. Só transform, amarrado a scrub.
 */
export function CTA() {
  const ref = useGsapScene<HTMLElement>(({ q, gsap }) => {
    gsap.to(q("[data-cta='rays']"), {
      yPercent: -14,
      ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.5 },
    });
    gsap.from(q("[data-cta='content']"), {
      opacity: 0,
      y: 26,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
    });
  }, { disableOnCompact: true });

  const whatsapp = whatsappUrl(siteConfig.contact.whatsapp, siteConfig.contact.whatsappMessage);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-surface-dark"
      aria-labelledby="cta-title"
    >
      <div
        data-cta="rays"
        aria-hidden="true"
        className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_55%_70%_at_50%_100%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-72 w-[38rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-brand-600/25 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div data-cta="content" className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-brand-400" />
            Próximo passo
          </span>

          <h2
            id="cta-title"
            className="mt-7 font-display text-3xl font-bold leading-[1.08] tracking-tight text-white text-balance sm:text-5xl lg:text-[3.4rem]"
          >
            Tem algo no seu negócio que poderia funcionar melhor?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-300 lg:text-lg">
            Conte o que você precisa resolver. A primeira conversa serve para entender o
            problema — não para empurrar um pacote.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
            <Button href="#contato" size="lg" variant="light" className="max-sm:w-full">
              Falar sobre meu projeto
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
            </Button>
            <Button
              href={whatsapp}
              external
              size="lg"
              variant="outline-light"
              className="max-sm:w-full"
            >
              <WhatsAppIcon aria-hidden="true" className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>

          {/* Slot do mascote (item 10) — personagem ainda não definido. */}
          <div className="mascot-slot" data-mascot-slot="cta" />
        </div>
      </div>
    </section>
  );
}
