import { useEffect } from "react";
import {
  absoluteUrl,
  resolveSeo,
  seoDefaults,
  type RouteSeo,
} from "../../config/seo";

/**
 * Metadata em runtime, para navegação client-side.
 *
 * Por que imperativo e não as tags nativas do React 19:
 * o React 19 sabe içar <title>/<meta> para o <head>, mas ele ANEXA — não substitui
 * as tags que já vêm no HTML servido. O resultado seriam dois <title>, e tanto o
 * navegador quanto os crawlers usam o primeiro. Atualizar as tags existentes no
 * lugar evita duplicação e mantém o HTML estático (gerado no build) como fonte
 * para quem não executa JavaScript.
 */

function upsert(
  selector: string,
  create: () => HTMLElement,
  apply: (element: HTMLElement) => void,
) {
  let element = document.head.querySelector<HTMLElement>(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  apply(element);
}

function setMeta(key: "name" | "property", value: string, content: string) {
  upsert(
    `meta[${key}="${value}"]`,
    () => {
      const meta = document.createElement("meta");
      meta.setAttribute(key, value);
      return meta;
    },
    (element) => element.setAttribute("content", content),
  );
}

export type SeoProps = Partial<Omit<RouteSeo, "path">> & {
  path: string;
};

export function useSeo(props: SeoProps) {
  const { title, description, canonical, ogImage, robots } = resolveSeo(props);

  useEffect(() => {
    if (document.title !== title) document.title = title;

    setMeta("name", "description", description);
    setMeta("name", "robots", robots);

    // Canonical só faz sentido em página indexável. Apontar um /404 ou o /admin
    // para a Home confundiria o crawler, então a tag é removida nesses casos.
    const indexable = !robots.includes("noindex");
    if (indexable) {
      upsert(
        'link[rel="canonical"]',
        () => {
          const link = document.createElement("link");
          link.setAttribute("rel", "canonical");
          return link;
        },
        (element) => element.setAttribute("href", canonical),
      );
    } else {
      document.head.querySelector('link[rel="canonical"]')?.remove();
    }

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", seoDefaults.siteName);
    setMeta("property", "og:locale", seoDefaults.locale);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:image:alt", seoDefaults.ogImageAlt);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);
    setMeta("name", "twitter:image:alt", seoDefaults.ogImageAlt);
  }, [title, description, canonical, ogImage, robots]);
}

export function Seo(props: SeoProps) {
  useSeo(props);
  return null;
}

export { absoluteUrl };
