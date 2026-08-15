export const siteConfig = {
  name: "BEACORE",
  slogan: "Construímos experiências digitais que funcionam.",
  description: "Desenvolvimento web, produtos digitais e soluções sob medida.",
  brandUrl: "https://beacore.dev",
  stats: {
    projects: 80,
    technologies: 20,
    clients: 40,
  },
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "Equipe", href: "#equipe" },
    { label: "Projetos", href: "#projetos" },
    { label: "Contato", href: "#contato" },
  ],
  contact: {
    email: "equipebeacore@gmail.com",
    whatsapp: "5524998546942",
    whatsappMessage:
      "Olá! Conheci a Beacore através de um projeto e gostaria de conversar sobre um site/projeto.",
  },
  social: {
    github: "https://github.com/team-beacore/",
    linkedin: "#",
    instagram: "#",
  },
  cta: {
    label: "Vamos conversar",
    href: "#contato",
  },
  seo: {
    title: "Beacore | Digital Engineering",
    description: "Beacore — desenvolvimento web, produtos digitais e soluções sob medida.",
    url: "https://beacore.dev",
    ogImage: "/og-cover.svg",
  },
} as const;

export type SiteConfig = typeof siteConfig;