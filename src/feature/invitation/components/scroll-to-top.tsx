"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/components/motion/gsap-setup";
import { cn } from "@/lib/utils";

/** Nút về đầu trang nổi, bám góc phải dưới của cột thiệp; hiện khi đã cuộn qua màn đầu. */
const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Về đầu trang"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "fixed right-[max(12px,calc(50%-256px+12px))] bottom-4 z-900 grid size-10.5 cursor-pointer place-items-center rounded-full border border-[#f3dfbd]/40 bg-[#5b0e17]/90 text-[#f6ead6] shadow-[0_8px_25px_#23030830] backdrop-blur-sm transition-[opacity,translate] duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};

export default ScrollToTop;
