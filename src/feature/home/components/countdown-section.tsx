"use client";

import Image from "next/image";
import { site } from "@/constants/site";
import { useCountdown } from "@/hooks/use-count-down";

const UNITS: Array<{
  key: "days" | "hours" | "minutes" | "seconds";
  label: string;
}> = [
  { key: "days", label: "Ngày" },
  { key: "hours", label: "Giờ" },
  { key: "minutes", label: "Phút" },
  { key: "seconds", label: "Giây" },
];

const CountdownSection: React.FC = () => {
  const countdown = useCountdown(site.le_tan_hon_ceremony.dateTime);

  return (
    <section className="relative flex min-h-[70svh] w-full items-center justify-center overflow-hidden">
      <Image
        src="/images/gallery/TH_02374.jpg"
        alt=""
        fill
        sizes="(min-width: 640px) 448px, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-burgundy-900/55" />

      <div className="relative flex flex-col items-center gap-6 px-6 text-center text-white">
        <h2 className="font-script text-4xl">Countdown</h2>
        <div className="flex gap-3">
          {UNITS.map((unit) => (
            <div
              key={unit.key}
              className="flex w-16 flex-col items-center gap-1 rounded-xl border border-white/30 bg-white/10 py-3 backdrop-blur-sm"
            >
              <span className="font-time text-2xl">
                {countdown ? String(countdown[unit.key]).padStart(2, "0") : "--"}
              </span>
              <span className="font-body text-[10px] tracking-[0.2em] text-white/80">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
