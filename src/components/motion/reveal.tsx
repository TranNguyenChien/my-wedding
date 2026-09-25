"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
  REPLAY_TOGGLE_ACTIONS,
} from "@/components/motion/gsap-setup";

type RevealProps = {
  children: ReactNode;
  /** "fade-up" for text/blocks, "clip" for a cinematic mask reveal on imagery. */
  variant?: "fade-up" | "clip";
  delay?: number;
  className?: string;
};

/**
 * Scroll reveal (fade-up or clip-path mask), power3.out, ~1s — replays each
 * time the element scrolls into view (see REPLAY_TOGGLE_ACTIONS).
 * Renders fully visible until the effect runs, and is a no-op under
 * prefers-reduced-motion — content just stays visible.
 */
export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      ensureGsapReady();

      const scrollTrigger = {
        trigger: el,
        start: "top 85%",
        toggleActions: REPLAY_TOGGLE_ACTIONS,
      };

      if (variant === "clip") {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            delay,
            ease: "power3.out",
            scrollTrigger,
          },
        );
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay,
            ease: "power3.out",
            scrollTrigger,
          },
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
