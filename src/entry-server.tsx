import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppRoutes } from "./App";

/**
 * Entrada usada apenas por `scripts/prerender.mjs` durante o build.
 * Nada daqui vai para o bundle do navegador.
 *
 * Os reexports abaixo permitem que o script de prerender (JS puro) consuma a
 * mesma configuração de SEO em TypeScript, sem um segundo loader.
 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
}

export { routeSeo, resolveSeo, renderSeoTags } from "./config/seo";
