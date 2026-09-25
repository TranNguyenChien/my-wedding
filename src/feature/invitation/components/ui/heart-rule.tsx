import { cn } from "@/lib/utils";

interface HeartRuleProps {
  tone?: "gold" | "light";
  align?: "center" | "start";
  className?: string;
}

/** Hai vạch mảnh kẹp một trái tim — dấu ngắt quen thuộc giữa tiêu đề và mô tả. */
const HeartRule: React.FC<HeartRuleProps> = ({
  tone = "gold",
  align = "center",
  className,
}) => {
  const line = cn(
    "h-px w-11",
    tone === "gold" ? "bg-[#bc8d61]/40" : "bg-[#f0d9b5]/45",
  );

  return (
    <span
      aria-hidden="true"
      className={cn(
        "my-4 flex items-center gap-3 text-[10px]",
        tone === "gold" ? "text-[#bc8d61]" : "text-[#f0d9b5]",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
    >
      <i className={line} />♥<i className={line} />
    </span>
  );
};

export default HeartRule;
