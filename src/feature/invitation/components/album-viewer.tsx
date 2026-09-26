"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap-setup";
import { cn } from "@/lib/utils";
import { useInvitation } from "../invitation-context";

interface AlbumViewerProps {
  /** Ảnh mở đầu tiên. */
  startIndex: number;
  /** Gọi sau khi animation đóng chạy xong — cha gỡ viewer khỏi DOM. */
  onClosed: () => void;
}

/** Vuốt ngang tối thiểu (px) để chuyển ảnh. */
const SWIPE_THRESHOLD = 45;

/**
 * Trình xem toàn màn hình cho cả album: vuốt / phím mũi tên / dải ảnh nhỏ để
 * chuyển ảnh. Render qua portal vào <body> để `position: fixed` không bị các
 * wrapper có transform (Reveal) giữ lại.
 */
const AlbumViewer: React.FC<AlbumViewerProps> = ({ startIndex, onClosed }) => {
  const photos = useInvitation().album;
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closingRef = useRef(false);
  const pointerStartX = useRef<number | null>(null);
  const [index, setIndex] = useState(startIndex);
  const [direction, setDirection] = useState<1 | -1>(1);
  const photo = photos[index];

  const { contextSafe } = useGSAP(
    () => {
      closeRef.current?.focus();
      if (prefersReducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(rootRef.current, { autoAlpha: 0, duration: 0.35 })
        .from(
          "[data-viewer-chrome]",
          { autoAlpha: 0, y: 12, duration: 0.45, stagger: 0.06 },
          0.15,
        );
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-viewer-photo]", {
        autoAlpha: 0,
        x: 28 * direction,
        duration: 0.45,
        ease: "power2.out",
      });
    },
    { scope: rootRef, dependencies: [index], revertOnUpdate: true },
  );

  // Giữ ảnh nhỏ đang chọn luôn nằm trong dải thumbnail.
  useEffect(() => {
    thumbRefs.current[index]?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [index]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // contextSafe gọi lúc click (không phải lúc render) để hợp lệ với rule react-hooks/refs.
  const close = () =>
    contextSafe(() => {
      if (closingRef.current) return;
      closingRef.current = true;
      if (prefersReducedMotion()) {
        onClosed();
        return;
      }
      gsap.to(rootRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClosed,
      });
    })();

  const goTo = (next: number, dir: 1 | -1) => {
    setDirection(dir);
    setIndex((next + photos.length) % photos.length);
  };
  const prev = () => goTo(index - 1, -1);
  const next = () => goTo(index + 1, 1);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") close();
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const dx = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (dx <= -SWIPE_THRESHOLD) next();
    if (dx >= SWIPE_THRESHOLD) prev();
  };

  const NAV_BUTTON =
    "absolute top-1/2 z-[2] grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-[#f3dfc4]/25 bg-[#240409]/45 font-text text-[20px] leading-none text-[#fff4e4] backdrop-blur-sm transition-colors duration-300 hover:bg-[#240409]/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b579]";

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Album ảnh cưới"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[9500] flex flex-col bg-[#1d0306]/95 pt-[max(12px,env(safe-area-inset-top))] pb-[max(14px,env(safe-area-inset-bottom))] text-[#fff4e4]"
    >
      <header
        data-viewer-chrome
        className="flex items-center justify-between px-4 py-2"
      >
        <p className="font-text text-[9px] font-medium tracking-[4px] text-[#d9bf9b]">
          OUR MEMORIES
        </p>
        <p
          aria-live="polite"
          className="font-display text-[18px] leading-none tracking-[1px]"
        >
          {String(index + 1).padStart(2, "0")}
          <span className="text-[#d9bf9b]/60">
            {" "}
            / {String(photos.length).padStart(2, "0")}
          </span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Đóng album"
          className="grid size-[34px] cursor-pointer place-items-center rounded-full border border-[#f3dfc4]/25 font-text text-[23px] leading-none font-light transition-[rotate,background-color] duration-300 hover:rotate-90 hover:bg-white/10"
        >
          ×
        </button>
      </header>

      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => (pointerStartX.current = null)}
        className="relative min-h-0 flex-1 touch-pan-y select-none"
      >
        <figure data-viewer-photo className="absolute inset-x-3 inset-y-2">
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 768px) 720px, 100vw"
            draggable={false}
            className="object-contain"
          />
          {photo.caption && (
            <figcaption className="absolute inset-x-0 bottom-2 text-center font-text text-[9px] font-medium tracking-[2px] uppercase [text-shadow:0_2px_12px_#321013]">
              {photo.caption}
            </figcaption>
          )}
        </figure>

        <button
          data-viewer-chrome
          type="button"
          onClick={prev}
          aria-label="Ảnh trước"
          className={cn(NAV_BUTTON, "left-3")}
        >
          ‹
        </button>
        <button
          data-viewer-chrome
          type="button"
          onClick={next}
          aria-label="Ảnh tiếp theo"
          className={cn(NAV_BUTTON, "right-3")}
        >
          ›
        </button>
      </div>

      <div
        data-viewer-chrome
        className="mt-3 flex gap-1.5 overflow-x-auto px-4 pb-1 scrollbar-none"
      >
        {photos.map((item, i) => (
          <button
            key={item.src}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            type="button"
            onClick={() => goTo(i, i >= index ? 1 : -1)}
            aria-label={`Xem ảnh ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "relative h-15.5 w-11 shrink-0 cursor-pointer overflow-hidden rounded-md transition-[opacity,outline-color] duration-300 outline-2 outline-offset-2",
              i === index
                ? "opacity-100 outline-[#d9b579]"
                : "opacity-45 outline-transparent hover:opacity-80",
            )}
          >
            <Image
              src={item.src}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
};

export default AlbumViewer;
