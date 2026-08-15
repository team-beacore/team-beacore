import { cn } from "../lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const isDark = tone === "dark";
  const isCentered = align === "center";

  return (
    <div className={cn(isCentered ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]",
            isDark ? "text-brand-400" : "text-brand-600",
            isCentered && "justify-center",
          )}
        >
          <span aria-hidden="true" className={cn("h-px w-6", isDark ? "bg-brand-400/70" : "bg-brand-500/70")} />
          {eyebrow}
          {isCentered && (
            <span aria-hidden="true" className={cn("h-px w-6", isDark ? "bg-brand-400/70" : "bg-brand-500/70")} />
          )}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          isDark ? "text-white" : "text-ink-950",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed lg:text-lg", isDark ? "text-ink-300" : "text-ink-500")}>
          {description}
        </p>
      )}
    </div>
  );
}