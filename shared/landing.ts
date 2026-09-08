// The Manus Space hostname is stable: each successful publication replaces the
// live checkpoint behind this URL, so CTAs always open the latest published app.
export const LATEST_PUBLISHED_APP_URL = "https://minutopage-hrqkpvou.manus.space/dashboard";

export function getLandingRevealDelay(index: number, step = 60, maximum = 240) {
  const safeIndex = Math.max(0, Math.floor(index));
  return Math.min(safeIndex * step, maximum);
}
