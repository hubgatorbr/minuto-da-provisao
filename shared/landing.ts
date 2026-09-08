export const PUBLISHED_APP_URL = "https://minutopage-hrqkpvou.manus.space/dashboard";

export function getLandingRevealDelay(index: number, step = 60, maximum = 240) {
  const safeIndex = Math.max(0, Math.floor(index));
  return Math.min(safeIndex * step, maximum);
}
