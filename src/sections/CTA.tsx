import { Button } from "../components/Button";
import { Core } from "../components/core/Core";
import { useGsapScene } from "../components/motion/useGsapScene";
import { siteConfig } from "../config/site";
import { ArrowRightIcon, WhatsAppIcon } from "../lib/icons";
import { whatsappUrl } from "../lib/utils";

/**
 * CTA final — o encerramento da história.
 *
 * Um único ambiente em CSS 3D — horizonte de luz e piso em perspectiva — em
 * vez de uma segunda cena WebGL. O Core espera na plataforma, pronto para
 * começar: a comemoração já aconteceu no fim do Processo.
 *
 * Cena GSAP: o piso "avança" e o horizonte se abre durante o scroll; o
 * conteúdo sobe uma vez ao entrar. Só transform/opacity/background-position.
 */
export function CTA() {

  const ref = useGsapScene<HTMLElement>(
    ({ q, gsap }) => {
      const trigger = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.5 };
      gsap.fromTo(q("[data-cta='floor']"), { backgroundPositionY: "0px" }, {
        backgroundPositionY: "256px",
        ease: "none",
        scrollTrigger: trigger,
      });
      // Horizonte: a linha de luz se abre enquanto a seção entra na tela.
      gsap.fromTo(
        q("[data-cta='horizon']"),
        { scaleX: 0.35, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 35%", scrub: 0.5 },
        },
      );
      gsap.from(q("[data-cta='content']"), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });
      gsap.from(q("[data-cta='core']"), {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 65%", once: true },
      });
    },
    { disableOnCompact: true },
  );

  const whatsapp = whatsappUrl(siteConfig.contact.whatsapp, siteConfig.contact.whatsappMessage);

  return (
    <section
      ref={ref}
      aria-labelledby="cta-title"
      className="relative isolate overflow-hidden bg-night-950"
    >
      <div className="relative">
        {/* Ambiente */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
          {/*
            Horizonte de luz: separa a história do convite. No desktop o arco
            se apaga sob o texto e só aparece do lado do Core — antes ele
            cortava o título.
          */}
          <div data-cta="horizon" className="absolute inset-x-0 top-0 h-[26rem] origin-top lg:[mask-image:linear-gradient(90deg,transparent_35%,black_65%)]">
            <div className="absolute left-1/2 top-[-30rem] h-[56rem] w-[150%] -translate-x-1/2 rounded-[100%] border-b border-brand-300/50 shadow-[0_40px_90px_-30px_rgb(47_114_255/0.55)]" />
            <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,rgb(47_114_255/0.2),transparent_70%)]" />
          </div>
          <div className="absolute inset-x-[-20%] bottom-[-10%] top-[58%]">
            <div data-cta="floor" className="floor-grid h-full w-full" />
          </div>
          <div className="grain absolute inset-0" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-28 sm:px-6 sm:py-32 lg:grid-cols-[1.3fr_0.7fr] lg:px-8 lg:py-40">
          <div data-cta="content" className="max-w-3xl">
            <h2
              id="cta-title"
              className="pb-[0.1em] font-display text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white text-balance sm:text-6xl lg:text-[4.4rem]"
            >
              Tem algo no seu negócio que poderia funcionar melhor?
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
              Conte o que você precisa resolver. A primeira conversa serve para entender o problema
              — não para empurrar um pacote.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#contato" size="lg" variant="light" className="group max-sm:w-full">
                Falar sobre meu projeto
                <ArrowRightIcon
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
              <Button href={whatsapp} external size="lg" variant="outline-light" className="max-sm:w-full">
                <WhatsAppIcon aria-hidden="true" className="h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Core na plataforma de luz. */}
          <div data-cta="core" className="relative mx-auto w-32 sm:w-40 lg:w-44">
            <Core pose="ready" className="w-full drop-shadow-[0_30px_40px_rgb(0_0_0/0.6)]" />
            <div aria-hidden="true" className="relative mx-auto -mt-4 h-8 w-[115%] -translate-x-[6.5%]">
              <div className="absolute inset-0 rounded-[100%] border border-brand-300/40 bg-brand-500/10" />
              <div className="absolute inset-x-6 inset-y-1 rounded-[100%] bg-brand-400/40 blur-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
