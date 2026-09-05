import { devotionals } from '../shared/devotionals.ts';

const january = devotionals.filter(item => item.dayNumber <= 31);
const reflectionWordCounts = january.map(item => item.reflection.trim().split(/\s+/).length);
const totalWordCounts = january.map(item => [item.reflection, ...item.practicalActions, item.dailyQuestion, item.prayer].join(' ').trim().split(/\s+/).length);
const actions = january.flatMap(item => item.practicalActions);
const questions = january.map(item => item.dailyQuestion);

if (january.length !== 31) throw new Error(`Expected 31 January devotionals, got ${january.length}`);
if (!january.every(item => item.catalogRevision === 'editorial-v4.5')) throw new Error('January revision mismatch');
if (Math.min(...reflectionWordCounts) < 350 || Math.max(...reflectionWordCounts) > 450) {
  throw new Error(`January reflection range ${Math.min(...reflectionWordCounts)}-${Math.max(...reflectionWordCounts)} is outside 350-450`);
}
if (Math.min(...totalWordCounts) < 450 || Math.max(...totalWordCounts) > 550) {
  throw new Error(`January total range ${Math.min(...totalWordCounts)}-${Math.max(...totalWordCounts)} is outside 450-550`);
}
if (new Set(actions).size !== actions.length) throw new Error('Duplicate January practical action');
if (new Set(questions).size !== questions.length) throw new Error('Duplicate January daily question');
if (!january.every(item => item.practicalActions.length === 3 && item.prayer.length >= 35)) {
  throw new Error('Incomplete January structured fields');
}

console.log(JSON.stringify({
  days: january.length,
  reflectionWordRange: [Math.min(...reflectionWordCounts), Math.max(...reflectionWordCounts)],
  totalWordRange: [Math.min(...totalWordCounts), Math.max(...totalWordCounts)],
  averageTotalWords: Math.round(totalWordCounts.reduce((sum, count) => sum + count, 0) / totalWordCounts.length),
  uniqueActions: new Set(actions).size,
  uniqueQuestions: new Set(questions).size,
  revision: january[0].catalogRevision,
}, null, 2));
