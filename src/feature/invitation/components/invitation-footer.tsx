"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { useInvitation } from "../invitation-context";

const InvitationFooter: React.FC = () => {
  const content = useInvitation();
  const { sibling } = content;

  return (
    <footer className="flex flex-col items-center bg-wine-dark px-5 pt-12 pb-11 text-center text-linen">
      {/* Thẻ vé dẫn sang thiệp của buổi lễ còn lại. */}
      <Link
        href={sibling.href}
        aria-label={`Xem thiệp ${sibling.eventName}, ngày ${sibling.dateShort} tại ${sibling.place}`}
        className="group relative w-full max-w-85 rounded-[22px] border border-champagne/25 bg-linen/4 p-1.5 transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-champagne/50 hover:bg-linen/7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne active:scale-[0.98]"
      >
        <span className="flex items-center gap-4 rounded-[17px] border border-dashed border-champagne/20 py-4 pr-4 pl-5 text-left">
          <span className="min-w-0 flex-1">
            <span className="block font-text text-[11.5px] leading-none text-champagne/75">
              Mời bạn xem thêm thiệp
            </span>
            <span className="mt-2 block font-display text-[24px] leading-[1.1] text-[#fff8ec]">
              {sibling.eventName}
            </span>
            <span className="mt-1.5 block font-time text-[11px] font-semibold tracking-[2px] text-champagne tabular-nums">
              {sibling.dateShort}
              <span className="px-2 opacity-50">|</span>
              {sibling.place.toUpperCase()}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-champagne text-wine-dark transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
          >
            <ArrowRightIcon size={18} weight="bold" />
          </span>
        </span>
      </Link>

      <span aria-hidden="true" className="mt-10 mb-8 h-px w-16 bg-champagne/25" />

      <p className="mb-3 font-script text-[40px] leading-none">
        {content.firstName} <span>&amp;</span>
        <br /> {content.secondName}
      </p>
      <time
        dateTime={content.dateIso}
        className="font-text text-[11px] font-semibold tracking-[4px] text-champagne"
      >
        {content.dateDots}
      </time>
    </footer>
  );
};

export default InvitationFooter;
