import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Services } from "./sections/Services";
import { Team } from "./sections/Team";
import { Projects } from "./sections/Projects";
import { Technologies } from "./sections/Technologies";
import { Process } from "./sections/Process";
import { CTA } from "./sections/CTA";
import { Contact } from "./sections/Contact";
import { FeedbackPage } from "./pages/FeedbackPage";
import { AdminPage } from "./pages/AdminPage";

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <About />
      <Services />
      <Team />
      <Projects />
      <Technologies />
      <Process />
      <CTA />
      <Contact />
    </SiteLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/feedback/:token" element={<FeedbackPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}