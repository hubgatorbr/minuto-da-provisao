import { describe, expect, it } from "vitest";
import { getLandingRevealDelay, LANDING_LOGIN_ROUTE } from "./landing";

describe("LANDING_LOGIN_ROUTE", () => {
  it("direciona CTAs para o login da aplicação integrada, sem domínio externo", () => {
    expect(LANDING_LOGIN_ROUTE).toBe("/login");
    expect(LANDING_LOGIN_ROUTE.startsWith("http")).toBe(false);
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
