import type { TeamMember } from "../data/team";
import { ArrowUpRightIcon, GitHubIcon, LinkedInIcon, WhatsAppIcon } from "../lib/icons";
import { cn, initialsOf } from "../lib/utils";

type TeamCardProps = {
  member: TeamMember;
};

export function TeamCard({ member }: TeamCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-glow">
      <div className="relative aspect-square overflow-hidden bg-ink-950">
        {member.photo ? (
          <img
            src={member.photo}
            alt={`Foto de ${member.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="absolute inset-0 bg-grid-dark opacity-[0.07]" aria-hidden="true" />
            <span className="font-display text-5xl font-bold tracking-tight text-white/15">
              {initialsOf(member.name)}
            </span>
            <span className="absolute left-3 top-3 rounded-md border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
              Demo
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-ink-950">{member.name}</h3>
        <p className="mt-0.5 text-sm font-semibold text-brand-600">{member.role}</p>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-500">{member.description}</p>

        <div className="mt-4 flex items-center gap-2 border-t border-ink-100 pt-4">
          {member.whatsapp && (
            <a
              href={`https://wa.me/${member.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp de ${member.name}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-100 text-ink-500 transition-colors hover:border-brand-500 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`GitHub de ${member.name}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-100 text-ink-500 transition-colors hover:border-brand-500 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`LinkedIn de ${member.name}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-100 text-ink-500 transition-colors hover:border-brand-500 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
          )}
          {member.portfolio && (
            <a
              href={member.portfolio}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700",
                "transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
              )}
            >
              Portfólio
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}