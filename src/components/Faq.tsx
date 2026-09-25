import { useId, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";
import { PlusIcon } from "../lib/icons";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqProps = {
  items: readonly FaqItem[];
  className?: string;
  tone?: "light" | "dark";
};

/**
 * Acordeão de perguntas.
 *
 * Acessibilidade: cada pergunta é um <button> real com aria-expanded e
 * aria-controls; a resposta é uma região referenciada por aria-labelledby.
 * A animação é de height/opacity via Motion (que usa transform interno e
 * mede o conteúdo), e é dispensada quando o usuário pede movimento reduzido.
 */
export function Faq({ items, className, tone = "light" }: FaqProps) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();
  const isDark = tone === "dark";

  return (
    <div className={cn("divide-y", isDark ? "divide-white/10" : "divide-ink-100", className)}>
      {items.map((item, index) => {
        const expanded = open === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
                className={cn(
                  "flex w-full items-start justify-between gap-6 py-5 text-left transition-colors",
                  isDark
                    ? "text-white hover:text-brand-300"
                    : "text-ink-950 hover:text-brand-700",
                )}
              >
                <span className="font-display text-base font-semibold leading-snug sm:text-lg">
                  {item.question}
                </span>
                <m.span
                  aria-hidden="true"
                  animate={reduced ? undefined : { rotate: expanded ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                    isDark
                      ? "border-white/15 text-brand-300"
                      : "border-ink-200 text-brand-600",
                  )}
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                </m.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {expanded && (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p
                    className={cn(
                      "max-w-2xl pb-6 pr-10 text-sm leading-relaxed sm:text-[15px]",
                      isDark ? "text-ink-300" : "text-ink-600",
                    )}
                  >
                    {item.answer}
                  </p>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
