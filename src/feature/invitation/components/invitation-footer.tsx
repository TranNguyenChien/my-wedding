"use client";

import { useInvitation } from "../invitation-context";

const InvitationFooter: React.FC = () => {
  const content = useInvitation();
  return (
    <footer className="flex min-h-47.5 flex-col items-center justify-center bg-wine-dark px-5 py-11 text-center text-linen">
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
