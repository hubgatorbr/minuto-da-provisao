export async function getAuthStatus(authenticate: () => Promise<unknown>) {
  try {
    await authenticate();
    return { authenticated: true } as const;
  } catch {
    return { authenticated: false } as const;
  }
}
