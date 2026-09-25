import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

/** Registers ScrollTrigger + SplitText once, client-side only. Safe to call repeatedly. */
export function ensureGsapReady() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * toggleActions cho reveal theo cuộn: chạy mỗi lần phần tử vào khung nhìn
 * (cả khi cuộn xuống lẫn cuộn ngược lên), và reset khi ra khỏi khung nhìn
 * để lần sau thấy lại thì chạy lại từ đầu.
 */
export const REPLAY_TOGGLE_ACTIONS = "play reset play reset";

/**
 * Chạy lại các reveal đang nằm trong khung nhìn — dùng khi một lớp phủ
 * (màn thư) vừa gỡ ra, vì những reveal đó đã chạy xong khi còn bị che.
 */
export function replayActiveReveals() {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (
      trigger.isActive &&
      trigger.animation &&
      trigger.vars.toggleActions === REPLAY_TOGGLE_ACTIONS
    ) {
      trigger.animation.restart(true);
    }
  });
}

export { gsap, ScrollTrigger, SplitText };
