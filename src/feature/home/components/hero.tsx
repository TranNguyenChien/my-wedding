import Image from "next/image";
import { site } from "@/constants/site";
import { Reveal } from "@/components/motion/reveal";
import { format } from "date-fns/format";

const Hero: React.FC = () => {
  const ceremony = site.le_tan_hon_ceremony;

  return (
    <section className="relative h-[90svh] w-full overflow-hidden">
      <Image
        src="/images/gallery/CN0091.jpg"
        alt={`${site.bride.shortName} & ${site.groom.shortName}`}
        fill
        priority
        sizes="(min-width: 640px) 448px, 100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(61,5,12,0.9), rgba(61,5,12,0.15) 55%, transparent)",
        }}
      />

      <Reveal className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center px-6">
        <div className="relative flex flex-col items-center text-white">
          <span className="font-display text-6xl leading-[0.9] font-semibold tracking-wide uppercase sm:text-7xl">
            Save
          </span>
          <span className="font-script -my-2 text-4xl sm:text-5xl">the</span>
          <span className="font-display text-6xl leading-[0.9] font-semibold tracking-wide uppercase sm:text-7xl">
            Date
          </span>
        </div>
      </Reveal>

      <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-3 px-6 text-center text-white">
        <Reveal delay={0.1}>
          <h1 className="font-script text-5xl leading-tight sm:text-6xl">
            {site.groom.shortName} &amp;
            <br />
            {site.bride.shortName}
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="font-body text-xs tracking-[0.3em] text-white/80">
            {format(new Date(ceremony.dateTime), "dd.MM.yyyy")}
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;
