import type { Service } from "../data/services";
import {
  BagIcon,
  BotIcon,
  CodeIcon,
  CubesIcon,
  GlobeIcon,
  MonitorIcon,
  SlidersIcon,
  TargetIcon,
} from "../lib/icons";
import { cn } from "../lib/utils";

const iconMap = {
  globe: GlobeIcon,
  target: TargetIcon,
  code: CodeIcon,
  monitor: MonitorIcon,
  bot: BotIcon,
  cubes: CubesIcon,
  bag: BagIcon,
  sliders: SlidersIcon,
} as const;

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon];

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow sm:p-8",
        service.featured
          ? "border-brand-200 bg-brand-50/50 hover:border-brand-400 hover:bg-brand-50/80"
          : "border-ink-100 bg-white hover:border-brand-300",
      )}
    >
      <div
        className={cn(
          "mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300 group-hover:border-brand-500/40 group-hover:bg-brand-50 group-hover:text-brand-600",
          service.featured
            ? "border-brand-200 bg-brand-100/70 text-brand-700"
            : "border-ink-100 bg-ink-50 text-ink-600",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-950">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">{service.description}</p>
    </article>
  );
}