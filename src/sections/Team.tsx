import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { SectionHeading } from "../components/SectionHeading";
import { TeamCard } from "../components/TeamCard";
import { team } from "../data/team";

export function Team() {
  return (
    <Section id="equipe">
      <div className="py-20 sm:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Equipe"
          title="Por trás dos projetos."
          description="Uma equipe pequena, multidisciplinar e apaixonada por tecnologia."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {team.map((member, index) => (
            <Reveal key={member.id} delay={(index % 4) * 80}>
              <TeamCard member={member} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}