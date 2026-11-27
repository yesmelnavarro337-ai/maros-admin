export const BLACK_DAYS_START = "2026-11-27T00:00:00-05:00";
export const BLACK_DAYS_END = "2026-11-29T23:59:59-05:00";
export const BLACK_DAYS_TIMEZONE = "America/Bogota";
export const BLACK_DAYS_UTC_OFFSET = "-05:00";
export const PROMO_DISCOUNT_PERCENT = 0.05;
export const BLACK_DAYS_MESSAGE = "Black Days — 5% de descuento (27 al 29 de nov)";

const START_MS = Date.parse(BLACK_DAYS_START);
const END_MS = Date.parse(BLACK_DAYS_END);

export const BLACK_DAYS_START_MS = START_MS;
export const BLACK_DAYS_END_MS = END_MS;

export interface BlackDaysCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isActive: boolean;
  hasStarted: boolean;
  hasEnded: boolean;
}

export function isBlackDaysActive(currentDate: Date | number = new Date()): boolean {
  const time = typeof currentDate === "number" ? currentDate : currentDate.getTime();
  return time >= START_MS && time <= END_MS;
}

export function getBlackDaysCountdown(now: number = Date.now()): BlackDaysCountdown {
  const remainingMs = Math.max(0, END_MS - now);
  const totalSeconds = Math.floor(remainingMs / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
    isActive: isBlackDaysActive(now),
    hasStarted: now >= START_MS,
    hasEnded: now > END_MS,
  };
}

export function formatCountdownPart(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0");
}
