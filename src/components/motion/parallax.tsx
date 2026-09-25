"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";

const DEPTH_OFFSET = {
  foreground: -40,
  midground: -20,
  background: -8,
} as const;

type ParallaxProps = {
  children: ReactNode;
  depth?: keyof typeof DEPTH_OFFSET;
  className?: string;
};

/** Subtle scroll-scrubbed translateY, depth per the brief's foreground/mid/background scale. */
export function Parallax({
  children,
  depth = "midground",
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      ensureGsapReady();

      gsap.to(el, {
        y: DEPTH_OFFSET[depth],
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: ref, dependencies: [depth] },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
