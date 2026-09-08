import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { COOKIE_NAME } from "@shared/const";
import { getLandingCtaAction } from "@shared/landing";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  Crown,
  Flame,
  Heart,
  Lightbulb,
  Menu,
  Moon,
  NotebookPen,
  Pause,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy,
  Users,
  Volume2,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./landing.css";

const navItems = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#jornada", label: "Jornada" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#para-quem", label: "Para quem é" },
  { href: "#faq", label: "FAQ" },
];

const problems = [
  { number: "01", title: "Decisões demais", text: "Você precisa decidir o tempo todo.", icon: Target },
  { number: "02", title: "Pressão demais", text: "Resultados, equipe, clientes, caixa e responsabilidades.", icon: Briefcase },
  { number: "03", title: "Barulho demais", text: "Informações, notificações, reuniões e urgências.", icon: Volume2 },
  { number: "04", title: "Tempo de menos", text: "E sua vida espiritual acaba ficando para depois.", icon: Clock3 },
];

const steps = [
  { number: "01", title: "Pare", text: "Saia por alguns minutos da correria.", icon: Pause },
  { number: "02", title: "Ouça", text: "Leia uma passagem bíblica.", icon: BookOpen },
  { number: "03", title: "Reflita", text: "Conecte a Palavra ao momento que você está vivendo.", icon: Lightbulb },
  { number: "04", title: "Ore", text: "Entregue seus planos, decisões e desafios a Deus.", icon: Heart },
  { number: "05", title: "Aja", text: "Leve uma aplicação prática para o seu dia.", icon: ArrowRight },
];

const themes = [
  { title: "Propósito", question: "Por que você está construindo?", icon: Compass },
  { title: "Decisões", question: "Como decidir sem ter todas as respostas?", icon: Target },
  { title: "Coragem", question: "O que o medo está impedindo você de fazer?", icon: Zap },
  { title: "Finanças", question: "Como administrar o que foi colocado em suas mãos?", icon: Wallet },
  { title: "Liderança", question: "Que tipo de líder você está se tornando?", icon: Users },
  { title: "Resiliência", question: "O que fazer quando os planos mudam?", icon: Flame },
];

const achievements = [
  { title: "Primeiro Minuto", text: "Concluiu o primeiro devocional.", icon: Sparkles },
  { title: "Uma Semana", text: "7 dias consecutivos.", icon: Flame },
  { title: "Constância", text: "30 dias consecutivos.", icon: Star },
  { title: "Metade do Caminho", text: "182 dias de jornada.", icon: Trophy },
  { title: "Um Ano de Propósito", text: "365 dias de presença.", icon: Crown },
];

const audience = [
  "Empreende e quer manter sua fé no centro.",
  "Precisa tomar decisões todos os dias.",
  "Quer desenvolver uma liderança baseada em princípios bíblicos.",
  "Deseja administrar melhor seus recursos.",
  "Quer começar o dia com propósito.",
  "Sente que precisa desacelerar e ouvir Deus.",
  "Quer construir um negócio sem perder o que realmente importa.",
];

const faqs = [
  ["O que é o Minuto da Provisão?", "É um devocional diário criado especialmente para empreendedores cristãos."],
  ["Quantos devocionais existem?", "A jornada possui 365 devocionais — um para cada dia do ano."],
  ["Quanto tempo leva?", "A experiência foi pensada para aproximadamente 5 minutos por dia."],
  ["Preciso ser empresário?", "Não. O conteúdo é direcionado especialmente a empreendedores, mas qualquer pessoa pode acompanhar."],
  ["O conteúdo é baseado na Bíblia?", "Sim. Cada devocional parte de uma passagem bíblica e conecta seus princípios à vida e ao empreendedorismo."],
  ["Qual tradução bíblica é utilizada?", "A aplicação identifica a edição de Almeida utilizada e sua arquitetura permite atualizar a tradução de forma responsável."],
  ["O Minuto da Provisão promete prosperidade financeira?", "Não. A proposta é ajudar você a desenvolver fé, sabedoria, caráter, responsabilidade e propósito."],
];

