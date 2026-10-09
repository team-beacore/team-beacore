import { cn } from "../../lib/utils";

/**
 * CORE — mascote oficial da Beacore.
 *
 * As artes vivem em `public/core/` com os nomes oficiais da folha de sprites
 * (recortes com transparência fornecidos pela equipe). O personagem nunca é
 * redesenhado em código: este componente só posiciona a arte. Para trocar
 * uma pose, basta substituir o arquivo mantendo o nome.
 *
 * Quase sempre decorativo (aria-hidden): a função do Core é narrativa, e o
 * conteúdo que ele acompanha já está no texto ao lado.
 */

/** Arquivo e dimensões intrínsecas (evitam CLS) de cada pose. */
const POSES = {
  mascot: ["core-mascot", 356, 452],
  waving: ["core-waving", 354, 446],
  pointing: ["core-pointing", 372, 438],
  "thumbs-up": ["core-thumbs-up", 336, 442],
  thinking: ["core-thinking", 304, 452],
  working: ["core-working", 364, 442],
  celebrating: ["core-celebrating", 404, 456],
  idea: ["core-idea", 386, 438],
  laptop: ["core-laptop", 362, 328],
  chart: ["core-chart", 366, 340],
  target: ["core-target", 460, 356],
  rocket: ["core-rocket", 330, 386],
  confused: ["core-confused", 360, 470],
  security: ["core-security", 352, 404],
  search: ["core-search", 342, 434],
  megaphone: ["core-megaphone", 446, 432],
  heart: ["core-heart", 348, 402],
  sleep: ["core-sleep", 392, 412],
  peek: ["core-peek", 314, 386],
  amazed: ["core-amazed", 330, 424],
  calm: ["core-calm", 312, 412],
  ready: ["core-ready", 316, 430],
  "thumbs-up-2": ["core-thumbs-up-2", 324, 438],
  "celebrating-2": ["core-celebrating-2", 398, 462],
  "face-normal": ["face-normal", 352, 276],
  "face-happy": ["face-happy", 352, 274],
  "face-surprised": ["face-surprised", 352, 276],
  "face-wink": ["face-wink", 358, 284],
  "face-determined": ["face-determined", 358, 300],
  "face-thinking": ["face-thinking", 354, 426],
  "face-curious": ["face-curious", 348, 420],
  "face-confused": ["face-confused", 324, 404],
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
      className={cn("pointer-events-none h-auto select-none", className)}
    />
  );
}
