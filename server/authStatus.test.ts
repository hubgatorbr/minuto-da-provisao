import { describe, expect, it } from "vitest";
import { getAuthStatus } from "./authStatus";

describe("getAuthStatus", () => {
  it("informa sessão autenticada quando a validação é aceita", async () => {
    await expect(getAuthStatus(async () => ({ id: 1 }))).resolves.toEqual({ authenticated: true });
  });

  it("responde como visitante sem propagar detalhes da falha de autenticação", async () => {
    await expect(getAuthStatus(async () => { throw new Error("invalid session"); })).resolves.toEqual({ authenticated: false });
  });
});
