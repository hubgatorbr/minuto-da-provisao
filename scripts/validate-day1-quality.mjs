import { devotionals } from '../shared/devotionals.ts';
import { DEFAULT_BIBLE_TRANSLATION_ID } from '../shared/bible-translations.ts';

const day1 = devotionals[0];
const wrongTranslations = devotionals.filter(item => item.bibleTranslation !== DEFAULT_BIBLE_TRANSLATION_ID || item.bibleText !== null);
const checks = {
  total: devotionals.length,
  translationAuditPassed: wrongTranslations.length === 0,
  day1ReflectionWords: day1.reflection.trim().split(/\s+/).length,
  day1Translation: day1.bibleTranslation,
  day1Question: day1.dailyQuestion,
  day1PrayerPreserved: day1.prayer === 'Senhor, recebe o plano que tenho diante de mim e acalma minha pressa por garantias. Dá-me clareza para preparar o que depende de mim, humildade para ouvir correções e paz para deixar contigo a resposta dos clientes, o tempo e o resultado. Firma meus pensamentos em Ti. Amém.',
  day1Action2Preserved: day1.practicalActions[1] === 'Alternativa 1: antes de enviar uma proposta, ore por um minuto e retire dela qualquer promessa que você não consiga cumprir.',
  day1Action3Preserved: day1.practicalActions[2] === 'Alternativa 2: defina um limite financeiro para uma decisão desta semana e respeite-o mesmo se a resposta esperada demorar.',
};
console.log(JSON.stringify(checks, null, 2));
if (wrongTranslations.length || checks.day1ReflectionWords < 350 || checks.day1ReflectionWords > 450 || !checks.day1PrayerPreserved || !checks.day1Action2Preserved || !checks.day1Action3Preserved) process.exit(1);
