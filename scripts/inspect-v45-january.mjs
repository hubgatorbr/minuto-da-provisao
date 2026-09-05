import { devotionals } from '../shared/devotionals.ts';
for (const item of devotionals.filter(item => item.dayNumber <= 31)) {
  const reflection = item.reflection.trim().split(/\s+/).length;
  const total = [item.reflection, ...item.practicalActions, item.dailyQuestion, item.prayer].join(' ').trim().split(/\s+/).length;
  if (total > 550 || total < 450) console.log(item.dayNumber, item.title, { reflection, total });
}
