"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
  REPLAY_TOGGLE_ACTIONS,
} from "@/components/motion/gsap-setup";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { useInvitation } from "../invitation-context";
import AlbumViewer from "./album-viewer";
import SectionHeading from "./ui/section-heading";

/** Vị trí + bo góc riêng của từng ô trong lưới bento 12 cột × 7 hàng. */
const TILE_LAYOUT = [
  "col-span-12 row-span-3 rounded-[70px_18px_18px_18px]",
  "col-span-6 row-span-2 rounded-[18px]",
  "col-span-6 row-span-2 rounded-[18px_55px_18px_18px]",
  "col-span-5 row-span-2 rounded-[18px_18px_18px_50px]",
  "col-span-7 row-span-2 rounded-[18px_18px_55px_18px]",
];

/**
 * Album: lưới bento chỉ hiện vài ảnh nổi bật; chạm vào ảnh hoặc nút
 * "Xem tất cả" để mở trình xem toàn bộ album.
 */
const AlbumSection: React.FC = () => {
  const content = useInvitation();
  const gridRef = useRef<HTMLDivElement>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const highlights = content.album.slice(0, TILE_LAYOUT.length);

  // Từng ô "mở màn" từ dưới lên, ảnh bên trong thu về kích thước thật.
  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      const tiles = gsap.utils.toArray<HTMLElement>("[data-album-tile]");
      gsap
        .timeline({
          scrollTrigger: { trigger: gridRef.current, start: "top 80%", toggleActions: REPLAY_TOGGLE_ACTIONS },
        })
        .from(tiles, {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
        })
        .from(
          tiles.map((tile) => tile.querySelector("img")),
          { scale: 1.25, duration: 1.5, ease: "power2.out", stagger: 0.12 },
          0,
        )
        .from(
          "[data-album-caption]",
          { autoAlpha: 0, y: 10, duration: 0.6, stagger: 0.1 },
          0.6,
        );
    },
    { scope: gridRef },
  );

  return (
    <section
      aria-labelledby="album-title"
      className="relative bg-linen px-[3.5%] pt-[62px] pb-[42px]"
    >
      <Reveal>
        <SectionHeading
          script="Album ảnh"
          title="NHỮNG KHOẢNH KHẮC"
          titleId="album-title"
        >
          Cùng nhìn lại những khoảnh khắc ngọt ngào
          <br />
          trên hành trình yêu thương của chúng mình.
        </SectionHeading>
      </Reveal>

      <div
        ref={gridRef}
        className="relative z-[3] mt-8 grid grid-cols-12 grid-rows-[repeat(7,min(21vw,100px))] gap-1.5"
      >
        {highlights.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            data-album-tile
            onClick={() => setViewerIndex(i)}
            aria-label={`Xem ảnh ${i + 1}: ${photo.alt}`}
            className={cn(
              "group relative cursor-zoom-in overflow-hidden bg-[#e5d5c6] text-left shadow-[0_16px_32px_#4f2c2417] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine",
              TILE_LAYOUT[i],
            )}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={i === 0 ? "(min-width: 512px) 490px, 95vw" : "(min-width: 512px) 280px, 55vw"}
              className="object-cover object-[center_30%] saturate-[.86] transition-[scale] duration-700 ease-out group-hover:scale-[1.035]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[55%] bottom-0 bg-linear-to-b from-transparent to-[#32101394]"
            />
            <span
              data-album-caption
              className="absolute inset-x-2.5 bottom-2 z-[2] flex items-end justify-between gap-2.5 text-white [text-shadow:0_2px_12px_#321013a8]"
            >
              <span className="font-display text-[14px] leading-none tracking-[1px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {photo.caption && (
                <small className="text-right font-text text-[6px] leading-tight font-medium tracking-[0.8px] uppercase">
                  {photo.caption}
                </small>
              )}
            </span>
          </button>
        ))}
      </div>

      {content.album.length > highlights.length && (
        <Reveal className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setViewerIndex(0)}
            className="group inline-flex cursor-pointer items-center gap-3 rounded-full border border-wine/25 bg-[#fffaf3] py-1.5 pr-5 pl-1.5 shadow-[0_10px_24px_#4f2c2414] transition-[background-color,box-shadow] duration-300 hover:bg-[#f6ebdf] hover:shadow-[0_14px_30px_#4f2c2424] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
          >
            <span aria-hidden="true" className="flex -space-x-3">
              {content.album
                .slice(highlights.length, highlights.length + 3)
                .map((photo) => (
                  <span
                    key={photo.src}
                    className="relative size-9 overflow-hidden rounded-full border-2 border-[#fffaf3]"
                  >
                    <Image src={photo.src} alt="" fill sizes="36px" className="object-cover" />
                  </span>
                ))}
            </span>
            <span className="font-text text-[9px] font-medium tracking-[2px] text-wine uppercase">
              Xem tất cả {content.album.length} ảnh
            </span>
            <span
              aria-hidden="true"
              className="font-text text-[14px] leading-none text-wine transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </Reveal>
      )}

      <Reveal className="mt-5 flex items-center gap-4 text-[#8a5f57]">
        <span aria-hidden="true" className="font-text text-[7px] font-medium tracking-[3px]">
          OUR MEMORIES
        </span>
        <i aria-hidden="true" className="h-px flex-1 bg-[#b78c71]/25" />
        <b aria-hidden="true" className="font-script text-[27px] leading-none font-normal">
          {content.monogram.groom} &amp; {content.monogram.bride}
        </b>
      </Reveal>

      {viewerIndex !== null && (
        <AlbumViewer
          startIndex={viewerIndex}
          onClosed={() => setViewerIndex(null)}
        />
      )}
    </section>
  );
};

export default AlbumSection;
