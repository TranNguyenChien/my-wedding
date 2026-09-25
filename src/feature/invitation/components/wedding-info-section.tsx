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
import { Reveal } from "@/components/motion/reveal";
import type { ScheduleKey } from "../types";
import { useInvitation } from "../invitation-context";
import HeartRule from "./ui/heart-rule";
import SectionHeading from "./ui/section-heading";

const ICONS: Record<ScheduleKey, React.ReactNode> = {
  ceremony: (
    <>
      <circle cx="19" cy="26" r="10" />
      <circle cx="30" cy="26" r="10" />
      <path d="m15 12 4-5 4 5m3 0 4-5 4 5" />
    </>
  ),
  reception: (
    <path d="M11 9h11l-2 12c-.7 4-7.5 4-8.2 0L11 9Zm15 0h11l-1.2 12c-.7 4-7.5 4-8.2 0L26 9ZM16 25v12m16-12v12M10 40h12m4 0h12" />
  ),
  date: (
    <>
      <rect x="8" y="11" width="32" height="29" rx="2" />
      <path d="M8 19h32M16 7v8m16-8v8M15 26h4m6 0h4m6 0h1M15 33h4m6 0h4" />
    </>
  ),
};

/** Giờ lễ / tiệc / ngày cưới + ảnh địa điểm với nút xem bản đồ. */
const WeddingInfoSection: React.FC = () => {
  const content = useInvitation();
  const cardsRef = useRef<HTMLDivElement>(null);
  const venueRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap.from("[data-info-card]", {
        autoAlpha: 0,
        x: -24,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: cardsRef.current, start: "top 85%", toggleActions: REPLAY_TOGGLE_ACTIONS },
      });
      gsap.from("[data-info-icon]", {
        scale: 0.4,
        rotate: -20,
        duration: 0.9,
        ease: "back.out(2)",
        stagger: 0.12,
        scrollTrigger: { trigger: cardsRef.current, start: "top 85%", toggleActions: REPLAY_TOGGLE_ACTIONS },
      });
    },
    { scope: cardsRef },
  );

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        "[data-venue-media]",
        { scale: 1.15, yPercent: -6 },
        {
          scale: 1,
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: venueRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.from("[data-venue-copy] > *", {
        autoAlpha: 0,
        y: 22,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: venueRef.current, start: "top 70%", toggleActions: REPLAY_TOGGLE_ACTIONS },
      });
    },
    { scope: venueRef },
  );

  return (
    <section
      id="thong-tin"
      aria-labelledby="info-title"
      className="relative bg-linen pt-[62px]"
    >
      <div className="px-[4%]">
        <Reveal>
          <SectionHeading script="Thông tin" title="NGÀY CƯỚI" titleId="info-title">
            Chúng mình rất mong được đón tiếp những người
            <br />
            thân yêu trong ngày trọng đại này!
          </SectionHeading>
        </Reveal>

        <div ref={cardsRef} className="relative z-[3] mt-7 mb-10 grid gap-2">
          {content.schedule.map((item) => (
            <article
              key={item.key}
              data-info-card
              className="grid min-h-[115px] grid-cols-[55px_1fr] content-center rounded-[14px] border border-[#8b3834]/10 bg-[linear-gradient(145deg,#fffaf3,#f8eee4)] px-3.5 py-4"
            >
              <svg
                data-info-icon
                viewBox="0 0 48 48"
                aria-hidden="true"
                className="row-span-3 size-[34px] self-center fill-none stroke-wine stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round]"
              >
                {ICONS[item.key]}
              </svg>
              <small className="self-end font-text text-[9px] font-medium tracking-[3px] text-[#8e4b49]">
                {item.label}
              </small>
              <strong className="mt-2 font-display text-[27px] leading-none font-normal text-wine">
                {item.value}
              </strong>
              {item.note && (
                <p className="mt-1.5 font-text text-[10px] leading-[1.4] font-light text-taupe">
                  {item.note}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>

      <div ref={venueRef} className="relative h-[470px] overflow-hidden">
        <div data-venue-media className="absolute inset-0">
          <Image
            src={content.images.venue}
            alt={`Không gian ${content.venue.name}`}
            fill
            sizes="(min-width: 512px) 512px, 100vw"
            className="object-cover object-[58%_center] saturate-[.9]"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,#fffaf4e6_0,#fffaf48c_46%,transparent_80%)]"
        />
        <div
          data-venue-copy
          className="absolute top-1/2 left-[6%] z-[3] w-[56%] -translate-y-1/2"
        >
          <p className="font-script text-[48px] leading-[0.82] text-bronze">
            Địa điểm
          </p>
          <h2 className="font-display text-[32px] leading-none text-wine">
            TỔ CHỨC
          </h2>
          <HeartRule align="start" />
          <h3 className="mb-3 font-display text-[20px] leading-[1.25] text-wine">
            {content.venue.name}
          </h3>
          <address className="font-text text-[10px] leading-[1.7] font-light text-taupe not-italic">
            ● &nbsp;{content.venue.address}
          </address>
          <a
            href={content.venue.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full bg-wine px-[18px] py-3 font-text text-[8px] font-medium tracking-[1.5px] text-white transition-transform duration-300 hover:-translate-y-0.5"
          >
            Xem bản đồ &nbsp; ⟶
          </a>
        </div>
      </div>
    </section>
  );
};

export default WeddingInfoSection;
