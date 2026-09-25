import { Navigate, useParams } from "react-router-dom";
import { SiteLayout } from "../layouts/SiteLayout";
import { Seo } from "../components/seo/Seo";
import { StructuredData } from "../components/seo/StructuredData";
import { serviceStructuredData } from "../config/structuredData";
import { getServiceBySlug, type Service, type ServicePageContent } from "../content/services";
import {
  ServiceAudience,
  ServiceBenefits,
  ServiceCTA,
  ServiceDeliverables,
  ServiceFaq,
  ServiceHero,
  ServiceProblem,
  ServiceProcess,
  ServiceProjects,
} from "../components/service/ServiceSections";

type WithPage = Service & { page: ServicePageContent };

/**
 * Uma página para todas as ofertas com conteúdo.
 *
 * A rota é dirigida pelo registro em `src/content/services.ts`: acrescentar uma
 * oferta com `page` preenchido cria a página, a metadata, o prerender e a
 * entrada no sitemap — sem escrever um novo componente.
 */
export function ServicePage() {
  const { slug = "" } = useParams();
  const service = getServiceBySlug(slug);

  // Slug sem página dedicada cai no 404 da aplicação, em vez de renderizar vazio.
  if (!service?.page) return <Navigate to="/404" replace />;

  const withPage = service as WithPage;
  const path = `/servicos/${withPage.slug}`;

  return (
    <SiteLayout>
      <Seo
        path={path}
        title={withPage.page.seo.title}
        description={withPage.page.seo.description}
      />
      <StructuredData
        data={serviceStructuredData({
          name: withPage.title,
          description: withPage.page.seo.description,
          path,
          faq: withPage.page.faq,
        })}
      />

      <ServiceHero service={withPage} />
      <ServiceProblem service={withPage} />
      <ServiceAudience service={withPage} />
      <ServiceDeliverables service={withPage} />
      <ServiceBenefits service={withPage} />
      <ServiceProcess service={withPage} />
      <ServiceProjects service={withPage} />
      <ServiceFaq service={withPage} />
      <ServiceCTA service={withPage} />
    </SiteLayout>
  );
}
