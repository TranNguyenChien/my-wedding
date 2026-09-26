import { Heart } from "@phosphor-icons/react/ssr";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Nhãn nhỏ in hoa phía trên — dùng tiết kiệm, không phải section nào cũng cần. */
  kicker?: string;
  /** Dòng chữ viết tay màu đồng phía trên; khi có, `title` chuyển sang serif nhỏ hơn. */
  script?: string;
  /** Tiêu đề; bọc chữ cần nhấn trong `<em>` để hiện italic màu đồng. */
  title: React.ReactNode;
  titleId?: string;
  align?: "center" | "start";
  tone?: "wine" | "light";
  children?: React.ReactNode;
  className?: string;
}

/** Tiêu đề serif lớn kiểu tạp chí + đoạn mô tả ngắn. */
const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  script,
  title,
  titleId,
  align = "center",
  tone = "wine",
  children,
  className,
}) => {
  const light = tone === "light";

  return (
    <header
      className={cn(
        "relative z-3",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {kicker && (
        <p
          className={cn(
            "mb-4 font-text text-[11px] font-medium tracking-[0.28em] uppercase",
            light ? "text-champagne/80" : "text-bronze",
          )}
        >
          {kicker}
        </p>
      )}
      {script && (
        <p
          className={cn(
            "font-script text-[58px] leading-[0.82]",
            light ? "text-champagne" : "text-bronze",
          )}
        >
          {script}
        </p>
      )}
      <h2
        id={titleId}
        className={cn(
          script
            ? "mt-2 font-display text-[36px] leading-[1.05] tracking-[-1px]"
            : "pb-1 font-script text-[60px] leading-[1.02] font-light tracking-[-0.02em]",
          "text-balance [&_em]:font-normal [&_em]:italic",
          light
            ? "text-[#fff8ec] [&_em]:text-champagne"
            : "text-wine [&_em]:text-bronze",
        )}
      >
        {title}
      </h2>

      <div
        aria-hidden
        className={cn(
          "mt-3 flex items-center gap-3",
          align === "center" ? "justify-center" : "justify-start",
          light ? "text-champagne" : "text-bronze",
        )}
      >
        <span className="h-px w-14 bg-current opacity-40" />
        <Heart weight="fill" className="size-2.5" />
        <span className="h-px w-14 bg-current opacity-40" />
      </div>

      {children && (
        <p
          className={cn(
            "mt-4 max-w-[34ch] font-text text-[14px] leading-[1.75] text-pretty",
            align === "center" && "mx-auto",
            light ? "text-[#f1ddd6]" : "text-taupe",
          )}
        >
          {children}
        </p>
      )}
    </header>
  );
};

export default SectionHeading;
