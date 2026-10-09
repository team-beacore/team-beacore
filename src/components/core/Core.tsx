import { cn } from "../../lib/utils";

/**
 * CORE — mascote oficial da Beacore.
 *
 * As artes vivem em `public/core/`, recortadas da folha oficial de sprites
 * (ver `design/core/`). O personagem nunca é
 * redesenhado em código: este componente só posiciona a arte. Para trocar
 * uma pose, basta substituir o arquivo mantendo o nome.
 *
 * Quase sempre decorativo (aria-hidden): a função do Core é narrativa, e o
 * conteúdo que ele acompanha já está no texto ao lado.
 */

/**
 * Arquivo e dimensões intrínsecas (evitam CLS) de cada pose.
 *
 * Versão atual: moletom preto BEACORE. Recortadas da folha oficial
 * `design/core/core-sprite-sheet-v2.png` (1536×1024) com fundo transparente;
 * cada pose tem ~180×250 px — exibir até ~200 px de largura para não perder nitidez.
 */
const POSES = {
  waving: ["core-waving", 197, 250],
  mascot: ["core-mascot", 177, 247],
  pointing: ["core-pointing", 188, 241],
  "thumbs-up": ["core-thumbs-up", 173, 243],
  thinking: ["core-thinking", 162, 243],
  working: ["core-working", 194, 235],
  celebrating: ["core-celebrating", 206, 263],
  idea: ["core-idea", 202, 236],
  "face-normal": ["face-normal", 183, 162],
  "face-happy": ["face-happy", 184, 169],
  "face-surprised": ["face-surprised", 203, 171],
  "face-wink": ["face-wink", 189, 165],
  chart: ["core-chart", 279, 183],
  target: ["core-target", 297, 206],
  rocket: ["core-rocket", 196, 216],
  confused: ["core-confused", 187, 279],
  "face-determined": ["face-determined", 187, 162],
  "thinking-2": ["core-thinking-2", 184, 254],
  "face-curious": ["face-curious", 169, 241],
  presenting: ["core-presenting", 226, 246],
  security: ["core-security", 197, 239],
  search: ["core-search", 190, 248],
  megaphone: ["core-megaphone", 252, 251],
  heart: ["core-heart", 203, 239],
  sleep: ["core-sleep", 203, 236],
  peek: ["core-peek", 170, 240],
  amazed: ["core-amazed", 177, 242],
  calm: ["core-calm", 178, 244],
  ready: ["core-ready", 174, 242],
  "thumbs-up-2": ["core-thumbs-up-2", 177, 247],
  "celebrating-2": ["core-celebrating-2", 216, 264],
} as const satisfies Record<string, readonly [string, number, number]>;

export type CorePose = keyof typeof POSES;

export function coreSrc(pose: CorePose): string {
  return `/core/${POSES[pose][0]}.webp`;
}

type CoreProps = {
  pose: CorePose;
  className?: string;
  /** Texto alternativo. Vazio = decorativo. */
  alt?: string;
  priority?: boolean;
};

export function Core({ pose, className, alt = "", priority = false }: CoreProps) {
  const [, width, height] = POSES[pose];

  return (
    <img
      src={coreSrc(pose)}
      width={width}
      height={height}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      // `h-auto` só como padrão: viria depois no CSS e anularia um `h-*` passado.
      className={cn("pointer-events-none select-none", !/(^|\s|:)h-/.test(className ?? "") && "h-auto", className)}
    />
  );
}
