"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
  REPLAY_TOGGLE_ACTIONS,
} from "@/components/motion/gsap-setup";
import { useInvitation } from "../invitation-context";
import HeartRule from "./ui/heart-rule";
import Wave from "./ui/wave";

/** Lời cảm ơn trên ảnh full-bleed, nối từ section Mừng cưới bằng đường cong. */
const EndingSection: React.FC = () => {
  const content = useInvitation();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        "[data-ending-media]",
        { yPercent: -8, scale: 1.1 },
        {
          yPercent: 8,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.from("[data-ending-copy] > *", {
        autoAlpha: 0,
        y: 20,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 65%",
          toggleActions: REPLAY_TOGGLE_ACTIONS,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-label="Lời cảm ơn"
      className="relative h-125 overflow-hidden bg-[#d3b28e] text-[#5d161b]"
    >
      <div data-ending-media className="absolute inset-0">
        <Image
          src={content.images.ending}
          alt={`${content.firstName} và ${content.secondName} bên nhau`}
          fill
          sizes="(min-width: 512px) 512px, 100vw"
          className="object-cover object-[35%_center] saturate-[.78] sepia-[.04]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0,#fff5e866_28%,#fff5e8e0_52%,#fff5e8f5_100%)]"
      />
      <Wave edge="top" fillClassName="fill-sand" className="z-3 h-21.25" />

      <div
        data-ending-copy
        className="absolute top-[52%] right-[4%] z-[4] w-[58%] -translate-y-1/2 text-center"
      >
        <p className="font-script text-[52px] leading-[0.82] text-wine">
          Cảm ơn bạn
        </p>
        <span className="mt-3 block font-text text-[12px] leading-[1.7] text-cocoa">
          đã dành thời gian và trở thành
          <br />
          một phần trong ngày đặc biệt
          <br />
          của chúng mình.
        </span>
        <HeartRule />
        <strong className="block font-display text-[19px] leading-[1.3] font-normal text-wine">
          {content.firstName} &amp; {content.secondName}
        </strong>
        <time
          dateTime={content.dateIso}
          className="mt-2.5 block font-text text-[10.5px] font-semibold tracking-[3px] text-wine"
        >
          {content.dateDots}
        </time>
      </div>
    </section>
  );
};

export default EndingSection;
