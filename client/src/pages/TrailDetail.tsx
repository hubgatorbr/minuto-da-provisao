import AppShell from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { canAccessTrail } from "@shared/plans";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Crown,
  FileText,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation, useRoute } from "wouter";

export default function TrailDetail() {
  const [, params] = useRoute("/trilhas/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug ?? "";
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const trailQuery = trpc.trails.getBySlug.useQuery({ slug }, { enabled: !!slug });
  const subQuery = trpc.plans.mySubscription.useQuery(undefined, { enabled: isAuthenticated });
  const startMutation = trpc.trails.start.useMutation({
    onSuccess: (data) => {
      utils.trails.getBySlug.setData({ slug }, data);
      utils.trails.myOverview.invalidate();
      toast.success("Trilha iniciada com sucesso!");
    },
    onError: () => {
      toast.error("Não foi possível iniciar a trilha.");
    },
  });

  const trail = trailQuery.data;

  if (trailQuery.isLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#b38c31] border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  if (!trail) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-[#b38c31]" />
          <h1 className="mt-4 font-serif text-3xl font-semibold">Trilha não encontrada</h1>
          <p className="mt-2 text-sm text-[#78857d]">A trilha solicitada não existe ou ainda não foi publicada.</p>
          <Link href="/trilhas" className="mt-6 inline-block text-sm font-semibold text-[#102a43] underline">
            Voltar para o catálogo de trilhas
          </Link>
        </div>
      </AppShell>
    );
  }

  const completedPositions = trail.userProgress?.completedPositions ?? [];
  const completedCount = completedPositions.length;
  const totalCount = trail.items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isStarted = !!trail.userProgress;
  const isAllCompleted = completedCount > 0 && completedCount >= totalCount;
  const mySub = subQuery.data;
  const hasTrailAccess = !isAuthenticated
    ? trail.accessLevel === "free"
    : canAccessTrail(trail.accessLevel, {
        planId: mySub?.planId || "free",
        isActive: mySub?.isActive ?? true,
        isTrialing: mySub?.isTrialing ?? true,
      });

  const handleStartTrail = () => {
    if (!isAuthenticated) {
      toast.message("Entre para registrar seu progresso na trilha.");
      startLogin();
      return;
    }
    if (!hasTrailAccess) {
      toast.error("Esta trilha é exclusiva para assinantes Premium ou período gratuito.");
      navigate("/planos");
      return;
    }
    startMutation.mutate({ slug });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-7 sm:px-7 lg:py-10">
        {/* Navegação Voltar */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/trilhas")}
            className="-ml-3 gap-2 text-xs font-semibold text-[#647789]"
          >
            <ArrowLeft className="h-4 w-4" /> Todas as Trilhas
          </Button>
        </div>

        {/* Banner Superior da Trilha */}
        <section className="rounded-[28px] border border-[#e5dfd1] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#15263b] sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.18em] text-[#a07c34]">
              <Compass className="h-4 w-4" /> Trilha Temática
            </span>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-[#ded7c8] text-xs text-[#78857d]">
                <Clock className="mr-1 h-3.5 w-3.5" /> {trail.durationDays} dias
              </Badge>
              <Badge variant="outline" className="border-[#ded7c8] text-xs text-[#78857d]">
                {trail.accessLevel === "free" ? "Acesso Gratuito" : "Premium"}
              </Badge>
            </div>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl text-[#102a43] dark:text-[#eeeade]">
            {trail.title}
          </h1>
          <p className="mt-2 text-base text-[#8a7238] dark:text-[#d9b45e]">
            {trail.subtitle}
          </p>

          <p className="mt-5 text-sm leading-7 text-[#526359] dark:text-[#a5b6ad]">
            {trail.description}
          </p>

          {/* Aviso Pastoral Importante */}
          <div className="mt-6 rounded-2xl bg-[#f8f6f0] p-4 text-xs leading-5 text-[#736340] dark:bg-[#1f2d3d] dark:text-[#d4c6a9]">
            <p className="font-semibold">Orientação pastoral e de cuidado:</p>
            <p className="mt-1">
              Esta trilha oferece direcionamento bíblico e reflexão prática para sua postura como empreendedor. Não substitui aconselhamento financeiro técnico, consultoria contábil, assistência jurídica, psicológica ou médica.
            </p>
          </div>

          {/* Progresso do Usuário ou Botão Iniciar */}
          <div className="mt-8 border-t border-[#f0ece1] pt-6 dark:border-white/10">
            {isStarted ? (
              <div>
                <div className="flex items-center justify-between text-xs text-[#6e7d74] dark:text-[#aab8af]">
                  <span className="font-semibold">Seu progresso nesta trilha</span>
                  <span>{completedCount} de {totalCount} etapas concluídas ({progressPercent}%)</span>
                </div>
                <Progress value={progressPercent} className="mt-2 h-2.5 bg-[#eae6dc] [&>div]:bg-[#487a57]" />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#7d897f]">
                    {isAllCompleted
                      ? "Parabéns! Você completou todas as etapas desta trilha temática."
                      : `Você parou na etapa ${trail.userProgress?.lastPosition ?? 1}. Continue sua caminhada.`}
                  </span>

                  {totalCount > 0 && (
                    <Link href={`/trilhas/${trail.slug}/dia/${trail.userProgress?.lastPosition ?? 1}`}>
                      <Button className="rounded-xl bg-[#102a43] px-5 text-xs font-semibold text-white hover:bg-[#183c5c]">
                        {isAllCompleted ? "Rever Etapa 1" : `Continuar Etapa ${trail.userProgress?.lastPosition ?? 1}`}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#102a43] dark:text-[#eeeade]">
                    Pronto para começar esta trilha?
                  </p>
                  <p className="text-xs text-[#78857d]">
                    Seu progresso nesta trilha é 100% independente da sua jornada anual de 365 dias.
                  </p>
                </div>
                <Button
                  onClick={handleStartTrail}
                  disabled={startMutation.isPending}
                  className="rounded-xl bg-[#102a43] px-6 text-xs font-semibold text-white hover:bg-[#183c5c]"
                >
                  {!hasTrailAccess ? (
                    <>
                      <Crown className="mr-2 h-4 w-4 text-[#d9b45e]" /> Desbloquear no Premium
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Iniciar Trilha
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Lista de Etapas / Dias da Trilha */}
        <section className="mt-9">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-[#102a43] dark:text-[#eeeade]">
              Etapas da Trilha ({totalCount} {totalCount === 1 ? "dia" : "dias"})
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            {trail.items.map((item) => {
              const isDone = completedPositions.includes(item.position);
              const dev = item.devotional;

              return (
                <Link
                  key={item.position}
                  href={`/trilhas/${trail.slug}/dia/${item.position}`}
                  className="group flex flex-col justify-between gap-4 rounded-2xl border border-[#e5dfd1] bg-white/80 p-5 transition-all hover:border-[#b38c31] hover:shadow-md dark:border-white/10 dark:bg-[#15263b] sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-serif text-sm font-semibold transition-colors ${
                        isDone
                          ? "bg-[#487a57] text-white"
                          : "bg-[#f2efe6] text-[#7d6e4d] group-hover:bg-[#102a43] group-hover:text-white dark:bg-white/10 dark:text-[#cbd6ce]"
                      }`}
                    >
                      {isDone ? <Check className="h-5 w-5" /> : item.position}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9f7d34]">
                          Dia {item.position}
                        </span>
                        {dev && (
                          <span className="text-xs text-[#7e8c83]">
                            · {dev.bibleReference}
                          </span>
                        )}
                        {isDone && (
                          <Badge variant="outline" className="border-[#487a57] text-[10px] text-[#487a57]">
                            concluído
                          </Badge>
                        )}
                      </div>

                      <h3 className="mt-1 font-serif text-lg font-semibold text-[#102a43] group-hover:text-[#2f5d7c] dark:text-[#eeeade]">
                        {dev?.title || `Etapa ${item.position}`}
                      </h3>

                      {item.trailIntro && (
                        <p className="mt-1 text-xs leading-5 text-[#6c7b72] dark:text-[#9fb0a5] line-clamp-2">
                          {item.trailIntro}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                    <span className="text-xs font-semibold text-[#2f5d7c] group-hover:text-[#102a43] dark:text-[#cbd7e2]">
                      Acessar etapa
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#2f5d7c] transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          {totalCount === 0 && (
            <div className="rounded-2xl border border-dashed border-[#d7cfbe] p-10 text-center text-sm text-[#7d897f]">
              O catálogo de etapas desta trilha está sendo estruturado editorialmente. Em breve todas as reflexões estarão disponíveis.
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
