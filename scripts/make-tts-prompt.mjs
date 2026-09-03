import { devotionals } from '../shared/devotionals.ts';

const day = Number(process.argv[2] ?? 246);
const devotional = devotionals.find(item => item.dayNumber === day);
if (!devotional) throw new Error(`Devotional day ${day} not found`);
const spokenText = [
  devotional.title,
  `Referência bíblica: ${devotional.bibleReference}.`,
  devotional.reflection,
  `Para colocar em prática hoje: ${devotional.practicalActions.join('. ')}.`,
  `Pergunta do dia: ${devotional.dailyQuestion}.`,
  `Minha oração de hoje: ${devotional.prayer}`,
].join('\n\n');
const instructions = 'Speak in Brazilian Portuguese with an adult male voice. Sound extremely natural and human, as if speaking directly to one person. Use a warm, friendly, confident, conversational delivery with moderate pacing, natural breaths and pauses between phrases, subtle emphasis on important words, and small organic variations in rhythm, intonation, and intensity. Keep it professional but informal and close. Do not sound like a narrator reading a script; sound like a trusted specialist explaining something personally. Avoid robotic cadence and exaggerated emotion.';
process.stdout.write(`${instructions}: ${spokenText}`);
