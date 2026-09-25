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
import { useInvitation } from "../invitation-context";
import HeartRule from "./ui/heart-rule";
import SectionHeading from "./ui/section-heading";

const ARCH_RADIUS = "rounded-[190px_190px_16px_16px/75px_75px_16px_16px]";

/** "Thân gửi": lời chào + chân dung khung vòm + giới thiệu cô dâu chú rể. */
const WelcomeSection: React.FC = () => {
  const content = useInvitation();
  const portraitRef = useRef<HTMLElement>(null);

  // Khung vòm mở từ dưới lên, ảnh bên trong thu nhỏ dần về 1.
  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap
        .timeline({
          scrollTrigger: { trigger: portraitRef.current, start: "top 82%", toggleActions: REPLAY_TOGGLE_ACTIONS },
        })
        .from(portraitRef.current, {
          clipPath: "inset(100% 0% 0% 0% round 190px 190px 16px 16px)",
          duration: 1.3,
          ease: "power3.out",
        })
        .from("img", { scale: 1.18, duration: 1.8, ease: "power2.out" }, 0);
    },
    { scope: portraitRef },
  );

  return (
    <section
      id="than-gui"
      aria-labelledby="welcome-title"
      className="relative bg-linen pt-6"
    >
      <Reveal className="mx-auto w-[88%] pb-10">
        <SectionHeading script="Thân gửi" titleId="welcome-title">
          Chào mừng bạn đến với lễ cưới của chúng mình!
          <br />
          Chúng mình rất hạnh phúc khi được chia sẻ ngày đặc biệt này cùng gia
          đình và bạn bè thân yêu.
        </SectionHeading>
      </Reveal>

      <div className="relative z-[3] px-[5%] pb-[72px]">
        <figure
          ref={portraitRef}
          className={`relative mx-auto h-[465px] w-[94%] overflow-hidden border-[6px] border-[#fffaf1] shadow-[0_24px_55px_#4d2c231c] ${ARCH_RADIUS}`}
        >
          <Image
            src={content.images.couple}
            alt={`Khoảnh khắc dịu dàng của ${content.groomName} và ${content.brideName}`}
            fill
            sizes="(min-width: 512px) 450px, 90vw"
            className="object-cover object-[center_30%] saturate-[.86]"
          />
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-[9px] border border-[#bd9669]/30 ${ARCH_RADIUS}`}
          />
        </figure>

        <Reveal className="mx-auto mt-8 w-[88%]">
          <p
            aria-hidden="true"
            className="mb-7 text-center font-display text-[24px] leading-none tracking-[7px] text-bronze"
          >
            {content.monogram.groom}&nbsp;&nbsp;·&nbsp;&nbsp;{content.monogram.bride}
          </p>
          <blockquote className="text-center font-display text-[24px] leading-[1.4] text-wine italic">
            “Có anh, mọi hành trình
            <br />
            đều trở nên dịu dàng.”
          </blockquote>
          <HeartRule className="mt-5 mb-7" />

          {content.profiles.map((profile, index) => (
            <article
              key={profile.role}
              className={
                index < content.profiles.length - 1
                  ? "mb-6 border-b border-[#b48b70]/20 pb-6"
                  : undefined
              }
            >
              <small className="font-text text-[9px] font-medium tracking-[4px] text-[#8c4d4d]">
                {profile.role}
              </small>
              <h2 className="mt-2 mb-2.5 font-display text-[29px] leading-none text-wine">
                {profile.name}
              </h2>
              <p className="font-text text-[11px] leading-[1.75] font-light text-taupe">
                {profile.bio}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default WelcomeSection;
