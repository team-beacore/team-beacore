import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type SectionIntroProps = {
  /**
   * Rótulo curto acima do título. Opcional de propósito: só entra quando
   * acrescenta informação que o título não dá (na Home, quase nunca).
   */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
  /**
   * Escala do título. `xl` para os momentos que abrem um bloco da narrativa;
   * `md` para seções de apoio (FAQ, contato). A variação de escala — e não
   * um enfeite repetido — é o que diferencia as seções entre si.
   */
  size?: "md" | "lg" | "xl";
};

/** Abertura de seção da Home escura. O h2 recebe `id` para `aria-labelledby`. */
export function SectionIntro({
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
      {eyebrow && <p className="mb-5 text-sm font-medium text-brand-300">{eyebrow}</p>}
      <h2
        id={id}
        className={cn(
          "font-display font-semibold text-balance text-white",
          size === "xl" && "text-[2.5rem] leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.75rem]",
          size === "lg" && "text-[2.1rem] leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[3.4rem]",
          size === "md" && "text-3xl leading-[1.1] tracking-[-0.03em] sm:text-4xl",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
