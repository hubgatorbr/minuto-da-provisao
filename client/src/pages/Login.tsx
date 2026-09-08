import { getLandingUrl, startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginRedirect } from "@/auth-routing";
import { ArrowLeft, ArrowRight, BookOpen, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();
  const { user, loading, error } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const redirect = getLoginRedirect({ loading, authenticated: Boolean(user) });

  useEffect(() => {
    if (redirect) navigate(redirect, { replace: true });
  }, [navigate, redirect]);

  const handleLogin = () => {
    setStartError(null);
    setIsStarting(true);
    try {
      startLogin();
    } catch (loginError) {
      setIsStarting(false);
      setStartError(loginError instanceof Error ? loginError.message : "Não foi possível iniciar o login.");
    }
  };

  if (loading || user) return <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] text-[#b38c31]"><Loader2 className="h-7 w-7 animate-spin" aria-label="Carregando autenticação" /></div>;

  return <main className="min-h-screen bg-[#102a43] text-white"><div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[.9fr_1.1fr]">
    <section className="hidden flex-col justify-between p-10 lg:flex xl:p-14"><a href={getLandingUrl()} className="flex items-center gap-3 text-white"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d9b45e] text-[#102a43]"><BookOpen className="h-5 w-5" /></span><span><strong className="block font-serif text-lg">Minuto</strong><span className="-mt-1 block text-[11px] uppercase tracking-[.2em] text-[#d9b45e]">da Provisão</span></span></a><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-[#d9b45e]">Sua jornada começa com uma pausa</p><h1 className="mt-5 max-w-md font-serif text-5xl font-semibold leading-tight">Fé para decidir. Clareza para construir.</h1><p className="mt-5 max-w-md text-sm leading-7 text-[#c9d8e4]">Uma prática diária para alinhar o coração, a liderança e o trabalho.</p></div><p className="text-xs text-[#9fb2c4]">Autenticação segura, sem criar uma segunda conta ou sessão.</p></section>
    <section className="flex items-center justify-center bg-[#f7f8fb] px-5 py-10 text-[#14263a] sm:px-8"><div className="w-full max-w-md"><a href={getLandingUrl()} className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#265a82] hover:text-[#102a43] lg:hidden"><ArrowLeft className="h-4 w-4" /> Voltar para a landing</a><div className="rounded-[28px] border border-[#e0e8ef] bg-white p-7 shadow-[0_20px_55px_rgba(16,42,67,.08)] sm:p-9"><div className="mb-8 lg:hidden"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d9b45e] text-[#102a43]"><BookOpen className="h-5 w-5" /></span><p className="mt-3 font-serif text-xl font-semibold">Minuto da Provisão</p></div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b38c31]">Acesso à sua jornada</p><h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight">Entre ou crie sua conta</h2><p className="mt-3 text-sm leading-6 text-[#718291]">Use sua conta Google para continuar com segurança. O mesmo acesso serve para entrar e criar sua conta.</p>{(error || startError) && <div role="alert" className="mt-6 rounded-xl border border-[#e7b4b4] bg-[#fff4f4] px-4 py-3 text-sm text-[#9f3a3a]">{startError || error?.message || "Não foi possível verificar sua sessão."}</div>}<Button type="button" disabled={isStarting} onClick={handleLogin} className="mt-7 h-12 w-full rounded-xl bg-[#102a43] text-sm font-semibold text-white hover:bg-[#1e4d73] disabled:cursor-wait disabled:opacity-70">{isStarting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Abrindo o acesso...</> : <>Continuar com Google <ArrowRight className="ml-2 h-4 w-4" /></>}</Button><div className="mt-6 space-y-3 text-center text-sm text-[#718291]"><p>Primeira vez por aqui? <button type="button" onClick={handleLogin} disabled={isStarting} className="font-semibold text-[#265a82] underline-offset-4 hover:underline disabled:opacity-60">Criar minha conta</button></p><p>Já tenho uma conta? <button type="button" onClick={handleLogin} disabled={isStarting} className="font-semibold text-[#265a82] underline-offset-4 hover:underline disabled:opacity-60">Entrar</button></p></div><div className="mt-8 flex gap-3 rounded-2xl bg-[#edf3f8] p-4 text-xs leading-5 text-[#647789]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#b38c31]" /><span>O login usa o Manus OAuth oficial, com sessão segura no servidor. Nenhum token é armazenado nesta página.</span></div></div><p className="mt-6 text-center text-xs text-[#8a98a5]">Ao continuar, você será levado ao fluxo oficial de autenticação.</p></div></section>
  </div></main>;
}
