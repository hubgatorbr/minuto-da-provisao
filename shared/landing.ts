// The Manus Space hostname is stable: each successful publication replaces the
// live checkpoint behind this URL. Every commercial CTA enters through the
// application's dedicated login page rather than opening protected content.
export const PUBLISHED_APP_LOGIN_URL = "https://minutopage-hrqkpvou.manus.space/login";

export function getLandingRevealDelay(index: number, step = 60, maximum = 240) {
  const safeIndex = Math.max(0, Math.floor(index));
  return Math.min(safeIndex * step, maximum);
}
