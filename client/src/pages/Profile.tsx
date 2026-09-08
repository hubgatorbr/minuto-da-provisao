import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { BellRing, Camera, Check, Clock3, Crown, Flame, LogOut, Medal, Sparkles, Target, Trophy, UserRound, X } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const challenges = ["Propósito", "Liderança", "Finanças", "Disciplina", "Decisões", "Medo", "Crescimento", "Relacionamentos", "Equilíbrio"];

export default function Profile() {
  const { user, isAuthenticated, logout, refresh } = useAuth();
  const utils = trpc.useUtils();
  const stateQuery = trpc.devotional.state.useQuery(undefined, { enabled: isAuthenticated });
  const journeyQuery = trpc.journey.stats.useQuery(undefined, { enabled: isAuthenticated });
  const preferences = stateQuery.data?.preferences;
  const [goal, setGoal] = useState(""); const [challenge, setChallenge] = useState(""); const [time, setTime] = useState("07:00"); const [notifications, setNotifications] = useState(true);
  useEffect(() => { setGoal(preferences?.goal || ""); setChallenge(preferences?.mainChallenge || ""); setTime(preferences?.notificationTime || "07:00"); setNotifications(preferences?.notificationsEnabled ?? true); }, [preferences]);
  const mutation = trpc.devotional.updatePreferences.useMutation({ onSuccess: () => { utils.devotional.state.invalidate(); toast.success("Preferências salvas."); } });
  const avatarMutation = trpc.profile.updateAvatar.useMutation({ onSuccess: async () => { await refresh(); toast.success("Foto de perfil atualizada."); } });
  const removeAvatarMutation = trpc.profile.removeAvatar.useMutation({ onSuccess: async () => { await refresh(); toast.success("Foto removida."); } });
  const save = () => mutation.mutate({ goal, mainChallenge: challenge, notificationTime: time, notificationsEnabled: notifications, preferredTheme: "system" });
  const name = user?.name || "Empreendedor";
  const initials = name.split(" ").map(item => item[0]).slice(0, 2).join("").toUpperCase();
  const handleAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) return toast.error("Use uma imagem JPG, PNG ou WEBP.");
    if (file.size > 5 * 1024 * 1024) return toast.error("A foto deve ter no máximo 5 MB.");
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") avatarMutation.mutate({ dataUrl: reader.result }); };
    reader.readAsDataURL(file);
    event.target.value = "";
  };
  if (!isAuthenticated) return <AppShell><div className="mx-auto max-w-2xl px-4 py-24 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7f0f8] text-[#3f6e8f]"><UserRound className="h-6 w-6" /></span><p className="mt-6 text-xs font-bold uppercase tracking-[.18em] text-[#a07c34]">Seu perfil</p><h1 className="mt-3 font-serif text-4xl font-semibold">Uma jornada que respeita seu momento.</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#718291]">Entre para personalizar desafios, objetivo e o horário do seu Minuto da Provisão.</p><Button onClick={startLogin} className="mt-7 rounded-xl bg-[#102a43] text-white">Entrar para personalizar</Button></div></AppShell>;
  return <AppShell><div className="mx-auto max-w-3xl px-4 py-7 sm:px-7 lg:py-10">
    <section className="flex flex-col gap-5 rounded-[24px] bg-[#edf3f8] p-6 dark:bg-[#15263b] sm:flex-row sm:items-center">
      <div className="relative"><div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#102a43] font-serif text-3xl font-semibold text-[#d9b45e] ring-4 ring-white dark:ring-[#243f5b]">{user?.avatarUrl ? <img src={user.avatarUrl} alt={`Foto de ${name}`} className="h-full w-full object-cover" /> : initials}</div><label className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#d9b45e] text-[#102a43] shadow-lg"><Camera className="h-4 w-4" /><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleAvatar} /></label></div>
      <div className="flex-1"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#a07c34]">Seu perfil</p><h1 className="mt-1 font-serif text-3xl font-semibold">{name}</h1><p className="mt-1 text-sm text-[#708295]">Seu Minuto da Provisão, no seu ritmo.</p><div className="mt-3 flex flex-wrap gap-2"><label className="cursor-pointer rounded-xl border border-[#c5d3df] bg-white px-3 py-2 text-xs font-semibold text-[#265a82]">Alterar foto<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleAvatar} /></label>{user?.avatarUrl && <button onClick={() => removeAvatarMutation.mutate()} className="rounded-xl border border-[#e5caca] px-3 py-2 text-xs font-semibold text-[#a15858]">Remover foto</button>}</div></div>
    </section>
    <section className="mt-6 rounded-[24px] border border-[#dce5ed] bg-white p-6 dark:border-white/10 dark:bg-[#15263b]"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a07c34]">Minha jornada</p><h2 className="mt-1 font-serif text-2xl font-semibold">Cada marco representa um passo.</h2></div><Link href="/conquistas" className="rounded-xl bg-[#102a43] px-3 py-2 text-xs font-semibold text-white">Ver conquistas</Link></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-2xl bg-[#edf3f8] p-4 dark:bg-white/5"><Target className="h-4 w-4 text-[#3f6e8f]" /><p className="mt-2 text-2xl font-semibold">{journeyQuery.data?.completedCount ?? 0}</p><p className="text-xs text-[#718291]">dias concluídos</p></div><div className="rounded-2xl bg-[#edf3f8] p-4 dark:bg-white/5"><Flame className="h-4 w-4 text-[#c57b38]" /><p className="mt-2 text-2xl font-semibold">{journeyQuery.data?.currentStreak ?? 0}</p><p className="text-xs text-[#718291]">sequência atual</p></div><div className="rounded-2xl bg-[#edf3f8] p-4 dark:bg-white/5"><Sparkles className="h-4 w-4 text-[#b38c31]" /><p className="mt-2 text-2xl font-semibold">{journeyQuery.data?.longestStreak ?? 0}</p><p className="text-xs text-[#718291]">maior sequência</p></div><div className="rounded-2xl bg-[#edf3f8] p-4 dark:bg-white/5"><Trophy className="h-4 w-4 text-[#b38c31]" /><p className="mt-2 text-2xl font-semibold">{journeyQuery.data?.achievements.filter(item => item.unlocked).length ?? 0}</p><p className="text-xs text-[#718291]">conquistas</p></div></div></section>
    <section className="mt-6 space-y-5"><div className="rounded-[24px] border border-[#dce5ed] bg-white p-6 dark:border-white/10 dark:bg-[#15263b]"><div className="flex items-center gap-2"><Target className="h-4 w-4 text-[#b38c31]" /><h2 className="font-serif text-xl font-semibold">Direção da jornada</h2></div><label className="mt-5 block text-xs font-bold uppercase tracking-[.12em] text-[#718291]">Meu objetivo atual</label><Input value={goal} onChange={event => setGoal(event.target.value)} placeholder="Ex.: liderar com mais serenidade e clareza" className="mt-2 h-11 rounded-xl border-[#d5e0ea] bg-white dark:border-white/10 dark:bg-white/5" /><label className="mt-6 block text-xs font-bold uppercase tracking-[.12em] text-[#718291]">O que mais desafia você hoje?</label><div className="mt-3 flex flex-wrap gap-2">{challenges.map(item => <button key={item} onClick={() => setChallenge(item)} className={challenge === item ? "rounded-full bg-[#102a43] px-3 py-2 text-xs font-semibold text-white" : "rounded-full bg-[#edf1f5] px-3 py-2 text-xs font-semibold text-[#697b8b] dark:bg-white/10 dark:text-[#d3dce5]"}>{item}</button>)}</div></div>
      <div className="rounded-[24px] border border-[#dce5ed] bg-white p-6 dark:border-white/10 dark:bg-[#15263b]"><div className="flex items-center gap-2"><BellRing className="h-4 w-4 text-[#b38c31]" /><h2 className="font-serif text-xl font-semibold">Meu horário</h2></div><p className="mt-2 text-sm leading-6 text-[#718291]">Escolha o horário ideal para a sua pausa diária.</p><div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f0f8] text-[#3f6e8f]"><Clock3 className="h-4 w-4" /></span><Input type="time" value={time} onChange={event => setTime(event.target.value)} className="w-28 rounded-xl border-[#d5e0ea] bg-white dark:border-white/10 dark:bg-white/5" /></div><div className="flex items-center gap-3"><span className="text-sm font-medium">Receber meu Minuto diariamente</span><Switch checked={notifications} onCheckedChange={setNotifications} /></div></div></div>
      <div className="flex flex-col gap-3 sm:flex-row"><Button onClick={save} disabled={mutation.isPending} className="h-11 rounded-xl bg-[#102a43] px-5 text-white hover:bg-[#1e4d73]"><Check className="mr-2 h-4 w-4" /> Salvar preferências</Button><Button variant="outline" onClick={() => logout()} className="h-11 rounded-xl border-[#ddcfca] text-[#9a5047]"><LogOut className="mr-2 h-4 w-4" /> Sair da conta</Button></div>
    </section>
  </div></AppShell>;
}
