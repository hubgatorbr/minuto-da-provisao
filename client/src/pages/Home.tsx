import { getAppUrl } from "@/const";
import { ArrowRight, BookOpen, Check, Compass, Heart, Sparkles, Target } from "lucide-react";
import type { ReactNode } from "react";

const loginUrl = getAppUrl("/login");

function CtaLink({ children, secondary = false }: { children: ReactNode; secondary?: boolean }) {
  return <a href={loginUrl} className={secondary ? "inline-flex h-12 items-center justify-center rounded-xl border border-[#d9b45e]/45 px-5 text-sm font-semibold text-[#f5df9f] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b45e]" : "inline-flex h-12 items-center justify-center rounded-xl bg-[#d9b45e] px-5 text-sm font-semibold text-[#102a43] shadow-[0_10px_28px_rgba(217,180,94,.22)] transition-transform hover:-translate-y-0.5 hover:bg-[#e7c976] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5df9f]"}>{children}</a>;
}

export default function Home() {
  return <div className="min-h-screen bg-[#f7f8fb] text-[#14263a]">
    <header className="border-b border-[#e4eaf0] bg-[#f7f8fb]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="Minuto da Provisão, início">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d9b45e] text-[#102a43]"><BookOpen className="h-5 w-5" /></span>
          <span><strong className="block font-serif text-lg font-semibold tracking-tight text-[#102a43]">Minuto</strong><span className="-mt-1 block text-[11px] uppercase tracking-[.2em] text-[#b38c31]">da Provisão</span></span>
        </a>
        <a href={loginUrl} className="rounded-xl px-4 py-2 text-sm font-semibold text-[#265a82] transition-colors hover:bg-[#e8f0f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b38c31]">Entrar</a>
      </div>
    </header>

    <main>
      <section className="relative overflow-hidden bg-[#102a43] text-white">
        <div className="absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#d9b45e]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d9b45e]/10 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:py-28">
          <div>
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.24em] text-[#d9b45e]"><Sparkles className="h-4 w-4" /> Fé para decidir. Clareza para construir.</p>
            <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">Um minuto para ouvir Deus. Um dia para empreender com propósito.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#c9d8e4] sm:text-lg">Uma prática diária, simples e profunda, para líderes que querem cuidar do coração antes de cuidar dos negócios.</p>
            <div className="mt-8 flex flex-wrap gap-3"><CtaLink>Criar minha conta <ArrowRight className="ml-2 h-4 w-4" /></CtaLink><CtaLink secondary>Começar agora</CtaLink></div>
            <p className="mt-5 text-xs text-[#9fb2c4]">Acesso seguro com sua conta Google pela autenticação oficial da aplicação.</p>
          </div>
          <div className="relative rounded-[30px] border border-white/10 bg-white/[.06] p-5 shadow-2xl backdrop-blur-sm sm:p-7">
            <div className="rounded-[24px] bg-[#f7f8fb] p-6 text-[#14263a] sm:p-8"><div className="flex items-center justify-between"><span className="rounded-full bg-[#e8f0f5] px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#2f5d7c]">Seu encontro diário</span><span className="text-xs text-[#718291]">5 min</span></div><p className="mt-8 text-xs font-semibold uppercase tracking-[.17em] text-[#b38c31]">Crescimento</p><h2 className="mt-2 font-serif text-3xl font-semibold leading-tight">A constância que sustenta suas decisões.</h2><p className="mt-4 text-sm leading-7 text-[#647789]">Uma pausa para refletir, aplicar e seguir com mais presença.</p><div className="mt-6 rounded-2xl border-l-4 border-[#d9b45e] bg-[#fffaf0] p-4"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#a07c34]">Referência bíblica · Almeida</p><p className="mt-2 font-serif text-lg">“Confia ao Senhor as tuas obras...”</p></div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b38c31]">Uma jornada possível</p><h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Pequenos minutos. Mudanças que permanecem.</h2><p className="mt-4 text-base leading-7 text-[#647789]">O Minuto da Provisão conecta espiritualidade, liderança e vida real em uma experiência feita para caber na rotina.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3"><article className="rounded-[24px] border border-[#e0e8ef] bg-white p-6 shadow-[0_12px_32px_rgba(20,38,58,.05)]"><Heart className="h-5 w-5 text-[#b38c31]" /><h3 className="mt-5 font-serif text-xl font-semibold">Ouça antes de agir</h3><p className="mt-2 text-sm leading-6 text-[#718291]">Comece o dia com uma leitura e uma reflexão que devolvem perspectiva às decisões.</p></article><article className="rounded-[24px] border border-[#e0e8ef] bg-white p-6 shadow-[0_12px_32px_rgba(20,38,58,.05)]"><Target className="h-5 w-5 text-[#b38c31]" /><h3 className="mt-5 font-serif text-xl font-semibold">Aplique ao seu contexto</h3><p className="mt-2 text-sm leading-6 text-[#718291]">Transforme princípios bíblicos em perguntas e ações práticas para sua liderança.</p></article><article className="rounded-[24px] border border-[#e0e8ef] bg-white p-6 shadow-[0_12px_32px_rgba(20,38,58,.05)]"><Compass className="h-5 w-5 text-[#b38c31]" /><h3 className="mt-5 font-serif text-xl font-semibold">Caminhe com constância</h3><p className="mt-2 text-sm leading-6 text-[#718291]">Acompanhe sua jornada, registre aprendizados e celebre cada conquista.</p></article></div></section>

      <section className="bg-[#edf3f8]"><div className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-8 lg:py-20"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b38c31]">Seu próximo minuto começa agora</p><h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Cuide daquilo que sustenta sua caminhada.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#647789]">Crie sua conta e receba uma jornada diária feita para sua fé e seu propósito.</p><div className="mt-7"><CtaLink>Começar minha jornada <ArrowRight className="ml-2 h-4 w-4" /></CtaLink></div><div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#718291]"><span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#b38c31]" /> Conta segura</span><span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#b38c31]" /> Conteúdo diário</span><span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#b38c31]" /> Jornada no seu ritmo</span></div></div></section>
    </main>

    <footer className="border-t border-[#e0e8ef] bg-[#f7f8fb]"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-[#718291] sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>© {new Date().getFullYear()} Minuto da Provisão.</span><span>Um minuto para ouvir Deus. Um dia para empreender com propósito.</span></div></footer>
  </div>;
}
