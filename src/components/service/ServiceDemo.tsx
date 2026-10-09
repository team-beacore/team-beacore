import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/utils";

/**
 * Pequenas demonstrações visuais de cada solução — interfaces abstratas em
 * HTML/CSS/SVG, sem números, clientes ou resultados. Mostram O QUE a solução
 * é (uma página que se monta, dados que fluem entre sistemas), não prometem
 * nada sobre ela.
 *
 * Decorativas (aria-hidden): o texto do painel já descreve o serviço.
 * Com movimento reduzido, as animações param no estado legível.
 */

const bar = "rounded-full bg-white/15";
const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-night-950/80 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function BrowserBar() {
  return (
    <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-3 py-2.5">
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-brand-400/80" />
      <span className="ml-2 h-3.5 w-28 rounded-md bg-white/[0.06]" />
    </div>
  );
}

const rise = "animate-[demo-rise_5s_ease-out_infinite] motion-reduce:animate-none";

/** Criação de Sites: as seções de um site se montam em sequência. */
function SitesDemo() {
  return (
    <Frame>
      <BrowserBar />
      <div className="space-y-3 p-4">
        <div className={cn("flex items-center justify-between", rise)} style={delay(0)}>
          <span className="h-3 w-16 rounded bg-white/30" />
          <span className="flex gap-2">
            <span className={cn(bar, "h-2 w-8")} />
            <span className={cn(bar, "h-2 w-8")} />
            <span className="h-2 w-10 rounded-full bg-brand-400/70" />
          </span>
        </div>
        <div className={cn("rounded-xl border border-white/[0.07] bg-gradient-to-br from-brand-600/25 to-transparent p-4", rise)} style={delay(0.35)}>
          <span className="block h-3.5 w-3/4 rounded bg-white/50" />
          <span className="mt-2 block h-3.5 w-1/2 rounded bg-white/35" />
          <span className="mt-4 block h-6 w-24 rounded-full bg-white/85" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0.7, 0.9, 1.1].map((d) => (
            <div key={d} className={cn("rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5", rise)} style={delay(d)}>
              <span className="block h-5 w-5 rounded-md bg-brand-400/40" />
              <span className={cn(bar, "mt-2 block h-1.5 w-full")} />
              <span className={cn(bar, "mt-1 block h-1.5 w-2/3")} />
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/** Landing Pages: uma página, uma oferta, um botão — o cursor vai até ele. */
function LandingDemo() {
  return (
    <Frame>
      <BrowserBar />
      <div className="flex flex-col items-center px-6 pb-6 pt-5 text-center">
        <span className="h-2 w-16 rounded-full bg-brand-400/60" />
        <span className="mt-3 h-4 w-4/5 rounded bg-white/55" />
        <span className="mt-2 h-4 w-3/5 rounded bg-white/40" />
        <span className={cn(bar, "mt-4 h-2 w-2/3")} />
        <div className="mt-5 w-full max-w-[15rem] space-y-2">
          <span className="block h-7 rounded-lg border border-white/10 bg-white/[0.04]" />
          <span className="block h-7 rounded-lg border border-white/10 bg-white/[0.04]" />
          <span className="relative block">
            <span className="block h-8 animate-[demo-pulse_2.6s_ease-in-out_infinite] rounded-lg bg-brand-500 motion-reduce:animate-none" />
            {/* cursor */}
            <svg
              viewBox="0 0 16 16"
              className="absolute left-1/2 top-1/2 h-5 w-5 animate-[demo-cursor_2.6s_ease-in-out_infinite] text-white drop-shadow motion-reduce:hidden"
            >
              <path d="M2 1l11 6-5 1.4L6 14z" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>
    </Frame>
  );
}

/** Sistemas Web: painel com navegação e uma tabela sendo percorrida. */
function SystemsDemo() {
  return (
    <Frame className="flex">
      <div className="w-14 shrink-0 space-y-2.5 border-r border-white/[0.07] p-3">
        <span className="block h-5 w-5 rounded-md bg-brand-400/70" />
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn("block h-1.5 rounded-full", i === 1 ? "bg-white/50" : "bg-white/15")} />
        ))}
      </div>
      <div className="flex-1 p-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5">
              <span className={cn(bar, "block h-1.5 w-1/2")} />
              <span className={cn("mt-2 block h-3 rounded", i === 0 ? "w-2/3 bg-brand-300/70" : "w-1/2 bg-white/40")} />
            </div>
          ))}
        </div>
        <div className="relative mt-3 overflow-hidden rounded-lg border border-white/[0.07]">
          <span className="absolute inset-x-0 top-0 h-1/4 animate-[demo-scan_4s_ease-in-out_infinite] bg-brand-500/10 motion-reduce:hidden" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative flex items-center gap-3 border-b border-white/[0.05] px-3 py-2.5 last:border-0">
              <span className={cn("h-1.5 w-1.5 rounded-full", i % 2 ? "bg-white/30" : "bg-brand-400")} />
              <span className={cn(bar, "h-1.5 w-1/3")} />
              <span className={cn(bar, "ml-auto h-1.5 w-1/5")} />
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/** Automações: sistemas que não conversavam passam a trocar dados sozinhos. */
function AutomationDemo() {
  const path = "M60 60 C 140 60, 140 150, 220 150 S 300 60, 380 60";
  return (
    <Frame>
      <svg viewBox="0 0 440 210" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <path d={path} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="2" />
        <path
          d={path}
          fill="none"
          stroke="rgb(89 151 255)"
          strokeWidth="2"
          strokeDasharray="6 14"
          className="animate-[demo-flow_1.2s_linear_infinite] motion-reduce:animate-none"
        />
        {[
          [60, 60],
          [220, 150],
          [380, 60],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 34} y={y - 22} width="68" height="44" rx="12" fill="#0e1119" stroke={i === 1 ? "rgb(89 151 255 / 0.7)" : "rgb(255 255 255 / 0.15)"} />
            <rect x={x - 18} y={y - 6} width="36" height="5" rx="2.5" fill="rgb(255 255 255 / 0.35)" />
            <rect x={x - 18} y={y + 4} width="22" height="5" rx="2.5" fill="rgb(255 255 255 / 0.15)" />
          </g>
        ))}
        {/* pacotes percorrendo o fluxo (seguem o viewBox ao escalar) */}
        {[0, 0.9, 1.8].map((d) => (
          <circle key={d} r="4.5" fill="rgb(142 188 255)" className="motion-reduce:hidden">
            <animateMotion dur="2.7s" begin={`-${d}s`} repeatCount="indefinite" path={path} />
          </circle>
        ))}
      </svg>
    </Frame>
  );
}

