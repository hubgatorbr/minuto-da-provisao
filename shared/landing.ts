export type LandingCtaAction = "disabled" | "dashboard" | "login";

export function getLandingCtaAction(isAuthenticated: boolean, loading: boolean): LandingCtaAction {
  if (loading) return "disabled";
  return isAuthenticated ? "dashboard" : "login";
}

export function getLandingRevealDelay(index: number, step = 60, maximum = 240) {
  const safeIndex = Math.max(0, Math.floor(index));
  return Math.min(safeIndex * step, maximum);
}
