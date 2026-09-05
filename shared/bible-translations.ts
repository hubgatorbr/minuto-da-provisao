export const BIBLE_TRANSLATIONS = {
  ALMEIDA_PUBLIC_DOMAIN: {
    id: "ALMEIDA_PUBLIC_DOMAIN",
    label: "Almeida — domínio público",
    shortLabel: "Almeida",
    license: "Domínio público",
    sourceUrl: "https://github.com/seven1m/open-bibles/blob/master/por-almeida.usfx.xml",
    sourceName: "João Ferreira de Almeida — Open Bibles",
  },
  NVI: {
    id: "NVI",
    label: "Nova Versão Internacional",
    shortLabel: "NVI",
    license: "Texto protegido; requer licença para reprodução integral",
    sourceUrl: "https://www.bible.com/pt-BR/versions/129-nvi-nova-versao-internacional",
    sourceName: "Bíblia NVI",
  },
} as const;

export type BibleTranslationId = keyof typeof BIBLE_TRANSLATIONS;
export const DEFAULT_BIBLE_TRANSLATION_ID: BibleTranslationId = "ALMEIDA_PUBLIC_DOMAIN";

export function getBibleTranslation(id: string | null | undefined) {
  return BIBLE_TRANSLATIONS[id as BibleTranslationId] ?? BIBLE_TRANSLATIONS[DEFAULT_BIBLE_TRANSLATION_ID];
}
