import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, BookMarked, Check, CheckCircle2, Heart, Loader2, LockKeyhole, NotebookPen, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation, useRoute } from "wouter";

export default function Devotional() {
  const [, params] = useRoute("/devocional/:dayNumber");
  const [, navigate] = useLocation();
  const dayNumber = Math.max(1, Math.min(365, Number(params?.dayNumber ?? 1)));
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const devotionalQuery = trpc.devotional.byDay.useQuery({ dayNumber });
  const stateQuery = trpc.devotional.state.useQuery(undefined, { enabled: isAuthenticated });
  const devotional = devotionalQuery.data;
  const devotionalId = devotional?.id ?? devotional?.dayNumber ?? dayNumber;
  const isComplete = stateQuery.data?.completedIds.includes(devotionalId) ?? false;
  const isFavorite = stateQuery.data?.favoriteIds.includes(devotionalId) ?? false;
  const entry = stateQuery.data?.entries.find(item => item.devotionalId === devotionalId)?.content || "";
  const [journal, setJournal] = useState("");
  useEffect(() => setJournal(entry), [entry, devotionalId]);
  const completionMutation = trpc.devotional.toggleCompleted.useMutation({ onSuccess: () => utils.devotional.state.invalidate() });
  const favoriteMutation = trpc.devotional.toggleFavorite.useMutation({ onSuccess: () => utils.devotional.state.invalidate() });
  const journalMutation = trpc.devotional.saveJournal.useMutation({ onSuccess: () => { utils.devotional.state.invalidate(); toast.success("Sua reflexão foi salva no diário."); } });
  const paragraphs = useMemo(() => devotional?.reflection.split("\n\n") ?? [], [devotional?.reflection]);
  const requireLogin = () => { toast.message("Entre para salvar a sua jornada."); startLogin(); };
  const handleComplete = () => { if (!isAuthenticated) return requireLogin(); completionMutation.mutate({ devotionalId, completed: !isComplete }, { onSuccess: () => toast.success(!isComplete ? "Minuto concluído. Mais um dia construindo com propósito." : "Devocional marcado como não concluído.") }); };
  const handleFavorite = () => { if (!isAuthenticated) return requireLogin(); favoriteMutation.mutate({ devotionalId, favorite: !isFavorite }); };
  const handleJournal = () => { if (!isAuthenticated) return requireLogin(); journalMutation.mutate({ devotionalId, content: journal }); };

  if (devotionalQuery.isLoading) return <AppShell><div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#b38c31]" /></div></AppShell>;
  if (!devotional) return <AppShell><div className="mx-auto max-w-3xl px-5 py-24 text-center"><BookMarked className="mx-auto h-8 w-8 text-[#b38c31]" /><h1 className="mt-4 font-serif text-3xl">Este devocional não foi encontrado.</h1><Link href="/jornada" className="mt-5 inline-block text-sm font-semibold text-[#315d43]">Voltar para a jornada</Link></div></AppShell>;

  return <AppShell><div className="mx-auto max-w-3xl px-4 py-7 sm:px-7 lg:py-12"><div className="mb-7 flex items-center justify-between"><Button variant="ghost" onClick={() => navigate("/")} className="-ml-3 gap-2 text-[#66756c]"><ArrowLeft className="h-4 w-4" /> Hoje</Button><div className="text-right"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a2813c]">Minuto da Provisão</p><p className="mt-0.5 text-xs text-[#78857d]">Dia {dayNumber} de 365</p></div></div>
    <article className="rounded-[28px] border border-[#e6e0d3] bg-[#fffdfa] px-6 py-8 shadow-[0_10px_35px_rgba(22,39,29,.05)] dark:border-white/10 dark:bg-[#17231f] sm:px-10 sm:py-11"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b38c31]">{devotional.theme} · {devotional.month}</p><h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{devotional.title}</h1></div><button aria-label="Favoritar devocional" onClick={handleFavorite} className={isFavorite ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f9e8e5] text-[#b85b4d]" : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2f1eb] text-[#7c887f] hover:text-[#b85b4d] dark:bg-white/5"}><Heart className={isFavorite ? "h-5 w-5 fill-current" : "h-5 w-5"} /></button></div>
      <div className="mt-8 border-y border-[#ece6d9] py-5 dark:border-white/10"><p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#9a7730]"><BookMarked className="h-3.5 w-3.5" /> Referência bíblica · NVI</p><p className="mt-2 font-serif text-2xl text-[#274432] dark:text-[#eadcaa]">{devotional.bibleReference}</p><p className="mt-2 text-xs leading-5 text-[#79867d]">A Bíblia Nova Versão Internacional é protegida por direitos autorais. Este aplicativo apresenta a referência e reflexão original; o texto integral poderá ser conectado a uma fonte licenciada.</p></div>
      <section className="prose prose-[1.05rem] mt-9 max-w-none leading-8 text-[#3f5147] dark:prose-invert dark:text-[#c8d4cd]"><p className="not-prose mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#b38c31]"><Sparkles className="h-3.5 w-3.5" /> Reflexão</p>{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>
      <section className="mt-10 rounded-2xl bg-[#edf3eb] p-5 dark:bg-[#21342b]"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#497054]">Para colocar em prática hoje</p><ol className="mt-4 space-y-3">{devotional.practicalActions.map((action, index) => <li key={action} className="flex gap-3 text-sm leading-6"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#cfe1d0] text-xs font-bold text-[#2b5a3a] dark:bg-[#315341] dark:text-[#d7ead8]">{index + 1}</span><span>{action}</span></li>)}</ol></section>
      <section className="mt-9"><div className="flex items-center gap-2"><NotebookPen className="h-4 w-4 text-[#b38c31]" /><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a07c34]">Pergunta do dia</p></div><h2 className="mt-3 font-serif text-2xl leading-8">“{devotional.dailyQuestion}”</h2><Textarea value={journal} onChange={event => setJournal(event.target.value)} placeholder="Escreva sua resposta, oração ou aprendizado..." className="mt-5 min-h-32 resize-y rounded-2xl border-[#ded7c8] bg-[#fcfbf7] p-4 leading-6 dark:border-white/10 dark:bg-white/5" /><div className="mt-3 flex justify-end"><Button variant="outline" onClick={handleJournal} disabled={journalMutation.isPending} className="rounded-xl border-[#d5c49c] text-[#70591e] dark:text-[#e6d099]">Salvar no diário</Button></div></section>
      <section className="mt-10 rounded-2xl border border-[#e6dfd0] p-5 dark:border-white/10"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a07c34]">Minha oração de hoje</p><p className="mt-3 font-serif text-lg leading-8 text-[#3b4d42] dark:text-[#d6e1d8]">{devotional.prayer}</p></section>
      {!isAuthenticated && <div className="mt-7 flex gap-3 rounded-2xl bg-[#fbf5e6] p-4 text-sm text-[#755d2b] dark:bg-[#2d291f] dark:text-[#e8d8a6]"><LockKeyhole className="h-4 w-4 shrink-0" /><span>Entre para salvar o diário, favoritos e sua sequência de fé.</span></div>}
      <div className="mt-9 flex flex-col gap-3 border-t border-[#ece6d9] pt-7 sm:flex-row"><Button onClick={handleComplete} disabled={completionMutation.isPending} className={isComplete ? "h-12 flex-1 rounded-xl bg-[#e1efe2] text-[#2e6640] hover:bg-[#d6e9d7] dark:bg-[#2d543a] dark:text-[#d4ecd8]" : "h-12 flex-1 rounded-xl bg-[#102820] text-white hover:bg-[#1d4938]"}>{isComplete ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Minuto concluído</> : <><Check className="mr-2 h-4 w-4" /> Marcar meu minuto como concluído</>}</Button>{dayNumber < 365 && <Button variant="outline" onClick={() => navigate(`/devocional/${dayNumber + 1}`)} className="h-12 rounded-xl border-[#d8d1c3]">Continuar para amanhã <ArrowRight className="ml-2 h-4 w-4" /></Button>}</div>
    </article></div></AppShell>;
}
