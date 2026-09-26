"use client";

import { useRef } from "react";
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
import HeartRule from "./ui/heart-rule";
import SectionHeading from "./ui/section-heading";

const ARCH_RADIUS = "rounded-[999px_999px_20px_20px/260px_260px_20px_20px]";

/** "Thân gửi": lời chào + chân dung khung vòm + giới thiệu cô dâu chú rể. */
const WelcomeSection: React.FC = () => {
  const content = useInvitation();
  const portraitRef = useRef<HTMLDivElement>(null);

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

      <Reveal className="mt-10">
        <p
          aria-hidden="true"
          className="mb-7 text-center font-display text-[24px] leading-none tracking-[7px] text-bronze"
        >
          {content.monogram.first}&nbsp;&nbsp;·&nbsp;&nbsp;
          {content.monogram.second}
        </p>
        <blockquote className="text-center font-display text-[24px] leading-[1.4] text-wine italic">
          “Có anh, mọi hành trình
          <br />
          đều trở nên dịu dàng.”
        </blockquote>
        <HeartRule className="mt-5 mb-7" />
      </Reveal>

      <div className="mt-16 space-y-12">
        {content.profiles.map((profile, index) => {
          const end = index % 2 === 1;
          return (
            <Reveal key={profile.role}>
              <article className={cn(end && "text-right")}>
                <p className="font-text text-[11px] font-medium tracking-[0.28em] text-bronze uppercase">
                  {profile.role}
                </p>
                <h3 className="mt-2 font-display text-[44px] leading-none font-light tracking-[-0.02em] text-wine">
                  {profile.name}
                </h3>
                <p
                  className={cn(
                    "mt-3 max-w-[30ch] font-text text-[14px] leading-[1.75] text-taupe",
                    end && "ml-auto",
                  )}
                >
                  {profile.bio}
                </p>
              </article>
              {index < content.profiles.length - 1 && (
                <p
                  aria-hidden="true"
                  className="mt-8 text-center font-display text-[64px] leading-none text-bronze/70 italic"
                >
                  &amp;
                </p>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

export default WelcomeSection;
