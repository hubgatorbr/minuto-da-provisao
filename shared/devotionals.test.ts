import { describe, expect, it } from "vitest";
import { devotionals, monthlyJourneys } from "./devotionals";
import { DEFAULT_BIBLE_TRANSLATION_ID } from "./bible-translations";

describe("devotional catalogue", () => {
  it("contains a complete and ordered 365-day journey", () => {
    expect(devotionals).toHaveLength(365);
    expect(devotionals.map(item => item.dayNumber)).toEqual(Array.from({ length: 365 }, (_, index) => index + 1));
    expect(monthlyJourneys).toHaveLength(12);
    expect(monthlyJourneys.reduce((total, month) => total + month.count, 0)).toBe(365);
  });

  it("preserves editorial uniqueness and public-domain translation metadata", () => {
    expect(new Set(devotionals.map(item => item.title)).size).toBe(365);
    expect(new Set(devotionals.map(item => item.dailyQuestion)).size).toBe(365);
    expect(new Set(devotionals.map(item => item.bibleReference)).size).toBe(365);
    expect(devotionals.every(item => item.bibleTranslation === DEFAULT_BIBLE_TRANSLATION_ID && item.bibleText === null)).toBe(true);
  });

  it("uses a distinct practical action set for every devotional", () => {
    const actions = devotionals.flatMap(item => item.practicalActions);
    expect(actions).toHaveLength(1095);
    expect(new Set(actions).size).toBe(actions.length);
  });

  it("establishes the requested tone and depth on day one", () => {
    const first = devotionals[0];
    expect(first).toMatchObject({
      dayNumber: 1,
      title: "Empreender com propósito",
      bibleReference: "Provérbios 16:3",
      theme: "Propósito",
    });
    expect(first.reflection.trim().split(/\s+/).length).toBeGreaterThanOrEqual(500);
    expect(first.practicalActions).toHaveLength(3);
    expect(first.prayer.length).toBeGreaterThan(40);
  });

  it("keeps every reflection within a five-minute editorial reading range", () => {
    const wordCounts = devotionals.map(item => item.reflection.trim().split(/\s+/).length);
    expect(Math.min(...wordCounts)).toBeGreaterThanOrEqual(500);
    expect(Math.max(...wordCounts)).toBeLessThanOrEqual(800);
  });
});
