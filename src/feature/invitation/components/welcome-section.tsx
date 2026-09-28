"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
  REPLAY_TOGGLE_ACTIONS,
  SplitText,
} from "@/components/motion/gsap-setup";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { useInvitation } from "../invitation-context";
import ProfileSpread from "./profile-spread";
import HeartRule from "./ui/heart-rule";
import SectionHeading from "./ui/section-heading";

const ARCH_RADIUS = "rounded-[999px_999px_20px_20px/260px_260px_20px_20px]";

/** "Thân gửi": lời chào + chân dung khung vòm + giới thiệu cô dâu chú rể. */
const WelcomeSection: React.FC = () => {
  const content = useInvitation();
  const portraitRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  // Khung vòm mở từ dưới lên, ảnh bên trong thu nhỏ dần về 1, dấu sáp đóng sau cùng.
  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: portraitRef.current,
            start: "top 82%",
            toggleActions: REPLAY_TOGGLE_ACTIONS,
          },
        })
        .from("[data-portrait]", {
          clipPath: "inset(100% 0% 0% 0% round 260px 260px 20px 20px)",
          duration: 1.3,
          ease: "power3.out",
        })
        .from("img", { scale: 1.18, duration: 1.8, ease: "power2.out" }, 0)
        .from(
          "[data-seal]",
          { scale: 0, rotate: -40, duration: 0.8, ease: "back.out(1.8)" },
          0.9,
        );
    },
    { scope: portraitRef },
  );

  // Lời kết như đang được viết tay: hai nét gạch kéo ra, monogram hiện theo
  // nét bút từ trái sang, rồi câu trích dẫn hiện lần lượt từng chữ cái.
  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      const split = SplitText.create("[data-quote]", {
        type: "words,chars",
        charsClass: "inline-block",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: closingRef.current,
            start: "top 80%",
            toggleActions: REPLAY_TOGGLE_ACTIONS,
          },
        })
        .from("[data-rule='left']", {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.9,
          ease: "power3.out",
        })
        .from(
          "[data-rule='right']",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.9,
            ease: "power3.out",
          },
          0,
        )
        .fromTo(
          "[data-glyph]",
          { clipPath: "inset(-20% 100% -20% 0%)" },
          {
            clipPath: "inset(-20% 0% -20% 0%)",
            duration: 0.55,
            stagger: 0.35,
            ease: "power1.inOut",
          },
          0.2,
        )
        .from(
          split.chars,
          {
            opacity: 0,
            y: 6,
            filter: "blur(3px)",
            duration: 0.35,
            stagger: 0.022,
            ease: "power1.out",
          },
          1.1,
        )
        .from(
          "[data-heart]",
          { opacity: 0, scale: 0.6, duration: 0.6, ease: "back.out(2)" },
          "-=0.1",
        );
    },
    { scope: closingRef },
  );

  return (
    <section
      id="than-gui"
      aria-labelledby="welcome-title"
      className="relative bg-linen px-6 py-6"
    >
      <Reveal>
        <SectionHeading
          align="center"
          titleId="welcome-title"
          title={
            <>
              <em className="text-center">Thân gửi</em>
            </>
          }
        >
          Chào mừng bạn đến với lễ cưới của chúng mình! Chúng mình rất hạnh phúc
          khi được chia sẻ ngày đặc biệt này cùng gia đình và bạn bè thân yêu.
        </SectionHeading>
      </Reveal>

      <div ref={portraitRef} className="relative mt-12 w-full">
        <figure
          data-portrait
          className={cn(
            "relative aspect-3/4 overflow-hidden bg-sand shadow-[0_30px_60px_-30px_#4c080e66]",
            ARCH_RADIUS,
          )}
        >
          <Image
            src={content.images.couple}
            alt={`Khoảnh khắc dịu dàng của ${content.firstName} và ${content.secondName}`}
            fill
            sizes="(min-width: 512px) 450px, 88vw"
            className="object-cover object-[center_28%]"
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-2.5 border border-linen/60",
              ARCH_RADIUS,
            )}
          />
        </figure>
      </div>

      <div className="mt-20 space-y-10">
        {content.profiles.map((profile, index) => (
          <div key={profile.role}>
            <ProfileSpread
              profile={profile}
              flip={index % 2 === 1}
              dropPhoto={index === 0}
            />
          </div>
        ))}
      </div>
      <div ref={closingRef} className="mt-10">
        <p
          aria-hidden="true"
          className="mb-7 flex items-center gap-4 text-center font-script text-4xl leading-none tracking-[7px] text-bronze"
        >
          <i
            data-rule="left"
            aria-hidden="true"
            className="h-px w-full flex-1 bg-[#b78c71]/25"
          ></i>
          <span data-glyph className="inline-block pb-1">
            {content.monogram.first}
          </span>
          <span data-glyph className="inline-block pb-1">
            ·
          </span>
          <span data-glyph className="inline-block pb-1">
            {content.monogram.second}
          </span>
          <i
            data-rule="right"
            aria-hidden="true"
            className="h-px w-full flex-1 bg-[#b78c71]/25"
          ></i>
        </p>
        <blockquote
          data-quote
          className="text-center font-display text-xl leading-[1.4] text-wine italic"
        >
          “Có lẽ chúng mình đã không biết rằng một ngày rất bình thường sẽ mở
          đầu cho một câu chuyện thật đặc biệt.
          <br />
          Từ hai người xa lạ, thành hai người thương; và hôm nay - thành một gia
          đình”
        </blockquote>
        <div data-heart>
          <HeartRule className="mt-5 mb-7" />
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
