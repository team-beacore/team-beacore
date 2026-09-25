import { Button } from "../components/Button";
import { Seo } from "../components/seo/Seo";
import { SiteLayout } from "../layouts/SiteLayout";
import { siteConfig } from "../config/site";
import { whatsappUrl } from "../lib/utils";
import { ArrowRightIcon, WhatsAppIcon } from "../lib/icons";

export function NotFoundPage() {
  const whatsapp = whatsappUrl(siteConfig.contact.whatsapp, siteConfig.contact.whatsappMessage);

  return (
    <SiteLayout>
      <Seo
        path="/404"
        title="Página não encontrada | Beacore"
        description="A página que você procurou não existe ou foi movida."
        robots="noindex, follow"
      />
      <section className="relative flex min-h-dvh items-center overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-grid-light [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-2xl px-5 py-28 text-center sm:px-6 lg:px-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">
            Erro 404
          </p>

          <p
            aria-hidden="true"
            className="mt-6 font-display text-[5rem] font-bold leading-none tracking-tight text-ink-100 sm:text-[7rem]"
          >
            404
          </p>

          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink-950 text-balance sm:text-4xl">
            Esta página não foi encontrada.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-500">
            O endereço pode ter mudado ou não existe mais. Você pode voltar ao início ou falar
            diretamente com a Beacore.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/" size="lg">
              Voltar para o início
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Button href="/#contato" size="lg" variant="secondary">
              Falar com a Beacore
            </Button>
          </div>

          <p className="mt-8 text-sm text-ink-500">
            Prefere WhatsApp?{" "}
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-brand-700 underline underline-offset-4 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Conversar agora
            </a>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
