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
import { cn } from "@/lib/utils";
import type { InvitationContent } from "../types";

type Profile = InvitationContent["profiles"][number];

interface ProfileSpreadProps {
  profile: Profile;
  /** Đổi chiều: ảnh bên trái tràn mép trái, chữ canh phải. */
  flip?: boolean;
  /** Hạ ảnh xuống để khối này đan vào khối kế tiếp qua dấu "&". */
  dropPhoto?: boolean;
}

/**
 * Một "trang tạp chí" giới thiệu cô dâu / chú rể: chữ một bên, ảnh tràn ra
 * mép bên kia, chữ cái đầu tên cỡ lớn chìm phía sau làm chiều sâu.
 */
const ProfileSpread: React.FC<ProfileSpreadProps> = ({
  profile,
  flip = false,
  dropPhoto = false,
}) => {
  const ref = useRef<HTMLElement>(null);
  const initial = profile.name.split(" ").at(-1)?.charAt(0) ?? "";

  // Ảnh hé mở từ mép tràn vào trong, chữ nối tiếp theo; ảnh trôi chậm hơn
  // trang khi cuộn để tách lớp ảnh khỏi lớp chữ.
  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top 78%",
            toggleActions: REPLAY_TOGGLE_ACTIONS,
          },
        })
        .fromTo(
          "[data-photo]",
          {
            clipPath: flip
              ? "inset(0% 100% 0% 0% round 0px 24px 24px 0px)"
              : "inset(0% 0% 0% 100% round 24px 0px 0px 24px)",
          },
          {
            clipPath: flip
              ? "inset(0% 0% 0% 0% round 0px 24px 24px 0px)"
              : "inset(0% 0% 0% 0% round 24px 0px 0px 24px)",
            duration: 1.4,
            ease: "expo.inOut",
          },
        )
        .from(
          "[data-initial]",
          { opacity: 0, yPercent: 12, duration: 1.6, ease: "power2.out" },
          0.1,
        )
        .from(
          "[data-line]",
          {
            opacity: 0,
            y: 28,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
          },
          0.35,
        );

      gsap.fromTo(
        "[data-parallax]",
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <article
      ref={ref}
      className={cn(
        "relative grid items-start gap-5",
        flip
          ? "grid-cols-[46%_minmax(0,1fr)] text-right"
          : "grid-cols-[minmax(0,1fr)_46%]",
      )}
    >
      <span
        data-initial
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-10 font-display text-[200px] leading-none font-light text-bronze/10 italic select-none",
          flip ? "right-0" : "-left-1",
        )}
      >
        {initial}
      </span>

      <div
        className={cn("relative pt-6", flip ? "order-2" : "order-1")}
      >
        <p
          data-line
          className={cn(
            "flex items-center gap-3 font-text text-[11px] font-medium tracking-[0.28em] text-bronze uppercase",
            flip && "justify-end",
          )}
        >
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-50" />
          {profile.role}
        </p>
        <h3
          data-line
          className="mt-3 pb-1 font-display text-[40px] leading-[1.02] font-light tracking-[-0.03em] text-balance text-wine"
        >
          {profile.name}
        </h3>
        <p
          data-line
          className="mt-4 font-text text-[14px] leading-[1.75] text-pretty text-taupe"
        >
          {profile.bio}
        </p>
      </div>

      <figure
        data-photo
        className={cn(
          "relative aspect-3/4 overflow-hidden bg-sand shadow-[0_30px_50px_-28px_#4c080e73]",
          flip
            ? "order-1 -ml-6 rounded-r-3xl"
            : "order-2 -mr-6 rounded-l-3xl",
          dropPhoto && "mt-24",
        )}
      >
        <div data-parallax className="absolute inset-x-0 inset-y-[-8%]">
          <Image
            src={profile.photo}
            alt={`Chân dung ${profile.role.toLowerCase()} ${profile.name}`}
            fill
            sizes="(min-width: 512px) 240px, 48vw"
            className="object-cover object-[center_30%]"
          />
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-2.5 border border-linen/55",
            flip
              ? "right-2.5 left-0 rounded-r-[18px] border-l-0"
              : "right-0 left-2.5 rounded-l-[18px] border-r-0",
          )}
        />
      </figure>
    </article>
  );
};

export default ProfileSpread;
