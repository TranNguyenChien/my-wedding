"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
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
    photo: "contrast-[1.05]",
  },
];

const STRIP_COUNT = 2;
const FRAMES_PER_STRIP = 5;

type Photo = { src: string; alt: string };

/** Chia `photos` thành các dải liên tiếp, mỗi dải `FRAMES_PER_STRIP` ảnh. */
const toStrips = (photos: readonly Photo[]) =>
  Array.from({ length: STRIP_COUNT }, (_, s) =>
    photos.slice(s * FRAMES_PER_STRIP, (s + 1) * FRAMES_PER_STRIP),
  );

/** Fisher–Yates: trả về bản sao đã xáo trộn, không đổi mảng gốc. */
const shuffle = <T,>(items: readonly T[]) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/** Mỗi kho ảnh chỉ xáo một lần mỗi lần tải trang, để snapshot ổn định giữa các lần render. */
const shuffled = new WeakMap<readonly Photo[], readonly Photo[]>();
const shuffledOnce = (pool: readonly Photo[]) => {
  let out = shuffled.get(pool);
  if (!out) {
    out = shuffle(pool);
    shuffled.set(pool, out);
  }
  return out;
};

const noopSubscribe = () => () => {};

/**
 * Photobooth: mỗi lần section vào khung nhìn, đèn flash chớp rồi từng dải ảnh
 * chạy thẳng xuống từ dưới thân máy (không nghiêng).
 */
const PhotoboothSection: React.FC = () => {
  const content = useInvitation();
  const stageRef = useRef<HTMLDivElement>(null);

  // Server và lúc hydrate dùng thứ tự gốc để khớp HTML; sau đó client đổi sang
  // bộ đã xáo, nên mỗi lần tải trang là một bộ ảnh khác.
  const photos = useSyncExternalStore(
    noopSubscribe,
    () => shuffledOnce(content.photobooth),
    () => content.photobooth,
  );
  const strips = toStrips(photos);

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      const strips = gsap.utils.toArray<HTMLElement>("[data-strip]");

      const tl = gsap
        .timeline({ paused: true })
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
            duration: 4.2,
            stagger: 0.6,
            ease: "sine.inOut",
          },
          "+=0.1",
        );

      // Chạy lại mỗi lần cuộn tới (cả xuống lẫn ngược lên), nhưng chỉ reset
      // khi section đã ra hẳn khỏi khung nhìn — không giật lúc còn thấy.
      const playIfReset = () => {
        if (tl.progress() === 0) tl.play();
      };
      ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: playIfReset,
        onEnterBack: playIfReset,
      });
      ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => tl.pause(0),
        onLeaveBack: () => tl.pause(0),
      });
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
      >
        Cùng nhìn lại những khoảnh khắc ngọt ngào
        <br />
        trên hành trình yêu thương của chúng mình.
      </SectionHeading>

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
            <span
              aria-hidden="true"
              className="mt-3.5 block h-3 rounded-full bg-[#1a0104] shadow-[inset_0_3px_5px_#000000cc,0_1px_0_#ffffff1a]"
            />
          </div>
        </div>

        {/* Cắt mép trên ngay dưới thân máy để dải ảnh không tràn lên phần phía trên khi chạy xuống. */}
        <div className="relative -mt-5 flex justify-center gap-5 overflow-hidden px-4 pt-0 pb-10">
          {strips.map((strip, s) => {
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
                  <span className="mt-1.5 block font-script text-sm font-medium tracking-[0.3em] opacity-70">
                    our memories
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
