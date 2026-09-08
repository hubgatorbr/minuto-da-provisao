import { describe, expect, it } from "vitest";
import { users } from "../drizzle/schema";
import { getLoginRedirect, getProtectedRedirect } from "../client/src/auth-routing";

describe("auth routing", () => {
  it("redirects unauthenticated users to the central login route", () => {
    expect(getProtectedRedirect({ loading: false, authenticated: false })).toBe("/login");
    expect(getProtectedRedirect({ loading: true, authenticated: false })).toBeNull();
  });

  it("keeps authenticated users in the application and away from login", () => {
    expect(getProtectedRedirect({ loading: false, authenticated: true })).toBeNull();
    expect(getLoginRedirect({ loading: false, authenticated: true })).toBe("/app");
    expect(getLoginRedirect({ loading: true, authenticated: true })).toBeNull();
  });

  it("uses the unique OAuth openId as the user identity key", () => {
    expect(users.openId.name).toBe("openId");
    expect(users.openId.config.isUnique).toBe(true);
  });
});
