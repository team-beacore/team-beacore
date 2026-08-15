import { cn } from "../lib/utils";

const LOGO_SRC = "/logo.png";

type LogoProps = {
  size?: number;
  href?: string;
  className?: string;
};

export function Logo({ size, href, className }: LogoProps) {
  const img = (
    <img
      src={LOGO_SRC}
      alt="Beacore — Digital Engineering"
      width={2172}
      height={724}
      className={cn("h-auto w-auto select-none", className)}
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