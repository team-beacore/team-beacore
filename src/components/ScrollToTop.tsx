import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { syncScrollPosition } from "./motion/gsap";

/**
 * Restauração de scroll na navegação entre rotas.
 *
 * A Home usa âncoras (#servicos, #contato) e as páginas de serviço são rotas
 * reais. Sem isto, ir de /servicos/sistemas-web para /#contato mantinha a
 * posição anterior do scroll, e trocar de página de serviço abria no meio.
 *
 * Com hash, o navegador rola para o elemento; sem hash, volta ao topo.
 * Respeita prefers-reduced-motion ao escolher entre rolagem suave e instantânea.
 *
 * "instant", não "auto": `auto` herda o `scroll-behavior: smooth` do <html>,
 * e a nova página aparecia rolando de volta desde a posição da anterior.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const smooth =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        // Antes da rolagem: escrever a posição depois cancelaria o scroll suave.
        syncScrollPosition();
        target.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    syncScrollPosition();
  }, [pathname, hash]);

  return null;
}
