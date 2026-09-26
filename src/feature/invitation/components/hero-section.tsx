"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";
import { cn } from "@/lib/utils";
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

      if (!imageOnly) gsap.set("[data-hero-line]", { autoAlpha: 0, y: 28 });
      gsap.set("[data-hero-media]", { scale: 1.12 });
      gsap.to("[data-hero-media]", {
        yPercent: 10,
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
          duration: 2,
          ease: "power2.out",
        });
      if (!imageOnly) {
        intro.to(
          "[data-hero-line]",
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.14 },
          0.35,
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
        imageOnly ? `${content.firstName} & ${content.secondName}` : undefined
      }
      className={cn(
        "relative overflow-hidden bg-wine-dark",
        imageOnly ? "aspect-2/3" : "min-h-dvh max-h-225 text-[#fff8ec]",
      )}
    >
      <div data-hero-media className="absolute inset-0">
        <Image
          src={content.images.hero}
          alt={`${content.firstName} và ${content.secondName} trong ngày cưới`}
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
            className="absolute inset-0 bg-[linear-gradient(180deg,#2a04081f_0%,transparent_30%,transparent_48%,#2a0408b3_78%,#1f0306eb_100%)]"
          />

          <div className="absolute inset-x-6 bottom-28 z-5">
            <p
              data-hero-line
              className="font-text text-[11px] font-medium tracking-[0.3em] text-champagne uppercase"
            >
              {content.eventName}
            </p>
            <h1
              id="hero-title"
              className="mt-4 font-display text-[48px] leading-[0.95] font-light tracking-[-0.03em]"
            >
              <span data-hero-line className="block">
                {content.firstName}
              </span>
              <span data-hero-line className="block pb-1 pl-5 mt-4">
                <em className="pr-2 font-normal text-champagne">&amp;</em>
                {content.secondName}
              </span>
            </h1>
            <time
              data-hero-line
              dateTime={content.dateIso}
              className="nums mt-6 flex items-center gap-4 font-display text-[22px] leading-none italic text-[#f6e6cf]"
            >
              <span aria-hidden="true" className="h-px w-10 bg-champagne/60" />
              {content.dateShort}
            </time>
          </div>
        </>
      )}

      <Wave edge="bottom" fillClassName="fill-linen" className="h-[92px]" />
    </section>
  );
};

export default HeroSection;
