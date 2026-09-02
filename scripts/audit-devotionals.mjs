import { devotionals } from '../shared/devotionals.ts';

const wordCounts = devotionals.map((devotional) => devotional.reflection.trim().split(/\s+/).length);
const uniqueTitles = new Set(devotionals.map((devotional) => devotional.title));
const uniqueReferences = new Set(devotionals.map((devotional) => devotional.bibleReference));
const uniqueQuestions = new Set(devotionals.map((devotional) => devotional.dailyQuestion));
const duplicateTitles = devotionals
  .map((devotional) => devotional.title)
  .filter((title, index, titles) => titles.indexOf(title) !== index)
  .filter((title, index, titles) => titles.indexOf(title) === index);

const audit = {
  count: devotionals.length,
  titles: uniqueTitles.size,
  references: uniqueReferences.size,
  questions: uniqueQuestions.size,
  minReflectionWords: Math.min(...wordCounts),
  maxReflectionWords: Math.max(...wordCounts),
  averageReflectionWords: Math.round(wordCounts.reduce((total, count) => total + count, 0) / wordCounts.length),
  dayOneReference: devotionals[0]?.bibleReference,
  dayOneTitle: devotionals[0]?.title,
  duplicateTitles,
};

console.log(JSON.stringify(audit, null, 2));
if (audit.count !== 365 || audit.titles !== 365 || audit.questions !== 365) process.exit(1);
