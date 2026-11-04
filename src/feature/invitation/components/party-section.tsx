"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "@phosphor-icons/react/ssr";
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
import { useInvitation } from "../invitation-context";
import SectionHeading from "./ui/section-heading";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/**
 * Tiệc Báo Hỷ dạng một tấm vé mời: nửa trên tối (ảnh cặp đôi + giờ tiệc +
 * dải tuần), đường xé có khấc, cuống vé kem (nhà hàng, địa chỉ, sảnh/tầng +
 * nút chỉ đường). Thay mục "Ngày cưới" trên những trang có `content.party`.
 * Không dùng quầng sáng/bóng màu: chỉ bóng đổ trung tính nhạt.
 */
const PartySection: React.FC = () => {
  const content = useInvitation();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      // Vé mở từ trên xuống (phần khách thấy trước hiện trước), ảnh bên trong
      // thu dần về 1 rồi trôi theo cuộn.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-party-card]",
            start: "top 82%",
            toggleActions: REPLAY_TOGGLE_ACTIONS,
          },
        })
        .from("[data-party-card]", {
          clipPath: "inset(0% 0% 100% 0% round 28px)",
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

      // Cuống vé dính liền thẻ nên không trượt cả khối, chỉ từng dòng hiện lên.
      gsap.from("[data-party-reveal]", {
        autoAlpha: 0,
        y: 14,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-party-venue]",
          start: "top 88%",
          toggleActions: REPLAY_TOGGLE_ACTIONS,
        },
      });
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
        className="@container relative mt-10 overflow-hidden rounded-[28px] bg-wine-dark text-[#fff8ec] shadow-[0_28px_48px_-36px_rgba(42,24,26,0.45)]"
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

        <div data-party-time className="relative -mt-28 px-6 pb-8">
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
                      className="absolute inset-x-0.5 inset-y-0 rounded-full bg-champagne"
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

        {/* Đường xé của vé: hai khấc tròn màu nền trang cắt vào hai mép. */}
        <div aria-hidden="true" className="relative">
          <span className="absolute top-0 -left-3 size-6 -translate-y-1/2 rounded-full bg-linen" />
          <span className="absolute top-0 -right-3 size-6 -translate-y-1/2 rounded-full bg-linen" />
        </div>

        <div data-party-venue className="bg-cream px-6 pt-8 pb-6 text-cocoa">
          <h3
            data-party-reveal
            className="font-display text-[24px] leading-[1.22] text-balance text-wine"
          >
            {venue.name}
          </h3>
          <address
            data-party-reveal
            className="mt-2 flex items-start gap-2 font-text text-[13.5px] leading-[1.6] text-taupe not-italic"
          >
            <MapPin
              size={16}
              weight="duotone"
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-wine/70"
            />
            {venue.address}
          </address>

          {venue.hall && (
            <dl
              data-party-reveal
              className="mt-6 grid grid-cols-2 border-y border-dashed border-wine/20"
            >
              <div className="py-4 pr-4">
                <dt className="font-text text-[11px] font-medium tracking-[0.24em] text-taupe uppercase">
                  Sảnh
                </dt>
                <dd className="mt-1.5 font-time text-[22px] leading-none text-wine">
                  {venue.hall.name}
                </dd>
              </div>
              <div className="border-l border-dashed border-wine/20 py-4 pl-5">
                <dt className="font-text text-[11px] font-medium tracking-[0.24em] text-taupe uppercase">
                  Tầng
                </dt>
                <dd className="mt-1.5 font-time text-[22px] leading-none text-wine">
                  {venue.hall.floor}
                </dd>
              </div>
            </dl>
          )}

          <a
            data-party-reveal
            href={venue.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-wine px-6 py-4 font-time text-[12px] font-semibold tracking-[2px] text-linen transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-wine-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine active:scale-[0.98]"
          >
            CHỈ ĐƯỜNG
            <ArrowUpRight
              size={14}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </article>
    </section>
  );
};

export default PartySection;
