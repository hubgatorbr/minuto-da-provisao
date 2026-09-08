import AppShell from "@/components/AppShell";
import BibleReference from "@/components/BibleReference";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getBibleTranslation } from "@shared/bible-translations";
import { ArrowLeft, ArrowRight, BookMarked, Check, CheckCircle2, Heart, Loader2, LockKeyhole, NotebookPen, Pause, Play, Sparkles, Square, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation, useRoute } from "wouter";

export default function Devotional() {
  const [, params] = useRoute("/devocional/:dayNumber");
  const [, navigate] = useLocation();
  const dayNumber = Math.max(1, Math.min(365, Number(params?.dayNumber ?? 1)));
  const { isAuthenticated, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();
  const devotionalQuery = trpc.devotional.byDay.useQuery({ dayNumber });
  const stateQuery = trpc.devotional.state.useQuery(undefined, { enabled: isAuthenticated });
  const devotional = devotionalQuery.data;
  const bibleTranslation = getBibleTranslation(devotional?.bibleTranslation);
  const devotionalId = devotional?.id ?? devotional?.dayNumber ?? dayNumber;
  const generatedAudioUrl = devotional?.dayNumber ? {
    1: "/manus-storage/devotional-001-natural_994b91a5.wav",
    2: "/manus-storage/devotional-002_cd6d36b3.wav",
    3: "/manus-storage/devotional-003_1a7fae2f.wav",
    4: "/manus-storage/devotional-004_9ec9c5aa.wav",
    5: "/manus-storage/devotional-005_e1110915.wav",
    6: "/manus-storage/devotional-006_d2112182.wav",
    7: "/manus-storage/devotional-007_88eeacf8.wav",
  }[devotional.dayNumber as 1 | 2 | 3 | 4 | 5 | 6 | 7] : undefined;
  const isComplete = stateQuery.data?.completedIds.includes(devotionalId) ?? false;
  const isFavorite = stateQuery.data?.favoriteIds.includes(devotionalId) ?? false;
  const entry = stateQuery.data?.entries.find(item => item.devotionalId === devotionalId)?.content || "";
  const [journal, setJournal] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => setJournal(entry), [entry, devotionalId]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const completionMutation = trpc.devotional.toggleCompleted.useMutation({
    onMutate: async ({ completed }) => {
      await utils.devotional.state.cancel();
      const previous = utils.devotional.state.getData();
      utils.devotional.state.setData(undefined, current => {
        if (!current) return current;
        const completedIds = completed
          ? Array.from(new Set([...current.completedIds, devotionalId]))
          : current.completedIds.filter(id => id !== devotionalId);
        const completedDays = completed
          ? Array.from(new Set([...(current.completedDays ?? []), dayNumber]))
          : (current.completedDays ?? []).filter(day => day !== dayNumber);
        return { ...current, completedIds, completedDays };
      });
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) utils.devotional.state.setData(undefined, context.previous);
      toast.error("Não foi possível salvar. Faça login novamente e tente outra vez.");
    },
    onSuccess: async () => {
      await utils.devotional.state.invalidate();
      toast.success(!isComplete ? "Minuto concluído. Mais um dia construindo com propósito." : "Devocional marcado como não concluído.");
    },
  });
  const favoriteMutation = trpc.devotional.toggleFavorite.useMutation({ onSuccess: () => utils.devotional.state.invalidate() });
  const journalMutation = trpc.devotional.saveJournal.useMutation({ onSuccess: () => { utils.devotional.state.invalidate(); toast.success("Sua reflexão foi salva no diário."); } });
  const paragraphs = useMemo(() => devotional?.reflection.split("\n\n") ?? [], [devotional?.reflection]);
  const audioText = useMemo(() => devotional ? [
    devotional.title,
    `Referência bíblica: ${devotional.bibleReference}.`,
    devotional.reflection,
    `Para colocar em prática hoje: ${devotional.practicalActions.join(". ")}.`,
    `Pergunta do dia: ${devotional.dailyQuestion}.`,
    `Minha oração de hoje: ${devotional.prayer}`,
  ].join("\n\n") : "", [devotional]);
  const choosePortugueseVoice = () => {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    return voices.find(voice => voice.lang.toLowerCase().startsWith("pt-br"))
      ?? voices.find(voice => voice.lang.toLowerCase().startsWith("pt"));
  };
  const playAudio = () => {
    if (!audioText || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(audioText);
    utterance.lang = "pt-BR";
    utterance.rate = 0.88;
    utterance.pitch = 0.98;
    const voice = choosePortugueseVoice();
    if (voice) utterance.voice = voice;
    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); toast.error("Não foi possível reproduzir o áudio neste dispositivo."); };
    window.speechSynthesis.speak(utterance);
  };
  const pauseAudio = () => { if (!window.speechSynthesis) return; if (isPaused) { window.speechSynthesis.resume(); setIsPaused(false); } else { window.speechSynthesis.pause(); setIsPaused(true); } };
  const stopAudio = () => { window.speechSynthesis?.cancel(); setIsSpeaking(false); setIsPaused(false); };
  const requireLogin = () => { toast.message("Entre para salvar a sua jornada."); startLogin(); };
  const handleComplete = () => { if (!isAuthenticated) return requireLogin(); completionMutation.mutate({ devotionalId, completed: !isComplete }); };
  const handleFavorite = () => { if (!isAuthenticated) return requireLogin(); favoriteMutation.mutate({ devotionalId, favorite: !isFavorite }); };
  const handleJournal = () => { if (!isAuthenticated) return requireLogin(); journalMutation.mutate({ devotionalId, content: journal }); };

  if (devotionalQuery.isLoading || authLoading || (isAuthenticated && stateQuery.isLoading)) return <AppShell><div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#b38c31]" /></div></AppShell>;
  if (!devotional) return <AppShell><div className="mx-auto max-w-3xl px-5 py-24 text-center"><BookMarked className="mx-auto h-8 w-8 text-[#b38c31]" /><h1 className="mt-4 font-serif text-3xl">Este devocional não foi encontrado.</h1><Link href="/jornada" className="mt-5 inline-block text-sm font-semibold text-[#265a82]">Voltar para a jornada</Link></div></AppShell>;

  return <AppShell><div className="mx-auto max-w-3xl px-4 py-7 sm:px-7 lg:py-12"><div className="mb-7 flex items-center justify-between"><Button variant="ghost" onClick={() => navigate("/app")} className="-ml-3 gap-2 text-[#647789]"><ArrowLeft className="h-4 w-4" /> Hoje</Button><div className="text-right"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a2813c]">Minuto da Provisão</p><p className="mt-0.5 text-xs text-[#78857d]">Dia {dayNumber} de 365</p></div></div>
    <article className="rounded-[28px] border border-[#e6e0d3] bg-[#ffffff] px-6 py-8 shadow-[0_10px_35px_rgba(22,39,29,.05)] dark:border-white/10 dark:bg-[#15263b] sm:px-10 sm:py-11"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b38c31]">{devotional.theme} · {devotional.month}</p><h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{devotional.title}</h1></div><button aria-label="Favoritar devocional" onClick={handleFavorite} className={isFavorite ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f9e8e5] text-[#b85b4d]" : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2f1eb] text-[#7c887f] hover:text-[#b85b4d] dark:bg-white/5"}><Heart className={isFavorite ? "h-5 w-5 fill-current" : "h-5 w-5"} /></button></div>
      <div className="mt-8"><BibleReference reference={devotional.bibleReference} translation={devotional.bibleTranslation} text={devotional.bibleText} /></div>
      <section aria-label="Áudio do devocional" className="mt-8 rounded-2xl border border-[#ded7c8] bg-[#f7f3e8] p-5 dark:border-white/10 dark:bg-[#1c344b]"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d9b45e] text-[#102a43]"><Volume2 className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#8d6e2d] dark:text-[#e6d099]">Ouvir este devocional</p><p className="mt-1 text-sm leading-6 text-[#637169] dark:text-[#c4d1c8]">{generatedAudioUrl ? "Locução masculina brasileira, natural e conversacional." : "Leitura em voz clara, suave e pausada para acompanhar sua reflexão."}</p>{generatedAudioUrl ? <audio className="mt-4 w-full" controls preload="metadata" src={generatedAudioUrl}><track kind="captions" /></audio> : <div className="mt-4 flex flex-wrap gap-2"><Button onClick={isSpeaking ? pauseAudio : playAudio} className="rounded-xl bg-[#102a43] text-white hover:bg-[#1e4d73]"><span className="mr-2">{isSpeaking ? (isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />) : <Play className="h-4 w-4" />}</span>{isSpeaking ? (isPaused ? "Continuar" : "Pausar") : "Dar play no áudio"}</Button>{isSpeaking && <Button variant="outline" onClick={stopAudio} className="rounded-xl border-[#cbbd9e] text-[#70591e] dark:text-[#e6d099]"><Square className="mr-2 h-3.5 w-3.5 fill-current" /> Parar</Button>}</div>}</div></div></section>
      <section className="prose prose-[1.05rem] mt-9 max-w-none leading-8 text-[#3f5147] dark:prose-invert dark:text-[#c8d4cd]"><p className="not-prose mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#b38c31]"><Sparkles className="h-3.5 w-3.5" /> Reflexão</p>{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>
      <section className="mt-10 rounded-2xl bg-[#e8f0f5] p-5 dark:bg-[#1c344b]"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#3f6e8f]">Para colocar em prática hoje</p><ol className="mt-4 space-y-3">{devotional.practicalActions.map((action, index) => <li key={action} className="flex gap-3 text-sm leading-6"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d5e7f2] text-xs font-bold text-[#2f5d7c] dark:bg-[#315341] dark:text-[#d7ead8]">{index + 1}</span><span>{action}</span></li>)}</ol></section>
      <section className="mt-9"><div className="flex items-center gap-2"><NotebookPen className="h-4 w-4 text-[#b38c31]" /><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a07c34]">Pergunta do dia</p></div><h2 className="mt-3 font-serif text-2xl leading-8">“{devotional.dailyQuestion}”</h2><Textarea value={journal} onChange={event => setJournal(event.target.value)} placeholder="Escreva sua resposta, oração ou aprendizado..." className="mt-5 min-h-32 resize-y rounded-2xl border-[#ded7c8] bg-[#fcfbf7] p-4 leading-6 dark:border-white/10 dark:bg-white/5" /><div className="mt-3 flex justify-end"><Button variant="outline" onClick={handleJournal} disabled={journalMutation.isPending} className="rounded-xl border-[#d5c49c] text-[#70591e] dark:text-[#e6d099]">Salvar no diário</Button></div></section>
      <section className="mt-10 rounded-2xl border border-[#e6dfd0] p-5 dark:border-white/10"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a07c34]">Minha oração de hoje</p><p className="mt-3 font-serif text-lg leading-8 text-[#3b4d42] dark:text-[#d6e3eb]">{devotional.prayer}</p></section>
      {!isAuthenticated && <div className="mt-7 flex gap-3 rounded-2xl bg-[#fbf5e6] p-4 text-sm text-[#755d2b] dark:bg-[#242a38] dark:text-[#e8d8a6]"><LockKeyhole className="h-4 w-4 shrink-0" /><span>Entre para salvar o diário, favoritos e sua sequência de fé.</span></div>}
      <div className="mt-9 flex flex-col gap-3 border-t border-[#ece6d9] pt-7 sm:flex-row"><Button onClick={handleComplete} disabled={completionMutation.isPending} className={isComplete ? "h-12 flex-1 rounded-xl bg-[#e2eef7] text-[#2e6640] hover:bg-[#d6e9d7] dark:bg-[#274e70] dark:text-[#d4ecd8]" : "h-12 flex-1 rounded-xl bg-[#102a43] text-white hover:bg-[#1e4d73]"}>{isComplete ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Minuto concluído</> : <><Check className="mr-2 h-4 w-4" /> Marcar meu minuto como concluído</>}</Button>{dayNumber < 365 && <Button variant="outline" onClick={() => navigate(`/devocional/${dayNumber + 1}`)} className="h-12 rounded-xl border-[#d8d1c3]">Continuar para amanhã <ArrowRight className="ml-2 h-4 w-4" /></Button>}</div>
    </article></div></AppShell>;
}
