"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Check, Copy, MapPin } from "@phosphor-icons/react/ssr";
import { useGSAP } from "@gsap/react";
import {
  getDate,
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
  parseISO,
  startOfMonth,
} from "date-fns";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
  REPLAY_TOGGLE_ACTIONS,
} from "@/components/motion/gsap-setup";
import { Reveal } from "@/components/motion/reveal";
import { useInvitation } from "../invitation-context";
import HeartRule from "./ui/heart-rule";
import SectionHeading from "./ui/section-heading";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/** Ô lịch của tháng cưới, tuần bắt đầu từ Thứ Hai; `null` là ô trống đầu tháng. */
const buildMonth = (date: Date): (number | null)[] => {
  const leading = (getDay(startOfMonth(date)) + 6) % 7;
  return [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: getDaysInMonth(date) }, (_, i) => i + 1),
  ];
};

/** Ngày cưới (số lớn + lịch tháng + giờ lễ / tiệc) và địa điểm (ảnh khung vòm + thẻ địa chỉ). */
const WeddingInfoSection: React.FC = () => {
  const content = useInvitation();
  const dateRef = useRef<HTMLDivElement>(null);
  const venueRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(content.venue.address);
      setCopied(true);
    } catch {
      // Trình duyệt chặn clipboard: khách vẫn còn nút bản đồ.
    }
  };

  const weddingDate = parseISO(content.dateIso);
  const day = getDate(weddingDate);
  const month = getMonth(weddingDate) + 1;
  const year = getYear(weddingDate);
  const cells = buildMonth(weddingDate);
  const dateItem = content.schedule.find((item) => item.key === "date");
  const times = content.schedule.filter((item) => item.key !== "date");

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: dateRef.current,
            start: "top 80%",
            toggleActions: REPLAY_TOGGLE_ACTIONS,
          },
          defaults: { ease: "power3.out" },
        })
        .from("[data-date-side]", {
          autoAlpha: 0,
          x: (i) => (i === 0 ? 20 : -20),
          duration: 0.8,
        })
        .from(
          "[data-date-day]",
          { autoAlpha: 0, scale: 0.7, duration: 0.9, ease: "back.out(1.6)" },
          0,
        )
        .from("[data-date-note]", { autoAlpha: 0, y: 12, duration: 0.6 }, 0.35);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-calendar]",
            start: "top 82%",
            toggleActions: REPLAY_TOGGLE_ACTIONS,
          },
        })
        .from("[data-calendar]", {
          autoAlpha: 0,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          "[data-calendar-cell]",
          {
            autoAlpha: 0,
            y: 6,
            duration: 0.4,
            stagger: 0.012,
            ease: "power2.out",
          },
          0.2,
        )
        .from(
          "[data-wedding-mark]",
          { scale: 0, duration: 0.7, ease: "back.out(2.4)" },
          "-=0.1",
        );

      gsap.from("[data-time]", {
        autoAlpha: 0,
        y: 22,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: "[data-times]",
          start: "top 88%",
          toggleActions: REPLAY_TOGGLE_ACTIONS,
        },
      });
    },
    { scope: dateRef },
  );

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        "[data-venue-media]",
        { scale: 1.18, yPercent: -5 },
        {
          scale: 1.04,
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-venue-frame]",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.from("[data-venue-frame]", {
        clipPath: "inset(100% 0% 0% 0% round 999px 999px 16px 16px)",
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: "[data-venue-frame]",
          start: "top 85%",
          toggleActions: REPLAY_TOGGLE_ACTIONS,
        },
      });
      gsap.from("[data-venue-halo]", {
        autoAlpha: 0,
        scale: 0.94,
        duration: 1.2,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-venue-frame]",
          start: "top 85%",
          toggleActions: REPLAY_TOGGLE_ACTIONS,
        },
      });
      gsap.from("[data-venue-card]", {
        autoAlpha: 0,
        y: 36,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-venue-card]",
          start: "top 92%",
          toggleActions: REPLAY_TOGGLE_ACTIONS,
        },
      });
      gsap.from("[data-venue-reveal] > *", {
        autoAlpha: 0,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.07,
        delay: 0.25,
        scrollTrigger: {
          trigger: "[data-venue-card]",
          start: "top 88%",
          toggleActions: REPLAY_TOGGLE_ACTIONS,
        },
      });
    },
    { scope: venueRef },
  );

  return (
    <section
      id="thong-tin"
      aria-labelledby="info-title"
      className="relative bg-linen pt-15.5 pb-16"
    >
      <div ref={dateRef} className="px-[6%]">
        <Reveal>
          <SectionHeading
            script="Thông tin"
            title="Ngày cưới"
            titleId="info-title"
          >
            Chúng mình rất mong được đón tiếp những người thân yêu trong ngày
            trọng đại này!
          </SectionHeading>
        </Reveal>

        <div className="font-time mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-wine">
          <span
            data-date-side
            className="border-y border-wine/25 py-2.5 text-center text-[11px] font-semibold tracking-[3px]"
          >
            {dateItem?.label}
          </span>
          <time
            data-date-day
            dateTime={content.dateIso}
            className="font-time text-[92px] leading-[0.9] tabular-nums"
          >
            {String(day).padStart(2, "0")}
          </time>
          <span
            data-date-side
            className="border-y border-wine/25 py-2.5 text-center text-[11px] font-semibold tracking-[3px]"
          >
            THÁNG {month}
          </span>
        </div>
        <p
          data-date-note
          className="mt-3 text-center font-time text-[12px] leading-[1.6] text-taupe"
        >
          Năm {year}
          {dateItem?.note && (
            <>
              <br />
              {dateItem.note}
            </>
          )}
        </p>

        <div
          data-calendar
          className="font-time  mt-10 w-full rounded-[28px] bg-cream p-1.5 shadow-[0_32px_60px_-38px_rgba(120,19,29,0.55)] ring-1 ring-wine/10"
        >
          <div className="rounded-[22px] border border-wine/10  px-4 pt-5 pb-4">
            <div className="flex items-end justify-between px-1.5">
              <p className="font-script text-[34px] leading-[1.1] text-wine">
                Tháng {month}
              </p>
              <p className="pb-2 font-time text-[11px] font-semibold tracking-[3px] text-bronze tabular-nums">
                {year}
              </p>
            </div>
            <div className="mt-2 h-px bg-linear-to-r from-transparent via-wine/25 to-transparent" />

            <div
              aria-hidden="true"
              className="mt-4 grid grid-cols-7 gap-y-2 text-center"
            >
              {WEEKDAYS.map((label) => (
                <span
                  key={label}
                  className={`pb-1 font-time text-[10px] font-semibold tracking-[1px] ${
                    label === "CN" ? "text-wine" : "text-taupe/80"
                  }`}
                >
                  {label}
                </span>
              ))}
              {cells.map((cell, i) => {
                if (cell === null) return <span key={`empty-${i}`} />;
                const isWedding = cell === day;
                const isSunday = i % 7 === 6;
                return (
                  <span
                    key={cell}
                    data-calendar-cell
                    className="relative mx-auto flex size-9 items-center justify-center font-time text-[13px] tabular-nums"
                  >
                    {isWedding && (
                      <>
                        {/* Khung vòm đôi, cùng hình với khung ảnh địa điểm bên dưới. */}
                        <span
                          data-wedding-mark
                          className="absolute inset-x-0 -top-1.5 -bottom-1 origin-bottom rounded-t-full rounded-b-lg bg-wine shadow-[0_10px_20px_-8px_rgba(120,19,29,0.65)]"
                        />
                        <span
                          data-wedding-mark
                          className="absolute -inset-x-1 -top-2.5 -bottom-2 origin-bottom rounded-t-full rounded-b-[11px] border border-wine/35 motion-safe:animate-pulse"
                        />
                      </>
                    )}
                    <span
                      className={
                        isWedding
                          ? "relative mt-1 font-semibold text-linen"
                          : cell < day
                            ? "text-cocoa/40"
                            : isSunday
                              ? "text-wine/80"
                              : "text-cocoa"
                      }
                    >
                      {cell}
                    </span>
                  </span>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2.5 border-t border-dashed border-wine/15 pt-4 text-wine">
              <span
                aria-hidden="true"
                className="size-4 bg-current [mask:url(/images/icons/ring_icon.svg)_center/contain_no-repeat]"
              />
              <span className="font-time text-[11px] font-semibold tracking-[3px] tabular-nums">
                {String(day).padStart(2, "0")}.{String(month).padStart(2, "0")}.
                {year}
              </span>
            </div>
          </div>
        </div>

        <div
          data-times
          className="mx-auto mt-8 grid max-w-85 grid-cols-2 divide-x divide-wine/15"
        >
          {times.map((item) => (
            <div key={item.key} data-time className="px-2 text-center">
              <p className="font-time text-[10.5px] font-semibold tracking-[2.5px] text-[#8e4b49]">
                {item.label}
              </p>
              <strong className="mt-2 block font-time text-[40px] leading-none font-normal tabular-nums text-wine">
                {item.value}
              </strong>
            </div>
          ))}
        </div>
      </div>

      <div ref={venueRef} className="mt-20 px-[6%]">
        <header className="text-center">
          <p className="font-script text-[52px] leading-[0.82] text-bronze">
            Địa điểm
          </p>
          <h2 className="mt-2 font-display text-[32px] leading-none text-wine">
            TỔ CHỨC
          </h2>
          <HeartRule />
        </header>

        <div className="relative mx-auto mt-2 w-[84%] max-w-90">
          {/* Vòm viền lệch phía sau ảnh, cùng nhịp khung vòm đôi của ô ngày cưới. */}
          <span
            aria-hidden="true"
            data-venue-halo
            className="pointer-events-none absolute -inset-x-3 -top-3 bottom-8 rounded-t-full border border-wine/20"
          />
          <figure
            data-venue-frame
            className="relative aspect-4/5 overflow-hidden rounded-t-full rounded-b-2xl bg-sand shadow-[0_30px_60px_-40px_rgba(120,19,29,0.6)]"
          >
            <div data-venue-media className="absolute inset-0">
              <Image
                src={content.images.venue}
                alt={`Không gian ${content.venue.name}`}
                fill
                sizes="(min-width: 512px) 360px, 84vw"
                className="object-cover object-[58%_center] saturate-[.9]"
              />
            </div>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-wine-dark/45 to-transparent"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-2.5 rounded-t-full rounded-b-[10px] border border-linen/70"
            />
          </figure>
        </div>

        {/* Thẻ vé mời: phần thông tin + đường xé răng cưa + phần hành động. */}
        <div
          data-venue-card
          className="relative z-[3] mx-auto -mt-16 w-full max-w-95 drop-shadow-[0_22px_28px_rgba(120,19,29,0.16)]"
        >
          <div
            data-venue-reveal
            className="rounded-t-[22px] bg-cream px-6 pt-7 pb-5 text-center"
          >
            <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-wine/8 text-wine ring-1 ring-wine/15">
              <MapPin size={20} weight="duotone" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-[23px] leading-[1.25] text-wine">
              {content.venue.name}
            </h3>
            <address className="mx-auto mt-2.5 max-w-[30ch] font-time text-[12.5px] leading-[1.7] text-taupe not-italic">
              {content.venue.address}
            </address>
          </div>
          <div
            aria-hidden="true"
            className="relative h-6 bg-cream [mask:radial-gradient(circle_at_0_50%,transparent_11px,#000_11.5px)_left/51%_100%_no-repeat,radial-gradient(circle_at_100%_50%,transparent_11px,#000_11.5px)_right/51%_100%_no-repeat]"
          >
            <span className="absolute inset-x-5 top-1/2 border-t border-dashed border-wine/25" />
          </div>
          <div
            data-venue-reveal
            className="grid grid-cols-[1fr_auto] gap-2.5 rounded-b-[22px] bg-cream px-5 pt-2 pb-5"
          >
            <a
              href={content.venue.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-wine px-5 py-3.5 font-time text-[11px] font-semibold tracking-[2px] whitespace-nowrap text-linen transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-wine-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine active:scale-[0.98]"
            >
              XEM BẢN ĐỒ
              <ArrowUpRight
                size={14}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <button
              type="button"
              onClick={copyAddress}
              aria-label={copied ? "Đã chép địa chỉ" : "Chép địa chỉ"}
              className="inline-flex size-12 items-center justify-center rounded-full bg-sand text-wine ring-1 ring-wine/15 transition-[transform,background-color] duration-300 hover:bg-champagne/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine active:scale-[0.94]"
            >
              {copied ? (
                <Check size={18} weight="bold" aria-hidden="true" />
              ) : (
                <Copy size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingInfoSection;
