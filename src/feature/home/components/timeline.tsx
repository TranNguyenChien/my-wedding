import Image from "next/image";
import { site } from "@/constants/site";
import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  { icon: "/images/anh_10.png", label: "Đón Dâu", time: null },
  { icon: "/images/anh_12.png", label: "Lễ Thành Hôn", time: null },
  {
    icon: "/images/icons/line.png",
    label: "Khai Tiệc",
    time: site.le_tan_hon_ceremony.time,
  },
  { icon: "/images/anh_14.png", label: "Ca Nhạc", time: null },
] as const;

const Timeline: React.FC = () => {
  return (
    <section className="w-full px-6 py-16">
      <Reveal className="mb-10 text-center">
        <h2 className="font-script text-4xl text-burgundy-700">Timeline</h2>
      </Reveal>

      <div className="relative mx-auto max-w-xs">
        <div className="absolute top-2 bottom-2 left-1/2 w-px -translate-x-1/2 bg-gold-400/50" />

        <ul className="flex flex-col gap-10">
          {STEPS.map((step, i) => {
            const alignEnd = i % 2 === 1;
            return (
              <Reveal key={step.label} delay={i * 0.08}>
                <li
                  className={`flex items-center gap-4 ${
                    alignEnd ? "flex-row-reverse text-right" : "text-left"
                  }`}
                >
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-400/60 bg-cream">
                    <Image
                      src={step.icon}
                      alt=""
                      width={26}
                      height={26}
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold tracking-widest text-burgundy-700">
                      {step.label}
                    </p>
                    {step.time && (
                      <p className="font-body text-xs text-foreground/60">
                        {step.time}
                      </p>
                    )}
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Timeline;
