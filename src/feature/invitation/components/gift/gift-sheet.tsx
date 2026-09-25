"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap-setup";
import { cn } from "@/lib/utils";
import { useInvitation } from "../../invitation-context";

interface GiftSheetProps {
  /** Gọi sau khi animation đóng chạy xong — cha gỡ sheet khỏi DOM. */
  onClosed: () => void;
}

/**
 * Bottom sheet chứa QR + thông tin tài khoản. Render qua portal vào <body>
 * để `position: fixed` không bị các wrapper có transform (Reveal) giữ lại.
 */
const GiftSheet: React.FC<GiftSheetProps> = ({ onClosed }) => {
  const recipients = useInvitation().giftRecipients;
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const recipient = recipients[activeIndex];

  const { contextSafe } = useGSAP(
    () => {
      tabRefs.current[0]?.focus();
      if (prefersReducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-sheet-backdrop]", { autoAlpha: 0, duration: 0.35 })
        .from("[data-sheet-panel]", { yPercent: 100, duration: 0.5 }, 0)
        .from("[data-sheet-panel] > *", { autoAlpha: 0, y: 16, duration: 0.45, stagger: 0.05 }, 0.2);
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-sheet-account]", { autoAlpha: 0, x: 14, duration: 0.4, ease: "power2.out" });
      gsap.from("[data-sheet-qr]", { scale: 0.94, autoAlpha: 0.4, duration: 0.4, ease: "power2.out" });
    },
    { scope: rootRef, dependencies: [activeIndex], revertOnUpdate: true },
  );

  // contextSafe gọi lúc click (không phải lúc render) để hợp lệ với rule react-hooks/refs.
  const close = () =>
    contextSafe(() => {
      if (closingRef.current) return;
      closingRef.current = true;
      if (prefersReducedMotion()) {
        onClosed();
        return;
      }
      gsap
        .timeline({ onComplete: onClosed, defaults: { ease: "power2.in" } })
        .to("[data-sheet-panel]", { yPercent: 100, duration: 0.4 })
        .to("[data-sheet-backdrop]", { autoAlpha: 0, duration: 0.3 }, 0.1);
    })();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const selectTab = (index: number) => {
    const next = (index + recipients.length) % recipients.length;
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") close();
    if (event.key === "ArrowRight") selectTab(activeIndex + 1);
    if (event.key === "ArrowLeft") selectTab(activeIndex - 1);
  };

  return createPortal(
    <div
      ref={rootRef}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[9500] flex items-end justify-center"
    >
      <button
        data-sheet-backdrop
        type="button"
        onClick={close}
        aria-label="Đóng hộp mừng cưới"
        className="absolute inset-0 cursor-pointer bg-[#240409]/70"
      />

      <section
        data-sheet-panel
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-sheet-title"
        className="relative z-[1] w-full max-w-lg overflow-hidden rounded-t-[28px] border border-[#9f6d5e]/20 bg-[#fffaf1] px-[22px] pt-9 pb-[max(25px,env(safe-area-inset-bottom))] shadow-[0_38px_95px_#21030770]"
      >
        <span
          aria-hidden="true"
          className="mx-auto -mt-[22px] mb-6 block h-1 w-[42px] rounded-full bg-[#8d6a63]/25"
        />
        <button
          type="button"
          onClick={close}
          aria-label="Đóng"
          className="absolute top-[19px] right-[17px] z-[2] grid size-[34px] cursor-pointer place-items-center rounded-full border border-[#7a3f3d]/20 font-text text-[23px] leading-none font-light text-[#6f3033] transition-[rotate,background-color] duration-300 hover:rotate-90 hover:bg-[#f3e7d8]"
        >
          ×
        </button>

        <header className="text-center">
          <p className="mb-3 font-text text-[8px] font-medium tracking-[5px] text-[#8b5f57]">
            WEDDING GIFT
          </p>
          <h2
            id="gift-sheet-title"
            className="font-display text-[42px] leading-[0.95] tracking-[-1.5px] text-wine"
          >
            Gửi lời chúc
          </h2>
          <p className="mx-auto mt-3 max-w-[330px] font-text text-[11px] leading-[1.65] font-light text-[#7a6868]">
            Một chút yêu thương dành cho hành trình mới của chúng mình.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Chọn người nhận"
          className="my-6 grid grid-cols-2 rounded-full border border-[#8b4c49]/15 bg-[#f2e7da] p-1"
        >
          {recipients.map((item, index) => (
            <button
              key={item.key}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`gift-tab-${item.key}`}
              aria-selected={index === activeIndex}
              aria-controls="gift-panel"
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "cursor-pointer rounded-full px-[18px] py-3 font-text text-[9px] leading-none font-medium tracking-[2px] uppercase transition-[background-color,color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a87561]",
                index === activeIndex
                  ? "bg-wine text-[#fff8ec] shadow-[0_7px_16px_#4e0b1326]"
                  : "text-[#836b69]",
              )}
            >
              {item.tab}
            </button>
          ))}
        </div>

        <div
          id="gift-panel"
          role="tabpanel"
          aria-labelledby={`gift-tab-${recipient.key}`}
          className="grid grid-cols-[132px_1fr] items-center gap-[19px]"
        >
          <div
            data-sheet-qr
            className="relative rounded-[17px] border border-[#a46b5c]/20 bg-white p-[9px] shadow-[0_13px_28px_#4f2d2512] before:pointer-events-none before:absolute before:top-[7px] before:left-[7px] before:size-[22px] before:rounded-tl-[7px] before:border-t before:border-l before:border-wine after:pointer-events-none after:absolute after:right-[7px] after:bottom-[7px] after:size-[22px] after:rounded-br-[7px] after:border-r after:border-b after:border-wine"
          >
            {recipient.qr ? (
              <div className="relative aspect-square w-full">
                <Image
                  src={recipient.qr}
                  alt={`Mã QR mừng cưới của ${recipient.role.toLowerCase()} ${recipient.name}`}
                  fill
                  sizes="132px"
                  className="object-contain"
                />
              </div>
            ) : (
              <div
                role="img"
                aria-label={`Mã QR mừng cưới của ${recipient.role.toLowerCase()} đang cập nhật`}
                className="grid aspect-square w-full place-items-center rounded-lg border border-dashed border-[#a46b5c]/40 bg-[#fbf5ea] text-center font-text text-[9px] leading-snug font-light text-[#8d746f]"
              >
                Mã QR
                <br />
                đang cập nhật
              </div>
            )}
          </div>

          <div data-sheet-account>
            <small className="font-text text-[8px] font-medium tracking-[3px] text-[#a07165]">
              {recipient.role}
            </small>
            <h3 className="mt-2 mb-3.5 font-display text-[25px] leading-none text-wine">
              {recipient.name}
            </h3>
            <dl className="border-t border-[#8d5545]/15 pt-3.5 font-text text-[9px] leading-[1.45] font-light">
              <div className="py-[3px]">
                <dt className="text-[8px] text-[#796766]">Ngân hàng</dt>
                <dd className="text-[#4d3434]">{recipient.bank}</dd>
              </div>
              <div className="py-[3px]">
                <dt className="text-[8px] text-[#796766]">Số tài khoản</dt>
                <dd className="text-[#4d3434]">{recipient.account}</dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="mt-[22px] border-t border-[#8d5545]/15 pt-4 text-center font-text text-[9px] leading-normal font-light text-[#8d746f]">
          <span aria-hidden="true" className="mr-[7px] text-[#9f5e55]">
            ♥
          </span>
          Cảm ơn bạn đã gửi lời chúc đến chúng mình.
        </p>
      </section>
    </div>,
    document.body,
  );
};

export default GiftSheet;
