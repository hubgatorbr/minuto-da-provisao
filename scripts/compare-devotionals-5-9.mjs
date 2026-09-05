import { devotionals } from "../shared/devotionals.ts";

const normalize = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
const tokens = (value) => new Set(normalize(value).split(/[^a-z0-9]+/).filter((word) => word.length > 2));
const jaccard = (a, b) => {
  const union = new Set([...a, ...b]);
  const intersection = [...a].filter((word) => b.has(word)).length;
  return union.size ? intersection / union.size : 1;
};
const a = devotionals.find((item) => item.dayNumber === 5);
const b = devotionals.find((item) => item.dayNumber === 9);
if (!a || !b) throw new Error("Days 5 and 9 were not found");
const fields = ["title", "theme", "bibleReference", "reflection", "dailyQuestion", "prayer"];
const comparison = Object.fromEntries(fields.map((field) => [field, {
  exact: normalize(a[field]) === normalize(b[field]),
  similarity: Number(jaccard(tokens(a[field]), tokens(b[field])).toFixed(4)),
}]));
const actionPairs = a.practicalActions.flatMap((left) => b.practicalActions.map((right) => ({ left, right, similarity: Number(jaccard(tokens(left), tokens(right)).toFixed(4)) })));
const strongestActions = actionPairs.sort((x, y) => y.similarity - x.similarity).slice(0, 3);
console.log(JSON.stringify({
  day5: { title: a.title, reference: a.bibleReference, focusExcerpt: a.reflection.split("\n\n")[2]?.slice(0, 300), actions: a.practicalActions },
  day9: { title: b.title, reference: b.bibleReference, focusExcerpt: b.reflection.split("\n\n")[2]?.slice(0, 300), actions: b.practicalActions },
  comparison,
  strongestActionPairs: strongestActions,
}, null, 2));
