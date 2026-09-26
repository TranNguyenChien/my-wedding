"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";
import { Reveal } from "@/components/motion/reveal";
import { useInvitation } from "../../invitation-context";
import HeartRule from "../ui/heart-rule";
import GiftSheet from "./gift-sheet";

const SPARKLES = [
  { glyph: "✦", className: "top-[28%] left-[8%] text-[18px]" },
  { glyph: "✧", className: "top-[16%] right-[3%] text-[27px]" },
  { glyph: "✦", className: "right-[10%] bottom-[23%] text-[13px]" },
];

/** "Mừng cưới": hộp quà lơ lửng, chạm để mở bottom sheet QR. */
const GiftSection: React.FC = () => {
  const content = useInvitation();
  const rootRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const openingRef = useRef(false);

  const { contextSafe } = useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        "[data-gift-float]",
        { y: 0, rotate: -1 },
        { y: -9, rotate: 1, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 },
      );
      gsap.utils.toArray<HTMLElement>("[data-gift-sparkle]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0.18, scale: 0.65, rotate: 0 },
          {
            autoAlpha: 0.9,
            scale: 1.15,
            rotate: 28,
            duration: 1.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.7,
          },
        );
      });
    },
    { scope: rootRef },
  );

  // contextSafe gọi lúc click (không phải lúc render) để hợp lệ với rule react-hooks/refs.
  const openSheet = () =>
    contextSafe(() => {
      if (openingRef.current || sheetOpen) return;
      if (prefersReducedMotion()) {
        setSheetOpen(true);
        return;
      }
      openingRef.current = true;
      gsap
        .timeline({
          onComplete: () => {
            openingRef.current = false;
            setSheetOpen(true);
          },
        })
        .to("[data-gift-pop]", { scale: 0.94, y: 2, duration: 0.18, ease: "power2.in" })
        .to("[data-gift-pop]", {
          scale: 1.08,
          y: -15,
          rotate: 3,
          duration: 0.32,
          ease: "back.out(2)",
        })
        .to("[data-gift-burst]", { scale: 2.2, autoAlpha: 0, duration: 0.4, ease: "power2.out" }, "<")
        // Đưa hộp quà và sparkle về chỗ cũ trong lúc sheet che phủ.
        .set("[data-gift-pop]", { scale: 1, y: 0, rotate: 0 }, "+=0.35")
        .set("[data-gift-burst]", { scale: 1, autoAlpha: 1 });
    })();

  const handleClosed = () => {
    setSheetOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <section
      ref={rootRef}
      id="mung-cuoi"
      aria-labelledby="gift-title"
      className="relative overflow-hidden border-t border-[#8f5446]/10 bg-sand px-[8%] pt-[78px] pb-[88px]"
    >
      <Reveal className="relative mx-auto w-full max-w-[610px] text-center">
        <span aria-hidden="true" className="mx-auto mb-7 block h-[37px] w-px bg-[#9c665b]/30" />
        <p className="mb-5 font-text text-[8px] font-medium tracking-[6px] text-[#8b5f57]">
          WEDDING GIFT
        </p>
        <h2
          id="gift-title"
          className="font-display text-[56px] leading-[0.92] tracking-[-2.4px] text-wine"
        >
          Mừng cưới
        </h2>
        <HeartRule />
        <p className="mx-auto max-w-[500px] font-text text-[11px] leading-[1.8] font-light text-[#766465]">
          Sự hiện diện của bạn đã là món quà quý giá nhất. Nếu muốn gửi thêm
          một lời chúc, chúng mình xin trân trọng đón nhận.
        </p>

        <button
          ref={triggerRef}
          type="button"
          onClick={openSheet}
          aria-label="Mở hộp quà mừng cưới"
          aria-haspopup="dialog"
          className="group mx-auto mt-4 grid w-[min(310px,82vw)] cursor-pointer place-items-center rounded-[30px] text-wine focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#9f6c57]"
        >
          <span
            aria-hidden="true"
            className="relative block aspect-square w-[210px] drop-shadow-[0_21px_17px_#48101828] transition-[scale] duration-400 group-hover:scale-[1.045]"
          >
            <span className="absolute inset-x-[16%] bottom-[8%] h-[17%] scale-y-[.42] rounded-full bg-[#5b171c]/15 blur-[15px]" />
            {SPARKLES.map((sparkle, i) => (
              // Lớp ngoài cho hiệu ứng "nổ" khi mở, lớp trong lấp lánh liên tục.
              <span
                key={i}
                data-gift-burst
                className={`absolute z-[3] block leading-none text-[#b78b53] ${sparkle.className}`}
              >
                <i data-gift-sparkle className="block not-italic">
                  {sparkle.glyph}
                </i>
              </span>
            ))}
            <span data-gift-float className="relative z-[2] block size-full p-5">
              <span data-gift-pop className="relative block size-full">
                <Image
                  src={content.images.giftBox}
                  alt=""
                  fill
                  sizes="210px"
                  className="object-contain"
                />
              </span>
            </span>
          </span>
          <span className="-mt-2 flex items-center gap-3 font-text text-[8px] font-medium tracking-[3px] text-[#8d665e] uppercase before:h-px before:w-[27px] before:bg-[#9f776d]/40">
            Chạm để mở
            <i
              aria-hidden="true"
              className="grid size-[27px] place-items-center rounded-full border border-[#98645c]/35 font-display text-[13px] not-italic transition-[rotate,background-color,color] duration-300 group-hover:rotate-45 group-hover:bg-wine group-hover:text-[#fff7e9]"
            >
              ↗
            </i>
          </span>
        </button>

        <small className="mt-7 block font-text text-[7px] font-medium tracking-[3.5px] text-[#97766d] uppercase">
          {content.firstName}&nbsp;&nbsp;·&nbsp;&nbsp;{content.secondName}
        </small>
      </Reveal>

      {sheetOpen && <GiftSheet onClosed={handleClosed} />}
    </section>
  );
};

export default GiftSection;
