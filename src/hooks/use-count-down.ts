"use client";

import { useEffect, useState } from "react";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function diffToCountdown(target: Date): Countdown {
  const totalSeconds = Math.max(
    0,
    Math.floor((target.getTime() - Date.now()) / 1000),
  );
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/**
 * Ticks every second toward `targetIso`. Starts `null` (rendered as the SSR
 * fallback) and only computes on the client, avoiding a hydration mismatch
 * between server render time and the viewer's own clock.
 */
export function useCountdown(targetIso: string): Countdown | null {
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    const target = new Date(targetIso);
    const tick = () => setCountdown(diffToCountdown(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return countdown;
}
