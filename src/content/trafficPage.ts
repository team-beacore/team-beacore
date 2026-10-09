/**
 * Conteúdo da página /servicos/gestao-de-trafego-pago.
 *
 * REGRA DE CONTEÚDO (a mesma das outras ofertas): nada aqui afirma resultado,
 * número de leads, ROAS, redução de custo, prazo, preço, cliente ou
 * certificação. Descreve-se o que o serviço É, o que pode ENTREGAR e do que os
 * resultados DEPENDEM. O escopo final é sempre definido na proposta.
 */

export type TrafficChannel = "meta-ads" | "google-ads" | "meta-google";

export const trafficChannels: {
  id: TrafficChannel;
  name: string;
  /** Rótulo curto para o seletor do formulário. */
  short: string;
  platforms: string;
  title: string;
  description: string;
  objectives: string[];
  cta: string;
}[] = [
  {
    id: "meta-ads",
    name: "Meta Ads",
    short: "Meta Ads",
    platforms: "Facebook e Instagram",
    title: "Gere demanda e conquiste atenção.",
    description:
      "Campanhas no Facebook e no Instagram alcançam pessoas pelo perfil e pelo interesse — inclusive quem ainda não procura pelo seu serviço. Servem para ampliar o alcance, despertar interesse, captar contatos e estimular conversões.",
    objectives: [
      "Reconhecimento e alcance",
      "Geração de leads",
      "Conversas e mensagens",
      "Vendas e conversões",
      "Remarketing, quando há estrutura e consentimento adequados",
    ],
    cta: "Quero anunciar no Meta Ads",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    short: "Google Ads",
    platforms: "Pesquisa e outros formatos",
    title: "Seja encontrado quando seu cliente procura.",
    description:
      "Campanhas na Rede de Pesquisa aparecem para quem já está buscando soluções ligadas ao seu negócio. Outros formatos — como Display, YouTube ou Performance Max — entram quando fazem sentido para o objetivo.",
    objectives: [
      "Capturar a demanda que já existe",
      "Gerar contatos qualificados",
      "Levar tráfego relevante para páginas comerciais",
      "Aumentar as oportunidades de venda",
      "Medir as ações importantes do usuário",
    ],
    cta: "Quero anunciar no Google Ads",
  },
  {
    id: "meta-google",
    name: "Meta Ads + Google Ads",
    short: "Meta + Google",
    platforms: "Os dois canais",
    title: "Uma estratégia integrada para diferentes etapas da jornada.",
    description:
      "Os canais podem trabalhar juntos: o Meta Ads ajuda a gerar interesse, e o Google Ads captura parte da demanda ativa de quem já procura. Se a combinação faz sentido — e em que proporção — depende do mercado, do orçamento, do público e dos objetivos.",
    objectives: [
      "Gerar interesse em quem ainda não conhece a empresa",
      "Estar presente quando a busca acontece",
      "Ler os dois canais com a mesma mensuração",
      "Distribuir o orçamento conforme o que os dados mostram",
    ],
    cta: "Quero uma estratégia integrada",
  },
];

export function channelName(id: TrafficChannel): string {
  return trafficChannels.find((channel) => channel.id === id)?.name ?? id;
}

/** Entregas da gestão. O escopo de cada contratação é definido na proposta. */
export const trafficDeliverables: { title: string; items: string[] }[] = [
  {
    title: "Diagnóstico e planejamento",
    items: [
      "Entendimento do negócio, do público, da oferta e da concorrência",
      "Definição de objetivos e indicadores",
      "Avaliação das páginas de destino e do processo comercial",
    ],
  },
  {
    title: "Estruturação das campanhas",
    items: [
      "Configuração de campanhas e contas, conforme as permissões e a estrutura do cliente",
      "Segmentação, palavras-chave, públicos e posicionamentos adequados",
      "Campanhas organizadas de acordo com os objetivos",
    ],
  },
  {
    title: "Anúncios e criativos",
    items: [
      "Planejamento das mensagens publicitárias",
      "Desenvolvimento ou orientação de textos e peças, conforme o escopo contratado",
      "Testes de variações quando há volume e orçamento para isso",
    ],
  },
  {
    title: "Rastreamento e mensuração",
    items: [
      "Avaliação da estrutura de conversões",
      "Configuração de tags e eventos, quando aplicável",
      "Validação dos dados e identificação das limitações de mensuração",
      "Respeito às regras de consentimento e privacidade",
    ],
  },
  {
    title: "Otimização contínua",
    items: [
      "Monitoramento das campanhas",
      "Análise de desempenho",
      "Ajustes de segmentação, orçamento e anúncios",
      "Testes e melhorias com base nos dados disponíveis",
    ],
  },
  {
    title: "Relatórios e direcionamento",
    items: [
      "Apresentação dos principais indicadores",
      "Análise do que está funcionando e do que precisa melhorar",
      "Recomendações para os próximos ciclos",
    ],
  },
];

export const trafficMethod: { title: string; description: string }[] = [
  {
    title: "Diagnóstico",
    description:
      "Entendemos o negócio, o público, a oferta, os objetivos e a estrutura digital atual.",
  },
  {
    title: "Estratégia",
    description:
      "Definimos os canais, a estrutura de campanhas, as prioridades e os indicadores de desempenho.",
  },
  {
    title: "Execução",
    description:
      "Configuramos as campanhas e o rastreamento necessário, respeitando o escopo acordado.",
  },
  {
    title: "Otimização",
    description:
      "Acompanhamos os dados, identificamos oportunidades e ajustamos a estratégia de forma contínua.",
  },
];

