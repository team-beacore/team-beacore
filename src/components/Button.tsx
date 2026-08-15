import type { ReactNode } from "react";
import { cn } from "../lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:pointer-events-none disabled:opacity-60";

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98]",
  secondary:
    "border border-ink-200 bg-white text-ink-900 hover:border-brand-500 hover:text-brand-700 active:scale-[0.98]",
  light: "bg-white text-ink-950 hover:bg-brand-50 hover:text-brand-700 active:scale-[0.98]",
  "outline-light":
    "border border-white/25 text-white hover:border-white/60 hover:bg-white/5 active:scale-[0.98]",
  ghost: "text-ink-700 hover:text-brand-700",
} as const;

const sizes = {
  sm: "h-10 px-5 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-[15px]",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  type = "button",
  disabled,
  onClick,
  ariaLabel,
  className,
  children,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}