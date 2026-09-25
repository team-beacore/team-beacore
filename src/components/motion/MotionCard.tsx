import type { ElementType, ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";

type MotionCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
  /** Intensidade do levantamento no hover, em px. */
  lift?: number;
  interactive?: boolean;
};

/**
 * Microinteração padrão de card: levanta levemente no hover, recua no clique.
 *
 * Só `transform` é animado — nunca width/height/top/left — para manter tudo no
 * compositor. No toque, `whileHover` não dispara, então nenhuma informação
 * depende de hover para ser acessada.
 *
 * Assim como o Reveal, o componente nunca troca de forma entre servidor e
 * cliente: com movimento reduzido apenas os gestos são omitidos.
 */
export function MotionCard({
  children,
  className,
  as = "div",
  lift = 4,
  interactive = true,
}: MotionCardProps) {
  const reduced = useReducedMotion();
  const Tag = m[as as keyof typeof m] as ElementType;
  const animate = interactive && !reduced;

  return (
    <Tag
      whileHover={animate ? { y: -lift } : undefined}
      whileTap={animate ? { scale: 0.995 } : undefined}
      transition={{ type: "spring", stiffness: 360, damping: 26 }}
      className={cn(animate && "will-change-transform", className)}
    >
      {children}
    </Tag>
  );
}
