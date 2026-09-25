"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
  REPLAY_TOGGLE_ACTIONS,
} from "@/components/motion/gsap-setup";
import { useCountdown } from "@/hooks/use-count-down";
import { useInvitation } from "../invitation-context";
import HeartRule from "./ui/heart-rule";

const UNITS = [
  { key: "days", label: "Ngày" },
  { key: "hours", label: "Giờ" },
  { key: "minutes", label: "Phút" },
  { key: "seconds", label: "Giây" },
] as const;

const pad = (value: number | undefined) =>
  value === undefined ? "00" : String(value).padStart(2, "0");

const CountdownSection: React.FC = () => {
  const content = useInvitation();
  const rootRef = useRef<HTMLElement>(null);
  const countdown = useCountdown(content.countdownTarget);

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap
        .timeline({
          scrollTrigger: { trigger: rootRef.current, start: "top 78%", toggleActions: REPLAY_TOGGLE_ACTIONS },
          defaults: { ease: "power3.out" },
        })
        .from("[data-countdown-head] > *", { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.1 })
        .from(
          "[data-countdown-cell]",
          { autoAlpha: 0, y: 30, rotateX: -70, duration: 0.8, stagger: 0.1 },
          0.3,
        );
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="countdown-title"
      className="relative overflow-hidden bg-wine px-[3%] pt-[49px] pb-[55px] text-center text-[#fff8ec]"
    >
      <div data-countdown-head>
        <p className="font-script text-[48px] leading-[0.82] text-[#f2cfba]">
          Đếm ngược
        </p>
        <h2
          id="countdown-title"
          className="mt-2 font-display text-[27px] leading-none tracking-[1px]"
        >
          ĐẾN NGÀY CƯỚI
        </h2>
        <HeartRule tone="light" />
      </div>

      <div
        className="relative z-[3] mx-auto mt-4 grid w-full max-w-[600px] grid-cols-4 perspective-[600px]"
      >
        {UNITS.map((unit) => (
          <div
            key={unit.key}
            data-countdown-cell
            className="border-r border-[#f2dec2]/50 px-1 py-2 last:border-r-0"
          >
            <strong className="block font-time text-[34px] leading-none font-normal tabular-nums">
              {pad(countdown?.[unit.key])}
            </strong>
            <span className="mt-2 block font-text text-[10px] leading-none font-light text-[#f0d7c9]">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CountdownSection;
