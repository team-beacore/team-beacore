import type { ProjectCategory } from "../data/projects";

/**
 * Registro único das ofertas.
 *
 * Alimenta: cards da Home, índice /servicos, páginas de serviço, metadata e sitemap.
 * Um serviço com `page` definido ganha página própria; sem `page`, aparece só
 * como card apontando para o contato.
 *
 * REGRA DE CONTEÚDO: nada aqui afirma resultado, prazo, preço, número de
 * clientes ou case. Descreve-se o que a oferta É e o que ela ENTREGA — isso é
 * definição de escopo, não alegação de fato.
 */

export type ServiceIcon =
  | "globe"
  | "target"
  | "code"
  | "monitor"
  | "bot"
  | "cubes"
  | "bag"
  | "sliders";

export type ServicePageContent = {
  /** Hero da página. */
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  /** Contexto/problema. */
  problem: {
    title: string;
    description: string;
    points: string[];
  };
  audience: {
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
  deliverables: {
    title: string;
    description: string;
    items: string[];
  };
  benefits: {
    title: string;
    items: { title: string; description: string }[];
  };
  steps: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  /** Categorias do portfólio relacionadas a esta oferta. */
  relatedCategories: ProjectCategory[];
  seo: { title: string; description: string };
};

export type Service = {
  id: string;
  slug: string;
  icon: ServiceIcon;
  title: string;
  /** Uma linha, usada nos cards. */
  summary: string;
  /** O problema que a oferta resolve, em linguagem de cliente. */
  problem: string;
  /** Entregável mais concreto, mostrado no card. */
  highlight: string;
  /** Rótulo do CTA contextual. */
  cta: string;
  /** Mensagem usada no WhatsApp a partir desta oferta. */
  whatsapp: string;
  /** Presente = tem página dedicada. */
  page?: ServicePageContent;
};

export const services: Service[] = [
  {
    id: "criacao-de-sites",
    slug: "criacao-de-sites",
    icon: "globe",
    title: "Criação de Sites",
    summary: "Site institucional que explica o que sua empresa faz e gera contato.",
    problem: "Seu site não existe, está desatualizado ou não traz ninguém.",
    highlight: "Site completo, responsivo e pronto para receber visitantes",
    cta: "Quero criar meu site",
    whatsapp: "a criação de um site",
    page: {
      eyebrow: "Criação de Sites",
      headline: "Um site que explica o seu negócio e abre conversas.",
      subheadline:
        "Do conteúdo à publicação: estrutura pensada para o visitante entender o que você faz e saber como falar com você.",
      ctaLabel: "Quero criar meu site",
      problem: {
        title: "Quando o site atrapalha em vez de ajudar",
        description:
          "Um site institucional não precisa ser bonito apenas. Ele precisa responder, em poucos segundos, o que a empresa faz e por que vale a pena entrar em contato.",
        points: [
          "O visitante não entende o que a empresa oferece",
          "Não existe um caminho claro para entrar em contato",
          "O site abre mal no celular, onde está a maior parte do tráfego",
          "Ninguém da equipe consegue atualizar o conteúdo",
          "A empresa não aparece quando alguém pesquisa pelo nome dela",
        ],
      },
      audience: {
        title: "Para quem é",
        description: "Situações em que um site institucional é a peça certa.",
        items: [
          {
            title: "Empresas sem presença digital",
            description:
              "O negócio já funciona, mas na internet ele não existe — ou existe só como perfil de rede social.",
          },
          {
            title: "Sites antigos que não representam mais",
            description:
              "A empresa evoluiu, o site ficou. Hoje ele passa uma imagem menor do que a realidade.",
          },
          {
            title: "Quem depende de indicação",
            description:
              "O cliente indicado pesquisa antes de ligar. O site é o que confirma que a empresa é séria.",
          },
          {
            title: "Prestadores de serviço",
            description:
              "Quem precisa explicar serviços, área de atuação e diferenciais sem depender de uma conversa.",
          },
        ],
      },
      deliverables: {
        title: "O que entregamos",
        description: "Escopo típico de um projeto de site institucional.",
        items: [
          "Arquitetura de páginas e organização do conteúdo",
          "Design próprio, alinhado à identidade da sua marca",
          "Desenvolvimento responsivo para celular, tablet e desktop",
          "Formulário de contato e integração com WhatsApp",
          "SEO técnico: títulos, descrições, sitemap, robots e URLs legíveis",
          "Otimização de imagens e performance de carregamento",
          "Publicação, configuração de domínio e entrega em funcionamento",
        ],
      },
      benefits: {
        title: "Por que com a Beacore",
        items: [
          {
            title: "Nada de template genérico",
            description:
              "O layout é construído para o seu conteúdo, não um tema pronto com o seu logo trocado.",
          },
          {
            title: "Performance como requisito",
            description:
              "Imagens otimizadas, JavaScript enxuto e carregamento rápido fazem parte do escopo, não são extra.",
          },
          {
            title: "Feito para ser encontrado",
            description:
              "Estrutura semântica e SEO técnico entram desde o começo, não depois que o site já está no ar.",
          },
          {
            title: "Conversa direta com quem desenvolve",
            description:
              "Você fala com a equipe que está construindo, sem camada de intermediário.",
          },
        ],
      },
      steps: [
        {
          title: "Conversa inicial",
          description:
            "Entendemos o negócio, o público e o que o site precisa resolver na prática.",
        },
        {
          title: "Proposta e escopo",
          description: "Definimos páginas, entregáveis e prazo antes de qualquer linha de código.",
        },
        {
          title: "Estrutura e design",
          description: "Organizamos o conteúdo e desenhamos as telas para aprovação.",
        },
        {
          title: "Desenvolvimento",
          description: "Construímos o site responsivo e revisamos junto com você.",
        },
        {
          title: "Publicação",
          description: "Colocamos no ar, configuramos domínio e deixamos tudo funcionando.",
        },
      ],
      faq: [
        {
          question: "Quanto tempo leva para ficar pronto?",
          answer:
            "Depende do número de páginas e de quanto do conteúdo já existe. Definimos o prazo junto com a proposta, depois da conversa inicial — e ele entra por escrito no escopo.",
        },
        {
          question: "Quanto custa?",
          answer:
            "O valor varia com o escopo. Não trabalhamos com pacote fechado publicado, porque o que uma empresa precisa raramente é o que a outra precisa. Na conversa inicial levantamos o escopo e enviamos a proposta.",
        },
        {
          question: "Eu preciso ter o conteúdo pronto?",
          answer:
            "Ajuda muito ter textos, fotos e logo. Se não tiver tudo, organizamos junto o que falta e definimos o que é essencial para a primeira versão.",
        },
        {
          question: "Quem cuida do domínio e da hospedagem?",
          answer:
            "Podemos configurar ambos. O domínio fica sempre registrado no nome da sua empresa. As condições de hospedagem e manutenção são definidas na proposta.",
        },
        {
          question: "Consigo atualizar o site depois?",
          answer:
            "Sim. Definimos na proposta quais partes você mesmo atualiza e como isso funciona, de acordo com a tecnologia escolhida para o projeto.",
        },
        {
          question: "O site funciona bem no celular?",
          answer:
            "Sim. O desenvolvimento é responsivo por padrão e testamos em celular, tablet e desktop antes da entrega.",
        },
      ],
      relatedCategories: ["site"],
      seo: {
        title: "Criação de Sites Profissionais | Beacore",
        description:
          "Sites institucionais sob medida: estrutura clara, design próprio, responsivo, rápido e preparado para SEO. Da conversa inicial à publicação.",
      },
    },
  },
  {
    id: "landing-pages",
    slug: "landing-pages",
    icon: "target",
    title: "Landing Pages",
    summary: "Uma página com um objetivo só: transformar visitante em contato.",
    problem: "Você investe em divulgação, mas o tráfego não vira contato.",
    highlight: "Página única, focada em uma oferta e uma ação",
    cta: "Quero criar minha landing page",
    whatsapp: "a criação de uma landing page",
    page: {
      eyebrow: "Landing Pages",
      headline: "Uma página, um objetivo, uma ação.",
      subheadline:
        "Página de destino construída em torno de uma oferta específica, para que o visitante que chegou pela campanha saiba exatamente o que fazer.",
      ctaLabel: "Quero criar minha landing page",
      problem: {
        title: "Quando o tráfego chega e vai embora",
        description:
          "Mandar uma campanha para a home é desperdiçar clique. A home fala com todo mundo; a landing page fala com quem clicou naquele anúncio específico.",
        points: [
          "A campanha leva para uma página que fala de tudo, menos da oferta anunciada",
          "O visitante não encontra o botão de ação sem rolar procurando",
          "A página demora a carregar e o visitante desiste antes de ver",
          "Não há como saber quantos contatos vieram de qual campanha",
          "O formulário pede informação demais e espanta o interessado",
        ],
      },
      audience: {
        title: "Para quem é",
        description: "Situações em que uma landing page rende mais que uma página comum.",
        items: [
          {
            title: "Quem anuncia",
            description:
              "Campanhas pagas exigem um destino desenhado para a oferta anunciada, não a home institucional.",
          },
          {
            title: "Lançamento de produto ou serviço",
            description:
              "Uma oferta nova merece uma página própria, sem competir com o resto do site.",
          },
          {
            title: "Captação de contatos",
            description:
              "Quando o objetivo é preencher a agenda comercial com pedidos qualificados.",
          },
          {
            title: "Eventos e inscrições",
            description: "Página objetiva para quem precisa que o visitante conclua uma ação.",
          },
        ],
      },
      deliverables: {
        title: "O que entregamos",
        description: "Escopo típico de uma landing page.",
        items: [
          "Estrutura de argumentação da página, do topo ao CTA final",
          "Design próprio, focado em leitura rápida e em uma ação clara",
          "Formulário qualificado, com os campos que a sua operação usa de fato",
          "Integração com WhatsApp para o contato imediato",
          "Carregamento otimizado, pensado para quem chega pelo celular",
          "Metadata e prévia de compartilhamento configuradas",
          "Publicação e entrega em funcionamento",
        ],
      },
      benefits: {
        title: "Por que com a Beacore",
        items: [
          {
            title: "Conteúdo antes de efeito",
            description:
              "A página é montada em torno do argumento de venda. A parte visual reforça a leitura, não disputa com ela.",
          },
          {
            title: "Formulário que qualifica",
            description:
              "Perguntamos o que a sua equipe comercial precisa saber para priorizar o atendimento.",
          },
          {
            title: "Velocidade tratada como conversão",
            description:
              "Página lenta perde visitante. Performance entra como requisito desde o início.",
          },
          {
            title: "Preparada para medir",
            description:
              "A estrutura permite identificar a origem do contato, para você saber o que está funcionando.",
          },
        ],
      },
      steps: [
        {
          title: "Conversa inicial",
          description: "Entendemos a oferta, o público da campanha e qual ação define sucesso.",
        },
        {
          title: "Proposta e escopo",
          description: "Definimos seções, formulário e prazo.",
        },
        {
          title: "Estrutura e design",
          description: "Montamos o argumento da página e desenhamos as telas.",
        },
        {
          title: "Desenvolvimento",
          description: "Construímos a página e testamos o fluxo até o envio.",
        },
        {
          title: "Publicação",
          description: "Colocamos no ar, pronta para receber a campanha.",
        },
      ],
      faq: [
        {
          question: "Qual a diferença entre landing page e site?",
          answer:
            "O site apresenta a empresa inteira e tem vários caminhos possíveis. A landing page trata de uma oferta só e tem um caminho só: a ação que você quer que o visitante execute.",
        },
        {
          question: "Vocês também cuidam da campanha de anúncios?",
          answer:
            "Nosso escopo é a construção da página. Trabalhamos junto com quem cuida da mídia, entregando a página preparada para receber o tráfego.",
        },
        {
          question: "Dá para fazer mais de uma versão para testar?",
          answer:
            "Sim, é possível montar variações da mesma página. Definimos na proposta quantas versões entram no escopo.",
        },
        {
          question: "Consigo usar meu domínio atual?",
          answer:
            "Sim. A página pode ficar em um subdomínio ou em um caminho do seu domínio principal. Definimos isso junto na conversa inicial.",
        },
        {
          question: "Os contatos chegam onde?",
          answer:
            "Definimos o destino junto com você — o formulário pode registrar o contato e direcionar para WhatsApp ou e-mail, conforme a sua operação.",
        },
        {
          question: "Quanto custa e quanto tempo leva?",
          answer:
            "Depende do escopo da página. Levantamos na conversa inicial e enviamos a proposta com valor e prazo definidos.",
        },
      ],
      relatedCategories: ["site", "template"],
      seo: {
        title: "Criação de Landing Pages | Beacore",
        description:
          "Landing pages construídas em torno de uma oferta e uma ação: argumentação clara, formulário qualificado, carregamento rápido e integração com WhatsApp.",
      },
    },
  },
  {
    id: "sistemas-web",
    slug: "sistemas-web",
    icon: "code",
    title: "Sistemas Web",
    summary: "Sistema sob medida para o processo que sua empresa faz na mão.",
    problem: "Sua operação roda em planilhas, grupos de WhatsApp e retrabalho.",
    highlight: "Sistema próprio, com as regras do seu negócio",
    cta: "Quero conversar sobre meu sistema",
    whatsapp: "o desenvolvimento de um sistema",
    page: {
      eyebrow: "Sistemas Web",
      headline: "Quando a planilha não dá mais conta.",
      subheadline:
        "Sistemas desenvolvidos para o processo que a sua empresa já executa — com as regras, os perfis de acesso e o vocabulário do seu negócio.",
      ctaLabel: "Quero conversar sobre meu sistema",
      problem: {
        title: "Sinais de que o processo pede um sistema",
        description:
          "Muita empresa não precisa de mais um software genérico. Precisa de uma ferramenta que entenda exatamente como ela trabalha.",
        points: [
          "A informação vive espalhada entre planilhas, e-mails e grupos de mensagem",
          "A mesma informação é digitada mais de uma vez, em lugares diferentes",
          "Ninguém sabe qual é a versão correta do arquivo",
          "O sistema pronto do mercado obriga a empresa a mudar o processo dela",
          "Não dá para controlar quem vê e quem edita o quê",
          "Gerar um relatório simples consome horas de trabalho manual",
        ],
      },
      audience: {
        title: "Para quem é",
        description: "Situações em que um sistema sob medida se paga.",
        items: [
          {
            title: "Operações que cresceram na planilha",
            description:
              "O controle funcionou até certo ponto, mas hoje o volume e o número de pessoas envolvidas tornaram isso frágil.",
          },
          {
            title: "Processos específicos do negócio",
            description:
              "A empresa faz algo de um jeito próprio e nenhum sistema de prateleira encaixa sem gambiarra.",
          },
          {
            title: "Equipes com perfis diferentes",
            description:
              "Quando é preciso separar o que cada pessoa pode ver, criar, editar ou aprovar.",
          },
          {
            title: "Painéis internos e área de cliente",
            description:
              "Quando a empresa precisa de um lugar próprio para a equipe ou para os clientes acompanharem algo.",
          },
        ],
      },
      deliverables: {
        title: "O que entregamos",
        description: "Escopo típico de um projeto de sistema.",
        items: [
          "Levantamento do processo atual e das regras do negócio",
          "Modelagem dos dados e da estrutura do sistema",
          "Interface web responsiva, usável no computador e no celular",
          "Autenticação e controle de permissões por perfil de usuário",
          "Telas de cadastro, consulta, edição e acompanhamento",
          "Painel administrativo para a gestão do dia a dia",
          "Publicação em ambiente de produção e entrega em funcionamento",
        ],
      },
      benefits: {
        title: "Por que com a Beacore",
        items: [
          {
            title: "O sistema se adapta ao processo",
            description:
              "Partimos de como a empresa trabalha hoje, em vez de forçar a operação a caber num software genérico.",
          },
          {
            title: "Construído para evoluir",
            description:
              "A arquitetura considera que o negócio vai mudar. Adicionar um módulo depois não deve exigir recomeçar.",
          },
          {
            title: "Acesso controlado desde o início",
            description:
              "Perfis e permissões fazem parte da modelagem, não são remendo posterior.",
          },
          {
            title: "Entrega em partes",
            description:
              "Priorizamos o que resolve mais cedo, para o sistema começar a ser útil antes de estar completo.",
          },
        ],
      },
      steps: [
        {
          title: "Conversa inicial",
          description: "Mapeamos o processo atual, quem participa e onde estão os gargalos.",
        },
        {
          title: "Escopo e prioridades",
          description:
            "Definimos o que entra na primeira entrega e o que fica para as próximas etapas.",
        },
        {
          title: "Modelagem e telas",
          description: "Estruturamos os dados e desenhamos as telas principais para aprovação.",
        },
        {
          title: "Desenvolvimento",
          description: "Construímos em ciclos, com você acompanhando e validando o que fica pronto.",
        },
        {
          title: "Publicação e acompanhamento",
          description: "Colocamos em produção e acompanhamos o início do uso real.",
        },
      ],
      faq: [
        {
          question: "Sistema sob medida não sai muito mais caro que um pronto?",
          answer:
            "Depende do caso. Um sistema pronto costuma cobrar por usuário todo mês e ainda assim exigir adaptações no seu processo. O sob medida tem um investimento inicial maior e nenhuma mensalidade por usuário. Avaliamos os dois cenários com você na conversa inicial.",
        },
        {
          question: "Quanto tempo leva?",
          answer:
            "Depende diretamente do escopo. Por isso trabalhamos com entregas em etapas: definimos junto o que é essencial para a primeira versão útil e o prazo dela entra na proposta.",
        },
        {
          question: "O sistema conversa com ferramentas que já usamos?",
          answer:
            "Integrações são possíveis quando a ferramenta oferece uma forma de conexão. Verificamos isso caso a caso durante o levantamento, antes de entrar no escopo.",
        },
        {
          question: "Como ficam os dados que já temos hoje?",
          answer:
            "Avaliamos o que existe e definimos junto a estratégia de migração. Isso é levantado antes do desenvolvimento, não depois.",
        },
        {
          question: "Quem é o dono do sistema?",
          answer: "Você. O sistema é da sua empresa, assim como os dados dele.",
        },
        {
          question: "E depois da entrega?",
          answer:
            "As condições de suporte e evolução são definidas na proposta, de acordo com o que o projeto exigir.",
        },
      ],
      relatedCategories: ["aplicacao", "produto"],
      seo: {
        title: "Desenvolvimento de Sistemas Web sob Medida | Beacore",
        description:
          "Sistemas web construídos para o processo da sua empresa: modelagem, perfis de acesso, painel administrativo e entrega em etapas.",
      },
    },
  },
  {
    id: "automacoes",
    slug: "automacoes",
    icon: "bot",
    title: "Automações e Integrações",
    summary: "Tarefas repetitivas e sistemas que não conversam entre si.",
    problem: "Sua equipe gasta horas copiando informação de um lugar para outro.",
    highlight: "Fluxos automatizados e sistemas integrados",
    cta: "Quero automatizar um processo",
    whatsapp: "a automação de um processo",
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    icon: "bag",
    title: "E-commerce",
    summary: "Loja virtual para vender seus produtos pela internet.",
    problem: "Você vende pelo WhatsApp e perde pedido por falta de estrutura.",
    highlight: "Catálogo, carrinho e checkout",
    cta: "Quero criar minha loja virtual",
    whatsapp: "a criação de uma loja virtual",
  },
  {
    id: "produtos-digitais",
    slug: "produtos-digitais",
    icon: "cubes",
    title: "Produtos Digitais / MVP",
    summary: "Sua ideia de produto transformada em uma primeira versão real.",
    problem: "Você tem uma ideia e precisa validá-la sem construir tudo de uma vez.",
    highlight: "Primeira versão funcional, pronta para testar",
    cta: "Quero tirar minha ideia do papel",
    whatsapp: "o desenvolvimento de um produto digital",
  },
];

export const servicesWithPage = services.filter(
  (service): service is Service & { page: ServicePageContent } => Boolean(service.page),
);

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function servicePath(service: Service): string {
  return service.page ? `/servicos/${service.slug}` : "/#contato";
}
