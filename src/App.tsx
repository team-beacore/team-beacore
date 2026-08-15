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

export default function App() {
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