"use client";

import { useEffect, useRef } from "react";
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

const SPRITE_SRC = "/images/gate-open-frames/gate-envelope-sprite-30-v4.webp";
const BACKGROUND_SRC = "/images/gate-open-frames/gate-sunset-background.png";
/** Sprite 6 cột × 5 hàng = 30 khung hình mở phong bì. */
const SPRITE_COLUMNS = 6;
const SPRITE_ROWS = 5;
const SPRITE_FRAMES = SPRITE_COLUMNS * SPRITE_ROWS;
const OPENING_DURATION = 1.6;
/** Nhiễu fractal làm hạt phim, nhúng thẳng để không tốn thêm request. */
const GRAIN_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const spritePosition = (index: number) => {
  const column = index % SPRITE_COLUMNS;
  const row = Math.floor(index / SPRITE_COLUMNS);
  return `${(column * 100) / (SPRITE_COLUMNS - 1)}% ${(row * 100) / (SPRITE_ROWS - 1)}%`;
};

/** Màn mở đầu: phong bì trên nền biển hoàng hôn, chạm để mở thiệp. */
const LetterGate: React.FC<LetterGateProps> = ({ onOpenStart, onOpened }) => {
  const content = useInvitation();
  const rootRef = useRef<HTMLElement>(null);
  const spriteRef = useRef<HTMLSpanElement>(null);
  const spriteReadyRef = useRef<Promise<unknown>>(Promise.resolve());
  const openingRef = useRef(false);

  // Giải mã sprite trước để khung hình không bị nháy khi bắt đầu mở.
  useEffect(() => {
    const preloader = new window.Image();
    preloader.decoding = "async";
    preloader.src = SPRITE_SRC;
    spriteReadyRef.current = preloader.decode().catch(() => undefined);
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      // Kể theo thứ tự: lời mời → tên (trượt lên khỏi mặt nạ) → "&" → ngày.
      gsap
        .timeline({ delay: 0.1, defaults: { ease: "expo.out" } })
        .from("[data-gate-eyebrow]", { y: 14, autoAlpha: 0, duration: 0.9 })
        .from(
          "[data-gate-word]",
          { yPercent: 115, duration: 1.2, stagger: 0.14 },
          0.2,
        )
        .from(
          "[data-gate-amp]",
          { scale: 0.4, rotate: -18, autoAlpha: 0, duration: 1.1 },
          0.45,
        )
        .from("[data-gate-meta]", { y: 12, autoAlpha: 0, duration: 0.9 }, 0.7);

      // Vệt nắng trôi chậm trên nền hoàng hôn.
      gsap.to("[data-gate-leak]", {
        xPercent: -12,
        yPercent: 8,
        scale: 1.15,
        duration: 9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Chữ "chạm để mở thư" ánh lên kiểu "slide to unlock".
      gsap.fromTo(
        "[data-gate-shimmer]",
        { backgroundPosition: "150% 0" },
        {
          backgroundPosition: "-50% 0",
          duration: 2.2,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 1.2,
          delay: 1.8,
        },
      );
      // Gợi ý chạm hiện ra sau phong bì.
      gsap.from("[data-gate-prompt]", {
        autoAlpha: 0,
        y: 8,
        duration: 0.8,
        delay: 1.1,
        ease: "power3.out",
      });
      gsap.from("[data-gate-glow]", {
        autoAlpha: 0,
        scale: 0.8,
        duration: 1.4,
        delay: 0.3,
        ease: "power2.out",
      });
      gsap
        .timeline({ delay: 0.15 })
        .from("[data-gate-envelope]", {
          y: 54,
          scale: 0.94,
          autoAlpha: 0,
          duration: 1.08,
          ease: "power3.out",
        })
        .to("[data-gate-envelope]", {
          y: -7,
          duration: 2.25,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

      gsap.fromTo(
        "[data-gate-bg]",
        { xPercent: -0.35 },
        {
          xPercent: 0.35,
          yPercent: -0.4,
          duration: 12,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
      );

      // Hai vòng sóng toả lần lượt từ điểm sáng phía trên chữ.
      gsap.fromTo(
        "[data-gate-pulse]",
        { scale: 1, autoAlpha: 0.85 },
        {
          scale: 4,
          autoAlpha: 0,
          duration: 1.8,
          ease: "power2.out",
          stagger: { each: 0.9, repeat: -1 },
          delay: 1.4,
        },
      );
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
        if (spriteRef.current) {
          spriteRef.current.style.backgroundPosition = spritePosition(
            SPRITE_FRAMES - 1,
          );
        }
        onOpened();
        return;
      }

      gsap.killTweensOf(
        "[data-gate-envelope], [data-gate-pulse], [data-gate-shimmer]",
      );
      gsap.to("[data-gate-leak]", {
        autoAlpha: 0,
        duration: 0.9,
        ease: "power2.out",
      });
      gsap.to("[data-gate-envelope]", {
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to("[data-gate-pulse]", { autoAlpha: 0, duration: 0.25 });
      gsap.to("[data-gate-copy]", {
        y: -18,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.to("[data-gate-glow]", {
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.to("[data-gate-prompt]", {
        y: 12,
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to("[data-gate-bg-image]", {
        scale: 1.09,
        filter: "saturate(.86) brightness(.78)",
        duration: 0.9,
        ease: "power3.out",
      });

      // Chạy 30 khung hình mở phong bì, xong thì mờ cả màn thư.
      const sprite = spriteRef.current;
      const frame = { index: 0 };
      const opening = gsap
        .timeline({ paused: true, onComplete: onOpened })
        .to(frame, {
          index: SPRITE_FRAMES - 1,
          duration: OPENING_DURATION,
          ease: "none",
          snap: "index",
          onUpdate: () => {
            if (sprite) {
              sprite.style.backgroundPosition = spritePosition(frame.index);
            }
          },
        })
        .to(
          sprite,
          {
            scale: 1.035,
            y: 10,
            duration: OPENING_DURATION,
            ease: "power3.out",
          },
          0,
        )
        .to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.48,
          ease: "power1.out",
        });

      void spriteReadyRef.current.then(() => opening.play());
    })();

  return (
    <section
      ref={rootRef}
      aria-labelledby="gate-title"
      className="fixed inset-0 z-9999 isolate overflow-hidden bg-[#1d0609] text-[#fff5e8]"
    >
      {/* Ngoài cột thiệp (desktop): chính ảnh nền, mờ và tối, để hai bên không trống. */}
      <div aria-hidden="true" className="absolute inset-0 -z-1">
        <Image
          src={BACKGROUND_SRC}
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover blur-2xl brightness-[.45] saturate-[.8]"
        />
      </div>

      {/* Cột thiệp: cùng max-w-lg với nội dung trang (layout.tsx). */}
      <div className="@container relative mx-auto h-full w-full max-w-lg overflow-hidden shadow-[0_0_80px_#0d020599]">
        <div
          data-gate-bg
          aria-hidden="true"
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <div data-gate-bg-image className="absolute inset-0 scale-[1.018]">
            <Image
              src={BACKGROUND_SRC}
              alt=""
              fill
              sizes="(min-width: 512px) 512px, 100vw"
              preload
              className="object-cover object-[center_52%]"
            />
          </div>
        </div>
        {/* Vệt nắng (light leak) hoà sáng vào ảnh hoàng hôn. */}
        <span
          data-gate-leak
          aria-hidden="true"
          className="pointer-events-none absolute -top-[15%] -right-[40%] z-1 size-[150cqw] rounded-full bg-[radial-gradient(circle,#ffb46a55_0%,#ff8a5a22_35%,transparent_65%)] mix-blend-screen"
        />
        {/* Lớp phủ: tối dần xuống đáy để chữ và phong bì nổi, viền tối để dồn mắt vào giữa. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 z-1 bg-[linear-gradient(180deg,#1f050cc2_0%,#2e08102e_34%,#25050b14_55%,#1a0409e0_100%)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_50%_60%,transparent_38%,#16040899_100%)]"
        />
        {/* Progressive blur: ảnh mờ dần phía sau tiêu đề, xoá dần xuống giữa. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-2 h-[44%] backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,#000_25%,transparent)]"
        />
        {/* Hạt phim: chất analog cho khung hình. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-5 opacity-[0.14] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_TEXTURE, backgroundSize: "180px" }}
        />
        {/* Khung viền mảnh. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 z-10 rounded-[22px] border border-[#fff0d9]/18 @max-[430px]:inset-2.5 @max-[430px]:rounded-[20px]"
        />

        <header
          data-gate-copy
          className="absolute top-[max(6.5dvh,44px)] left-1/2 z-3 flex w-[88cqw] -translate-x-1/2 flex-col items-center text-center [text-shadow:0_2px_24px_#2a070d8c] [@media(max-height:700px)]:top-[4.5dvh]"
        >
          <p
            data-gate-eyebrow
            id="gate-title"
            className="flex items-center gap-3 font-text text-[10.5px] leading-none font-medium tracking-[0.34em] text-[#f6e2c4] uppercase @max-[430px]:gap-2.5 @max-[430px]:text-[9.5px] @max-[430px]:tracking-[0.28em]"
          >
            <i
              aria-hidden="true"
              className="h-px w-8 bg-linear-to-r from-transparent to-[#efd1a2]/70 @max-[430px]:w-5"
            />
            Bạn nhận được một bức thư
            <i
              aria-hidden="true"
              className="h-px w-8 bg-linear-to-l from-transparent to-[#efd1a2]/70 @max-[430px]:w-5"
            />
          </p>

          <h1 className="mt-5 flex flex-col items-center font-display text-[clamp(38px,11cqw,56px)] leading-[1.05] tracking-[-0.025em] text-[#fff7ec] [@media(max-height:700px)]:mt-3.5 [@media(max-height:700px)]:text-[36px]">
            <span className="block overflow-hidden pb-1.5">
              <span data-gate-word className="block">
                {content.firstName}
              </span>
            </span>
            <span
              data-gate-amp
              aria-hidden="true"
              className="-my-2 block pb-1 font-script text-[0.85em] leading-[1.1] text-[#f3d3a0] [text-shadow:0_0_36px_#f3b97a66]"
            >
              &amp;
            </span>
            <span className="sr-only">và</span>
            <span className="block overflow-hidden pb-1.5">
              <span data-gate-word className="block">
                {content.secondName}
              </span>
            </span>
          </h1>

          <p
            data-gate-meta
            className="mt-3.5 flex items-center gap-3 font-text text-[10.5px] leading-none font-medium tracking-[0.28em] text-[#f0ddc7]/90 uppercase @max-[430px]:text-[9.5px] @max-[430px]:tracking-[0.22em] [@media(max-height:700px)]:mt-2.5"
          >
            <span>{content.eventName}</span>
            <i aria-hidden="true" className="h-3 w-px bg-[#efd1a2]/50" />
            <time dateTime={content.dateIso}>{content.dateDots}</time>
          </p>
        </header>

        {/* Quầng sáng ấm dưới phong bì: "đặt" phong bì xuống mặt cảnh. */}
        <span
          data-gate-glow
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[14dvh] left-1/2 z-3 h-[24dvh] w-[92cqw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,#f3c98d38_0%,#f3c98d14_40%,transparent_70%)] blur-2xl [@media(max-height:700px)]:bottom-[8dvh]"
        />

        <button
          data-gate-envelope
          type="button"
          onClick={handleOpen}
          aria-label={`Mở bức thư cưới của ${content.firstName} và ${content.secondName}`}
          className="group absolute bottom-[19dvh] left-1/2 z-4 aspect-[1.5] w-[102cqw] -translate-x-1/2 cursor-pointer drop-shadow-[0_27px_28px_#18030770] transition-[filter] duration-300 hover:drop-shadow-[0_34px_34px_#1803077d] focus-visible:rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f1d2a5] [@media(max-height:700px)]:bottom-[12dvh] [@media(max-height:700px)]:w-[88cqw]"
        >
          <span
            ref={spriteRef}
            aria-hidden="true"
            className="absolute inset-0 z-2 block bg-no-repeat transition-[scale] duration-500 backface-hidden group-hover:scale-[1.025]"
            style={{
              backgroundImage: `url('${SPRITE_SRC}')`,
              backgroundSize: `${SPRITE_COLUMNS * 100}% ${SPRITE_ROWS * 100}%`,
              backgroundPosition: "0% 0%",
            }}
          />
          {/* Gợi ý chạm trên thân thư, dưới dấu sáp: điểm sáng toả sóng + chữ ánh lên. */}
          <span
            data-gate-prompt
            className="absolute top-1/2 left-1/2 z-3 flex -translate-1/2 flex-col items-center gap-2.5 transition-[scale] duration-300 group-active:scale-[0.95]"
          >
            <span
              aria-hidden="true"
              className="relative grid size-3 place-items-center"
            >
              <span
                data-gate-pulse
                className="absolute inset-0 rounded-full border border-[#f6d8a8] opacity-0"
              />
              <span
                data-gate-pulse
                className="absolute inset-0 rounded-full border border-[#f6d8a8] opacity-0"
              />
              <span className="size-1.5 rounded-full bg-[#fbe9cf] shadow-[0_0_10px_2px_#f6d8a8b3]" />
            </span>
            <span
              data-gate-shimmer
              className="bg-[linear-gradient(90deg,#f3dfc2_0%,#f3dfc2_40%,#ffffff_50%,#f3dfc2_60%,#f3dfc2_100%)] bg-size-[200%_100%] bg-clip-text font-text text-[10px] leading-normal font-medium tracking-[0.24em] whitespace-nowrap text-transparent uppercase drop-shadow-[0_1px_6px_#1a040acc] @max-[430px]:text-[9px] @max-[430px]:tracking-[0.2em] pt-3"
            >
              Chạm để mở thư
            </span>
          </span>
        </button>
      </div>
    </section>
  );
};

export default LetterGate;
