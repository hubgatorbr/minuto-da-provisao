import { BookMarked } from "lucide-react";
import { getBibleTranslation } from "@shared/bible-translations";

type BibleReferenceProps = {
  reference: string;
  translation?: string | null;
  text?: string | null;
};

export default function BibleReference({ reference, translation, text }: BibleReferenceProps) {
  const bibleTranslation = getBibleTranslation(translation);
  return (
    <div className="rounded-2xl border-l-4 border-[#d9b45e] bg-[#f4f7fb] px-5 py-4 dark:bg-[#1d3349]">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#a07c34]"><BookMarked className="h-3.5 w-3.5" /> Referência bíblica · {bibleTranslation.shortLabel || "Almeida"}</p>
      <p className="mt-2 font-serif text-2xl text-[#163653] dark:text-[#e8dcae]">{reference}</p>
      {text ? <blockquote className="mt-3 border-l border-[#c5a85e] pl-4 text-sm leading-6 text-[#536879] dark:text-[#c7d6e2]">“{text}”</blockquote> : <p className="mt-2 text-xs leading-5 text-[#718291]">Tradução: {bibleTranslation.label}. O texto integral será exibido somente quando houver fonte autorizada.</p>}
    </div>
  );
}
