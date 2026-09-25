import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Restauração de scroll na navegação entre rotas.
 *
 * A Home usa âncoras (#servicos, #contato) e as páginas de serviço são rotas
 * reais. Sem isto, ir de /servicos/sistemas-web para /#contato mantinha a
 * posição anterior do scroll, e trocar de página de serviço abria no meio.
 *
 * Com hash, o navegador rola para o elemento; sem hash, volta ao topo.
 * Respeita prefers-reduced-motion ao escolher entre rolagem suave e instantânea.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const smooth =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
