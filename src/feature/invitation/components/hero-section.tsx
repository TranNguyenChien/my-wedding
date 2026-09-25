"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";
import { useInvitation } from "../invitation-context";
import Wave from "./ui/wave";

interface HeroSectionProps {
  /** Hero nằm dưới màn thư, nên chỉ chạy intro khi thư đã được mở. */
  isOpen: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isOpen }) => {
  const content = useInvitation();
  const imageOnly = content.heroImageOnly ?? false;
  const rootRef = useRef<HTMLElement>(null);

  // Ẩn chữ trước khi mở thư + parallax ảnh khi cuộn.
  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      if (!imageOnly) gsap.set("[data-hero-line]", { autoAlpha: 0, y: 24 });
      gsap.set("[data-hero-media]", { scale: 1.12 });
      gsap.to("[data-hero-media]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (!isOpen || prefersReducedMotion()) return;

      const intro = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to("[data-hero-media]", {
          scale: 1,
          duration: 1.8,
          ease: "power2.out",
        });
      if (!imageOnly) {
        intro.to(
          "[data-hero-line]",
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 },
          0.25,
        );
      }
    },
    { scope: rootRef, dependencies: [isOpen, imageOnly] },
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby={imageOnly ? undefined : "hero-title"}
      aria-label={
        imageOnly ? `${content.groomName} & ${content.brideName}` : undefined
      }
      className="relative h-152.5 overflow-hidden bg-[#d8b99f] text-[#5f1219]"
    >
      <div data-hero-media className="absolute inset-0">
        <Image
          src={content.images.hero}
          alt={`${content.groomName} và ${content.brideName} trong ngày cưới`}
          fill
          preload
          sizes="(min-width: 512px) 512px, 100vw"
          className="object-cover object-[58%_center]"
        />
      </div>
      {!imageOnly && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,#f3dfcbd9_0,#f3dfcb80_45%,transparent_80%),linear-gradient(180deg,transparent_60%,#400a102e)]"
          />

          <div className="absolute top-[10%] left-[7%] z-3 w-[62%]">
            <p
              data-hero-line
              className="font-text text-[8px] font-medium tracking-[4px]"
            >
              THE WEDDING OF
            </p>
            <h1
              id="hero-title"
              className="mt-3.5 mb-3.5 font-display text-[32px] leading-[1.08] tracking-[-1px]"
            >
              <span data-hero-line className="block uppercase">
                {content.groomName}
              </span>
              <i data-hero-line className="ml-1 block text-[0.7em] leading-[1.05]">
                &amp;
              </i>
              <span data-hero-line className="block uppercase">
                {content.brideName}
              </span>
            </h1>
            <time
              data-hero-line
              dateTime={content.dateIso}
              className="block font-text text-[10px] font-medium tracking-[4px]"
            >
              {content.dateDots}
            </time>
          </div>
        </>
      )}

      <Wave edge="bottom" fillClassName="fill-linen" className="h-[92px]" />
    </section>
  );
};

export default HeroSection;
