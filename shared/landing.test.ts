import { describe, expect, it } from "vitest";
import { getLandingRevealDelay, PUBLISHED_APP_URL } from "./landing";

describe("PUBLISHED_APP_URL", () => {
  it("aponta somente para a aplicação publicada", () => {
    const url = new URL(PUBLISHED_APP_URL);
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe("minutopage-hrqkpvou.manus.space");
    expect(url.pathname).toBe("/dashboard");
  });
});

describe("getLandingRevealDelay", () => {
  it("cria um stagger progressivo e limitado para grupos visuais", () => {
    expect(getLandingRevealDelay(0)).toBe(0);
    expect(getLandingRevealDelay(2)).toBe(120);
    expect(getLandingRevealDelay(10)).toBe(240);
  });

  it("normaliza índices negativos e aceita ritmos personalizados", () => {
    expect(getLandingRevealDelay(-2)).toBe(0);
    expect(getLandingRevealDelay(3, 40, 200)).toBe(120);
  });
});
