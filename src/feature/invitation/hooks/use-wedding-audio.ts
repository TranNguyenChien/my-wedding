"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Nhạc nền của thiệp. Trình duyệt chỉ cho phát sau một thao tác của người
 * dùng, nên `play()` được gọi từ nút mở thư; lỗi autoplay bị bỏ qua.
 */
export function useWeddingAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "metadata";
    audio.volume = 0.52;
    const sync = () => setPlaying(!audio.paused);
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
      audioRef.current = null;
    };
  }, [src]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    try {
      await audio.play();
    } catch {
      // Autoplay bị chặn hoặc chưa có file nhạc — nút nhạc vẫn cho thử lại.
    }
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void play();
    else audio.pause();
  }, [play]);

  return { playing, play, toggle };
}
