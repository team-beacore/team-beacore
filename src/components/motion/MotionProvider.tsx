import type { ReactNode } from "react";
import { LazyMotion, domAnimation } from "motion/react";

/**
 * Pacote de features do Motion.
 *
 * `domAnimation` em vez do pacote completo: traz animação, gestos e variantes,
 * mas não layout animations — que custam bem mais. Por isso nenhum componente
 * do projeto usa `layout`/`layoutId`.
 *
 * Por que estático e não `import()`: o Motion emite o estado inicial
 * (`opacity: 0`) já no HTML pré-renderizado. Se as features viessem em um chunk
 * separado e esse chunk falhasse, o conteúdo ficaria invisível de forma
 * permanente. Mantendo-as no chunk principal, o único cenário de falha é "o JS
 * não carregou" — que já é coberto pelo override em <noscript> no index.html.
 * A economia do carregamento dinâmico media 2,5 kB gzip; não compensa o risco.
 *
 * `strict` faz o build falhar se alguém usar `motion.*` em vez de `m.*`, o que
 * anularia o recorte acima trazendo a biblioteca inteira de volta.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
