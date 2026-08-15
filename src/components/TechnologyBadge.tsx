import { cn } from "../lib/utils";

type TechnologyBadgeProps = {
  name: string;
  className?: string;
};

export function TechnologyBadge({ name, className }: TechnologyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-ink-100 bg-ink-50 px-2 py-0.5 font-mono text-[11px] text-ink-600",
        className,
      )}
    >
      {name}
    </span>
  );
}