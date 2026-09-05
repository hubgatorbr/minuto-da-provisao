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

  it("establishes the simplified v5 tone on the first seven days", () => {
    const first = devotionals[0];
    expect(first).toMatchObject({
      dayNumber: 1,
      title: "Empreender com propósito",
      bibleReference: "Provérbios 16:3",
      theme: "Propósito",
    });
    expect(first.reflection.trim().split(/\s+/).length).toBeGreaterThanOrEqual(170);
    expect(first.reflection.trim().split(/\s+/).length).toBeLessThanOrEqual(260);
    expect(devotionals.slice(0, 7).every(item => item.catalogRevision === "editorial-v5")).toBe(true);
    expect(first.practicalActions).toHaveLength(3);
    expect(first.prayer.length).toBeGreaterThan(40);
  });

  it("keeps every reflection within a five-minute editorial reading range", () => {
    const wordCounts = devotionals.map(item => item.reflection.trim().split(/\s+/).length);
    expect(Math.min(...wordCounts)).toBeGreaterThanOrEqual(170);
    expect(Math.max(...wordCounts)).toBeLessThanOrEqual(800);
  });
});