/** E-commerce: um produto do catálogo vai para o carrinho. */
function StoreDemo() {
  return (
    <Frame>
      <BrowserBar />
      <div className="relative p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="h-3 w-16 rounded bg-white/30" />
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/15">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white/70" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 7h14l-1.5 10h-11z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-[demo-pulse_3s_ease-in-out_infinite] rounded-full bg-brand-400 motion-reduce:animate-none" />
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
              <span className={cn("block aspect-square rounded-md", i === 1 ? "bg-brand-500/40" : "bg-white/[0.07]")} />
              <span className={cn(bar, "mt-2 block h-1.5 w-3/4")} />
              <span className={cn(bar, "mt-1 block h-1.5 w-1/3")} />
            </div>
          ))}
        </div>
        {/* item "voando" para o carrinho */}
        <span
          className="absolute left-[calc(33%+1.6rem)] top-[3.6rem] h-10 w-10 animate-[demo-drop_3s_ease-in-out_infinite] rounded-md bg-brand-400/70 motion-reduce:hidden"
          style={{ "--dx": "calc(100% + 5.5rem)", "--dy": "-2.8rem" } as CSSProperties}
        />
      </div>
    </Frame>
  );
}

/** Produtos Digitais / MVP: módulos se empilham até a primeira versão. */
function ProductDemo() {
  const blocks = [
    { w: "w-full", d: 1.2, accent: true },
    { w: "w-11/12", d: 0.8 },
    { w: "w-10/12", d: 0.4 },
    { w: "w-9/12", d: 0 },
  ];
  return (
    <Frame className="flex items-end justify-center p-8">
      <div className="flex w-full max-w-[16rem] flex-col items-center gap-2">
        <span
          className="label-mono mb-2 animate-[demo-stack_5s_ease-out_infinite] rounded-full border border-brand-400/50 px-3 py-1 text-[10px] text-brand-200 motion-reduce:animate-none"
          style={delay(1.6)}
        >
          v1
        </span>
        {blocks.map((block, i) => (
          <span
            key={i}
            className={cn(
              "block h-9 animate-[demo-stack_5s_ease-out_infinite] rounded-xl border motion-reduce:animate-none",
              block.w,
              block.accent ? "border-brand-400/50 bg-brand-500/20" : "border-white/10 bg-white/[0.05]",
            )}
            style={delay(block.d)}
          />
        ))}
      </div>
    </Frame>
  );
}

const demos: Record<string, () => ReactNode> = {
  "criacao-de-sites": SitesDemo,
  "landing-pages": LandingDemo,
  "sistemas-web": SystemsDemo,
  automacoes: AutomationDemo,
  ecommerce: StoreDemo,
  "produtos-digitais": ProductDemo,
};

export function ServiceDemo({ serviceId, className }: { serviceId: string; className?: string }) {
  const Demo = demos[serviceId] ?? SitesDemo;
  return (
    <div aria-hidden="true" className={cn("h-full w-full", className)}>
      <Demo />
    </div>
  );
}
