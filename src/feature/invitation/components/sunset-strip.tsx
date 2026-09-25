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

/** Dải ảnh ngang có parallax, chuyển tiếp giữa Love Story và Thông tin. */
const SunsetStrip: React.FC = () => {
  const content = useInvitation();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        "[data-strip-media]",
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.from("figcaption", {
        autoAlpha: 0,
        x: 30,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%", toggleActions: REPLAY_TOGGLE_ACTIONS },
      });
    },
    { scope: rootRef },
  );

  return (
    <figure ref={rootRef} className="relative h-[220px] overflow-hidden">
      <div data-strip-media className="absolute -inset-y-[15%] inset-x-0">
        <Image
          src={content.images.sunset}
          alt={`${content.groomName} và ${content.brideName} cùng bước về phía trước`}
          fill
          sizes="(min-width: 512px) 512px, 100vw"
          className="object-cover object-[center_35%] saturate-[.72] sepia-[.08]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,transparent_40%,#fff4df9e)]"
      />
      <figcaption className="absolute top-[28%] right-[6%] z-[2] -rotate-4 text-center font-script text-[24px] leading-[1.1] text-[#714b4b]">
        Và còn nhiều
        <br />
        điều tuyệt vời phía trước…
      </figcaption>
    </figure>
  );
};

export default SunsetStrip;
