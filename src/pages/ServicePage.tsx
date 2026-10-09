import { Navigate, useParams } from "react-router-dom";
import { SiteLayout } from "../layouts/SiteLayout";
import { Seo } from "../components/seo/Seo";
import { StructuredData } from "../components/seo/StructuredData";
import { serviceStructuredData } from "../config/structuredData";
import { getServiceBySlug, type Service, type ServicePageContent } from "../content/services";
import { trafficFaq } from "../content/trafficPage";
import { TrafficPage } from "./TrafficPage";
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
 * Ofertas com layout próprio (`standalone` no registro). A página recebe só o
 * miolo: SiteLayout, metadata e dados estruturados continuam aqui.
 */
const STANDALONE_PAGES: Record<string, { Page: (props: { service: Service }) => React.ReactNode; faq: readonly { question: string; answer: string }[] }> = {
  "gestao-de-trafego-pago": { Page: TrafficPage, faq: trafficFaq },
};

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

  const standalone = service?.standalone ? STANDALONE_PAGES[service.slug] : undefined;
  if (service?.standalone && standalone) {
    const path = `/servicos/${service.slug}`;
    return (
      <SiteLayout>
        <Seo path={path} title={service.standalone.seo.title} description={service.standalone.seo.description} />
        <StructuredData
          data={serviceStructuredData({
            name: service.title,
            description: service.standalone.seo.description,
            path,
            faq: standalone.faq,
          })}
        />
        <standalone.Page service={service} />
      </SiteLayout>
    );
  }

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
