import { cn } from "../lib/utils";

type FeedbackQuoteProps = {
  content: string;
  authorName?: string | null;
  company?: string | null;
  className?: string;
};

export function FeedbackQuote({ content, authorName, company, className }: FeedbackQuoteProps) {
  const attribution = authorName && authorName.trim() ? authorName : null;

  return (
    <figure className={cn("rounded-xl border border-ink-100 bg-ink-50/60 p-4", className)}>
      <blockquote className="text-sm leading-relaxed text-ink-700">“{content}”</blockquote>
      <figcaption className="mt-3 text-xs font-semibold text-ink-900">
        {attribution ?? "Cliente"}
        {attribution && company && <span className="font-medium text-ink-500"> · {company}</span>}
      </figcaption>
    </figure>
  );
}