import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import {
  PLANS,
  PLAN_FEATURES_TABLE,
  canAccessAudio,
  canAccessTrail,
} from "../shared/plans";
import type { TrpcContext } from "./_core/context";

function createMockContext(userId: number = 1): TrpcContext {
  return {
    user: {
      id: userId,
      openId: `test-user-${userId}`,
      email: `user${userId}@example.com`,
      name: `User ${userId}`,
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as any,
    res: {
      clearCookie: () => {},
    } as any,
  };
}

describe("Planos e Modelo de Negócio", () => {
  it("contém a definição correta dos 3 planos com seus respectivos preços", () => {
    expect(PLANS.free).toBeDefined();
    expect(PLANS.free.priceMonthly).toBe(0);
    expect(PLANS.free.trialDays).toBe(7);

    expect(PLANS.starter).toBeDefined();
    expect(PLANS.starter.priceMonthly).toBe(990); // R$ 9,90
    expect(PLANS.starter.displayPrice).toBe("R$ 9,90");

    expect(PLANS.premium).toBeDefined();
    expect(PLANS.premium.priceMonthly).toBe(1490); // R$ 14,90
    expect(PLANS.premium.displayPrice).toBe("R$ 14,90");
    expect(PLANS.premium.highlight).toBe(true);
  });

  it("garante que a tabela comparativa possui os dois últimos itens exigidos: Notificações diárias e Suporte", () => {
    const totalItems = PLAN_FEATURES_TABLE.length;
    expect(totalItems).toBeGreaterThanOrEqual(9);

    const penultimate = PLAN_FEATURES_TABLE[totalItems - 2];
    const last = PLAN_FEATURES_TABLE[totalItems - 1];

    expect(penultimate.name).toBe("Notificações diárias");
    expect(last.name).toBe("Suporte");

    expect(last.free).toBe(false);
    expect(last.starter).toBe("Sim");
    expect(last.premium).toBe("Prioritário");
  });

  it("verifica a regra de Gamificação e Diário de Bordo nos 3 planos", () => {
    const gamification = PLAN_FEATURES_TABLE.find(f => f.name === "Gamificação");
    const journal = PLAN_FEATURES_TABLE.find(f => f.name === "Diário de Bordo");

    expect(gamification).toBeDefined();
    expect(gamification?.free).toBe(true);
    expect(gamification?.starter).toBe(true);
    expect(gamification?.premium).toBe(true);

    expect(journal).toBeDefined();
    expect(journal?.free).toBe(true);
    expect(journal?.starter).toBe(true);
    expect(journal?.premium).toBe(true);
  });

  it("valida regras de permissão de áudio: liberado no trial de 7 dias ou somente para Premium ativo", () => {
    // No período de degustação (trial de 7 dias)
    expect(canAccessAudio({ planId: "free", isActive: true, isTrialing: true })).toBe(true);

    // No plano Starter ativo (áudios NÃO incluídos)
    expect(canAccessAudio({ planId: "starter", isActive: true, isTrialing: false })).toBe(false);

    // No plano Premium ativo (áudios liberados)
    expect(canAccessAudio({ planId: "premium", isActive: true, isTrialing: false })).toBe(true);

    // Assinatura inativa ou cancelada
    expect(canAccessAudio({ planId: "premium", isActive: false, isTrialing: false })).toBe(false);
  });

  it("valida regras de permissão de trilhas temáticas: trilhas free liberadas, premium somente no trial ou Premium ativo", () => {
    // Trilha gratuita liberada para todos
    expect(canAccessTrail("free", { planId: "starter", isActive: true, isTrialing: false })).toBe(true);

    // Trilha premium liberada no trial de 7 dias
    expect(canAccessTrail("premium", { planId: "free", isActive: true, isTrialing: true })).toBe(true);

    // Trilha premium bloqueada no Starter
    expect(canAccessTrail("premium", { planId: "starter", isActive: true, isTrialing: false })).toBe(false);

    // Trilha premium liberada no Premium
    expect(canAccessTrail("premium", { planId: "premium", isActive: true, isTrialing: false })).toBe(true);
  });
});

describe("tRPC planRouter", () => {
  it("retorna o catálogo completo de planos e a tabela comparativa", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const catalog = await caller.plans.catalog();
    expect(catalog.plans.length).toBe(3);
    expect(catalog.featuresTable.length).toBeGreaterThanOrEqual(9);
  });

  it("cria sessão de checkout para plano starter ou premium", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const session = await caller.plans.createCheckout({
      planId: "premium",
      origin: "https://minuto-da-provisao.manus.space",
    });

    expect(session).toBeDefined();
    expect(session.url).toBeDefined();
    expect(session.sessionId).toBeDefined();
  });
});
