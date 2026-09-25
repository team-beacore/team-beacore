import { siteConfig, siteUrl } from "./site";
import { services, servicesWithPage } from "../content/services";

/**
 * Fonte central de metadata.
 *
 * Um único lugar define os padrões do site e o registro por rota.
 * Consumido por:
 *  - `useSeo` / `<Seo>`   → metadata em runtime (navegação client-side)
 *  - `scripts/prerender.mjs` → HTML estático por rota, gerado no build
 *  - `vite.config.ts`     → sitemap.xml
 *
 * Nada aqui é inventado: título, descrição e imagem vêm de `siteConfig`.
 */

export const seoDefaults = {
  siteName: "Beacore",
  locale: "pt_BR",
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  ogImage: siteConfig.seo.ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Beacore — Digital Engineering",
  robots: "index, follow",
} as const;

export type RouteSeo = {
  /** Caminho da rota, sempre iniciando com "/". */
  path: string;
  title: string;
  description: string;
  /** Sobrescreve a imagem padrão. Caminho absoluto a partir da raiz. */
  ogImage?: string;
  robots?: string;
  /** Entra no sitemap.xml. Rotas privadas ou com noindex ficam de fora. */
  sitemap?: boolean;
};

/**
 * Rotas públicas registradas.
 *
 * As páginas comerciais (/servicos, /servicos/criacao-de-sites, ...) entram aqui
 * na Fase 3, junto com os componentes de página. A infraestrutura já suporta:
 * basta adicionar a entrada e a rota no router — prerender e sitemap seguem juntos.
 */
export const routeSeo: RouteSeo[] = [
  {
    path: "/",
    title: seoDefaults.title,
    description: seoDefaults.description,
    sitemap: true,
  },
  {
    path: "/servicos",
    title: "Serviços | Beacore",
    description:
      "Sites, landing pages, sistemas web, automações, e-commerce e produtos digitais desenvolvidos sob medida pela Beacore.",
    sitemap: true,
  },
  // Derivadas do registro de ofertas: acrescentar uma oferta com `page`
  // cria automaticamente rota, metadata, prerender e entrada no sitemap.
  ...servicesWithPage.map((service) => ({
    path: `/servicos/${service.slug}`,
    title: service.page.seo.title,
    description: service.page.seo.description,
    sitemap: true,
  })),
];

/** Slugs que possuem página dedicada — usado pelo router. */
export const serviceSlugsWithPage = services
  .filter((service) => service.page)
  .map((service) => service.slug);

export function getRouteSeo(path: string): RouteSeo | undefined {
  return routeSeo.find((route) => route.path === path);
}

/** Rotas que entram no sitemap.xml. */
export function sitemapRoutes(): string[] {
  return routeSeo.filter((route) => route.sitemap !== false).map((route) => route.path);
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export type ResolvedSeo = {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  robots: string;
};

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Renderiza o bloco de metadata como HTML.
 *
 * Usado em dois lugares a partir desta mesma fonte:
 *  - `vite.config.ts`, substituindo o marcador <!--seo--> do index.html (dev e build)
 *  - `scripts/prerender.mjs`, reescrevendo o bloco para cada rota estática
 *
 * Manter uma única função evita que o HTML servido e o runtime divirjam.
 */
export function renderSeoTags(seo: ResolvedSeo): string {
  const e = escapeAttribute;

  return [
    `<title>${e(seo.title)}</title>`,
    `<meta name="description" content="${e(seo.description)}" />`,
    `<meta name="robots" content="${e(seo.robots)}" />`,
    `<link rel="canonical" href="${e(seo.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${e(seoDefaults.siteName)}" />`,
    `<meta property="og:locale" content="${e(seoDefaults.locale)}" />`,
    `<meta property="og:title" content="${e(seo.title)}" />`,
    `<meta property="og:description" content="${e(seo.description)}" />`,
    `<meta property="og:url" content="${e(seo.canonical)}" />`,
    `<meta property="og:image" content="${e(seo.ogImage)}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="${seoDefaults.ogImageWidth}" />`,
    `<meta property="og:image:height" content="${seoDefaults.ogImageHeight}" />`,
    `<meta property="og:image:alt" content="${e(seoDefaults.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(seo.title)}" />`,
    `<meta name="twitter:description" content="${e(seo.description)}" />`,
    `<meta name="twitter:image" content="${e(seo.ogImage)}" />`,
    `<meta name="twitter:image:alt" content="${e(seoDefaults.ogImageAlt)}" />`,
  ].join("\n    ");
}

export function resolveSeo(input: Partial<RouteSeo> & { path: string }): ResolvedSeo {
  return {
    title: input.title ?? seoDefaults.title,
    description: input.description ?? seoDefaults.description,
    canonical: absoluteUrl(input.path),
    ogImage: absoluteUrl(input.ogImage ?? seoDefaults.ogImage),
    robots: input.robots ?? seoDefaults.robots,
  };
}
