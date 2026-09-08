export type LandingCtaAction = "disabled" | "dashboard" | "login";

export function getLandingCtaAction(isAuthenticated: boolean, loading: boolean): LandingCtaAction {
  if (loading) return "disabled";
  return isAuthenticated ? "dashboard" : "login";
}
