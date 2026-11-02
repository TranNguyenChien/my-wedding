"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarPlus,
  Check,
  Copy,
  DownloadSimple,
  Globe,
  GoogleLogo,
  MapPin,
} from "@phosphor-icons/react/ssr";
import { useGSAP } from "@gsap/react";
import { addDays, getDate, isSameDay, parseISO, startOfWeek } from "date-fns";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
  REPLAY_TOGGLE_ACTIONS,
} from "@/components/motion/gsap-setup";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { buildGoogleCalendarUrl, buildIcsDataUrl } from "@/services/calendar";
import { useInvitation } from "../invitation-context";
import SectionHeading from "./ui/section-heading";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const ICON_BUTTON =
  "inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-sand text-wine ring-1 ring-wine/15 transition-[transform,background-color] duration-300 hover:bg-champagne/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine active:scale-[0.94]";
const SECONDARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-full bg-sand px-4 py-3 font-text text-[13px] font-medium whitespace-nowrap text-wine ring-1 ring-wine/15 transition-[transform,background-color] duration-300 hover:bg-champagne/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine active:scale-[0.97]";

/**
 * Tiệc Báo Hỷ: thẻ tối (ảnh cặp đôi + giờ tiệc + dải tuần) và thẻ địa điểm
 * chồng lên dưới (chỉ đường, chép địa chỉ, lưu vào lịch). Thay mục "Ngày
 * cưới" trên những trang có `content.party`.
 */
