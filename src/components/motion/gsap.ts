import type { gsap as GsapType } from "gsap";

export type Gsap = typeof GsapType;

/**
 * Carregamento sob demanda do GSAP.
 *
 * Por que dinâmico: GSAP + ScrollTrigger somam ~38 kB gzip. Importados
 * estaticamente, entram no chunk inicial e atrasam a primeira pintura por algo
 * que só roda DEPOIS dela. Como o HTML já vem pré-renderizado, o conteúdo
 * aparece na hora e as cenas se conectam quando o pacote chega.
 *
 * O registro do plugin acontece uma única vez, aqui.
 */
let loader: Promise<Gsap> | null = null;

export function loadGsap(): Promise<Gsap> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("GSAP não é carregado durante o prerender."));
  }

  if (!loader) {
    loader = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([core, scrollTrigger]) => {
        core.gsap.registerPlugin(scrollTrigger.ScrollTrigger);
        return core.gsap;
      },
    );
  }

  return loader;
}

/** Respeita a preferência do sistema por movimento reduzido. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Abaixo disso, cenas de scroll/parallax são desligadas (custo x benefício no mobile). */
export const MOTION_BREAKPOINT = 768;

export function isCompactViewport(): boolean {
  if (typeof window === "undefined") return true;
  return window.innerWidth < MOTION_BREAKPOINT;
}

/**
 * Janela máxima, em ms, para uma animação de ENTRADA ainda valer a pena.
 *
 * O conteúdo pré-renderizado já está visível quando o GSAP chega. Rodar um
 * `.from()` depois disso faria o texto saltar para trás para então reentrar —
 * um defeito visível. Se o pacote demorar mais que isto (conexão lenta), as
 * cenas de entrada são puladas e o visitante simplesmente lê o conteúdo.
 * As cenas de scroll continuam sendo conectadas normalmente.
 */
export const ENTRY_ANIMATION_BUDGET_MS = 220;
