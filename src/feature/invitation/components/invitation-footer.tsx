"use client";

import { useInvitation } from "../invitation-context";

const InvitationFooter: React.FC = () => {
  const content = useInvitation();
  return (
    <footer className="flex min-h-[190px] flex-col items-center justify-center bg-wine-dark px-5 py-11 text-center text-linen">
      <p className="mb-3 font-script text-[40px] leading-none">
        {content.groomName} <span>&amp;</span> {content.brideName}
      </p>
      <time
        dateTime={content.dateIso}
        className="font-text text-[8px] font-medium tracking-[4px] text-[#d9bf9b]"
      >
        {content.dateDots}
      </time>
      <a
        href="#noi-dung"
        className="mt-7 font-text text-[8px] font-medium tracking-[2px] transition-opacity hover:opacity-70"
      >
        Về đầu trang ↑
      </a>
    </footer>
  );
};

export default InvitationFooter;
