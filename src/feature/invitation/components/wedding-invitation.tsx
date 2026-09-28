"use client";

import { useEffect, useState } from "react";
import {
  replayActiveReveals,
  ScrollTrigger,
} from "@/components/motion/gsap-setup";
import type { InvitationContent } from "../types";
import { InvitationProvider } from "../invitation-context";
import { useAutoScroll } from "../hooks/use-auto-scroll";
import { useWeddingAudio } from "../hooks/use-wedding-audio";
import AlbumSection from "./album-section";
import CountdownSection from "./countdown-section";
import EndingSection from "./ending-section";
import GiftSection from "./gift/gift-section";
import HeroSection from "./hero-section";
import LetterGate from "./letter-gate";
import LoveStorySection from "./love-story-section";
import MusicControl from "./music-control";
import PhotoboothSection from "./photobooth-section";
import RsvpSection from "./rsvp-section";
import ScrollToTop from "./scroll-to-top";
import SunsetStrip from "./sunset-strip";
import InvitationFooter from "./invitation-footer";
import WeddingInfoSection from "./wedding-info-section";
import WelcomeSection from "./welcome-section";

/**
 * Gốc client của trang thiệp (Lễ Tân Hôn / Lễ Vu Quy): giữ trạng thái màn
 * thư + nhạc nền. Hai trang chỉ khác `content`.
 * Nội dung luôn render bên dưới màn thư (để ScrollTrigger đo layout đúng)
 * nhưng `inert` + khoá cuộn cho tới khi thư được mở.
 */
interface WeddingInvitationProps {
  content: InvitationContent;
}

const WeddingInvitation: React.FC<WeddingInvitationProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [gateMounted, setGateMounted] = useState(true);
  const audio = useWeddingAudio(content.audioSrc);
  // Bắt đầu khi màn thư đã gỡ hẳn và trang đã mở khoá cuộn.
  useAutoScroll(isOpen && !gateMounted);

  useEffect(() => {
    if (!gateMounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [gateMounted]);

  const handleOpenStart = () => {
    void audio.play();
    window.scrollTo({ top: 0, behavior: "instant" });
    replayActiveReveals();
    setIsOpen(true);
  };

  const handleOpened = () => {
    setGateMounted(false);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <InvitationProvider value={content}>
      <a
        href="#noi-dung"
        className="fixed top-3 left-3 z-10000 translate-y-[-150%] bg-white px-3.5 py-2.5 font-text text-[12px] font-semibold text-[#111] focus:translate-y-0"
      >
        Đến nội dung thiệp
      </a>

      {gateMounted && (
        <LetterGate onOpenStart={handleOpenStart} onOpened={handleOpened} />
      )}

      <div inert={!isOpen} className="bg-linen text-cocoa">
        {isOpen && (
          <>
            <MusicControl playing={audio.playing} onToggle={audio.toggle} />
            <ScrollToTop />
          </>
        )}

        <main id="noi-dung" className="overflow-hidden">
          <HeroSection isOpen={isOpen} />
          <WelcomeSection />
          <LoveStorySection />
          <PhotoboothSection />
          <SunsetStrip />
          <WeddingInfoSection />
          <AlbumSection />
          <CountdownSection />
          <RsvpSection />
          <GiftSection />
          <EndingSection />
        </main>

        <InvitationFooter />
      </div>
    </InvitationProvider>
  );
};

export default WeddingInvitation;
