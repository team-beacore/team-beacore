export type Service = {
  id: string;
  icon: "globe" | "target" | "code" | "monitor" | "bot" | "cubes" | "bag" | "sliders";
  title: string;
  description: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    id: "sites-institucionais",
    icon: "globe",
    title: "Sites Institucionais",
    description:
      "Sites modernos, responsivos e preparados para gerar novos contatos e fortalecer sua marca.",
  },
  {
    id: "landing-pages",
    icon: "target",
    title: "Landing Pages",
    description:
      "Páginas focadas em campanhas, produtos e conversão, com performance e design estratégico.",
  },
  {
    id: "aplicacoes-web",
    icon: "code",
    title: "Aplicações Web",
    description:
      "Sistemas e experiências digitais personalizadas, escaláveis e desenvolvidas sob medida.",
  },
  {
    id: "sistemas-personalizados",
    icon: "monitor",
    title: "Sistemas Personalizados",
    description: "Sistemas completos para gestão de processos, equipes, clientes e operações."
  },
  {
    id: "automacoes",
    icon: "bot",
    title: "Automações",
    description:
      "Automação de processos, fluxos inteligentes e integrações que economizam tempo e reduzem erros."
  },
  {
    id: "produtos-digitais",
    icon: "cubes",
    title: "Produtos Digitais",
    description: "Da ideia ao produto funcional. Desenvolvemos soluções digitais prontas para crescer.",
  },
  {
    id: "catalogos",
    icon: "bag",
    title: "Catálogos",
    description: "Experiências modernas para apresentar produtos e serviços de forma profissional.",
  },
  {
    id: "solucoes-personalizadas",
    icon: "sliders",
    title: "Soluções Personalizadas",
    description: "Projetos desenvolvidos de acordo com necessidades específicas do seu negócio.",
  },
];