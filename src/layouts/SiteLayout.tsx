import type { ReactNode } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SkipLink } from "../components/SkipLink";
import { WhatsAppButton } from "../components/WhatsAppButton";

export const MAIN_CONTENT_ID = "main-content";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <SkipLink targetId={MAIN_CONTENT_ID} />
      <Navbar />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
