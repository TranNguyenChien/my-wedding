import { cn } from "@/lib/utils";

const PATHS = {
  bottom: {
    viewBox: "0 0 900 150",
    d: "M0 42C165 104 280 116 429 91c189-31 298-85 471 18v41H0Z",
  },
  top: {
    viewBox: "0 0 900 145",
    d: "M0 0h900v96C718 45 548 110 367 74 210 43 99 79 0 107Z",
  },
} as const;

interface WaveProps {
  edge: keyof typeof PATHS;
  /** Tailwind `fill-*` class — màu của section liền kề. */
  fillClassName: string;
  className?: string;
}

/** Đường cong mềm nối ảnh full-bleed với section kế bên. */
const Wave: React.FC<WaveProps> = ({ edge, fillClassName, className }) => (
  <svg
    viewBox={PATHS[edge].viewBox}
    preserveAspectRatio="none"
    aria-hidden="true"
    className={cn(
      "pointer-events-none absolute left-0 z-4 w-full",
      edge === "bottom" ? "-bottom-px" : "-top-px",
      className,
    )}
  >
    <path d={PATHS[edge].d} className={fillClassName} />
  </svg>
);

export default Wave;
