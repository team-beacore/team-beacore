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

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  tabIndex?: number;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps & {
  /** Presente = navegação, renderiza <a>. Ausente = ação, renderiza <button>. */
  href: string;
  external?: boolean;
  type?: never;
};

type ActionProps = CommonProps & {
  href?: undefined;
  external?: never;
  type?: "button" | "submit";
};

type ButtonProps = LinkProps | ActionProps;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    disabled = false,
    onClick,
    ariaLabel,
    tabIndex,
    className,
    children,
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    // Um <a> desabilitado não existe em HTML. Para manter a semântica correta e
    // continuar impedindo a navegação, o link vira um link inerte, anunciado como
    // desabilitado e removido da ordem de tabulação.
    return (
      <a
        href={disabled ? undefined : props.href}
        role={disabled ? "link" : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndex}
        className={cn(classes, disabled && "pointer-events-none opacity-60")}
        onClick={disabled ? undefined : onClick}
        aria-label={ariaLabel}
        {...(props.external && !disabled ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
