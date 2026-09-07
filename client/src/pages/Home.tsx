import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getBibleTranslation } from "@shared/bible-translations";
import { ArrowRight, BookMarked, CheckCircle2, Flame, Loader2, LockKeyhole, Sparkles } from "lucide-react";
import { Link } from "wouter";

function dayOfYear() {
  const today = new Date();
  return Math.min(365, Math.max(1, Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)));
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const dayNumber = dayOfYear();
  const devotionalQuery = trpc.devotional.byDay.useQuery({ dayNumber });
  const stateQuery = trpc.devotional.state.useQuery(undefined, { enabled: isAuthenticated });
  const devotional = devotionalQuery.data;
  const completed = stateQuery.data?.completedDays?.length ?? 0;
  const translation = getBibleTranslation(devotional?.bibleTranslation);

  if (devotionalQuery.isLoading || (isAuthenticated && stateQuery.isLoading)) {
    return <AppShell><div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#b38c31]" /></div></AppShell>;
  }
  if (!devotional) {
    return <AppShell><div className="mx-auto max-w-2xl px-5 py-24 text-center"><BookMarked className="mx-auto h-9 w-9 text-[#b38c31]" /><h1 className="mt-5 font-serif text-3xl">Seu próximo minuto está sendo preparado.</h1><p className="mt-3 text-sm leading-6 text-[#718077]">Abra a jornada para explorar os devocionais disponíveis.</p><Link href="/jornada" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#356248]">Ver jornada <ArrowRight className="h-4 w-4" /></Link></div></AppShell>;
  }

  return <AppShell><div className="mx-auto max-w-[1420px] px-4 py-7 sm:px-7 lg:px-10 lg:py-12">
    <section className="grid gap-7 xl:grid-cols-[1.12fr_.88fr] xl:items-stretch">
      <div className="relative overflow-hidden rounded-[30px] bg-[#102820] px-6 py-8 text-white shadow-[0_20px_60px_rgba(16,40,32,.14)] sm:px-10 sm:py-11"><div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#d9b45e]/20" /><div className="absolute -bottom-28 right-10 h-56 w-56 rounded-full border border-[#d9b45e]/10" /><div className="relative"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#d9b45e]"><Sparkles className="h-3.5 w-3.5" /> Minuto de hoje · Dia {dayNumber}</p><h1 className="mt-5 max-w-2xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">Um minuto para ouvir Deus.<br /><span className="text-[#d9b45e]">Um dia para construir.</span></h1><p className="mt-5 max-w-xl text-sm leading-7 text-[#bfd0c5]">Devocionais breves para empreendedores que desejam alinhar fé, trabalho e decisões com propósito.</p><Link href={`/devocional/${dayNumber}`} className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-[#d9b45e] px-5 text-sm font-semibold text-[#102820] transition-transform hover:-translate-y-0.5">Começar meu minuto <ArrowRight className="h-4 w-4" /></Link></div></div>
      <article className="rounded-[30px] border border-[#e5dfd1] bg-[#fffdfa] p-6 shadow-[0_10px_35px_rgba(22,39,29,.05)] sm:p-8 dark:border-white/10 dark:bg-[#17231f]"><div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#a07c34]">Leitura de hoje</p><p className="mt-1 text-xs text-[#7b887f]">{devotional.month} · {devotional.theme}</p></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4e9c9] text-[#9b782d]"><BookMarked className="h-5 w-5" /></span></div><h2 className="mt-7 font-serif text-3xl font-semibold leading-tight">{devotional.title}</h2><p className="mt-4 flex items-center gap-2 text-sm font-medium text-[#416e53]"><span className="h-1.5 w-1.5 rounded-full bg-[#d9b45e]" /> {devotional.bibleReference} · {translation.shortLabel}</p><p className="mt-5 line-clamp-4 text-sm leading-7 text-[#68786e] dark:text-[#c7d2ca]">{devotional.reflection}</p><Link href={`/devocional/${dayNumber}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#356248]">Ler reflexão completa <ArrowRight className="h-4 w-4" /></Link></article>
    </section>
    <section className="mt-7 grid gap-5 md:grid-cols-[1fr_1fr_.8fr]"><div className="rounded-2xl border border-[#e5dfd1] bg-white/70 p-5 dark:border-white/10 dark:bg-white/[.03]"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a07c34]">Sua constância</p><p className="mt-2 font-serif text-2xl">{completed} de 365 minutos</p></div><Flame className="h-5 w-5 text-[#c29432]" /></div><Progress value={(completed / 365) * 100} className="mt-5 h-2 bg-[#e9e5da] [&>div]:bg-[#d9b45e]" /><Link href="/jornada" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#416e53]">Acompanhar jornada <ArrowRight className="h-3.5 w-3.5" /></Link></div><div className="rounded-2xl border border-[#e5dfd1] bg-white/70 p-5 dark:border-white/10 dark:bg-white/[.03]"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a07c34]">Uma prática para hoje</p><p className="mt-3 font-serif text-xl leading-7">“Não carregue sozinho aquilo que nunca esteve totalmente nas suas mãos.”</p><Link href={`/devocional/${dayNumber}`} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#416e53]">Ver ação prática <ArrowRight className="h-3.5 w-3.5" /></Link></div><div className="rounded-2xl bg-[#f3ead2] p-5 text-[#5e4d27] dark:bg-[#2d291f] dark:text-[#ead8a3]"><CheckCircle2 className="h-5 w-5 text-[#a17b2b]" /><p className="mt-3 font-serif text-xl leading-7">Constância também é uma forma de fé.</p>{!isAuthenticated && <p className="mt-2 flex items-center gap-1.5 text-xs leading-5"><LockKeyhole className="h-3.5 w-3.5" /> Entre para guardar seu progresso.</p>}</div></section>
  </div></AppShell>;
}
