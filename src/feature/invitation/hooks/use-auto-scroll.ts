import { useEffect } from "react";
import { prefersReducedMotion } from "@/components/motion/gsap-setup";

/** Tốc độ cuộn tự động (px/giây). */
const SPEED = 120;
/** Chờ intro của hero chạy một nhịp rồi mới bắt đầu cuộn. */
const START_DELAY_MS = 1500;
/** Thời gian tăng tốc từ 0 lên `SPEED`, để lúc bắt đầu không bị giật. */
const RAMP_MS = 1200;

const STOP_EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

/**
 * Tự cuộn trang từ từ khi `active`. Dừng hẳn khi khách tự tương tác (cuộn,
 * chạm, bấm phím) hoặc khi đã tới cuối trang.
 */
export const useAutoScroll = (active: boolean) => {
  useEffect(() => {
    if (!active || prefersReducedMotion()) return;

    let frame = 0;
    let startTime = 0;
    let lastTime = 0;
    // Giữ vị trí dạng số thực: trình duyệt làm tròn scrollY, cộng dồn từ đó sẽ bị kẹt.
    let y = window.scrollY;

    const stop = () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      STOP_EVENTS.forEach((type) => window.removeEventListener(type, stop));
    };

    const step = (now: number) => {
      if (!startTime) {
        startTime = now;
        lastTime = now;
      }
      // Kẹp dt để quay lại tab không bị nhảy một đoạn dài.
      const dt = Math.min(now - lastTime, 50) / 1000;
      lastTime = now;
      const ramp = Math.min((now - startTime) / RAMP_MS, 1);

      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      y = Math.min(y + SPEED * ramp * dt, maxY);
      window.scrollTo(0, y);

      if (y >= maxY) {
        stop();
        return;
      }
      frame = requestAnimationFrame(step);
    };

    const timer = setTimeout(() => {
      y = window.scrollY;
      frame = requestAnimationFrame(step);
    }, START_DELAY_MS);

    STOP_EVENTS.forEach((type) =>
      window.addEventListener(type, stop, { passive: true }),
    );

    return stop;
  }, [active]);
};
