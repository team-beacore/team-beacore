import { Link } from "react-router-dom";
import { ChevronRightIcon } from "../lib/icons";

export type Crumb = {
  label: string;
  href?: string;
};

/**
 * Trilha de navegação das páginas internas.
 * O último item não é link e recebe aria-current="page".
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500 sm:text-[13px]">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  to={item.href}
                  className="transition-colors hover:text-brand-700 hover:underline underline-offset-4"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-ink-700">
                  {item.label}
                </span>
              )}
              {!last && (
                <ChevronRightIcon aria-hidden="true" className="h-3.5 w-3.5 text-ink-300" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
