import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MotionProvider } from "./components/motion/MotionProvider";
import { ScrollToTop } from "./components/ScrollToTop";
import { SiteLayout } from "./layouts/SiteLayout";
import { Seo } from "./components/seo/Seo";
import { StructuredData } from "./components/seo/StructuredData";
import { homeStructuredData } from "./config/structuredData";
import { getRouteSeo } from "./config/seo";
import { Hero } from "./sections/Hero";
import { Needs } from "./sections/Needs";
import { Services } from "./sections/Services";
import { WhyBeacore } from "./sections/WhyBeacore";
import { Cases } from "./sections/Cases";
import { Testimonials } from "./sections/Testimonials";
import { Process } from "./sections/Process";
import { About } from "./sections/About";
import { HomeFaq } from "./sections/HomeFaq";
import { CTA } from "./sections/CTA";
import { Contact } from "./sections/Contact";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ServicesIndexPage } from "./pages/ServicesIndexPage";
import { ServicePage } from "./pages/ServicePage";

// Rotas privadas/pontuais carregadas sob demanda: nenhum código administrativo
// entra no bundle inicial da Home.
const FeedbackPage = lazy(() =>
  import("./pages/FeedbackPage").then((m) => ({ default: m.FeedbackPage })),
);
const AdminPage = lazy(() => import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })));

function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-5">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-500">Carregando...</p>
    </div>
  );
}

function HomePage() {
  const seo = getRouteSeo("/");

  return (
    <>
      <Seo path="/" title={seo?.title} description={seo?.description} />
      <StructuredData data={homeStructuredData()} />
      <SiteLayout>
        <Hero />
        <Needs />
        <Services />
        <WhyBeacore />
        <Cases />
        <Testimonials />
        <Process />
        <About />
        <HomeFaq />
        <CTA />
        <Contact />
      </SiteLayout>
    </>
  );
}

/**
 * Árvore de rotas sem router.
 * Separada para que o cliente use BrowserRouter e o prerender use StaticRouter,
 * a partir de exatamente a mesma definição de rotas.
 */
export function AppRoutes() {
  return (
    <MotionProvider>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicos" element={<ServicesIndexPage />} />
          <Route path="/servicos/:slug" element={<ServicePage />} />
          <Route path="/feedback/:token" element={<FeedbackPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </MotionProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
