"use client";

import { useEffect, useState } from "react";
import {
  BLACK_DAYS_START_MS,
  formatCountdownPart,
  getBlackDaysCountdown,
  type BlackDaysCountdown,
} from "@/features/promotions/black-days";

export function BlackDaysCountdown() {
  const [countdown, setCountdown] = useState<BlackDaysCountdown>(() =>
    getBlackDaysCountdown(BLACK_DAYS_START_MS)
  );

  useEffect(() => {
    const update = () => setCountdown(getBlackDaysCountdown(Date.now()));
    update();
    const intervalId = window.setInterval(update, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  if (!countdown.isActive) return null;

  return (
    <span
      className="inline-flex flex-wrap items-center gap-x-1 gap-y-0.5 font-mono font-bold tabular-nums text-[10px]"
      aria-label={`Tiempo restante de Black Days: ${formatCountdownPart(countdown.days)}d ${formatCountdownPart(countdown.hours)}h ${formatCountdownPart(countdown.minutes)}m ${formatCountdownPart(countdown.seconds)}s`}
    >
      <span>{formatCountdownPart(countdown.days)} días</span>
      <span>{formatCountdownPart(countdown.hours)} horas</span>
      <span>{formatCountdownPart(countdown.minutes)} minutos</span>
      <span>{formatCountdownPart(countdown.seconds)} segundos</span>
    </span>
  );
}
