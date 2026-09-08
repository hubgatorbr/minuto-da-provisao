export type AuthRoutingState = {
  loading: boolean;
  authenticated: boolean;
};

export function getProtectedRedirect({ loading, authenticated }: AuthRoutingState): "/login" | null {
  return loading || authenticated ? null : "/login";
}

export function getLoginRedirect({ loading, authenticated }: AuthRoutingState): "/app" | null {
  return loading || !authenticated ? null : "/app";
}