const calendarMonths = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="landing-brand">
      <span className="landing-brand__mark"><BookOpen aria-hidden="true" /></span>
      <span className="landing-brand__words">
        <strong>MINUTO</strong>
        {!compact && <small>DA PROVISÃO</small>}
      </span>
    </span>
  );
}

function PhoneMockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "phone phone--compact" : "phone"} aria-label="Prévia do aplicativo Minuto da Provisão">
      <div className="phone__frame">
        <div className="phone__notch" />
        <div className="phone__screen">
          <div className="phone__status"><span>9:41</span><span>•••</span></div>
          <div className="phone__topline"><Brand compact /><span className="phone__avatar">MP</span></div>
          <div className="phone__progress-label"><span>DIA 47 DE 365</span><span>13%</span></div>
          <div className="phone__progress"><i /></div>
          <div className="phone__card">
            <span className="phone__eyebrow">DECISÕES</span>
            <strong className="phone__title">Coragem para decidir</strong>
            <div className="phone__reference">
              <span>Referência bíblica · Almeida</span>
              <strong>Josué 1:9</strong>
            </div>
            <p>Uma reflexão para agir com sabedoria quando o caminho exige coragem.</p>
          </div>
          <div className="phone__meta"><span><Clock3 /> 5 min</span><span><BookOpen /> Devocional</span></div>
          <button type="button" tabIndex={-1}>COMEÇAR MEU MINUTO <ArrowRight /></button>
          <div className="phone__nav"><span className="active"><BookOpen />Hoje</span><span><CalendarDays />Jornada</span><span><NotebookPen />Diário</span></div>
        </div>
      </div>
    </div>
  );
}

