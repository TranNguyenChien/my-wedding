"use client";

import { useRef, useState } from "react";
import { Minus, Plus } from "@phosphor-icons/react/ssr";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap-setup";
import { cn } from "@/lib/utils";

interface GuestStepperProps {
  id?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  invalid?: boolean;
  describedBy?: string;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const STEP_BUTTON =
  "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-wine/15 bg-white/80 text-wine transition-[background-color,scale,opacity] hover:bg-wine hover:text-[#fff8ef] active:scale-[0.94] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white/80 disabled:hover:text-wine";

/**
 * Bộ đếm số khách: bấm −/+ hoặc gõ trực tiếp. Khi đang gõ giữ chuỗi nháp
 * (cho phép xoá trắng), rời ô thì kẹp về [min, max].
 */
const GuestStepper: React.FC<GuestStepperProps> = ({
  id,
  value,
  min = 1,
  max = 10,
  onChange,
  onBlur,
  invalid,
  describedBy,
}) => {
  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const step = (delta: number) => {
    const next = clamp(value + delta, min, max);
    if (next === value) return;
    setDraft(null);
    onChange(next);
    if (inputRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        inputRef.current,
        { y: delta > 0 ? 8 : -8, autoAlpha: 0.2 },
        { y: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" },
      );
    }
  };

  const handleInput = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    setDraft(digits);
    const parsed = Number(digits);
    if (digits && parsed >= min && parsed <= max) onChange(parsed);
  };

  const commit = () => {
    if (draft !== null) {
      const parsed = Number(draft);
      onChange(draft ? clamp(parsed, min, max) : min);
      setDraft(null);
    }
    onBlur?.();
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-full border bg-[#fffdf9] p-1.5 transition-[border-color,box-shadow] focus-within:border-wine/60 focus-within:shadow-[0_0_0_4px_rgba(120,19,29,0.07)]",
        invalid ? "border-[#a3222d]/60" : "border-wine/15",
      )}
    >
      <button
        type="button"
        aria-label="Giảm số khách"
        disabled={value <= min}
        onClick={() => step(-1)}
        className={STEP_BUTTON}
      >
        <Minus weight="bold" className="size-4" />
      </button>

      <div className="flex min-w-0 flex-1 items-baseline justify-center gap-1.5 overflow-hidden">
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          aria-invalid={invalid}
          aria-describedby={describedBy}
          value={draft ?? String(value)}
          onChange={(e) => handleInput(e.target.value)}
          onBlur={commit}
          onFocus={(e) => e.target.select()}
          className="nums w-10 bg-transparent text-right font-display text-[30px] leading-none text-wine outline-none"
        />
        <span className="font-text text-[13px] text-taupe">người</span>
      </div>

      <button
        type="button"
        aria-label="Tăng số khách"
        disabled={value >= max}
        onClick={() => step(1)}
        className={STEP_BUTTON}
      >
        <Plus weight="bold" className="size-4" />
      </button>
    </div>
  );
};

export default GuestStepper;
