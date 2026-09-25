import type { ElementType, ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * Entrada de conteúdo ao entrar no viewport.
 *
 * DECISÃO IMPORTANTE — por que o componente NUNCA troca de forma:
 * o HTML é pré-renderizado, e o Motion emite o estado inicial (`opacity: 0`)
 * já no servidor. Se o caminho de movimento reduzido devolvesse um elemento
 * simples, o `opacity: 0` vindo do HTML permaneceria e o conteúdo ficaria
 * invisível para justamente quem pediu menos movimento.
 *
 * Por isso renderizamos sempre o mesmo `m.*` e, com movimento reduzido,
 * usamos `initial={false}` + `animate` instantâneo: o estilo herdado do SSR
 * é sobrescrito para visível no primeiro frame, sem animação nenhuma.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Atraso em ms. */
  delay?: number;
  as?: "div" | "li" | "article" | "section";
  distance?: number;
  direction?: "up" | "left" | "right" | "none";
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  distance = 20,
  direction = "up",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = m[as as keyof typeof m] as ElementType;

  const offset =
    direction === "up"
      ? { y: distance }
      : direction === "left"
        ? { x: -distance }
        : direction === "right"
          ? { x: distance }
          : {};

  if (reduced) {
    return (
      <Tag
        initial={false}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0 }}
        className={cn(className)}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, delay: delay / 1000, ease: EASE }}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  step?: number;
};

/**
 * Escalona a entrada dos filhos envolvidos em <StaggerItem>.
 * Evita repetir `delay={index * n}` em cada map.
 */
export function Stagger({ children, className, as = "div", step = 0.07 }: StaggerProps) {
  const reduced = useReducedMotion();
  const Tag = m[as as keyof typeof m] as ElementType;

  return (
    <Tag
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      animate={reduced ? "visible" : undefined}
      viewport={reduced ? undefined : VIEWPORT}
      variants={{ visible: { transition: { staggerChildren: reduced ? 0 : step } } }}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const Tag = m[as as keyof typeof m] as ElementType;

  return (
    <Tag
      initial={reduced ? false : undefined}
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: reduced ? { duration: 0 } : { duration: 0.5, ease: EASE },
        },
      }}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
