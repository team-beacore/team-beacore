import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { siteUrl } from "./src/config/site";
import { renderSeoTags, resolveSeo, sitemapRoutes } from "./src/config/seo";

const BLOCKED_PATHS = ["/admin", "/feedback"];

function buildRobotsTxt(): string {
  const disallow = BLOCKED_PATHS.map((path) => `Disallow: ${path}`).join("\n");
  return ["User-agent: *", "Allow: /", disallow, "", `Sitemap: ${siteUrl}/sitemap.xml`, ""].join(
    "\n",
  );
}

function buildSitemapXml(): string {
  const urls = sitemapRoutes()
    .map((route) => `  <url>\n    <loc>${siteUrl}${route === "/" ? "/" : route}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * Metadata e arquivos de indexação a partir de uma única configuração
 * (`src/config/site.ts` + `src/config/seo.ts`):
 *  - substitui o marcador <!--seo--> do index.html pelo bloco padrão
 *  - gera robots.txt e sitemap.xml no build
 *  - serve ambos no dev server, para que possam ser testados localmente
 *
 * Só atua no build do cliente: no build SSR (`--ssr`) não há index.html nem
 * arquivos estáticos a emitir.
 */
function siteMetaPlugin(): Plugin {
  let isSsrBuild = false;

  return {
    name: "beacore-site-meta",
    config(_config, env) {
      isSsrBuild = Boolean(env.isSsrBuild);
    },
    transformIndexHtml(html) {
      const tags = renderSeoTags(resolveSeo({ path: "/" }));
      return html.replace("<!--seo-->", tags);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req as { url?: string }).url;
        if (url === "/robots.txt") {
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end(buildRobotsTxt());
          return;
        }
        if (url === "/sitemap.xml") {
          res.setHeader("Content-Type", "application/xml; charset=utf-8");
          res.end(buildSitemapXml());
          return;
        }
        next();
      });
    },
    generateBundle() {
      if (isSsrBuild) return;
      this.emitFile({ type: "asset", fileName: "robots.txt", source: buildRobotsTxt() });
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: buildSitemapXml() });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMetaPlugin()],
});
