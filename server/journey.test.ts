import { describe, expect, it } from "vitest";
import { achievementSeeds, calculateStreak } from "./db";

describe("journey metrics", () => {
  it("keeps completed days separate from the current and longest streak", () => {
    expect(calculateStreak([1, 2, 3, 8, 9])).toEqual({ currentStreak: 2, longestStreak: 3 });
  });

  it("deduplicates and handles an empty journey", () => {
    expect(calculateStreak([4, 4, 5, 7])).toEqual({ currentStreak: 1, longestStreak: 2 });
    expect(calculateStreak([])).toEqual({ currentStreak: 0, longestStreak: 0 });
  });

  it("seeds the five requested milestones", () => {
    expect(achievementSeeds.map(item => item.name)).toEqual([
      "Primeiro Minuto",
      "Uma Semana",
      "Constância",
      "Metade do Caminho",
      "Um Ano de Propósito",
    ]);
  });
});
