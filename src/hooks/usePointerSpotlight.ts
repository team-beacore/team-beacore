import { useEffect, useRef } from "react";

/**
 * Escreve a posição do ponteiro em `--mx` / `--my` (px, relativos ao elemento)
 * para que o CSS desenhe uma luz que acompanha o cursor.
 *
 * Sem estado React: atualiza variáveis CSS no próximo frame, então mover o
 * mouse nunca re-renderiza a árvore. Só liga em ponteiro fino com hover — no
 * toque a luz fica na posição padrão definida no CSS.
 */
export function usePointerSpotlight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      element.style.setProperty("--mx", `${x}px`);
      element.style.setProperty("--my", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    element.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      element.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
