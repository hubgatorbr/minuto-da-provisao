import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { BookOpen, CalendarDays, Heart, House, LogOut, Menu, Moon, NotebookPen, Shield, Sparkles, Sun, Trophy, UserRound, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const primaryItems = [
  { href: "/app", label: "Hoje", icon: House },
  { href: "/jornada", label: "Jornada", icon: CalendarDays },
  { href: "/diario", label: "Diário", icon: NotebookPen },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/conquistas", label: "Conquistas", icon: Trophy },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

type AppShellProps = { children: ReactNode };

export default function AppShell({ children }: AppShellProps) {
  const [location, navigate] = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const initials = user?.name?.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase() || "MP";
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };
  const navItems = user?.role === "admin" ? [...primaryItems, { href: "/admin", label: "Admin", icon: Shield }] : primaryItems;

  const isCurrent = (href: string) => href === "/" ? location === "/" : location.startsWith(href);
  const NavLinks = ({ compact = false }: { compact?: boolean }) => (
    <nav className={cn(compact ? "grid grid-cols-3 sm:grid-cols-6" : "space-y-1")}>{(compact ? navItems.filter(item => item.href !== "/admin") : navItems).map(({ href, label, icon: Icon }) => (
      <Link key={href} href={href} onClick={() => setMobileMenu(false)} className={cn(
        compact ? "flex flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium" : "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isCurrent(href) ? "bg-[#d9b45e]/15 text-[#d9b45e]" : "text-[#9baebe] hover:bg-white/5 hover:text-white"
      )}>
        <Icon className={cn(compact ? "h-5 w-5" : "h-[18px] w-[18px]", isCurrent(href) && "text-[#d9b45e]")} />
        <span>{label}</span>
      </Link>
    ))}</nav>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#14263a] dark:bg-[#0c1a2a] dark:text-[#eeeade]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] flex-col bg-[#102a43] px-4 py-6 lg:flex">
        <Link href="/app" className="mb-10 flex items-center gap-3 px-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d9b45e] text-[#102a43] shadow-[0_8px_22px_rgba(217,180,94,.25)]"><BookOpen className="h-5 w-5" /></span>
          <span><strong className="block font-serif text-lg font-semibold tracking-tight text-white">Minuto</strong><span className="block -mt-1 text-[11px] uppercase tracking-[.2em] text-[#d9b45e]">da Provisão</span></span>
        </Link>
        <div className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-[#8293a3]">Sua jornada</div>
        <NavLinks />
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.04] p-4">
          <Sparkles className="mb-2 h-4 w-4 text-[#d9b45e]" />
          <p className="font-serif text-sm leading-5 text-white">“Constância também é uma forma de fé.”</p>
          <p className="mt-2 text-xs leading-5 text-[#9baebe]">Reserve cinco minutos para alinhar o coração e o trabalho.</p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-[#e9e5d9] bg-[#f7f8fb]/90 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0c1a2a]/90 lg:ml-[252px] lg:px-8">
        <div className="mx-auto flex max-w-[1420px] items-center justify-between gap-3">
          <div className="flex items-center gap-3 lg:hidden"><Button variant="ghost" size="icon" aria-label="Abrir menu" onClick={() => setMobileMenu(true)}><Menu className="h-5 w-5" /></Button><Link href="/app" className="font-serif font-semibold tracking-tight">Minuto da Provisão</Link></div>
          <p className="hidden text-sm text-[#647789] dark:text-[#aab8af] lg:block">Um minuto para ouvir Deus. Um dia para empreender com propósito.</p>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Alternar modo escuro" onClick={toggleTheme}>{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
            {isAuthenticated ? <div className="flex items-center gap-2"><Link href="/perfil" className="hidden text-right sm:block"><span className="block text-xs font-semibold">{user?.name || "Empreendedor"}</span><span className="block text-[10px] text-[#7d8a83]">Minha conta</span></Link><button onClick={() => void handleLogout()} title="Sair" className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#102a43] text-xs font-semibold text-[#d9b45e] transition-transform hover:scale-105">{user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initials}</button></div> : <Button onClick={startLogin} className="rounded-xl bg-[#102a43] px-4 text-xs text-white hover:bg-[#183c5c]">Entrar</Button>}
          </div>
        </div>
      </header>

      <main className="pb-24 lg:ml-[252px] lg:pb-10">{children}</main>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#102a43]/95 px-2 pb-[max(.35rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl lg:hidden"><NavLinks compact /></div>
      {mobileMenu && <div className="fixed inset-0 z-50 bg-[#102a43] p-5 lg:hidden"><div className="mb-10 flex items-center justify-between"><Link href="/app" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 text-white"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d9b45e] text-[#102a43]"><BookOpen className="h-5 w-5" /></span><span className="font-serif text-lg">Minuto da Provisão</span></Link><Button variant="ghost" size="icon" className="text-white" onClick={() => setMobileMenu(false)}><X /></Button></div><NavLinks />{isAuthenticated && <button onClick={() => void handleLogout()} className="mt-8 flex items-center gap-3 px-3 py-3 text-sm text-[#9baebe]"><LogOut className="h-4 w-4" /> Sair da conta</button>}</div>}
    </div>
  );
}
