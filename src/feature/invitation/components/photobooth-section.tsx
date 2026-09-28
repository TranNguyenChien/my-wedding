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
import SectionHeading from "./ui/section-heading";

/** Giấy in của từng dải, lặp lại theo vòng. */
const STRIP_STYLE = [
  { paper: "bg-[#fffaf3]", ink: "text-wine", photo: "" },
  {
    paper: "bg-[#f3e4d3]",
    ink: "text-wine-dark",
    photo: "grayscale-[.85] contrast-[1.05]",
  },
];

/**
 * Photobooth: lần đầu section vào khung nhìn, đèn flash chớp rồi từng dải ảnh
 * chạy thẳng xuống từ dưới thân máy (không nghiêng).
 */
const PhotoboothSection: React.FC = () => {
  const content = useInvitation();
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      const strips = gsap.utils.toArray<HTMLElement>("[data-strip]");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 70%",
            // Chạy đúng một lần: cuộn ra khỏi khung nhìn không reset/giật lại.
            once: true,
          },
        })
        .from("[data-machine]", {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .fromTo(
          "[data-led]",
          { backgroundColor: "#6b2a2f", boxShadow: "0 0 0 0 #efd4aa00" },
          {
            backgroundColor: "#f5d8a7",
            boxShadow: "0 0 10px 2px #efd4aa99",
            duration: 0.3,
          },
          "-=0.2",
        )
        .fromTo(
          "[data-flash]",
          { opacity: 0, scale: 0.4 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.12,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
          },
        )
        .fromTo(
          strips,
          { yPercent: -101, rotate: 0 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 3.2,
            stagger: 0.6,
            ease: "sine.inOut",
          },
          "+=0.1",
        );
    },
    { scope: stageRef },
  );

  return (
    <section
      aria-labelledby="photobooth-title"
      className="relative bg-linen px-6 pt-14 pb-12"
    >
      <SectionHeading
        script="Photobooth"
        title="NHỮNG KHOẢNH KHẮC"
        titleId="photobooth-title"
      />

      <div ref={stageRef} className="mt-10">
        {/* Thân máy: bảng tên, đèn báo, ống kính (kèm lớp flash) và khe in. */}
        <div
          data-machine
          className="relative z-2 mx-auto w-[92%] rounded-[26px] bg-linear-to-b from-wine-soft to-wine-dark p-1.5 shadow-[0_28px_44px_-22px_#4c080eaa]"
        >
          <div className="rounded-[21px] border border-champagne/25 px-5 pt-4 pb-3.5 shadow-[inset_0_1px_0_#ffffff1f]">
            <div className="flex items-center gap-3">
              <span
                data-led
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[#6b2a2f]"
              />
              <p className="font-text text-[10px] font-semibold tracking-[0.42em] text-champagne">
                PHOTO BOOTH
              </p>
              <span
                aria-hidden="true"
                className="relative ml-auto size-11 rounded-full bg-[#1a0104] shadow-[inset_0_0_0_3px_#efd4aa55,inset_0_0_0_7px_#1a0104,inset_0_0_0_8px_#efd4aa30,0_4px_10px_#00000059]"
              >
                <span className="absolute top-3 left-3 size-1.5 rounded-full bg-[#fff8ec]/70" />
                <span
                  data-flash
                  className="absolute -inset-4 rounded-full bg-[#fff8ec] opacity-0 blur-md"
                />
              </span>
            </div>

            <p className="mt-2 font-script text-[22px] leading-none text-champagne/80">
              Smile, {content.monogram.first} &amp; {content.monogram.second}
            </p>

            <span
              aria-hidden="true"
              className="mt-3.5 block h-3 rounded-full bg-[#1a0104] shadow-[inset_0_3px_5px_#000000cc,0_1px_0_#ffffff1a]"
            />
          </div>
        </div>

        {/* Cắt mép trên ngay dưới thân máy để dải ảnh không tràn lên phần phía trên khi chạy xuống. */}
        <div className="relative -mt-5 flex justify-center gap-5 overflow-hidden px-4 pt-0 pb-10">
          {content.photobooth.map((strip, s) => {
            const style = STRIP_STYLE[s % STRIP_STYLE.length];
            return (
              <figure
                key={s}
                data-strip
                className={cn(
                  "w-[40%] shrink-0 origin-top p-2 pt-4 shadow-[0_22px_34px_-18px_#4c080e73]",
                  style.paper,
                )}
              >
                <ul className="flex flex-col gap-2">
                  {strip.map((photo) => (
                    <li
                      key={photo.src}
                      className="relative aspect-4/5 overflow-hidden bg-sand"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 512px) 180px, 40vw"
                        className={cn(
                          "object-cover object-[center_30%]",
                          style.photo,
                        )}
                      />
                    </li>
                  ))}
                </ul>
                <figcaption className={cn("pt-3 pb-1 text-center", style.ink)}>
                  <span className="block font-script text-[24px] leading-none">
                    {content.monogram.first} &amp; {content.monogram.second}
                  </span>
                  <span className="mt-1.5 block font-text text-[8px] font-medium tracking-[0.3em] opacity-70">
                    {content.dateDots}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PhotoboothSection;
