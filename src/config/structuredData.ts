import { seoDefaults } from "./seo";
import { siteConfig, siteUrl } from "./site";

/**
 * JSON-LD da Home.
 *
 * Regra: apenas dados que já existem no projeto e são verificáveis.
 * Deliberadamente AUSENTES por não existirem dados reais:
 * endereço, telefone, avaliações, número de funcionários, número de projetos,
 * faturamento, clientes e prêmios. Declarar qualquer um deles seria inventar.
 */
export function organizationSchema() {
  const sameAs = [siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.instagram]
    .filter((url): url is string => Boolean(url));

  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: seoDefaults.siteName,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}${seoDefaults.ogImage}`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function webSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: seoDefaults.siteName,
    url: `${siteUrl}/`,
    description: siteConfig.description,
    inLanguage: "pt-BR",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function homeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), webSiteSchema()],
  };
}

/**
 * JSON-LD das páginas de serviço: `Service` + `FAQPage`.
 *
 * O FAQPage usa exatamente as perguntas e respostas exibidas na página — é
 * requisito do Google que o conteúdo estruturado seja visível ao usuário.
 * Nenhum campo de preço, avaliação ou área de atendimento é declarado, porque
 * esses dados não existem no projeto.
 */
export function serviceStructuredData(input: {
  name: string;
  description: string;
  path: string;
  faq: readonly { question: string; answer: string }[];
}) {
  const url = `${siteUrl}${input.path}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: input.name,
      description: input.description,
      url,
      serviceType: input.name,
      provider: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Serviços", item: `${siteUrl}/servicos` },
        { "@type": "ListItem", position: 3, name: input.name, item: url },
      ],
    },
  ];

  if (input.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: input.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
