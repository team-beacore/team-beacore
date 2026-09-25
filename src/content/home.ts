/**
 * Conteúdo comercial da Home.
 *
 * Separado de `src/data/` de propósito: `data` guarda entidades (projetos,
 * equipe, tecnologias); `content` guarda a copy. Nada aqui afirma número,
 * resultado, prazo, preço ou cliente.
 */

/** Seção "O que você precisa resolver?" — cada item aponta para uma oferta. */
export const needs = [
  {
    id: "site",
    label: "Preciso de um site profissional",
    detail: "Minha empresa não aparece na internet, ou aparece mal.",
    serviceId: "criacao-de-sites",
  },
  {
    id: "landing",
    label: "Quero uma página para vender",
    detail: "Tenho uma oferta e preciso de um destino para a campanha.",
    serviceId: "landing-pages",
  },
  {
    id: "sistema",
    label: "Preciso de um sistema",
    detail: "Meu processo roda em planilha e já não dá conta.",
    serviceId: "sistemas-web",
  },
  {
    id: "automacao",
    label: "Quero automatizar meu negócio",
    detail: "Minha equipe repete tarefas que a máquina poderia fazer.",
    serviceId: "automacoes",
  },
  {
    id: "ecommerce",
    label: "Quero vender pela internet",
    detail: "Preciso de uma loja com catálogo, carrinho e checkout.",
    serviceId: "ecommerce",
  },
  {
    id: "produto",
    label: "Tenho uma ideia de produto",
    detail: "Quero tirar do papel e validar sem construir tudo.",
    serviceId: "produtos-digitais",
  },
] as const;

/**
 * "Por que Beacore" — apenas diferenciais sustentados pela forma como a equipe
 * trabalha e pelo que existe no projeto. Nenhum deles depende de número,
 * prêmio ou cliente para ser verdadeiro.
 */
export const whyBeacore = [
  {
    title: "Sob medida, não template",
    description:
      "Cada projeto parte do problema do negócio. Usamos bases que aceleram o desenvolvimento, mas o que você recebe é construído para o seu caso.",
  },
  {
    title: "Design e engenharia juntos",
    description:
      "A interface e o código são pensados no mesmo processo. Isso evita o site bonito que não funciona e o sistema que funciona mas ninguém usa.",
  },
  {
    title: "Conversa direta com quem constrói",
    description:
      "Equipe pequena e acesso direto a quem está desenvolvendo. Menos intermediário entre o que você precisa e o que é feito.",
  },
  {
    title: "Performance e SEO no escopo",
    description:
      "Carregamento rápido, estrutura semântica e metadata entram desde o início do projeto — não são um extra vendido depois.",
  },
  {
    title: "Preparado para evoluir",
    description:
      "A arquitetura considera que o negócio muda. Acrescentar uma página, um módulo ou uma integração depois não deve exigir recomeçar.",
  },
  {
    title: "Entrega em funcionamento",
    description:
      "O projeto termina publicado e operando, com domínio configurado — não como arquivo entregue para você resolver o resto.",
  },
] as const;

/** Processo, em linguagem do que o cliente de fato vive. */
export const processSteps = [
  {
    number: "01",
    title: "Você entra em contato",
    description:
      "Pelo formulário ou WhatsApp. Precisamos saber o que você quer resolver, não um briefing formatado.",
  },
  {
    number: "02",
    title: "Conversamos sobre a necessidade",
    description:
      "Uma conversa para entender o negócio, o público e o problema. É aqui que definimos se o que você pediu é mesmo o que você precisa.",
  },
  {
    number: "03",
    title: "Você recebe a proposta",
    description:
      "Escopo, entregáveis e prazo por escrito. Sem começar nada antes de estar claro dos dois lados.",
  },
  {
    number: "04",
    title: "Construímos com você acompanhando",
    description:
      "Desenvolvimento em etapas, com pontos de revisão. Você vê o projeto tomando forma em vez de esperar no escuro.",
  },
  {
    number: "05",
    title: "Publicamos e entregamos funcionando",
    description:
      "Colocamos no ar, configuramos o que for necessário e acompanhamos o início do uso real.",
  },
] as const;

/**
 * FAQ da Home.
 * Onde a resposta depende de regra comercial ainda não definida, a resposta diz
 * que é definido na proposta — em vez de inventar prazo ou preço.
 */
export const homeFaq = [
  {
    question: "Quanto custa um projeto?",
    answer:
      "Depende do escopo. Não publicamos pacote fechado porque o que uma empresa precisa raramente é o que a outra precisa. Na conversa inicial levantamos o escopo e enviamos uma proposta com valor e prazo definidos.",
  },
  {
    question: "Quanto tempo leva?",
    answer:
      "Varia conforme o tamanho do projeto. O prazo é definido junto com a proposta, depois de entendermos o escopo — e entra por escrito.",
  },
  {
    question: "Vocês cuidam do domínio e da hospedagem?",
    answer:
      "Podemos configurar os dois. O domínio fica sempre registrado no nome da sua empresa. As condições de hospedagem são definidas na proposta, conforme a tecnologia do projeto.",
  },
  {
    question: "E depois da entrega, tem manutenção?",
    answer:
      "As condições de suporte, manutenção e evolução são definidas na proposta de cada projeto, de acordo com o que ele exige.",
  },
  {
    question: "Consigo alterar o conteúdo depois?",
    answer:
      "Sim. Definimos na proposta quais partes você mesmo atualiza e como, de acordo com a tecnologia escolhida para o projeto.",
  },
  {
    question: "Vocês fazem integração com sistemas que já usamos?",
    answer:
      "Sim, quando a ferramenta oferece uma forma de conexão. Verificamos a viabilidade caso a caso antes de colocar no escopo.",
  },
  {
    question: "Como começa um projeto?",
    answer:
      "Pelo formulário desta página ou pelo WhatsApp. O primeiro passo é uma conversa para entender o que você precisa. Não é uma reunião de vendas com apresentação pronta.",
  },
  {
    question: "Atendem empresas de fora da região?",
    answer:
      "Sim. Trabalhamos remotamente, com reuniões online e acompanhamento pelos canais que você preferir.",
  },
] as const;
