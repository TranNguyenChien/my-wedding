"use client";

import { cn } from "@/lib/utils";

interface MusicControlProps {
  playing: boolean;
  onToggle: () => void;
}

const BAR_DELAYS = ["0s", "0.18s", "0.34s", "0.1s"];

/** Nút nhạc nổi, bám góc phải của cột thiệp (không phải góc màn hình desktop). */
const MusicControl: React.FC<MusicControlProps> = ({ playing, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={playing}
    aria-label={playing ? "Tạm dừng nhạc" : "Phát nhạc"}
    className="fixed top-3 right-[max(12px,calc(50%-256px+12px))] z-[900] grid size-[42px] cursor-pointer place-items-center rounded-full border border-[#f3dfbd]/40 bg-[#5b0e17]/90 text-white shadow-[0_8px_25px_#23030830] backdrop-blur-sm"
  >
    <span aria-hidden="true" className="flex h-4 items-center gap-0.5">
      {BAR_DELAYS.map((delay) => (
        <i
          key={delay}
          style={{ animationDelay: delay }}
          className={cn(
            "w-px bg-[#f6ead6] motion-safe:animate-music-bar",
            playing ? "h-2.5" : "h-[5px] [animation-play-state:paused]",
          )}
        />
      ))}
    </span>
  </button>
);

export default MusicControl;
