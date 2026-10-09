import { cn } from "../lib/utils";

const LOGO_SRC = "/logo.png";
/** Versão para fundos escuros: wordmark branco, chevron no azul da marca. */
const LOGO_LIGHT_SRC = "/logo-light.png";

type LogoProps = {
  size?: number;
  href?: string;
  className?: string;
  /** `light` = wordmark claro, para fundos escuros. */
  tone?: "dark" | "light";
};

export function Logo({ size, href, className, tone = "dark" }: LogoProps) {
  const img = (
    <img
      src={tone === "light" ? LOGO_LIGHT_SRC : LOGO_SRC}
      alt="Beacore — Digital Engineering"
      width={480}
      height={160}
      fetchPriority="high"
      decoding="async"
      className={cn("h-auto select-none", className)}
      style={size ? { height: size } : undefined}
    />
  );

  if (!href) return img;

  return (
    <a href={href} aria-label="Beacore — Início" className="inline-flex items-center">
      {img}
    </a>
  );
}