import { devotionals } from "../shared/devotionals.ts";
import { writeFileSync } from "node:fs";

const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
const paragraphs = (value) => String(value).split(/\n\s*\n/).map(normalize).filter(Boolean);
const tokens = (value) => new Set(normalize(value).split(/[^a-z0-9]+/).filter((word) => word.length > 2));
const jaccard = (a, b) => {
  const union = new Set([...a, ...b]);
  const intersection = [...a].filter((word) => b.has(word)).length;
  return union.size ? intersection / union.size : 1;
};

const paragraphCounts = new Map();
for (const item of devotionals) {
  for (const paragraph of paragraphs(item.reflection)) paragraphCounts.set(paragraph, (paragraphCounts.get(paragraph) ?? 0) + 1);
}
const recurringParagraphs = new Set([...paragraphCounts.entries()].filter(([, count]) => count >= 10).map(([paragraph]) => paragraph));
const specificText = (item) => paragraphs(item.reflection).filter((paragraph) => !recurringParagraphs.has(paragraph)).join(" ");

const pairs = [];
for (let i = 0; i < devotionals.length; i += 1) {
  for (let j = i + 1; j < devotionals.length; j += 1) {
    const a = devotionals[i];
    const b = devotionals[j];
    const aText = specificText(a);
    const bText = specificText(b);
    const similarity = jaccard(tokens(`${aText} ${a.dailyQuestion} ${a.prayer}`), tokens(`${bText} ${b.dailyQuestion} ${b.prayer}`));
    if (similarity >= 0.78) pairs.push({ dayA: a.dayNumber, dayB: b.dayNumber, titleA: a.title, titleB: b.title, similarity: Number(similarity.toFixed(4)) });
  }
}
pairs.sort((a, b) => b.similarity - a.similarity);

const result = {
  total: devotionals.length,
  recurringParagraphCount: recurringParagraphs.size,
  recurringParagraphs: [...recurringParagraphs].map((paragraph) => ({ occurrences: paragraphCounts.get(paragraph), sample: paragraph.slice(0, 180) })),
  nearSpecificPairs: pairs,
};
writeFileSync("duplicate-audit-specific.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify({
  total: result.total,
  recurringParagraphCount: result.recurringParagraphCount,
  nearSpecificPairs: pairs.length,
  topNearSpecific: pairs.slice(0, 20),
}, null, 2));
