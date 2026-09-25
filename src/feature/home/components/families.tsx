import { site } from "@/constants/site";
import { Reveal } from "@/components/motion/reveal";

const FamilyColumn: React.FC<{
  heading: string;
  father: string;
  mother: string;
  address: string;
}> = ({ heading, father, mother, address }) => (
  <div className="flex flex-1 flex-col items-center gap-2 text-center">
    <p className="font-body text-sm font-semibold tracking-[0.25em] text-burgundy-700">
      {heading}
    </p>
    <p className="font-body text-xs text-foreground/90">{father}</p>
    <p className="font-body text-xs text-foreground/90">{mother}</p>
    <p className="font-body text-xs text-foreground/60">{address}</p>
  </div>
);

const Families: React.FC = () => {
  return (
    <section className="w-full p-4">
      <Reveal className="flex items-start gap-1">
        <FamilyColumn
          heading={site.groomFamily.heading}
          father={site.groomFamily.father}
          mother={site.groomFamily.mother}
          address={site.groomFamily.address}
        />
        <div className="mt-1 h-24 w-px shrink-0 bg-gold-400/50" />
        <FamilyColumn
          heading={site.brideFamily.heading}
          father={site.brideFamily.father}
          mother={site.brideFamily.mother}
          address={site.brideFamily.address}
        />
      </Reveal>
    </section>
  );
};

export default Families;
