import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

const benefits = [
  "365 devocionais para sua jornada",
  "Progresso, diário e favoritos em um só lugar",
  "Uma pausa de cinco minutos para ouvir Deus",
];

export default function Login() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading, error } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, loading, navigate]);

  return (
    <main className="min-h-screen bg-[#071c35] text-[#f9f4e7]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,.95fr)]">
        <section className="relative hidden overflow-hidden px-12 py-10 lg:flex lg:flex-col xl:px-20 xl:py-14">
          <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-[#d9b45e]/10 blur-3xl" />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-[#d9b45e]/15" />
          <div className="absolute -right-8 top-8 h-64 w-64 rounded-full border border-[#d9b45e]/10" />

          <a href="/" className="relative flex w-fit items-center gap-3 focus-visible:rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b45e]">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9b45e]/35 bg-[#d9b45e]/10 text-[#e6c878]">
              <BookOpen className="h-5 w-5" />
            </span>
            <span>
              <strong className="block font-serif text-xl font-semibold leading-none">Minuto</strong>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[.24em] text-[#d9b45e]">da Provisão</span>
            </span>
          </a>

          <div className="relative my-auto max-w-2xl py-16">
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-[#d9b45e]">
              <Sparkles className="h-4 w-4" /> Sua jornada continua aqui
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-[1.03] tracking-[-.035em] xl:text-6xl">
              Entre para cuidar daquilo que sustenta sua caminhada.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#bdc9d4]">
              Acesse seu Minuto da Provisão e encontre fé para liderar, sabedoria para decidir e propósito para construir.
            </p>

            <ul className="mt-10 space-y-4" aria-label="Benefícios da conta">
              {benefits.map(benefit => (
                <li key={benefit} className="flex items-center gap-3 text-sm text-[#e7edf1]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d9b45e]/15 text-[#e6c878]">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative max-w-lg border-l border-[#d9b45e]/40 pl-5 font-serif text-lg italic leading-7 text-[#d7dfe5]">
            “Constância também é uma forma de fé.”
          </p>
        </section>

        <section className="relative flex items-center justify-center overflow-hidden bg-[#f7f3e9] px-5 py-8 text-[#102820] dark:bg-[#101a17] dark:text-[#eeeade] sm:px-8 lg:px-12">
          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#d9b45e]/15 blur-3xl" />
          <div className="relative w-full max-w-md">
            <a href="/" className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#536159] transition-colors hover:text-[#102820] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b38c31] dark:text-[#aab8af] dark:hover:text-white lg:hidden">
              <ArrowLeft className="h-4 w-4" /> Voltar ao site
            </a>

            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#102820] text-[#d9b45e] dark:bg-[#d9b45e] dark:text-[#102820]">
                <BookOpen className="h-5 w-5" />
              </span>
              <span>
                <strong className="block font-serif text-xl font-semibold leading-none">Minuto</strong>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[.24em] text-[#70551c]">da Provisão</span>
              </span>
            </div>

            <div className="rounded-[28px] border border-[#ded6c5] bg-white/80 p-7 shadow-[0_24px_70px_rgba(28,39,32,.10)] backdrop-blur-xl dark:border-white/10 dark:bg-[#17231f]/90 sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9efe7] text-[#315d43] dark:bg-[#273d32] dark:text-[#c5dccb]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[#70551c]">Área do assinante</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight">Entre na sua jornada.</h2>
              <p className="mt-4 text-sm leading-6 text-[#59675f] dark:text-[#b6c2ba]">
                Use sua conta Manus para acessar com segurança seu devocional, progresso e registros pessoais.
              </p>

              <Button
                type="button"
                onClick={startLogin}
                disabled={loading}
                className="mt-8 h-12 w-full rounded-xl bg-[#102820] text-sm font-semibold text-white shadow-[0_12px_28px_rgba(16,40,32,.18)] hover:-translate-y-0.5 hover:bg-[#183b2f] hover:shadow-[0_16px_34px_rgba(16,40,32,.24)] dark:bg-[#d9b45e] dark:text-[#102820] dark:hover:bg-[#e5c672]"
              >
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando acesso</> : <>Entrar com Manus <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>

              {error && (
                <p role="alert" className="mt-4 rounded-xl bg-[#f7e9e6] px-4 py-3 text-xs leading-5 text-[#8f4035] dark:bg-[#3a211e] dark:text-[#f2b8af]">
                  Não foi possível verificar sua sessão. Você ainda pode tentar entrar novamente.
                </p>
              )}

              <div className="mt-7 flex items-center gap-2 border-t border-[#e7e0d2] pt-6 text-xs leading-5 text-[#56645c] dark:border-white/10 dark:text-[#aab6ae]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#477258] dark:text-[#a9c8b0]" />
                A autenticação é protegida e seus dados pessoais permanecem vinculados à sua conta.
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-[#59665f] dark:text-[#9eaaa2]">
              Ao entrar, você concorda com os <a href="/termos" className="underline decoration-[#b38c31]/50 underline-offset-4 hover:text-[#102820] dark:hover:text-white">Termos de Uso</a> e a <a href="/privacidade" className="underline decoration-[#b38c31]/50 underline-offset-4 hover:text-[#102820] dark:hover:text-white">Política de Privacidade</a>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
