/**
 * Configuração central do site.
 *
 * `siteUrl` é a ÚNICA fonte de verdade do domínio público. Ele é consumido por:
 *  - `vite.config.ts` (injeta canonical/og:url no index.html e gera robots.txt + sitemap.xml)
 *  - componentes que precisam montar URLs absolutas
 *
 * Ao migrar para um domínio próprio, altere apenas esta constante.
 */
export const siteUrl = "https://beacore.vercel.app";

/** Rotas públicas indexáveis. Usado para gerar o sitemap no build. */
export const publicRoutes = ["/"] as const;

type SocialLinks = {
  github?: string;
  linkedin?: string;
  instagram?: string;
};

type NavItem = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  slogan: string;
  description: string;
  siteUrl: string;
  nav: NavItem[];
  contact: {
    email: string;
    whatsapp: string;
    whatsappMessage: string;
  };
  social: SocialLinks;
  cta: NavItem;
  seo: {
    title: string;
    description: string;
    url: string;
    ogImage: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "BEACORE",
  slogan: "Construímos experiências digitais que funcionam.",
  description: "Desenvolvimento web, produtos digitais e soluções sob medida.",
  siteUrl,
  // Com rotas reais (/servicos/*), as âncoras precisam do prefixo "/" para
  // funcionarem também a partir de uma página interna.
  nav: [
    { label: "Início", href: "/" },
    { label: "Serviços", href: "/servicos" },
    { label: "Cases", href: "/#projetos" },
    { label: "Processo", href: "/#processo" },
    { label: "Sobre", href: "/#sobre" },
    { label: "Equipe", href: "/#equipe" },
    { label: "Contato", href: "/#contato" },
  ],
  contact: {
    email: "equipebeacore@gmail.com",
    whatsapp: "5524998546942",
    whatsappMessage: "Olá! Gostaria de conversar com a Beacore sobre um projeto.",
  },
  // Só inclua uma rede aqui quando houver URL real. Links ausentes não são renderizados.
  social: {
    github: "https://github.com/team-beacore/",
    instagram:
      "https://www.instagram.com/equipebeacore",
  },
  cta: {
    label: "Falar com a Beacore",
    href: "/#contato",
  },
  seo: {
    title: "Beacore | Sites, sistemas e automações sob medida",
    description:
      "A Beacore desenvolve sites, landing pages, sistemas web, automações e produtos digitais sob medida.",
    url: siteUrl,
    ogImage: "/og-cover.png",
  },
};
