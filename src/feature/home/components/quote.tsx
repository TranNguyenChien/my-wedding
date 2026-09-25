import { site } from "@/constants/site";
import { Reveal } from "@/components/motion/reveal";
import Image from "next/image";

const Quote: React.FC = () => {
  return (
    <section className="flex w-full flex-col items-center gap-6 px-8 text-center pt-4">
      <Reveal className="relative flex items-center justify-center">
        <h2 className="font-display text-8xl font-medium text-burgundy-700 absolute -top-10 -left-8">
          {site.groom.name.charAt(0)}
        </h2>
        <Image src="/images/anh_06.png" alt="Heart" width={64} height={64} />
        <span className="font-display text-8xl font-medium text-burgundy-700 absolute -bottom-12 -right-10">
          {site.bride.name.charAt(0)}
        </span>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="font-display text-lg leading-relaxed text-foreground/80 italic mt-10 text-shadow-2xs">
          We step into a new chapter together, hand in hand, ready to build our
          home and embrace a lifetime of love.
        </p>
      </Reveal>
    </section>
  );
};

export default Quote;
