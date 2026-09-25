import { Reveal } from "@/components/motion/reveal";

const SWATCHES = [
  { name: "Ivory", className: "bg-ivory" },
  { name: "Burgundy", className: "bg-burgundy-700" },
  { name: "Gold", className: "bg-gold-400" },
  { name: "Beige", className: "bg-beige" },
  { name: "Deep Burgundy", className: "bg-burgundy-900" },
];

const Dresscode: React.FC = () => {
  return (
    <section className="flex w-full flex-col items-center gap-6 px-6 py-14 text-center">
      <Reveal>
        <h2 className="font-script text-4xl text-burgundy-700">Dresscode</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="font-body text-xs text-foreground/60">
          Gợi ý trang phục cùng tông với tiệc cưới
        </p>
      </Reveal>
      <Reveal delay={0.15} className="flex gap-4">
        {SWATCHES.map((s) => (
          <span
            key={s.name}
            title={s.name}
            className={`h-9 w-9 rounded-full border border-white shadow-sm ring-1 ring-black/5 ${s.className}`}
          />
        ))}
      </Reveal>
    </section>
  );
};

export default Dresscode;