const PartySection: React.FC = () => {
  const content = useInvitation();
  const rootRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      // Thẻ tối mở từ dưới lên, ảnh bên trong thu dần về 1 rồi trôi theo cuộn.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-party-card]",
            start: "top 82%",
            toggleActions: REPLAY_TOGGLE_ACTIONS,
          },
        })
        .from("[data-party-card]", {
          clipPath: "inset(100% 0% 0% 0% round 28px)",
          duration: 1.2,
          ease: "power3.inOut",
        })
        .from(
          "[data-party-media] img",
          { scale: 1.16, duration: 1.8, ease: "power2.out" },
          0,
        );
      gsap.fromTo(
        "[data-party-media]",
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-party-card]",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // Giờ tiệc là điểm nhấn: từng chữ số trượt lên khỏi mặt nạ, rồi tới
      // ngày, dải tuần và viên đánh dấu ngày tiệc.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-party-time]",
            start: "top 88%",
            toggleActions: REPLAY_TOGGLE_ACTIONS,
          },
          defaults: { ease: "power3.out" },
        })
        .from("[data-party-char]", {
          yPercent: 110,
          duration: 1,
          stagger: 0.07,
          ease: "expo.out",
        })
        .from(
          "[data-party-meta]",
          { autoAlpha: 0, y: 12, duration: 0.7, stagger: 0.1 },
          0.25,
        )
        .from(
          "[data-party-day]",
          { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.05 },
          0.45,
        )
        .from(
          "[data-party-mark]",
          { scale: 0, duration: 0.7, ease: "back.out(2.2)" },
          "-=0.15",
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-party-venue]",
            start: "top 92%",
            toggleActions: REPLAY_TOGGLE_ACTIONS,
          },
          defaults: { ease: "power3.out" },
        })
        .from("[data-party-venue]", { autoAlpha: 0, y: 36, duration: 0.9 })
        .from(
          "[data-party-reveal]",
          { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.08 },
          0.25,
        );
    },
    { scope: rootRef },
  );

  const { party, venue } = content;
  if (!party) return null;

  const partyDate = parseISO(content.dateIso);
  const week = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(partyDate, { weekStartsOn: 1 }), i),
  );
  const time =
    content.schedule.find((item) => item.key === "reception")?.value ?? "";
  const dateItem = content.schedule.find((item) => item.key === "date");

  const calendarEvent = {
    title: `Tiệc Báo Hỷ ${content.firstName} & ${content.secondName}`,
    description: `Thân mời bạn tới chung vui cùng ${content.firstName} và ${content.secondName}.`,
    location: `${venue.name}, ${venue.address}`,
    start: new Date(content.countdownTarget),
    end: new Date(party.endsAt),
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(venue.address);
      setCopied(true);
    } catch {
      // Trình duyệt chặn clipboard: khách vẫn còn nút chỉ đường.
    }
  };

  // Tạo file lúc bấm: DTSTAMP lấy giờ hiện tại, render sẵn sẽ lệch khi hydrate.
  const downloadIcs = () => {
    const link = document.createElement("a");
    link.href = buildIcsDataUrl(calendarEvent);
    link.download = "tiec-bao-hy.ics";
    link.click();
  };

  return (
    <section
      ref={rootRef}
      id="tiec-bao-hy"
      aria-labelledby="party-title"
      className="relative bg-linen px-[6%] pt-15.5 pb-16"
    >
      <Reveal>
        <SectionHeading
          script="Thân mời"
          title={
            <>
              Tiệc <em>Báo Hỷ</em>
            </>
          }
          titleId="party-title"
        >
          Sau lễ cưới ở quê nhà, chúng mình mở một buổi tiệc tối tại Sài Gòn
          để được chung vui cùng bạn.
        </SectionHeading>
      </Reveal>

      <article
        data-party-card
        className="@container relative mt-10 overflow-hidden rounded-[28px] bg-wine-dark text-[#fff8ec] shadow-[0_40px_70px_-40px_rgba(76,8,14,0.9)]"
      >
        <figure className="relative aspect-4/5 overflow-hidden">
          <div data-party-media className="absolute -inset-y-[6%] inset-x-0">
            <Image
              src={party.photo}
              alt={`${content.firstName} và ${content.secondName} khoe nhẫn cưới`}
              fill
              sizes="(min-width: 512px) 450px, 88vw"
              className="object-cover object-[center_30%]"
            />
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent from-45% via-wine-dark/55 via-75% to-wine-dark"
          />
        </figure>

        {/* Quầng sáng ấm dưới đáy thẻ: cảm giác tiệc tối dưới đèn vàng. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#efd4aa2e,transparent_65%)]"
        />

        <div data-party-time className="relative -mt-28 px-6 pb-6">
          <p
            data-party-meta
            className="font-text text-[11px] font-medium tracking-[0.28em] text-champagne/85 uppercase"
          >
            Bắt đầu lúc
          </p>
          <time
            dateTime={content.countdownTarget}
            className="mt-1 block font-time text-[min(27cqw,112px)] leading-[1.02] tracking-[-0.02em] text-champagne tabular-nums"
          >
            <span className="sr-only">{time}</span>
            <span aria-hidden="true" className="flex overflow-hidden">
              {time.split("").map((char, i) => (
                <span key={i} data-party-char className="inline-block">
                  {char}
                </span>
              ))}
            </span>
          </time>

          <p
            data-party-meta
            className="mt-3 flex items-center gap-3.5 font-time text-[12px] font-semibold tracking-[3px] text-[#f6e6cf]"
          >
            <span>{dateItem?.label}</span>
            <span aria-hidden="true" className="h-3.5 w-px bg-champagne/45" />
            <time dateTime={content.dateIso} className="tabular-nums">
              {dateItem?.value}
            </time>
          </p>
          {dateItem?.note && (
            <p
              data-party-meta
              className="mt-2 font-text text-[12.5px] leading-[1.6] text-[#f0d7c9]/80"
            >
              {dateItem.note}
            </p>
          )}

          <ol
            aria-label="Tuần có ngày tiệc"
            className="mt-6 grid grid-cols-7 gap-1 border-t border-champagne/15 pt-5 text-center"
          >
            {week.map((day, i) => {
              const isParty = isSameDay(day, partyDate);
              return (
                <li
                  key={WEEKDAYS[i]}
                  data-party-day
                  aria-current={isParty ? "date" : undefined}
                  className="relative flex flex-col items-center gap-1.5 py-2.5"
                >
                  {isParty && (
                    <span
                      data-party-mark
                      aria-hidden="true"
                      className="absolute inset-x-0.5 inset-y-0 rounded-full bg-champagne shadow-[0_10px_24px_-8px_#efd4aa99]"
                    />
                  )}
                  <span
                    className={cn(
                      "relative font-time text-[10px] tracking-[1px]",
                      isParty
                        ? "font-semibold text-wine-dark"
                        : "text-[#f0d7c9]/55",
                    )}
                  >
                    {WEEKDAYS[i]}
                  </span>
                  <span
                    className={cn(
                      "relative font-time text-[15px] leading-none tabular-nums",
                      isParty ? "text-wine-dark" : "text-[#fff8ec]/80",
                    )}
                  >
                    {getDate(day)}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </article>

      <div
        data-party-venue
        className="relative z-3 mx-auto -mt-5 w-[92%] rounded-[28px] bg-cream p-6 shadow-[0_24px_50px_-30px_rgba(120,19,29,0.5)] ring-1 ring-wine/10"
      >
        <div data-party-reveal className="flex items-start gap-3.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-wine/8 text-wine ring-1 ring-wine/15">
            <MapPin size={20} weight="duotone" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-[21px] leading-[1.25] text-balance text-wine">
              {venue.name}
            </h3>
            <address className="mt-1.5 font-text text-[13px] leading-[1.65] text-taupe not-italic">
              {venue.address}
            </address>
          </div>
        </div>

        <div data-party-reveal className="mt-5 flex gap-2.5">
          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-wine px-5 py-3.5 font-time text-[11px] font-semibold tracking-[2px] whitespace-nowrap text-linen transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-wine-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine active:scale-[0.98]"
          >
            CHỈ ĐƯỜNG
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
            className={ICON_BUTTON}
          >
            {copied ? (
              <Check size={18} weight="bold" aria-hidden="true" />
            ) : (
              <Copy size={18} aria-hidden="true" />
            )}
          </button>
          {venue.website && (
            <a
              href={venue.website}
              target="_blank"
              rel="noreferrer"
              aria-label="Trang web nhà hàng"
              className={ICON_BUTTON}
            >
              <Globe size={18} aria-hidden="true" />
            </a>
          )}
        </div>

        <div
          data-party-reveal
          className="mt-5 border-t border-dashed border-wine/15 pt-4"
        >
          <p className="flex items-center gap-2 font-text text-[13px] font-medium text-cocoa">
            <CalendarPlus
              size={16}
              weight="duotone"
              aria-hidden="true"
              className="text-wine"
            />
            Lưu vào lịch
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <a
              href={buildGoogleCalendarUrl(calendarEvent)}
              target="_blank"
              rel="noreferrer"
              className={SECONDARY_BUTTON}
            >
              <GoogleLogo size={15} weight="bold" aria-hidden="true" />
              Google Lịch
            </a>
            <button
              type="button"
              onClick={downloadIcs}
              className={SECONDARY_BUTTON}
            >
              <DownloadSimple size={15} weight="bold" aria-hidden="true" />
              Tải file .ics
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartySection;
