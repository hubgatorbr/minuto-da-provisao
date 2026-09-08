import { describe, expect, it } from "vitest";
import { getLandingCtaAction } from "./landing";

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
