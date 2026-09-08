export const LANDING_LOGIN_ROUTE = "/login";

export function getLandingRevealDelay(index: number, step = 60, maximum = 240) {
  const safeIndex = Math.max(0, Math.floor(index));
  return Math.min(safeIndex * step, maximum);
}
