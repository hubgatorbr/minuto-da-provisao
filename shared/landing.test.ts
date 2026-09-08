import { describe, expect, it } from "vitest";
import { getLandingCtaAction, getLandingRevealDelay } from "./landing";

describe("getLandingCtaAction", () => {
  it("bloqueia a ação enquanto o estado de autenticação está carregando", () => {
    expect(getLandingCtaAction(false, true)).toBe("disabled");
    expect(getLandingCtaAction(true, true)).toBe("disabled");
  });

  it("leva usuários autenticados diretamente ao dashboard", () => {
    expect(getLandingCtaAction(true, false)).toBe("dashboard");
  });

  it("inicia o login para visitantes não autenticados", () => {
    expect(getLandingCtaAction(false, false)).toBe("login");
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
