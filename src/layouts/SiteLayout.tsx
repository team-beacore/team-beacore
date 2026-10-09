import type { ReactNode } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SkipLink } from "../components/SkipLink";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { cn } from "../lib/utils";

export const MAIN_CONTENT_ID = "main-content";

type SiteLayoutProps = {
  children: ReactNode;
  /** `night`: páginas escuras (Home) — o fundo do conteúdo segue a identidade. */
  tone?: "light" | "night";
};

export function SiteLayout({ children, tone = "light" }: SiteLayoutProps) {
  return (
    <>
      <SkipLink targetId={MAIN_CONTENT_ID} />
      <Navbar />
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className={cn("focus:outline-none", tone === "night" && "bg-night-900")}
      >
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
