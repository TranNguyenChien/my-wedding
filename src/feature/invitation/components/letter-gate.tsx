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

interface LetterGateProps {
  /** Gọi ngay trong cú click — nơi duy nhất trình duyệt cho phép phát nhạc. */
  onOpenStart: () => void;
  /** Gọi khi màn thư đã mờ hẳn, để gỡ nó khỏi DOM. */
  onOpened: () => void;
}

const WaxSeal: React.FC = () => {
  const content = useInvitation();
  return (
    <span
      aria-hidden="true"
      className="relative block size-17 rounded-full border border-[#d9b579]/50 bg-wine shadow-[0_12px_24px_#2503086b,inset_0_0_0_6px_#8b2731,inset_0_0_0_7px_#d6ae6a42] transition-transform duration-300 group-hover:scale-105"
    >
      <span className="absolute inset-2.75 rounded-full border border-[#e2c28f]/40" />
      <b className="absolute top-3.5 left-4 font-display text-[28px] leading-none font-normal text-[#ead1a6]">
        {content.monogram.groom}
      </b>
      <i className="absolute right-3 bottom-2 font-script text-[29px] leading-none text-[#d9b579] not-italic">
        {content.monogram.bride}
      </i>
    </span>
  );
};

/** Màn mở đầu: một bức thư trên phong bì, chạm dấu sáp để mở thiệp. */
const LetterGate: React.FC<LetterGateProps> = ({ onOpenStart, onOpened }) => {
  const content = useInvitation();
  const rootRef = useRef<HTMLElement>(null);
  const openingRef = useRef(false);

  const { contextSafe } = useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-gate-paper]", {
          y: 45,
          rotate: 1,
          autoAlpha: 0,
          duration: 0.9,
        })
        .from(
          "[data-gate-envelope]",
          { y: 70, autoAlpha: 0, duration: 0.95 },
          0.12,
        )
        .from(
          "[data-gate-title]",
          {
            clipPath: "inset(0% 50% 0% 50%)",
            autoAlpha: 0,
            duration: 0.9,
            ease: "power2.out",
          },
          0.32,
        )
        .from("[data-gate-seal]", { y: 14, autoAlpha: 0, duration: 0.6 }, 0.7);

      gsap.to("[data-gate-seal-disc]", {
        scale: 1.06,
        duration: 1.1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.4,
      });
    },
    { scope: rootRef },
  );

  // contextSafe gọi lúc click (không phải lúc render) để hợp lệ với rule react-hooks/refs.
  const handleOpen = () =>
    contextSafe(() => {
      if (openingRef.current) return;
      openingRef.current = true;
      onOpenStart();

      if (prefersReducedMotion()) {
        onOpened();
        return;
      }

      gsap.killTweensOf("[data-gate-seal-disc]");
      gsap
        .timeline({ onComplete: onOpened })
        .to("[data-gate-seal]", {
          y: 12,
          autoAlpha: 0,
          duration: 0.35,
          ease: "power2.in",
        })
        .to(
          "[data-gate-paper]",
          {
            y: -18,
            scale: 1.025,
            autoAlpha: 0,
            duration: 0.52,
            ease: "power3.inOut",
          },
          0,
        )
        .to(
          "[data-gate-envelope]",
          { y: 36, autoAlpha: 0.45, duration: 0.5, ease: "power3.out" },
          0,
        )
        .to(
          rootRef.current,
          { autoAlpha: 0, duration: 0.4, ease: "power1.out" },
          0.45,
        );
    })();

  return (
    <section
      ref={rootRef}
      aria-labelledby="gate-title"
      className="fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-[#65111a] p-[18px] text-[#f7ead7]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[9px] border border-[#f0d2a5]/15 shadow-[inset_0_0_80px_#2503091e]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -left-[4vw] -translate-y-1/2 font-display text-[clamp(300px,42vw,650px)] leading-none text-[#f6dfbd]/[0.03]"
      >
        {content.monogram.groom}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-[4vw] -translate-y-1/2 font-display text-[clamp(300px,42vw,650px)] leading-none text-[#f6dfbd]/[0.03]"
      >
        {content.monogram.bride}
      </span>

      <div className="relative z-[2] grid h-[min(575px,81svh)] w-[min(390px,calc(100vw-42px))] place-items-center drop-shadow-[0_32px_36px_#25030855]">
        <div
          data-gate-envelope
          className="absolute -bottom-9 left-1/2 aspect-748/517 w-[140%] -translate-x-1/2 brightness-[.77] saturate-[.82]"
        >
          <Image
            src="/images/envelop/envelope.png"
            alt=""
            fill
            sizes="560px"
            preload
            className="object-contain"
          />
        </div>

        <article
          data-gate-paper
          className="relative z-[2] flex size-full flex-col items-center border border-[#9f7056]/15 bg-[#fffaf1] px-8 pt-6 pb-16 text-[#6e1920] shadow-[0_20px_55px_#27040a4c] [@media(max-height:700px)]:pt-5 [@media(max-height:700px)]:pb-14"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 border border-[#9f7056]/15"
          />
          <span
            aria-hidden="true"
            className="absolute top-[69px] left-1/2 h-[31px] w-px bg-[#a8795e]/30 [@media(max-height:700px)]:hidden"
          />

          <header className="relative z-[1] flex w-full items-center justify-between font-text text-[6px] font-medium tracking-[3.2px] text-[#9d756d]">
            <span>POSTED WITH LOVE</span>
            <span className="tracking-[2px]">{content.dateDots}</span>
          </header>

          <div
            aria-hidden="true"
            className="relative mt-9 mb-5 size-16 rounded-full border border-[#84504a]/30 shadow-[inset_0_0_0_7px_#a3715d0a] [@media(max-height:700px)]:mt-6 [@media(max-height:700px)]:mb-3 [@media(max-height:700px)]:size-14"
          >
            <span className="absolute inset-[7px] rounded-full border border-[#b88b67]/30" />
            <span className="absolute top-3 left-4 font-display text-[29px] leading-none">
              {content.monogram.groom}
            </span>
            <span className="absolute right-3 bottom-2 font-script text-[31px] leading-none text-[#b07a52]">
              {content.monogram.bride}
            </span>
          </div>

          <div data-gate-title className="text-center">
            <p className="font-display text-[19px] leading-none">
              Bạn nhận được
            </p>
            <h1
              id="gate-title"
              className="mt-1 font-script text-[50px] leading-[0.76] text-[#a66d4e] [@media(max-height:700px)]:text-[43px]"
            >
              một bức thư
            </h1>
          </div>

          <div className="mt-7 w-full border-t border-[#98675d]/15 px-1 pt-5 text-center text-[#746262] [@media(max-height:700px)]:mt-5 [@media(max-height:700px)]:pt-4">
            <p className="mb-2.5 font-display text-[16px] leading-tight text-[#6e1920] italic [@media(max-height:700px)]:text-[13px]">
              Thân gửi bạn,
            </p>
            <p className="font-text text-[9px] leading-[1.8] font-light [@media(max-height:700px)]:text-[8px]">
              Trân trọng mời bạn đến chung vui
              <br />
              và cùng chứng kiến khoảnh khắc
              <br />
              hai đứa về chung một nhà.
            </p>
          </div>

          <div className="mt-auto flex items-center justify-center gap-2.5">
            <strong className="font-display text-[15px] leading-none font-normal">
              {content.groomName}
            </strong>
            <i className="font-script text-[22px] leading-none text-[#b07a52] not-italic">
              &amp;
            </i>
            <strong className="font-display text-[15px] leading-none font-normal">
              {content.brideName}
            </strong>
          </div>
          <time
            dateTime={content.dateIso}
            className="mt-2.5 font-text text-[6px] font-medium tracking-[3px] text-[#9b716a]"
          >
            {content.dateDots}
          </time>

          <button
            data-gate-seal
            type="button"
            onClick={handleOpen}
            aria-label={`Mở thiệp cưới của ${content.groomName} và ${content.brideName}`}
            className="group absolute -bottom-[39px] left-1/2 z-[5] flex w-[118px] -translate-x-1/2 cursor-pointer flex-col items-center gap-2 rounded-full focus-visible:outline-1 focus-visible:outline-offset-[6px] focus-visible:outline-[#efcf9f]"
          >
            <span data-gate-seal-disc className="block">
              <WaxSeal />
            </span>
            <span className="font-text text-[7px] font-medium tracking-[2.6px] whitespace-nowrap text-[#eed9bc] uppercase [text-shadow:0_2px_8px_#31050a]">
              Chạm để mở thư
            </span>
          </button>
        </article>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 z-[3] hidden -translate-x-1/2 items-center gap-3.5 font-text text-[6px] font-medium tracking-[2.5px] whitespace-nowrap text-[#ead3b6]/70 md:flex"
      >
        <span>{content.eventName}</span>
        <i className="h-px w-[42px] bg-[#ebd1ab]/30" />
        <span>{content.region}</span>
      </div>
    </section>
  );
};

export default LetterGate;
