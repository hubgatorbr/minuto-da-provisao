import { devotionals } from "../shared/devotionals.ts";
const normalize = (v) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
const groups = new Map();
for (const item of devotionals) {
  for (const paragraph of String(item.reflection).split(/\n\s*\n/).map(normalize).filter(Boolean)) {
    const rows = groups.get(paragraph) ?? [];
    rows.push(item.dayNumber);
    groups.set(paragraph, rows);
  }
}
const repeated = [...groups.entries()].filter(([, days]) => days.length > 1).sort((a,b) => b[1].length - a[1].length);
const uniqueReflectionCount = devotionals.filter((item) => new Set(String(item.reflection).split(/\n\s*\n/).map(normalize)).size === String(item.reflection).split(/\n\s*\n/).length).length;
console.log(JSON.stringify({
  totalDevotionals: devotionals.length,
  totalReflectionParagraphs: devotionals.reduce((sum, item) => sum + String(item.reflection).split(/\n\s*\n/).filter(Boolean).length, 0),
  distinctParagraphs: groups.size,
  repeatedParagraphGroups: repeated.length,
  repeatedParagraphs: repeated.slice(0, 20).map(([text, days]) => ({ occurrences: days.length, days, sample: text.slice(0, 220) })),
  devotionsWithInternalRepeatedParagraph: devotionals.filter((item) => { const ps = String(item.reflection).split(/\n\s*\n/).map(normalize).filter(Boolean); return new Set(ps).size < ps.length; }).map((item) => item.dayNumber),
}, null, 2));
