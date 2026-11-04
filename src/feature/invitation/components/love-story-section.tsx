"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { STORY_LINE_LENGTH, STORY_LINE_PATH } from "../constants";
import { useInvitation } from "../invitation-context";
import HeartRule from "./ui/heart-rule";

const MILESTONE_POSITION = [
  "left-0 top-[3%]",
  "right-0 top-[28%]",
  "left-0 top-[53%]",
  "right-0 top-[78%]",
];

const DIM = { autoAlpha: 0.12, y: 22 };
const LIT = { autoAlpha: 1, y: 0 };

/**
 * Love Story: nét line vẽ dần theo tiến độ cuộn. Hình dạng nét lấy từ ảnh
 * `storyLine` (alpha mask), một "nét bút" chạy dọc tâm để lộ dần hình đó.
 * Mỗi mốc sáng lên khi nét vẽ đi tới `step` của nó.
 */
const LoveStorySection: React.FC = () => {
  const content = useInvitation();
  const stageRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      ensureGsapReady();
      const pen = penRef.current;
      if (!pen || prefersReducedMotion()) return;

      const milestones = gsap.utils.toArray<HTMLElement>("[data-milestone]");
      const lit = milestones.map(() => false);

      // Dash đặt bằng thuộc tính SVG (số không đơn vị, theo viewBox) thay vì
      // CSS style "…px": cách chắc chắn nhất để mọi trình duyệt, kể cả
      // Safari, ẩn nét lúc đầu rồi vẽ dần.
      gsap.set(pen, {
        attr: {
          "stroke-dasharray": STORY_LINE_LENGTH,
          "stroke-dashoffset": STORY_LINE_LENGTH,
        },
      });
      gsap.set(milestones, DIM);

      gsap.to(pen, {
        attr: { "stroke-dashoffset": 0 },
        ease: "none",
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top 72%",
          end: "bottom 60%",
          scrub: 0.6,
          onUpdate: ({ progress }) => {
            milestones.forEach((el, i) => {
              const shouldLight = progress >= content.story[i].step;
              if (shouldLight === lit[i]) return;
              lit[i] = shouldLight;
              gsap.to(el, {
                ...(shouldLight ? LIT : DIM),
                duration: 0.55,
                ease: "power2.out",
                overwrite: "auto",
              });
            });
          },
        },
      });
    },
    { scope: stageRef },
  );

  return (
    <section
      id="lich-trinh"
      aria-labelledby="story-title"
      className="relative overflow-hidden bg-wine-soft px-[5%] pt-11 pb-10 text-[#fff8ec]"
    >
      <Reveal className="relative z-[3] text-center">
        <p className="font-text text-[9px] font-medium tracking-[6px]">
          HÀNH TRÌNH YÊU THƯƠNG
        </p>
        <h2
          id="story-title"
          className="mt-2.5 font-script text-[52px] leading-[0.9]"
        >
          Love Story
        </h2>
        <HeartRule tone="light" />
      </Reveal>

      <div
        ref={stageRef}
        className="relative z-[3] mx-auto mt-8 h-[610px] w-full max-w-[470px]"
      >
        {/*
         * Nét bút tô màu trực tiếp, cắt theo hình ảnh `storyLine` bằng một
         * SVG mask alpha. Không thêm mask luminance cho nét vẽ hay
         * drop-shadow (Safari vẽ lại chúng trên CPU mỗi khung hình scrub →
         * giật), và không dùng CSS mask-image trên <svg> (Safari không vẽ
         * lại nét theo stroke-dashoffset → nét hiện sẵn toàn bộ).
         */}
        <svg
          viewBox="0 0 600 1340"
          aria-hidden="true"
          className="absolute top-0 left-1/2 h-[610px] w-[258px] -translate-x-1/2 overflow-visible opacity-90"
        >
          <defs>
            <mask
              id="love-story-shape"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="600"
              height="1340"
              style={{ maskType: "alpha" }}
            >
              <image
                href={content.images.storyLine}
                x="0"
                y="0"
                width="600"
                height="1340"
              />
            </mask>
          </defs>
          <g mask="url(#love-story-shape)">
            <path
              ref={penRef}
              d={STORY_LINE_PATH}
              fill="none"
              stroke="#f5d8a7"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        {content.story.map((milestone, i) => (
          <article
            key={milestone.date}
            data-milestone
            className={cn(
              "absolute w-[46%] rounded-[14px] border border-[#f1d7b7]/15 bg-[#640d16] px-3 py-3 shadow-[0_14px_26px_#3d050c38]",
              MILESTONE_POSITION[i],
            )}
          >
            <time className="mb-2 block font-display text-[11px] leading-tight tracking-[1px] text-champagne">
              {milestone.date}
            </time>
            <h3 className="font-display text-[14px] leading-tight text-[#fffaf1]">
              {milestone.title}
            </h3>
            <p className="mt-1.5 font-text text-[9.5px] leading-[1.6] font-light text-[#efd7d1]">
              {milestone.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LoveStorySection;
