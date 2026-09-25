import { useEffect, useRef, type RefObject } from "react";
import {
  ENTRY_ANIMATION_BUDGET_MS,
  isCompactViewport,
  loadGsap,
  prefersReducedMotion,
  type Gsap,
} from "./gsap";

type SceneOptions = {
  /** Desliga a cena em telas menores que 768px (parallax/scroll pesados). */
  disableOnCompact?: boolean;
  /**
   * Marca a cena como de ENTRADA (usa `.from()` sobre conteúdo já visível).
   * Cenas de entrada são puladas se o GSAP demorar a chegar — ver
   * ENTRY_ANIMATION_BUDGET_MS. Cenas de scroll devem deixar `false`.
   */
  entry?: boolean;
  deps?: unknown[];
};

type SceneSetup = (context: {
  root: HTMLElement;
  /** Busca restrita à raiz da cena. */
  q: (selector: string) => HTMLElement[];
  gsap: Gsap;
}) => void;

/**
 * Executa uma cena GSAP com escopo, limpeza e acessibilidade resolvidos.
 *
 * Um hook único em vez de GSAP espalhado pelos componentes porque:
 *  - `gsap.context()` isola os seletores na raiz e reverte TUDO no unmount,
 *    incluindo ScrollTriggers — sem vazamento ao trocar de rota na SPA;
 *  - `prefers-reduced-motion` e viewport compacto são checados em um lugar só;
 *  - o carregamento dinâmico do GSAP fica encapsulado aqui.
 *
 * Quando a cena não roda (movimento reduzido, tela pequena, sem JS, GSAP lento),
 * o conteúdo permanece no estado final legível. Nada fica invisível por padrão.
 */
export function useGsapScene<T extends HTMLElement = HTMLDivElement>(
  setup: SceneSetup,
  { disableOnCompact = false, entry = false, deps = [] }: SceneOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (prefersReducedMotion()) return;
    if (disableOnCompact && isCompactViewport()) return;

    let cancelled = false;
    let context: { revert: () => void } | null = null;
    const startedAt = performance.now();

    loadGsap()
      .then((gsap) => {
        if (cancelled || !ref.current) return;

        // Conteúdo já está visível (pré-renderizado). Um `.from()` tardio
        // faria o bloco saltar para trás antes de reentrar.
        if (entry && performance.now() - startedAt > ENTRY_ANIMATION_BUDGET_MS) return;

        context = gsap.context(() => {
          setupRef.current({
            root: ref.current as HTMLElement,
            q: (selector) =>
              Array.from((ref.current as HTMLElement).querySelectorAll<HTMLElement>(selector)),
            gsap,
          });
        }, ref.current);
      })
      .catch((error) => {
        // Falha ao carregar a animação não pode derrubar a página.
        console.error("[motion] Não foi possível carregar o GSAP:", error);
      });

    return () => {
      cancelled = true;
      context?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