export const trafficAudience: { title: string; description: string }[] = [
  { title: "Empresas de serviços", description: "Que dependem de novos contatos para fechar contratos." },
  { title: "Negócios locais", description: "Que atendem uma cidade ou região e precisam ser encontrados por ela." },
  { title: "Empresas B2B", description: "Com ciclo de venda mais longo e público bem definido." },
  { title: "E-commerces", description: "Que querem levar tráfego qualificado para o catálogo e o checkout." },
  { title: "Quem precisa de mais leads", description: "E tem estrutura para atender os contatos que chegarem." },
  {
    title: "Quem já anuncia",
    description: "E quer melhorar a mensuração, a organização e a gestão das campanhas.",
  },
];

export const trafficRequirements: string[] = [
  "Objetivo comercial",
  "Público e região atendida",
  "Oferta e diferenciais do negócio",
  "Site ou landing page",
  "Estrutura de atendimento aos leads",
  "Orçamento disponível para mídia",
  "Contas e ativos de publicidade existentes",
  "Possibilidade de rastrear os resultados",
];

export const trafficFaq: { question: string; answer: string }[] = [
  {
    question: "Qual é a diferença entre Meta Ads e Google Ads?",
    answer:
      "No Meta Ads (Facebook e Instagram), o anúncio aparece para pessoas pelo perfil e pelos interesses, mesmo que elas ainda não estejam procurando o seu serviço — é bom para gerar interesse e demanda. No Google Ads, especialmente na Rede de Pesquisa, o anúncio aparece para quem já está buscando algo relacionado ao seu negócio — é bom para capturar a demanda que já existe.",
  },
  {
    question: "Posso contratar apenas um dos canais?",
    answer:
      "Sim. É comum começar por um canal, aprender com os dados e só depois avaliar se faz sentido expandir. A escolha depende do seu objetivo, do seu público e do orçamento.",
  },
  {
    question: "Vale a pena anunciar nas duas plataformas?",
    answer:
      "Depende. Os canais podem se complementar em etapas diferentes da jornada, mas dividir um orçamento pequeno entre duas plataformas pode dificultar a otimização. Avaliamos o cenário antes de recomendar uma ou as duas.",
  },
  {
    question: "Quanto preciso investir em anúncios?",
    answer:
      "Não existe um valor único. O investimento adequado depende do mercado, da concorrência, da região, do objetivo e do custo dos cliques ou dos resultados no seu segmento. Na avaliação inicial discutimos um orçamento compatível com o que você quer alcançar.",
  },
  {
    question: "A verba de anúncios está incluída no serviço?",
    answer:
      "Não. O orçamento de mídia é pago diretamente às plataformas (Meta e Google) e é separado do valor da gestão da Beacore. As condições da gestão são definidas na proposta.",
  },
  {
    question: "A Beacore garante vendas ou um número de leads?",
    answer:
      "Não. Nenhuma gestão séria pode garantir vendas ou um número fixo de leads: os resultados variam conforme a oferta, o mercado, a concorrência, o investimento, a página de destino e o atendimento. O que garantimos é o trabalho: planejamento, execução cuidadosa, mensuração e otimização contínua.",
  },
  {
    question: "Preciso ter um site ou landing page?",
    answer:
      "Para a maioria das campanhas, sim — é para onde o tráfego vai. Algumas campanhas de mensagens podem levar direto para o WhatsApp ou o Direct. Se a sua página atual atrapalhar a conversão, isso aparece no diagnóstico, e a Beacore também desenvolve sites e landing pages.",
  },
  {
    question: "Como os resultados serão acompanhados?",
    answer:
      "Com os indicadores definidos no planejamento, a partir dos dados das plataformas e do rastreamento configurado. Você recebe relatórios com o que está funcionando, o que precisa melhorar e as recomendações para o próximo ciclo. A periodicidade é definida na proposta.",
  },
  {
    question: "Como funciona o início do projeto?",
    answer:
      "Começa por uma conversa para entender o negócio e o objetivo. Depois avaliamos as contas, as páginas e o rastreamento existentes, enviamos a proposta com o escopo e, aprovada, estruturamos as campanhas e a mensuração antes de colocar os anúncios no ar.",
  },
];

/** Objetivos do formulário. `fallbackGoal` = valor aceito pelo banco antes da migration 0012. */
export const trafficGoals = [
  { value: "gerar-leads", label: "Gerar contatos e leads", fallbackGoal: "mais-clientes" },
  { value: "conversas-mensagens", label: "Receber conversas e mensagens", fallbackGoal: "mais-clientes" },
  { value: "vender-online", label: "Vender pela internet", fallbackGoal: "vender-online" },
  { value: "reconhecimento-marca", label: "Tornar a marca conhecida", fallbackGoal: "presenca-digital" },
  { value: "melhorar-campanhas", label: "Melhorar campanhas que já rodam", fallbackGoal: "outro" },
  { value: "outro", label: "Outro objetivo", fallbackGoal: "outro" },
] as const;

export type TrafficGoal = (typeof trafficGoals)[number]["value"];
