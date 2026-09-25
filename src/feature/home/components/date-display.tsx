import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { site } from "@/constants/site";

const PHOTOS = [
  {
    image: "/images/gallery/CN0204.jpg",
    date: "29",
  },
  {
    image: "/images/gallery/CN0259.jpg",
    date: "10",
  },
  {
    image: "/images/gallery/CN0285.jpg",
    date: "26",
  },
];

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

// October 2026: the 1st falls on Thursday (index 4, Sunday = 0).
const FIRST_WEEKDAY_INDEX = 4;
const DAYS_IN_MONTH = 31;

const HIGHLIGHT_DAYS = [Number(site.le_tan_hon_ceremony.dateTime.slice(8, 10))];

const cells: Array<number | null> = [
  ...Array.from({ length: FIRST_WEEKDAY_INDEX }, () => null),
  ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
];

const DateDisplay: React.FC = () => {
  return (
    <section className="flex w-full flex-col items-center gap-8 ">
      <Reveal className="flex gap-2 w-full justify-center">
        {PHOTOS.map((photo) => (
          <div
            key={photo.image}
            className="relative h-60 w-full overflow-hidden"
          >
            <Image src={photo.image} alt="" fill className="object-cover" />
            <span className="font-body absolute bottom-2 right-1 rounded-full text-7xl text-white">
              {photo.date}
            </span>
          </div>
        ))}
      </Reveal>

      <div className="relative w-full  p-4 col-span-2 bg-burgundy-700 bg-contain ">
        <div className="absolute size-full top-0 left-0 opacity-20">
          <Image src="/images/background/black-sand.png" alt="" fill />
        </div>
        <Reveal delay={0.2} className="relative z-10 overflow-hidden  pt-6">
          <p className="text-center font-script text-4xl leading-none text-white">
            Tháng 10
          </p>
          <p className="mb-4 mt-1 text-center font-body text-xs tracking-[0.4em] text-white">
            2026
          </p>

          <div className="grid grid-cols-7 gap-y-2.5 text-center font-body text-xs">
            {WEEKDAYS.map((d) => (
              <span key={d} className="font-medium tracking-wide text-white">
                {d}
              </span>
            ))}
            {cells.map((day, i) =>
              day === null ? (
                <span key={`blank-${i}`} />
              ) : (
                <span
                  key={day}
                  className={cn(
                    "relative mx-auto flex h-6 w-6 items-center justify-center rounded-full text-white",
                  )}
                >
                  {HIGHLIGHT_DAYS.includes(day) && (
                    <Image
                      src="/images/icons/ring.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="pointer-events-none absolute left-1/3 top-[52%] size-10 max-w-none -translate-x-1/2 -translate-y-1/2 motion-safe:animate-pulse -rotate-45"
                    />
                  )}
                  <span className="relative">{day}</span>
                </span>
              ),
            )}
          </div>
        </Reveal>
        <Reveal className="text-end pb-30 pr-6">
          <div className="inset-0 z-0 text-white text-4xl font-script pt-6">
            Save the date
          </div>
          <p className="font-script text-white text-6xl right-20 absolute pt-5">
            CN
          </p>
        </Reveal>
        <Reveal className="absolute w-33 h-46.25 bottom-40 right-0 z-10">
          <Image
            src="/images/background/quill-pen.png"
            alt=""
            fill
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
};

export default DateDisplay;
