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
          alt={`${content.firstName} và ${content.secondName} cùng bước về phía trước`}
          fill
          sizes="(min-width: 512px) 512px, 100vw"
          className="object-cover object-[center_35%] saturate-[.72] sepia-[.08]"
        />
      </div>
      {/* Scrim kem đậm dần về mép phải để chữ script luôn đọc được trên nền voan/ảnh. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,transparent_42%,#fbf1e2b3_62%,#fbf1e2eb_100%)]"
      />
      <figcaption className="absolute top-1/2 right-[5%] z-[2] w-[42%] -translate-y-1/2 -rotate-4 pb-1 text-center font-script text-[22px] leading-[1.2] text-[#5a3434] [text-shadow:0_0_10px_#fbf1e2,0_0_2px_#fbf1e2] min-[400px]:text-[26px]">
        Và còn nhiều
        <br />
        điều tuyệt vời phía trước…
      </figcaption>
    </figure>
  );
};

export default SunsetStrip;
