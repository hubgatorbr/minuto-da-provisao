import AppShell from "@/components/AppShell";
import BibleReference from "@/components/BibleReference";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getBibleTranslation } from "@shared/bible-translations";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Compass,
  FileQuestion,
  HelpCircle,
  Lightbulb,
  Loader2,
  LockKeyhole,
  NotebookPen,
  Pause,
  Play,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation, useRoute } from "wouter";

export default function TrailDay() {
  const [, params] = useRoute("/trilhas/:slug/dia/:position");
  const [, navigate] = useLocation();
  const slug = params?.slug ?? "";
  const position = Math.max(1, Number(params?.position ?? 1));
  const { isAuthenticated, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();

  const trailQuery = trpc.trails.getBySlug.useQuery({ slug }, { enabled: !!slug });
  const trail = trailQuery.data;

  const currentItem = useMemo(() => {
    return trail?.items.find((i) => i.position === position);
  }, [trail, position]);

  const devotional = currentItem?.devotional;
  const isComplete = trail?.userProgress?.completedPositions.includes(position) ?? false;

  const [journal, setJournal] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const toggleStepMutation = trpc.trails.toggleStep.useMutation({
    onSuccess: (data) => {
      utils.trails.getBySlug.setData({ slug }, data);
      utils.trails.myOverview.invalidate();
      toast.success(
        !isComplete
          ? `Etapa ${position} concluída na trilha!`
          : `Etapa ${position} marcada como pendente.`
      );
    },
    onError: () => {
      toast.error("Não foi possível salvar o progresso da trilha.");
    },
  });

  const paragraphs = useMemo(
    () => devotional?.reflection.split("\n\n") ?? [],
    [devotional?.reflection]
  );

  const audioText = useMemo(() => {
    if (!devotional) return "";
    return [
      `Trilha temática: ${trail?.title}. Etapa ${position}.`,
      currentItem?.trailIntro ? `Introdução da etapa: ${currentItem.trailIntro}.` : "",
      devotional.title,
      `Referência bíblica: ${devotional.bibleReference}.`,
      devotional.reflection,
      currentItem?.actionPrompt ? `Ação concreta da trilha: ${currentItem.actionPrompt}.` : "",
      currentItem?.reviewQuestion ? `Pergunta de discernimento: ${currentItem.reviewQuestion}.` : "",
      `Oração de encerramento: ${devotional.prayer}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [trail, position, currentItem, devotional]);

  const playAudio = () => {
    if (!audioText || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(audioText);
    utterance.lang = "pt-BR";
    utterance.rate = 0.88;
    utterance.pitch = 0.98;

    const voices = window.speechSynthesis.getVoices() ?? [];
    const ptVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith("pt-br")) ??
      voices.find((v) => v.lang.toLowerCase().startsWith("pt"));
    if (ptVoice) utterance.voice = ptVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      toast.error("Não foi possível reproduzir áudio neste dispositivo.");
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseAudio = () => {
    if (!window.speechSynthesis) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopAudio = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleToggleComplete = () => {
    if (!isAuthenticated) {
      toast.message("Entre para salvar seu progresso na trilha.");
      startLogin();
      return;
    }
    toggleStepMutation.mutate({
      slug,
      position,
      completed: !isComplete,
      journalContent: journal,
    });
  };

  const hasNext = position < (trail?.items.length ?? 0);
  const hasPrev = position > 1;

  if (trailQuery.isLoading || authLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#b38c31]" />
        </div>
      </AppShell>
    );
  }

  if (!trail || !currentItem || !devotional) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <FileQuestion className="mx-auto h-8 w-8 text-[#b38c31]" />
          <h1 className="mt-4 font-serif text-3xl font-semibold">Etapa não encontrada</h1>
          <p className="mt-2 text-sm text-[#78857d]">
            Esta etapa da trilha não existe ou ainda não está disponível.
          </p>
          <Link
            href={`/trilhas/${slug}`}
            className="mt-6 inline-block text-sm font-semibold text-[#102a43] underline"
          >
            Voltar para a trilha
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-7 sm:px-7 lg:py-12">
        {/* Navegação Superior */}
        <div className="mb-7 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(`/trilhas/${slug}`)}
            className="-ml-3 gap-2 text-xs font-semibold text-[#647789]"
          >
            <ArrowLeft className="h-4 w-4" /> Trilha: {trail.title}
          </Button>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a2813c]">
              Etapa {position} de {trail.items.length}
            </p>
            <p className="mt-0.5 text-xs text-[#78857d]">
              {trail.durationDays} dias de discernimento
            </p>
          </div>
        </div>

        {/* Card Principal da Etapa */}
        <article className="rounded-[28px] border border-[#e6e0d3] bg-[#ffffff] px-6 py-8 shadow-sm dark:border-white/10 dark:bg-[#15263b] sm:px-10 sm:py-11">
          {/* Cabeçalho */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d9b45e] text-xs font-bold text-[#102a43]">
                {position}
              </span>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b38c31]">
                {trail.title} · Dia {position}
              </p>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#102a43] dark:text-[#eeeade] sm:text-4xl">
              {devotional.title}
            </h1>
          </div>

          {/* Introdução Pastoral da Etapa na Trilha */}
          {currentItem.trailIntro && (
            <div className="mt-6 rounded-2xl border border-[#ded7c8] bg-[#fbf9f4] p-5 dark:border-white/10 dark:bg-[#1c2e42]">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#8d6e2d] dark:text-[#d9b45e]">
                <Compass className="h-3.5 w-3.5" /> Foco da Etapa
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5b6a60] dark:text-[#cad6cd]">
                {currentItem.trailIntro}
              </p>
            </div>
          )}

          {/* Referência Bíblica */}
          <div className="mt-7">
            <BibleReference
              reference={devotional.bibleReference}
              translation={devotional.bibleTranslation}
              text={devotional.bibleText}
            />
          </div>

          {/* Áudio da Etapa */}
          <section
            aria-label="Áudio do devocional da trilha"
            className="mt-7 rounded-2xl border border-[#ded7c8] bg-[#f7f3e8] p-5 dark:border-white/10 dark:bg-[#1c344b]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d9b45e] text-[#102a43]">
                <Volume2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8d6e2d] dark:text-[#e6d099]">
                  Ouvir esta etapa da trilha
                </p>
                <p className="mt-1 text-xs leading-5 text-[#637169] dark:text-[#c4d1c8]">
                  Narração guiada para desacelerar o coração e refletir com clareza.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    onClick={isSpeaking ? pauseAudio : playAudio}
                    className="rounded-xl bg-[#102a43] text-xs font-semibold text-white hover:bg-[#1e4d73]"
                  >
                    <span className="mr-2">
                      {isSpeaking ? (
                        isPaused ? (
                          <Play className="h-3.5 w-3.5" />
                        ) : (
                          <Pause className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                    </span>
                    {isSpeaking ? (isPaused ? "Continuar" : "Pausar") : "Dar play no áudio"}
                  </Button>
                  {isSpeaking && (
                    <Button
                      variant="outline"
                      onClick={stopAudio}
                      className="rounded-xl border-[#cbbd9e] text-xs font-semibold text-[#70591e] dark:text-[#e6d099]"
                    >
                      <Square className="mr-1.5 h-3 w-3 fill-current" /> Parar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Reflexão Editorial */}
          <section className="prose prose-[1.02rem] mt-9 max-w-none leading-8 text-[#3f5147] dark:prose-invert dark:text-[#c8d4cd]">
            <p className="not-prose mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#b38c31]">
              <Sparkles className="h-3.5 w-3.5" /> Reflexão
            </p>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>

          {/* Ação Concreta da Trilha */}
          {currentItem.actionPrompt && (
            <section className="mt-9 rounded-2xl bg-[#eaf2f8] p-5 dark:bg-[#1b344a]">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#295c80] dark:text-[#9bc2e0]">
                <Lightbulb className="h-4 w-4" /> Ação Prática Desta Etapa
              </p>
              <p className="mt-2 text-sm leading-6 text-[#244256] dark:text-[#d7e5ef]">
                {currentItem.actionPrompt}
              </p>
            </section>
          )}

          {/* Pergunta de Discernimento / Diário */}
          <section className="mt-9">
            <div className="flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-[#b38c31]" />
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a07c34]">
                Pergunta de Discernimento
              </p>
            </div>
            <h2 className="mt-3 font-serif text-xl leading-7 text-[#102a43] dark:text-[#eeeade]">
              “{currentItem.reviewQuestion || devotional.dailyQuestion}”
            </h2>

            <Textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="Registre seus pensamentos, uma decisão sincera ou o que deseja colocar diante de Deus..."
              className="mt-4 min-h-28 resize-y rounded-2xl border-[#ded7c8] bg-[#fcfbf7] p-4 text-sm leading-6 dark:border-white/10 dark:bg-white/5"
            />
          </section>

          {/* Oração de Encerramento */}
          <section className="mt-9 rounded-2xl border border-[#e6dfd0] p-5 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a07c34]">
              Oração de Encerramento
            </p>
            <p className="mt-3 font-serif text-base leading-7 text-[#3b4d42] dark:text-[#d6e3eb]">
              {devotional.prayer}
            </p>
          </section>

          {/* Aviso se não logado */}
          {!isAuthenticated && (
            <div className="mt-7 flex gap-3 rounded-2xl bg-[#fbf5e6] p-4 text-xs text-[#755d2b] dark:bg-[#242a38] dark:text-[#e8d8a6]">
              <LockKeyhole className="h-4 w-4 shrink-0" />
              <span>
                Faça login para salvar suas reflexões e o progresso concluído nas trilhas temáticas.
              </span>
            </div>
          )}

          {/* Botões de Ação e Navegação */}
          <div className="mt-9 flex flex-col gap-3 border-t border-[#ece6d9] pt-7 sm:flex-row">
            <Button
              onClick={handleToggleComplete}
              disabled={toggleStepMutation.isPending}
              className={
                isComplete
                  ? "h-12 flex-1 rounded-xl bg-[#e2eef7] text-[#2e6640] hover:bg-[#d6e9d7] dark:bg-[#274e70] dark:text-[#d4ecd8]"
                  : "h-12 flex-1 rounded-xl bg-[#102a43] text-white hover:bg-[#1e4d73]"
              }
            >
              {isComplete ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Etapa Concluída na Trilha
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Marcar Etapa como Concluída
                </>
              )}
            </Button>

            {hasNext && (
              <Button
                variant="outline"
                onClick={() => navigate(`/trilhas/${slug}/dia/${position + 1}`)}
                className="h-12 rounded-xl border-[#d8d1c3] text-xs font-semibold"
              >
                Próxima Etapa ({position + 1}) <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            {!hasNext && (
              <Button
                variant="outline"
                onClick={() => navigate(`/trilhas/${slug}`)}
                className="h-12 rounded-xl border-[#d8d1c3] text-xs font-semibold"
              >
                Concluir e Ver Trilha <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </article>
      </div>
    </AppShell>
  );
}
