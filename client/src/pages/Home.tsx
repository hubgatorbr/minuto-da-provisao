import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getBibleTranslation } from "@shared/bible-translations";
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Clock3, Flame, Heart, Loader2, Sparkles, Target } from "lucide-react";
import { Link, useLocation } from "wouter";

function dayOfYear() { const now = new Date(); const start = new Date(now.getFullYear(), 0, 0); return Math.floor((now.getTime() - start.getTime()) / 86400000); }
function greeting() { const hour = new Date().getHours(); return hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"; }
function streak(ids: number[]) { const done = new Set(ids); let count = 0; for (let day = dayOfYear(); day >= 1 && done.has(day); day -= 1) count += 1; return count; }

export default function Home() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const day = dayOfYear();
  const devotionalQuery = trpc.devotional.byDay.useQuery({ dayNumber: day });
  const stateQuery = trpc.devotional.state.useQuery(undefined, { enabled: isAuthenticated });
  const devotional = devotionalQuery.data;
  const bibleTranslation = getBibleTranslation(devotional?.bibleTranslation);
  const completed = stateQuery.data?.completedDays ?? stateQuery.data?.completedIds ?? [];
  const completedCount = completed.length;
  const currentStreak = streak(completed);
  const progress = Math.round((completedCount / 365) * 100);
  const displayName = user?.name?.split(" ")[0] || "Empreendedor";
  const isDone = completed.includes(day);

  if (devotionalQuery.isLoading || loading || (isAuthenticated && stateQuery.isLoading)) return <AppShell><div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#b38c31]" /></div></AppShell>;

  return <AppShell><div className="mx-auto max-w-[1420px] px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
    <section className="relative overflow-hidden rounded-[28px] bg-[#102820] px-6 py-8 text-white shadow-[0_18px_50px_rgba(16,40,32,.14)] sm:px-9 sm:py-10">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#d9b45e]/10 blur-3xl" /><div className="absolute bottom-0 right-0 h-28 w-4/5 bg-gradient-to-r from-transparent to-[#d9b45e]/10" />
      <div className="relative max-w-2xl"><p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-[#d9b45e]"><Sparkles className="h-3.5 w-3.5" /> Seu encontro diário</p><h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">{greeting()}, {displayName}.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#c4d1cb] sm:text-base">Antes de cuidar dos seus negócios, cuide daquilo que sustenta sua caminhada.</p>{!isAuthenticated && <Button onClick={startLogin} variant="outline" className="mt-6 border-[#d9b45e]/40 bg-[#d9b45e]/10 text-[#f5df9f] hover:bg-[#d9b45e]/20">Começar minha jornada <ArrowRight className="ml-2 h-4 w-4" /></Button>}</div>
    </section>

    <section className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,.8fr)]">
      <article className="relative overflow-hidden rounded-[28px] border border-[#e5dfd1] bg-[#fffdfa] p-6 shadow-[0_8px_30px_rgba(20,38,28,.045)] dark:border-white/10 dark:bg-[#17231f] sm:p-8">
        <div className="mb-6 flex items-center justify-between"><span className="rounded-full bg-[#eaf0e7] px-3 py-1 text-[11px] font-bold uppercase tracking-[.16em] text-[#356248] dark:bg-[#2b4036] dark:text-[#b9d5be]">Dia {String(day).padStart(3, "0")} de 365</span><span className="flex items-center gap-1.5 text-xs font-medium text-[#7a887f]"><Clock3 className="h-3.5 w-3.5" /> 5 min</span></div>
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#b38c31]">{devotional?.theme || "Provisão"}</p><h2 className="mt-2 max-w-xl font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{devotional?.title || "Seu Minuto da Provisão"}</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-[#64726a] dark:text-[#b8c5bd]">Hoje, encontre clareza para liderar, decidir e construir sem separar a fé da sua vida de empreendedor.</p>
        <div className="mt-6 rounded-2xl border-l-4 border-[#d9b45e] bg-[#faf5e9] px-4 py-3 dark:bg-[#29291f]"><p className="text-xs font-medium uppercase tracking-[.12em] text-[#9a7730]">Referência bíblica · {bibleTranslation.shortLabel}</p><p className="mt-1 font-serif text-lg text-[#283a30] dark:text-[#ede4c4]">{devotional?.bibleReference || "Provérbios 16:3"}</p></div>
        <div className="mt-7 flex flex-wrap gap-3"><Button onClick={() => navigate(`/devocional/${day}`)} className="h-11 rounded-xl bg-[#102820] px-5 text-white hover:bg-[#1d4938]">{isDone ? "Revisar meu minuto" : "Começar meu minuto"} <ArrowRight className="ml-2 h-4 w-4" /></Button>{isDone && <span className="flex items-center gap-1.5 py-2 text-xs font-semibold text-[#3d7d57]"><CheckCircle2 className="h-4 w-4" /> Concluído hoje</span>}</div>
      </article>

      <aside className="rounded-[28px] border border-[#e5dfd1] bg-[#efe9dc] p-6 dark:border-white/10 dark:bg-[#1a2923]"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#867b65]">Minha jornada</p><h3 className="mt-1 font-serif text-2xl font-semibold">Seu ritmo importa.</h3></div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9b45e] text-[#102820]"><Target className="h-5 w-5" /></div></div><div className="mt-7"><div className="mb-2 flex justify-between text-sm"><span className="font-medium">{completedCount} de 365 dias</span><span className="text-[#8d8069]">{progress}%</span></div><Progress value={progress} className="h-2 bg-[#ddd3c0] [&>div]:bg-[#b38c31]" /></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/70 p-3 dark:bg-white/5"><Flame className="mb-2 h-4 w-4 text-[#c57b38]" /><p className="text-xl font-semibold">{currentStreak}</p><p className="text-[11px] text-[#7f7566]">sequência atual</p></div><div className="rounded-2xl bg-white/70 p-3 dark:bg-white/5"><BookOpen className="mb-2 h-4 w-4 text-[#416e53]" /><p className="text-xl font-semibold">{365 - completedCount}</p><p className="text-[11px] text-[#7f7566]">dias por viver</p></div></div><Link href="/jornada" className="mt-6 flex items-center justify-between border-t border-[#dcd2be] pt-4 text-sm font-semibold text-[#315d43] dark:border-white/10 dark:text-[#b9d5be]">Ver a jornada completa <ChevronRight className="h-4 w-4" /></Link></aside>
    </section>

    <section className="mt-7 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-[#e5dfd1] bg-white/75 p-5 dark:border-white/10 dark:bg-white/[.03]"><Heart className="h-4 w-4 text-[#b38c31]" /><h3 className="mt-3 font-serif text-lg font-semibold">Fé que orienta</h3><p className="mt-1 text-sm leading-6 text-[#718077]">Uma pausa para ouvir, refletir e voltar ao essencial.</p></div><div className="rounded-2xl border border-[#e5dfd1] bg-white/75 p-5 dark:border-white/10 dark:bg-white/[.03]"><Target className="h-4 w-4 text-[#b38c31]" /><h3 className="mt-3 font-serif text-lg font-semibold">Sabedoria que decide</h3><p className="mt-1 text-sm leading-6 text-[#718077]">Princípios bíblicos aplicados a desafios reais do negócio.</p></div><div className="rounded-2xl border border-[#e5dfd1] bg-white/75 p-5 dark:border-white/10 dark:bg-white/[.03]"><BookOpen className="h-4 w-4 text-[#b38c31]" /><h3 className="mt-3 font-serif text-lg font-semibold">Bíblia {bibleTranslation.shortLabel}</h3><p className="mt-1 text-sm leading-6 text-[#718077]">Referências {bibleTranslation.shortLabel} e conteúdo devocional original, sem longas reproduções.</p></div></section>
  </div></AppShell>;
}
