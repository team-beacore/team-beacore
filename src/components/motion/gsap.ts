import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

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
let scrollTriggerApi: typeof ScrollTriggerType | null = null;

/**
 * Informa ao ScrollTrigger a posição de scroll real depois de uma troca de rota.
 *
 * O ScrollTrigger guarda o scroll em cache e, a cada `refresh()`, grava e
 * RESTAURA essa posição. Na troca de rota o `watchLayout` dispara um refresh
 * (a altura da página muda) e o valor em cache ainda era o da página anterior:
 * a página nova abria no meio. Escrever a posição pela função de scroll do
 * próprio ScrollTrigger atualiza o cache; depois, a memória gravada é limpa.
 * Não faz nada se o GSAP ainda não carregou.
 */
export function syncScrollPosition(): void {
  if (!scrollTriggerApi) return;
  scrollTriggerApi.getScrollFunc(window)(window.scrollY);
  scrollTriggerApi.clearScrollMemory();
}

/**
 * Mantém as posições de todos os ScrollTriggers corretas quando a altura da
 * página muda depois da montagem — projetos e depoimentos chegam do Supabase,
 * imagens carregam, o FAQ abre. Sem isto, gatilhos calculados com a altura
 * antiga disparam no lugar errado (foi a causa da "área branca": uma seção
 * fixada fora de posição deixava à mostra o fundo do body).
 *
 * Um único ResizeObserver no body, com debounce: nada é recriado por scroll.
 */
function watchLayout(trigger: { refresh: () => void }) {
  if (typeof ResizeObserver === "undefined") return;
  let lastHeight = document.body.scrollHeight;
  let timer = 0;
  const observer = new ResizeObserver(() => {
    const height = document.body.scrollHeight;
    if (Math.abs(height - lastHeight) < 2) return;
    lastHeight = height;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => trigger.refresh(), 150);
  });
  observer.observe(document.body);
}

export function loadGsap(): Promise<Gsap> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("GSAP não é carregado durante o prerender."));
  }

  if (!loader) {
    loader = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([core, scrollTrigger]) => {
        core.gsap.registerPlugin(scrollTrigger.ScrollTrigger);
        scrollTriggerApi = scrollTrigger.ScrollTrigger;
        watchLayout(scrollTrigger.ScrollTrigger);
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
