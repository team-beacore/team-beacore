/**
 * Pré-renderização estática das rotas públicas.
 *
 * Roda depois de `vite build` (cliente) e `vite build --ssr` (servidor):
 *   1. usa dist/index.html como template (já com os assets com hash)
 *   2. renderiza cada rota do registro com renderToString
 *   3. reescreve o bloco <!--seo--> com a metadata daquela rota
 *   4. grava dist/<rota>/index.html
 *
 * Tolerante a falha por rota: se o render de uma rota lançar, aquela rota cai
 * para o shell vazio (SPA), com a metadata correta. O build não quebra e a
 * aplicação continua funcionando — só perde o HTML pré-renderizado daquela rota.
 *
 * /admin e /feedback/:token NÃO são pré-renderizados de propósito: são privados,
 * dependem de sessão/token e estão bloqueados no robots.txt.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const ssrEntry = pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href;

const template = readFileSync(join(distDir, "index.html"), "utf8");

if (!template.includes("<!--seo-->") && !template.includes("<title>")) {
  console.error("[prerender] index.html sem bloco de metadata reconhecível. Abortando.");
  process.exit(1);
}

const { render, routeSeo, resolveSeo, renderSeoTags } = await import(ssrEntry);

const SEO_BLOCK = /<title>[\s\S]*?<meta name="twitter:image:alt"[^>]*>/;
const ROOT_DIV = '<div id="root"></div>';

let prerendered = 0;
let shellOnly = 0;

for (const route of routeSeo) {
  const tags = renderSeoTags(resolveSeo(route));

  let html = template.replace(SEO_BLOCK, tags);

  try {
    const appHtml = render(route.path);
    if (!html.includes(ROOT_DIV)) {
      throw new Error('marcador <div id="root"></div> não encontrado no template');
    }
    html = html.replace(
      ROOT_DIV,
      `<div id="root" data-prerendered="${route.path}">${appHtml}</div>`,
    );
    prerendered += 1;
  } catch (error) {
    shellOnly += 1;
    console.warn(
      `[prerender] ${route.path}: render falhou, gravando shell SPA com metadata correta.`,
      error instanceof Error ? error.message : error,
    );
  }

  const outFile =
    route.path === "/" ? join(distDir, "index.html") : join(distDir, route.path, "index.html");

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html, "utf8");
  console.log(`[prerender] ${route.path.padEnd(32)} -> ${outFile.replace(root, ".")}`);
}

console.log(`[prerender] ${prerendered} rota(s) com HTML, ${shellOnly} apenas shell.`);