function MiniScreen({ type }: { type: "devotional" | "journal" | "progress" | "achievements" }) {
  if (type === "devotional") {
    return <div className="mini-screen mini-screen--navy"><div className="mini-screen__bar"><Brand compact /><span>•••</span></div><span className="mini-kicker">DIA 47</span><strong className="mini-title">Coragem para decidir</strong><div className="mini-reference"><small>Referência bíblica · Almeida</small><strong>Josué 1:9</strong></div><p>Fé não elimina decisões difíceis. Ela muda o lugar de onde você decide.</p><span className="mini-action">Continuar <ArrowRight /></span></div>;
  }
  if (type === "journal") {
    return <div className="mini-screen"><div className="mini-screen__bar"><NotebookPen /><span>•••</span></div><span className="mini-kicker">MEU DIÁRIO</span><strong className="mini-title">Minha reflexão</strong><div className="journal-lines"><p>Hoje percebi que estou tentando controlar uma decisão que preciso entregar a Deus...</p><i /><i /><i /></div><span className="mini-save"><Check /> Salvo hoje</span></div>;
  }
  if (type === "progress") {
    return <div className="mini-screen"><div className="mini-screen__bar"><CalendarDays /><span>2026</span></div><span className="mini-kicker">MINHA JORNADA</span><strong className="mini-title">47 <small>/ 365</small></strong><div className="mini-ring"><span>13%</span></div><div className="mini-streak"><Flame /><span><strong>12 dias</strong><small>consecutivos</small></span></div></div>;
  }
  return <div className="mini-screen mini-screen--warm"><div className="mini-screen__bar"><Trophy /><span>5 conquistas</span></div><span className="mini-kicker">CONQUISTAS</span><strong className="mini-title">Sua constância</strong><div className="mini-badges"><span><Sparkles /></span><span><Flame /></span><span><Star /></span><span className="locked"><Trophy /></span><span className="locked"><Crown /></span></div><p>Não é uma competição.<br />É uma jornada.</p></div>;
}

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [authState, setAuthState] = useState<"loading" | "guest" | "authenticated">("loading");
  const isAuthenticated = authState === "authenticated";
  const loading = authState === "loading";

  useEffect(() => {
    const controller = new AbortController();
    const headers: Record<string, string> = {};
    try {
      const isPreview = window.location.hostname.endsWith(".manus.computer");
      const raw = sessionStorage.getItem("manus-cookie") || (isPreview ? localStorage.getItem("manus-cookie") : null);
      const prefix = `${COOKIE_NAME}=`;
      const pair = raw?.split(";").find(value => value.trim().startsWith(prefix));
      const token = pair?.trim().slice(prefix.length);
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      // Cookie authentication remains available when storage is restricted.
    }
    fetch("/api/auth/status", { credentials: "include", headers, signal: controller.signal })
      .then(response => response.json())
      .then(data => setAuthState(data.authenticated ? "authenticated" : "guest"))
      .catch(error => { if (error.name !== "AbortError") setAuthState("guest"); });
    return () => controller.abort();
  }, []);

  const handleCta = () => {
    const action = getLandingCtaAction(isAuthenticated, loading);
    if (action === "dashboard") window.location.assign("/dashboard");
    if (action === "login") startLogin();
  };

  const closeMenu = () => setMobileMenu(false);

  return (
    <div className="landing" id="top">
      <a className="landing-skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="landing-header">
        <div className="landing-container landing-header__inner">
          <a href="#top" className="landing-logo"><Brand /></a>
          <nav className="landing-nav" aria-label="Navegação principal">
            {navItems.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
          <div className="landing-header__actions">
            <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Alternar tema">
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
            <button type="button" className="landing-login" onClick={handleCta}>{isAuthenticated ? "Meu painel" : "Entrar"}</button>
            <Button className="landing-button landing-button--small" onClick={handleCta} disabled={loading}>COMEÇAR AGORA <ArrowRight /></Button>
            <button type="button" className="landing-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-expanded={mobileMenu} aria-label="Abrir menu">{mobileMenu ? <X /> : <Menu />}</button>
          </div>
        </div>
        {mobileMenu && <nav className="landing-mobile-nav" aria-label="Navegação mobile">{navItems.map(item => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}<button type="button" onClick={handleCta}>{isAuthenticated ? "IR PARA MEU PAINEL" : "COMEÇAR AGORA"} <ArrowRight /></button></nav>}
      </header>

      <main id="conteudo">
        <section className="landing-hero">
          <div className="landing-hero__glow landing-hero__glow--one" /><div className="landing-hero__glow landing-hero__glow--two" />
          <div className="landing-container landing-hero__grid">
            <div className="landing-hero__copy landing-reveal">
              <p className="landing-eyebrow"><span /> DEVOCIONAL DIÁRIO PARA EMPREENDEDORES</p>
              <h1>Antes de cuidar dos seus negócios, cuide daquilo que sustenta sua caminhada.</h1>
              <p className="landing-lead">365 dias de devocionais, reflexões e oração para ajudar você a empreender com fé, sabedoria e propósito.</p>
              <div className="landing-hero__actions">
                <Button className="landing-button landing-button--hero" onClick={handleCta} disabled={loading}>COMEÇAR AGORA <ArrowRight /></Button>
                <span><Clock3 /> 5 minutos por dia</span>
              </div>
              <div className="landing-proof">
                <div><strong>365</strong><span>dias de jornada</span></div>
                <i />
                <div><strong>5 min</strong><span>para parar e ouvir</span></div>
                <i />
                <div><strong>Bíblia</strong><span>aplicada à vida real</span></div>
              </div>
            </div>
            <div className="landing-hero__visual landing-reveal">
              <div className="hero-orbit hero-orbit--one"><Sparkles /></div>
              <div className="hero-orbit hero-orbit--two"><ShieldCheck /></div>
              <PhoneMockup />
              <div className="hero-note hero-note--streak"><Flame /><span><strong>12 dias</strong><small>de constância</small></span></div>
              <div className="hero-note hero-note--daily"><BookOpen /><span><strong>Seu minuto</strong><small>está esperando</small></span></div>
            </div>
          </div>
          <div className="landing-scroll-cue"><span>DESCUBRA A JORNADA</span><i /></div>
        </section>

        <section className="impact-section landing-section">
          <div className="landing-container impact-section__grid">
            <p className="landing-eyebrow"><span /> SABEDORIA PARA LIDERAR</p>
            <div><h2>Grandes decisões exigem mais do que estratégia.<br /><em>Exigem sabedoria.</em></h2><p>Em meio a metas, reuniões, clientes, números e decisões, existe um momento que não deveria ficar para depois: o momento de parar e ouvir Deus.</p></div>
          </div>
        </section>

        <section className="problem-section landing-section">
          <div className="landing-container">
            <div className="landing-section-heading landing-section-heading--light"><p className="landing-eyebrow"><span /> O DESAFIO</p><h2>Empreender pode fazer você esquecer o essencial.</h2><p>Quanto mais responsabilidade você carrega, mais fácil é deixar o cuidado com a alma para depois.</p></div>
            <div className="problem-grid">
              {problems.map(({ number, title, text, icon: Icon }) => <article key={title} className="problem-card"><div className="problem-card__top"><span>{number}</span><Icon /></div><h3>{title}</h3><p>{text}</p></article>)}
            </div>
            <div className="problem-statement"><Sparkles /><p>O Minuto da Provisão nasceu para criar esse espaço.</p></div>
          </div>
        </section>

        <section id="como-funciona" className="solution-section landing-section">
          <div className="landing-container">
            <div className="landing-section-heading"><p className="landing-eyebrow"><span /> UMA PAUSA QUE TRANSFORMA</p><h2>Cinco minutos podem mudar a forma como você encara o dia.</h2><p>Uma experiência simples, profunda e prática para voltar ao essencial antes de tomar a próxima decisão.</p></div>
            <div className="steps-grid">
              {steps.map(({ number, title, text, icon: Icon }, index) => <article key={title} className="step-card"><div className="step-card__icon"><Icon /></div><span className="step-card__number">{number}</span><h3>{title}</h3><p>{text}</p>{index < steps.length - 1 && <ArrowRight className="step-card__arrow" />}</article>)}
            </div>
          </div>
        </section>

        <section id="jornada" className="journey-section landing-section">
          <div className="landing-container journey-section__grid">
            <div className="journey-copy"><p className="landing-eyebrow"><span /> CONSTÂNCIA COM PROPÓSITO</p><h2>365 dias.<br /><em>Uma jornada.</em></h2><p>Um dia de cada vez. Uma reflexão de cada vez. Uma decisão de cada vez.</p><div className="journey-stats"><div><strong>47 <span>/ 365</span></strong><small>dias concluídos</small></div><div><strong>12</strong><small><Flame /> dias consecutivos</small></div></div><Button className="landing-button landing-button--outline" onClick={handleCta}>COMEÇAR MINHA JORNADA <ArrowRight /></Button></div>
            <div className="year-card">
              <div className="year-card__header"><div><span>MINHA JORNADA</span><strong>2026</strong></div><CalendarDays /></div>
              <div className="year-grid">{calendarMonths.map((month, monthIndex) => <div className="month-card" key={month}><strong>{month}</strong><div>{Array.from({ length: 15 }).map((_, dayIndex) => { const completed = monthIndex < 3 || (monthIndex === 3 && dayIndex < 2); const current = monthIndex === 3 && dayIndex === 2; return <i key={dayIndex} className={current ? "current" : completed ? "completed" : ""} />; })}</div></div>)}</div>
              <div className="year-card__footer"><span><i className="completed" /> Concluído</span><span><i className="current" /> Hoje</span><span><i /> Próximo</span></div>
            </div>
          </div>
        </section>

        <section className="themes-section landing-section">
          <div className="landing-container">
            <div className="landing-section-heading landing-section-heading--split"><div><p className="landing-eyebrow"><span /> CONTEÚDO PARA A VIDA REAL</p><h2>Porque os desafios do seu negócio também precisam de sabedoria.</h2></div><p>Reflexões que encontram você no ponto em que fé, liderança e responsabilidade se cruzam.</p></div>
            <div className="themes-grid">{themes.map(({ title, question, icon: Icon }, index) => <article key={title} className="theme-card"><span className="theme-card__index">0{index + 1}</span><Icon /><h3>{title}</h3><p>{question}</p><span className="theme-card__line" /></article>)}</div>
          </div>
        </section>

        <section id="experiencia" className="experience-section landing-section">
          <div className="landing-container">
            <div className="landing-section-heading landing-section-heading--light"><p className="landing-eyebrow"><span /> A EXPERIÊNCIA</p><h2>Um espaço feito para acompanhar sua caminhada.</h2><p>Devocional, reflexão, progresso e conquistas em uma experiência serena e conectada.</p></div>
            <div className="experience-showcase">
              <div className="device-card device-card--one"><span>01 — DEVOCIONAL</span><div className="device-shell"><MiniScreen type="devotional" /></div></div>
              <div className="device-card device-card--two"><span>02 — DIÁRIO</span><div className="device-shell"><MiniScreen type="journal" /></div></div>
              <div className="device-card device-card--three"><span>03 — PROGRESSO</span><div className="device-shell"><MiniScreen type="progress" /></div></div>
              <div className="device-card device-card--four"><span>04 — CONQUISTAS</span><div className="device-shell"><MiniScreen type="achievements" /></div></div>
            </div>
            <div className="experience-cta"><p>Uma experiência simples o bastante para caber no seu dia.<br />Profunda o bastante para transformá-lo.</p><Button className="landing-button landing-button--gold" onClick={handleCta}>CONHECER A EXPERIÊNCIA <ArrowRight /></Button></div>
          </div>
        </section>

        <section className="constancy-section landing-section">
          <div className="landing-container constancy-section__grid">
            <div><p className="landing-eyebrow"><span /> GAMIFICAÇÃO LEVE</p><h2>Constância também é uma forma de fé.</h2><blockquote>“Não é uma competição.<br />É uma jornada.”</blockquote><p>Conquistas discretas celebram sua presença — sem ranking, moedas ou pressão.</p></div>
            <div className="achievement-list">{achievements.map(({ title, text, icon: Icon }, index) => <div className={index > 2 ? "achievement achievement--future" : "achievement"} key={title}><span className="achievement__icon"><Icon /></span><div><strong>{title}</strong><small>{text}</small></div>{index < 3 ? <Check /> : <span className="achievement__progress">{index === 3 ? "182" : "365"}</span>}</div>)}</div>
          </div>
        </section>

        <section className="provision-section landing-section">
          <div className="landing-container provision-card">
            <div className="provision-card__ornament"><Sparkles /></div>
            <p className="landing-eyebrow"><span /> O SIGNIFICADO DA MARCA</p>
            <h2>Provisão é mais do que dinheiro.</h2>
            <p>Provisão também é sabedoria para decidir, coragem para continuar, discernimento para reconhecer oportunidades, pessoas certas no caminho, força para atravessar períodos difíceis e paz para confiar em Deus.</p>
            <div className="provision-words"><span>Sabedoria</span><i /> <span>Direção</span><i /> <span>Força</span><i /> <span>Oportunidades</span><i /> <span>Recursos</span><i /> <span>Paz</span><i /> <span>Discernimento</span></div>
          </div>
        </section>

        <section className="bible-section landing-section">
          <div className="landing-container bible-section__grid">
            <div className="bible-book" aria-hidden="true"><div className="bible-book__edge" /><BookOpen /><span>MINUTO<br />DA PROVISÃO</span><small>365 dias de sabedoria</small></div>
            <div><p className="landing-eyebrow"><span /> A BASE DA JORNADA</p><h2>Uma jornada fundamentada na Bíblia.</h2><p>Cada devocional parte de uma passagem bíblica e busca conectar seus princípios aos desafios reais da vida e do empreendedorismo.</p><div className="bible-reference"><BookOpen /><span><small>Referência bíblica · Almeida</small><strong>Provérbios 16:3</strong><em>O texto integral é exibido somente quando a edição estiver devidamente identificada e autorizada.</em></span></div></div>
          </div>
        </section>

        <section id="para-quem" className="audience-section landing-section">
          <div className="landing-container audience-section__grid">
            <div><p className="landing-eyebrow"><span /> PARA QUEM É</p><h2>O Minuto da Provisão é para você que...</h2><div className="audience-list">{audience.map(item => <p key={item}><span><Check /></span>{item}</p>)}</div></div>
            <aside className="not-for-card"><span className="not-for-card__icon"><ShieldCheck /></span><h3>O Minuto da Provisão não é:</h3><ul><li>Uma fórmula para ficar rico.</li><li>Uma promessa de que todos os negócios darão certo.</li><li>Motivação empresarial com versículos decorativos.</li><li>Uma competição.</li></ul><div><small>É</small><strong>Um espaço diário para fé, reflexão, oração e sabedoria.</strong></div></aside>
          </div>
        </section>

        <section className="position-section landing-section">
          <div className="landing-container position-section__inner"><Sparkles /><p>O objetivo não é transformar você em um empreendedor mais ocupado.</p><h2>É ajudá-lo a se tornar<br /><em>um empreendedor mais sábio.</em></h2><div><span>Fé para liderar.</span><span>Sabedoria para decidir.</span><span>Propósito para construir.</span></div></div>
        </section>

        <section className="how-section landing-section">
          <div className="landing-container">
            <div className="landing-section-heading"><p className="landing-eyebrow"><span /> COMO FUNCIONA</p><h2>Simples para começar.<br />Profundo para continuar.</h2></div>
            <div className="how-grid"><article><span>01</span><div><BookOpen /></div><h3>Abra seu Minuto</h3><p>Todos os dias você encontra uma nova reflexão.</p></article><article><span>02</span><div><Clock3 /></div><h3>Pare por 5 minutos</h3><p>Leia, reflita e ore com calma e intenção.</p></article><article><span>03</span><div><ArrowRight /></div><h3>Leve para o seu dia</h3><p>Transforme a reflexão em uma atitude prática.</p></article></div>
            <div className="mid-cta"><div><span>COMECE COM CINCO MINUTOS</span><h3>Você não precisa mudar tudo hoje.</h3><p>Comece separando alguns minutos para ouvir Deus.</p></div><Button className="landing-button landing-button--gold" onClick={handleCta}>COMEÇAR AGORA <ArrowRight /></Button></div>
          </div>
        </section>

        <section id="faq" className="faq-section landing-section">
          <div className="landing-container faq-section__grid">
            <div><p className="landing-eyebrow"><span /> DÚVIDAS FREQUENTES</p><h2>Antes de começar sua jornada.</h2><p>Respostas simples para você entender a proposta do Minuto da Provisão.</p></div>
            <div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{question}</span><ChevronDown /></summary><p>{answer}</p></details>)}</div>
          </div>
        </section>

        <section className="final-cta landing-section">
          <div className="final-cta__glow" /><div className="landing-container final-cta__inner"><Brand /><p className="landing-eyebrow"><span /> SUA JORNADA COMEÇA AQUI</p><h2>Seu negócio precisa da sua estratégia.<br /><em>Sua jornada precisa de propósito.</em></h2><p>Comece uma jornada de 365 dias para fortalecer sua fé, sua sabedoria e a forma como você conduz aquilo que Deus colocou em suas mãos.</p><Button className="landing-button landing-button--final" onClick={handleCta}>COMEÇAR AGORA <ArrowRight /></Button><small>Um minuto para ouvir Deus. Um dia para empreender com propósito.</small></div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container landing-footer__top"><div className="landing-footer__brand"><Brand /><p>Um minuto para ouvir Deus.<br />Um dia para empreender com propósito.</p></div><div><strong>NAVEGAÇÃO</strong><a href="#top">Início</a><a href="#como-funciona">Como funciona</a><a href="#jornada">Jornada</a><a href="#experiencia">Experiência</a></div><div><strong>INSTITUCIONAL</strong><a href="#para-quem">Sobre</a><a href="#faq">FAQ</a><a href="/termos">Termos de Uso</a><a href="/privacidade">Política de Privacidade</a></div><div><strong>ACOMPANHE</strong><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a></div></div>
        <div className="landing-container landing-footer__bottom"><span>© 2026 Minuto da Provisão. Todos os direitos reservados.</span><span>Fé para liderar · Sabedoria para decidir · Propósito para construir</span></div>
      </footer>
    </div>
  );
}
