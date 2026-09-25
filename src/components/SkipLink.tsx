type SkipLinkProps = {
  targetId: string;
  label?: string;
};

/**
 * Link de atalho para o conteúdo principal.
 * Invisível até receber foco pelo teclado (primeiro Tab da página).
 */
export function SkipLink({ targetId, label = "Pular para o conteúdo" }: SkipLinkProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    // Move o foco de fato — só o hash não reposiciona o foco do teclado.
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: "auto", block: "start" });
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:h-11 focus:items-center focus:rounded-full focus:bg-ink-950 focus:px-5 focus:text-sm focus:font-semibold focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-brand-500"
    >
      {label}
    </a>
  );
}
