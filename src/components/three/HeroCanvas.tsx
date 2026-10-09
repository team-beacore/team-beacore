import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import type { HeroSceneController } from "./heroScene";

type HeroCanvasProps = {
  className?: string;
  /** Elemento cuja rolagem alimenta a cena (o próprio Hero). */
  scrollRoot?: React.RefObject<HTMLElement | null>;
  onStage?: (stage: number) => void;
  /** Arte oficial do Core a integrar na cena. */
  coreSrc?: string;
  /** Avisado quando o Core já está dentro da cena 3D. */
  onCoreReady?: () => void;
  /** Elemento posicionado sobre a cabeça do Core 3D (ex.: balão de fala). */
  anchorRef?: React.RefObject<HTMLElement | null>;
};

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Montagem da cena Three.js do Hero.
 *
 * Ordem de prioridade: o texto do Hero (LCP) pinta primeiro, vindo do HTML
 * pré-renderizado. Só depois, em tempo ocioso, o módulo 3D é baixado
 * (`import()` → chunk próprio) e a cena é criada. Até lá — e para sempre, se
 * WebGL não existir — o espaço mostra o "pôster" em CSS, com as mesmas
 * dimensões: nada se desloca (CLS zero).
 *
 * Economia: a cena pausa fora da viewport e com a aba oculta; o ponteiro só é
 * lido em dispositivos com hover real.
 */
export function HeroCanvas({
  className,
  scrollRoot,
  onStage,
  coreSrc,
  onCoreReady,
  anchorRef,
}: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onStageRef = useRef(onStage);
  onStageRef.current = onStage;
  const onCoreReadyRef = useRef(onCoreReady);
  onCoreReadyRef.current = onCoreReady;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !supportsWebGL()) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 767px)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let controller: HeroSceneController | null = null;
    let cancelled = false;
    let visible = true;
    const cleanups: Array<() => void> = [];

    const boot = () => {
      import("./heroScene")
        .then(({ createHeroScene }) => {
          if (cancelled || !canvasRef.current) return;
          controller = createHeroScene({
            canvas: canvasRef.current,
            compact,
            reducedMotion,
            onStage: (stage) => onStageRef.current?.(stage),
            coreSrc,
            onCoreReady: () => onCoreReadyRef.current?.(),
            // Escreve direto no estilo do balão: nada de re-render por quadro.
            onCoreAnchor: (x, y, opacity) => {
              const anchor = anchorRef?.current;
              if (!anchor) return;
              anchor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-20%, -100%)`;
              anchor.style.opacity = String(opacity);
            },
          });
          setReady(true);

          const sync = () => controller?.setActive(visible && !document.hidden);

          const observer = new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting;
              sync();
            },
            { rootMargin: "80px" },
          );
          observer.observe(canvasRef.current);
          cleanups.push(() => observer.disconnect());

          document.addEventListener("visibilitychange", sync);
          cleanups.push(() => document.removeEventListener("visibilitychange", sync));

          const resizeObserver = new ResizeObserver(() => controller?.resize());
          resizeObserver.observe(canvasRef.current);
          cleanups.push(() => resizeObserver.disconnect());

          if (!reducedMotion) {
            if (finePointer) {
              const target = canvasRef.current;
              const onMove = (event: PointerEvent) => {
                controller?.setPointer(
                  (event.clientX / window.innerWidth) * 2 - 1,
                  (event.clientY / window.innerHeight) * 2 - 1,
                );
                // Hover só sobre o canvas: coordenadas NDC para o raycast.
                const rect = target.getBoundingClientRect();
                const inside =
                  event.clientX >= rect.left &&
                  event.clientX <= rect.right &&
                  event.clientY >= rect.top &&
                  event.clientY <= rect.bottom;
                if (inside) {
                  controller?.setHover(
                    ((event.clientX - rect.left) / rect.width) * 2 - 1,
                    -((event.clientY - rect.top) / rect.height) * 2 + 1,
                  );
                } else {
                  controller?.setHover(null);
                }
              };
              const onClick = () => controller?.pulse();
              window.addEventListener("pointermove", onMove, { passive: true });
              target.addEventListener("click", onClick);
              cleanups.push(() => {
                window.removeEventListener("pointermove", onMove);
                target.removeEventListener("click", onClick);
              });
            }

            const onScroll = () => {
              const root = scrollRoot?.current;
              const height = root?.offsetHeight || window.innerHeight;
              controller?.setScroll(window.scrollY / height);
            };
            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
            cleanups.push(() => window.removeEventListener("scroll", onScroll));
          }

          sync();
        })
        .catch((error) => {
          // Sem a cena, o pôster em CSS continua cumprindo o papel visual.
          console.error("[hero] Não foi possível iniciar a cena 3D:", error);
        });
    };

    // Espera a página assentar antes de gastar CPU/GPU com a cena.
    const idle = (window as Window & { requestIdleCallback?: typeof requestIdleCallback })
      .requestIdleCallback;
    let handle: number;
    if (idle) {
      handle = idle(boot, { timeout: 1200 });
      cleanups.push(() => window.cancelIdleCallback?.(handle));
    } else {
      handle = window.setTimeout(boot, 350);
      cleanups.push(() => window.clearTimeout(handle));
    }

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      controller?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRoot, coreSrc]);

  return (
    // Posicionamento vem de quem usa (normalmente `absolute inset-0`).
    <div className={className} aria-hidden="true">
      {/* Pôster: aparece antes (e no lugar) da cena WebGL. */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          ready ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100 shadow-[0_0_40px_12px_rgb(47_114_255/0.55)]" />
      </div>
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-1000",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
