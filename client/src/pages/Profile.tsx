import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { BellRing, Check, Clock3, LogOut, Moon, Sparkles, Target, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const challenges = ["Propósito", "Liderança", "Finanças", "Disciplina", "Decisões", "Medo", "Crescimento", "Relacionamentos", "Equilíbrio"];

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const utils = trpc.useUtils();
  const stateQuery = trpc.devotional.state.useQuery(undefined, { enabled: isAuthenticated });
  const preferences = stateQuery.data?.preferences;
  const [goal, setGoal] = useState(""); const [challenge, setChallenge] = useState(""); const [time, setTime] = useState("07:00"); const [notifications, setNotifications] = useState(true);
  useEffect(() => { setGoal(preferences?.goal || ""); setChallenge(preferences?.mainChallenge || ""); setTime(preferences?.notificationTime || "07:00"); setNotifications(preferences?.notificationsEnabled ?? true); }, [preferences]);
  const mutation = trpc.devotional.updatePreferences.useMutation({ onSuccess: () => { utils.devotional.state.invalidate(); toast.success("Preferências salvas."); } });
  const save = () => mutation.mutate({ goal, mainChallenge: challenge, notificationTime: time, notificationsEnabled: notifications, preferredTheme: "system" });
  if (!isAuthenticated) return <AppShell><div className="mx-auto max-w-2xl px-4 py-24 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8efe6] text-[#416e53]"><UserRound className="h-6 w-6" /></span><p className="mt-6 text-xs font-bold uppercase tracking-[.18em] text-[#a07c34]">Seu perfil</p><h1 className="mt-3 font-serif text-4xl font-semibold">Uma jornada que respeita seu momento.</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#718077]">Entre para personalizar desafios, objetivo e o horário do seu Minuto da Provisão.</p><Button onClick={startLogin} className="mt-7 rounded-xl bg-[#102820] text-white">Entrar para personalizar</Button></div></AppShell>;
  const name = user?.name || "Empreendedor";
  return <AppShell><div className="mx-auto max-w-3xl px-4 py-7 sm:px-7 lg:py-10"><section className="flex items-center gap-4"><span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#102820] font-serif text-xl font-semibold text-[#d9b45e]">{name.split(" ").map(item => item[0]).slice(0, 2).join("")}</span><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#a07c34]">Seu perfil</p><h1 className="mt-1 font-serif text-3xl font-semibold">{name}</h1><p className="mt-1 text-sm text-[#708077]">Seu Minuto da Provisão, no seu ritmo.</p></div></section>
    <section className="mt-8 space-y-5"><div className="rounded-[24px] border border-[#e5dfd1] bg-[#fffdfa] p-6 dark:border-white/10 dark:bg-[#17231f]"><div className="flex items-center gap-2"><Target className="h-4 w-4 text-[#b38c31]" /><h2 className="font-serif text-xl font-semibold">Direção da jornada</h2></div><label className="mt-5 block text-xs font-bold uppercase tracking-[.12em] text-[#7c887f]">Meu objetivo atual</label><Input value={goal} onChange={event => setGoal(event.target.value)} placeholder="Ex.: liderar com mais serenidade e clareza" className="mt-2 h-11 rounded-xl border-[#ded7c8] bg-white dark:border-white/10 dark:bg-white/5" /><label className="mt-6 block text-xs font-bold uppercase tracking-[.12em] text-[#7c887f]">O que mais desafia você hoje?</label><div className="mt-3 flex flex-wrap gap-2">{challenges.map(item => <button key={item} onClick={() => setChallenge(item)} className={challenge === item ? "rounded-full bg-[#102820] px-3 py-2 text-xs font-semibold text-white" : "rounded-full bg-[#efeee8] px-3 py-2 text-xs font-semibold text-[#69766e] dark:bg-white/10 dark:text-[#d3dcd5]"}>{item}</button>)}</div></div>
      <div className="rounded-[24px] border border-[#e5dfd1] bg-[#fffdfa] p-6 dark:border-white/10 dark:bg-[#17231f]"><div className="flex items-center gap-2"><BellRing className="h-4 w-4 text-[#b38c31]" /><h2 className="font-serif text-xl font-semibold">Meu horário</h2></div><p className="mt-2 text-sm leading-6 text-[#728077]">A arquitetura está preparada para lembretes diários. O envio efetivo pode ser conectado a notificações push em uma próxima etapa.</p><div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3eb] text-[#416e53] dark:bg-[#294132]"><Clock3 className="h-4 w-4" /></span><Input type="time" value={time} onChange={event => setTime(event.target.value)} className="w-28 rounded-xl border-[#ded7c8] bg-white dark:border-white/10 dark:bg-white/5" /></div><div className="flex items-center gap-3"><span className="text-sm font-medium">Receber meu Minuto diariamente</span><Switch checked={notifications} onCheckedChange={setNotifications} /></div></div></div>
      <div className="flex flex-col gap-3 sm:flex-row"><Button onClick={save} disabled={mutation.isPending} className="h-11 rounded-xl bg-[#102820] px-5 text-white hover:bg-[#1d4938]"><Check className="mr-2 h-4 w-4" /> Salvar preferências</Button><Button variant="outline" onClick={() => logout()} className="h-11 rounded-xl border-[#ddcfca] text-[#9a5047]"><LogOut className="mr-2 h-4 w-4" /> Sair da conta</Button></div></section></div></AppShell>;
}
