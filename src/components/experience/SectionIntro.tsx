import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type SectionIntroProps = {
  /** Índice narrativo ("02"). */
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
  /** Tamanho do título: `xl` para momentos de abertura. */
  size?: "lg" | "xl";
};

/**
 * Abertura de seção da Home escura.
 *
 * O índice ("02 —") costura as seções como capítulos de uma mesma história,
 * em vez de blocos independentes. O h2 recebe `id` para `aria-labelledby`.
 */
export function SectionIntro({
  index,
  eyebrow,
  title,
  description,
  id,
  align = "left",
  className,
  size = "lg",
}: SectionIntroProps) {
  const centered = align === "center";

  return (
    <div className={cn(centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}>
      <p
        className={cn(
          "label-mono flex items-center gap-3 text-ink-400",
          centered && "justify-center",
        )}
      >
        {index && (
          <>
            <span className="text-brand-400">{index}</span>
            <span aria-hidden="true" className="h-px w-8 bg-white/20" />
          </>
        )}
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          "mt-5 pb-[0.1em] font-display font-semibold tracking-[-0.035em] text-balance text-silver",
          size === "xl"
            ? "text-[2.4rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem]"
            : "text-[2.1rem] leading-[1.05] sm:text-5xl lg:text-[3.5rem]",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 max-w-xl text-base leading-relaxed text-ink-400 sm:text-lg",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
