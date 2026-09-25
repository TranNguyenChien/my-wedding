import { cn } from "@/lib/utils";
import HeartRule from "./heart-rule";

interface SectionHeadingProps {
  script: string;
  title?: string;
  titleId?: string;
  children?: React.ReactNode;
  className?: string;
}

/** Tiêu đề chữ viết tay + tiêu đề serif + heart rule + đoạn mô tả, căn giữa. */
const SectionHeading: React.FC<SectionHeadingProps> = ({
  script,
  title,
  titleId,
  children,
  className,
}) => (
  <header className={cn("relative z-[3] text-center", className)}>
    <p
      id={title ? undefined : titleId}
      className="font-script text-[58px] leading-[0.82] text-bronze"
    >
      {script}
    </p>
    {title && (
      <h2
        id={titleId}
        className="mt-2 font-display text-[36px] leading-[1.05] tracking-[-1px] text-wine"
      >
        {title}
      </h2>
    )}
    <HeartRule />
    {children && (
      <p className="mx-auto font-text text-[11.5px] leading-[1.8] font-light text-taupe">
        {children}
      </p>
    )}
  </header>
);

export default SectionHeading;
