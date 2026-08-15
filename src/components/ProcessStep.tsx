type ProcessStepProps = {
  number: string;
  title: string;
  description: string;
};

export function ProcessStep({ number, title, description }: ProcessStepProps) {
  return (
    <div className="flex items-start gap-5 lg:flex-col lg:gap-6">
      <span className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-ink-900 font-display text-sm font-bold text-brand-400">
        {number}
      </span>
      <div>
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-ink-400">{description}</p>
      </div>
    </div>
  );
}