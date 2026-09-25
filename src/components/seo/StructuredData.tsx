type StructuredDataProps = {
  /** Objeto JSON-LD já montado (ver src/config/structuredData.ts). */
  data: unknown;
};

/**
 * Renderiza JSON-LD dentro da árvore React, para que ele apareça tanto no HTML
 * estático gerado no build quanto após navegação client-side.
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      // O conteúdo é gerado internamente a partir de `src/config`, nunca de entrada do usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
