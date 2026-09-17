import { describe, expect, it } from "vitest";
import { thematicTrailSeeds } from "../shared/thematic-trails";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(userId?: number): TrpcContext {
  return {
    user: userId
      ? {
          id: userId,
          openId: `user-${userId}`,
          email: `user${userId}@example.com`,
          name: `User ${userId}`,
          avatarUrl: null,
          loginMethod: "manus",
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        }
      : null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("Thematic Trails Feature", () => {
  it("has valid seeds for Ansiedade Financeira with 7 days", () => {
    const anxietyTrail = thematicTrailSeeds.find((t) => t.slug === "ansiedade-financeira");
    expect(anxietyTrail).toBeDefined();
    expect(anxietyTrail?.durationDays).toBe(7);
    expect(anxietyTrail?.items).toHaveLength(7);
    expect(anxietyTrail?.accessLevel).toBe("free");

    // Verificar se todas as posições são de 1 a 7 consecutivas
    const positions = anxietyTrail?.items.map((i) => i.position);
    expect(positions).toEqual([1, 2, 3, 4, 5, 6, 7]);

    // Verificar se cada etapa tem introdução pastoral, ação prática e pergunta de discernimento
    anxietyTrail?.items.forEach((item) => {
      expect(item.trailIntro).toBeTruthy();
      expect(item.actionPrompt).toBeTruthy();
      expect(item.reviewQuestion).toBeTruthy();
      expect(item.dayNumber).toBeGreaterThan(0);
      expect(item.dayNumber).toBeLessThanOrEqual(365);
    });
  });

  it("includes at least 10 planned thematic trails in the catalogue", () => {
    expect(thematicTrailSeeds.length).toBeGreaterThanOrEqual(10);
    const slugs = thematicTrailSeeds.map((t) => t.slug);
    expect(slugs).toContain("ansiedade-financeira");
    expect(slugs).toContain("lideranca-com-proposito");
    expect(slugs).toContain("decisoes-dificeis");
    expect(slugs).toContain("recomeco-depois-de-uma-crise");
    expect(slugs).toContain("equilibrio-trabalho-e-familia");
    expect(slugs).toContain("integridade-nas-negociacoes");
    expect(slugs).toContain("transformacao-digital");
    expect(slugs).toContain("inteligencia-artificial");
    expect(slugs).toContain("gestao-e-planejamento-estrategico");
    expect(slugs).toContain("recrutamento-e-desenvolvimento-de-pessoas");
  });

  it("lists published trails through trpc procedure without exposing private data to guests", async () => {
    const guestCtx = createMockContext();
    const caller = appRouter.createCaller(guestCtx);

    const trails = await caller.trails.list();
    expect(Array.isArray(trails)).toBe(true);
    expect(trails.length).toBeGreaterThan(0);

    const first = trails.find((t) => t.slug === "ansiedade-financeira");
    expect(first).toBeDefined();
    expect(first?.title).toBe("Ansiedade Financeira");
    expect(first?.durationDays).toBe(7);
    expect(first?.accessLevel).toBe("free");
    // Não deve expor campos privados de progresso de usuários
    expect((first as any).userProgress).toBeUndefined();
    expect((first as any).completed).toBeUndefined();
  });

  it("supports filtering trails by durationDays and challenge", async () => {
    const guestCtx = createMockContext();
    const caller = appRouter.createCaller(guestCtx);

    const sevenDays = await caller.trails.list({ durationDays: 7 });
    expect(sevenDays.every((t) => t.durationDays === 7)).toBe(true);

    const financeTrails = await caller.trails.list({ challenge: "financeira" });
    expect(financeTrails.some((t) => t.slug === "ansiedade-financeira")).toBe(true);
  });

  it("fetches trail details by slug including items and devotional content", async () => {
    const guestCtx = createMockContext();
    const caller = appRouter.createCaller(guestCtx);

    const trail = await caller.trails.getBySlug({ slug: "ansiedade-financeira" });
    expect(trail).toBeDefined();
    expect(trail.title).toBe("Ansiedade Financeira");
    expect(trail.items.length).toBe(7);

    // Primeiro dia
    const day1 = trail.items.find((i) => i.position === 1);
    expect(day1).toBeDefined();
    expect(day1?.trailIntro).toContain("Dia 1: Reconhecer a inquietação");
    expect(day1?.devotional).toBeDefined();
    expect(day1?.devotional?.title).toBeTruthy();
    expect(day1?.devotional?.bibleReference).toBeTruthy();
  });

  it("rejects non-existent trail slugs with NOT_FOUND error", async () => {
    const guestCtx = createMockContext();
    const caller = appRouter.createCaller(guestCtx);

    await expect(
      caller.trails.getBySlug({ slug: "trilha-inexistente-12345" })
    ).rejects.toThrow();
  });
});
