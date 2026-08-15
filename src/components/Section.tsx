import type { ReactNode } from "react";
import { cn } from "../lib/utils";

type SectionProps = {
  id?: string;
  tone?: "white" | "neutral" | "dark";
  className?: string;
  containerClassName?: string;
  children: ReactNode;
};

const tones = {
  white: "bg-white",
  neutral: "bg-ink-50",
  dark: "bg-ink-950",
} as const;

export function Section({
  id,
  tone = "white",
  className,
  containerClassName,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-24", tones[tone], className)}>
      <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}