import { describe, expect, it } from "vitest";
import { getSessionCookieOptions } from "./_core/cookies";

describe("session cookie options", () => {
  it("uses a persistent, same-site-safe cookie for HTTPS production traffic", () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const options = getSessionCookieOptions({ protocol: "http", headers: {} } as any);
    process.env.NODE_ENV = previous;

    expect(options).toMatchObject({
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
    });
  });

  it("keeps local HTTP development usable", () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const options = getSessionCookieOptions({ protocol: "http", headers: {} } as any);
    process.env.NODE_ENV = previous;

    expect(options.secure).toBe(false);
    expect(options.sameSite).toBe("lax");
  });
});
