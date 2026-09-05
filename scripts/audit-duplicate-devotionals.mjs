import { devotionals } from "../shared/devotionals.ts";
import { writeFileSync } from "node:fs";

const normalize = (value) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/\s+/g, " ")
  .trim();

const words = (value) => new Set(normalize(value).split(/[^a-z0-9]+/).filter((word) => word.length > 2));
const jaccard = (a, b) => {
  const union = new Set([...a, ...b]);
  const intersection = [...a].filter((word) => b.has(word)).length;
  return union.size ? intersection / union.size : 1;
};

const fields = ["title", "bibleReference", "reflection", "dailyQuestion", "prayer"];
const exact = {};
for (const field of fields) {
  const groups = new Map();
  devotionals.forEach((item) => {
    const key = normalize(String(item[field] ?? ""));
    const list = groups.get(key) ?? [];
    list.push(item.dayNumber);
    groups.set(key, list);
  });
  exact[field] = [...groups.values()].filter((days) => days.length > 1).map((days) => ({ days }));
}

const near = [];
for (let i = 0; i < devotionals.length; i += 1) {
  for (let j = i + 1; j < devotionals.length; j += 1) {
    const a = devotionals[i];
    const b = devotionals[j];
    const reflectionSimilarity = jaccard(words(a.reflection), words(b.reflection));
    const combinedSimilarity = jaccard(words(`${a.reflection} ${a.dailyQuestion} ${a.prayer}`), words(`${b.reflection} ${b.dailyQuestion} ${b.prayer}`));
    if (reflectionSimilarity >= 0.82 || combinedSimilarity >= 0.78) {
      near.push({
        dayA: a.dayNumber,
        dayB: b.dayNumber,
        titleA: a.title,
        titleB: b.title,
        reflectionSimilarity: Number(reflectionSimilarity.toFixed(4)),
        combinedSimilarity: Number(combinedSimilarity.toFixed(4)),
      });
    }
  }
}
near.sort((a, b) => (b.reflectionSimilarity + b.combinedSimilarity) - (a.reflectionSimilarity + a.combinedSimilarity));

const duplicateTitleNormalized = exact.title;
const duplicateReferenceNormalized = exact.bibleReference;
const result = {
  total: devotionals.length,
  dayNumbersUnique: new Set(devotionals.map((item) => item.dayNumber)).size === devotionals.length,
  exact,
  near,
  thresholds: { reflectionJaccard: 0.82, combinedJaccard: 0.78 },
};

writeFileSync("duplicate-audit.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify({
  total: result.total,
  dayNumbersUnique: result.dayNumbersUnique,
  exactDuplicateGroups: Object.fromEntries(Object.entries(exact).map(([field, groups]) => [field, groups.length])),
  nearDuplicatePairs: near.length,
  topNear: near.slice(0, 10),
}, null, 2));
