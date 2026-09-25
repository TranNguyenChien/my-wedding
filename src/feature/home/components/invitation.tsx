import { site } from "@/constants/site";
import { Reveal } from "@/components/motion/reveal";
import { format } from "date-fns";

const Invitation: React.FC = () => {
  const ceremony = site.le_tan_hon_ceremony;
  const mapsQuery = encodeURIComponent(
    `${ceremony.venueName}, ${ceremony.venueAddress}`,
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <section className="flex w-full flex-col items-center gap-5 px-4 text-center">
      <Reveal>
        <p className="font-body text-xs tracking-[0.35em] text-burgundy-600">
          TRÂN TRỌNG KÍNH MỜI
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="font-body text-sm text-foreground/80">
          Tham dự buổi tiệc cùng gia đình chúng tôi
        </p>
      </Reveal>

      <Reveal delay={0.1} className="flex flex-col items-center gap-1">
        <h2 className="font-script text-4xl text-burgundy-700">
          {site.groom.fullName}
        </h2>
        <span className="font-display text-base text-gold-500">&amp;</span>
        <h2 className="font-script text-4xl text-burgundy-700">
          {site.bride.fullName}
        </h2>
      </Reveal>

      <Reveal
        delay={0.15}
        className="flex w-full max-w-sm flex-col items-center gap-3 py-2"
      >
        <p className="font-time text-2xl font-bold tracking-wide text-burgundy-700 uppercase">
          {ceremony.weekday}
        </p>
        <div className="flex w-full items-center justify-center gap-4">
          <span className="flex-1 border-y border-burgundy-700/70 py-1.5 font-time text-sm font-bold tracking-wider text-burgundy-700">
            THÁNG {format(ceremony.dateTime, "M")}
          </span>
          <span className="font-time text-5xl font-bold pb-3 text-burgundy-700">
            {format(ceremony.dateTime, "dd")}
          </span>
          <span className="flex-1 border-y border-burgundy-700/70 py-1.5 font-time text-sm font-bold tracking-wider text-burgundy-700">
            NĂM {format(ceremony.dateTime, "yyyy")}
          </span>
        </div>
        <p className="font-time text-sm italic text-burgundy-700">
          ( {ceremony.lunarDate} )
        </p>
      </Reveal>

      <Reveal delay={0.2} className="flex flex-col items-center gap-1">
        <p className="font-body text-sm font-medium text-foreground/90">
          {ceremony.venueName}
        </p>
        <p className="font-body text-xs text-foreground/60">
          {ceremony.venueAddress}
        </p>
        <p className="font-body text-xs text-foreground/60">
          lúc {ceremony.time}
        </p>
      </Reveal>

      <Reveal delay={0.25}>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block rounded-full border border-burgundy-700 px-8 py-2.5 font-body text-xs tracking-[0.2em] text-burgundy-700 transition-colors hover:bg-burgundy-700 hover:text-white"
        >
          CHỈ ĐƯỜNG
        </a>
      </Reveal>
    </section>
  );
};

export default Invitation;
