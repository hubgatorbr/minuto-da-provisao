import { describe, expect, it } from "vitest";

describe("progress identity", () => {
  it("treats devotional ids and calendar day numbers as separate concepts", () => {
    const rows = [
      { devotionalId: 42, dayNumber: 1 },
      { devotionalId: 99, dayNumber: 2 },
    ];

    expect(rows.map(row => row.devotionalId)).toEqual([42, 99]);
    expect(rows.map(row => row.dayNumber)).toEqual([1, 2]);
    expect(new Set(rows.map(row => row.dayNumber)).has(1)).toBe(true);
    expect(new Set(rows.map(row => row.devotionalId)).has(1)).toBe(false);
  });
});
