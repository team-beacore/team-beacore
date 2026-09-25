import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";

const container = document.getElementById("root")!;

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

function normalize(path: string): string {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

/**
 * Hidratar só quando o HTML servido é o daquela rota.
 *
 * O rewrite SPA da Vercel entrega dist/index.html (que contém a Home
 * pré-renderizada) para qualquer rota sem arquivo próprio — /admin, /feedback/:token
 * e URLs inexistentes. Hidratar nesse caso quebra com erro de mismatch, porque o
 * cliente renderiza outra rota. O prerender marca cada arquivo com
 * `data-prerendered`, e só hidratamos quando ele corresponde ao caminho atual.
 */
const prerenderedPath = container.dataset.prerendered;
const matches =
  prerenderedPath !== undefined && normalize(prerenderedPath) === normalize(window.location.pathname);

if (matches) {
  hydrateRoot(container, app);
} else {
  container.innerHTML = "";
  createRoot(container).render(app);
}
