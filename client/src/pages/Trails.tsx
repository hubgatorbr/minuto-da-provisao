import AppShell from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CheckCircle2, Clock, Compass, Filter, Loader2, Sparkles, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

export default function Trails() {
  const { isAuthenticated } = useAuth();
  const [selectedDuration, setSelectedDuration] = useState<number | undefined>(undefined);
  const [searchChallenge, setSearchChallenge] = useState("");

  const listInput = useMemo(() => {
    return {
      durationDays: selectedDuration,
      challenge: searchChallenge.trim() || undefined,
    };
  }, [selectedDuration, searchChallenge]);

  const trailsQuery = trpc.trails.list.useQuery(listInput);
  const overviewQuery = trpc.trails.myOverview.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const trails = trailsQuery.data ?? [];
  const myProgressMap = useMemo(() => {
    const map = new Map<string, { status: string; completedSteps: number; totalSteps: number }>();
    if (overviewQuery.data) {
      for (const item of overviewQuery.data) {
        map.set(item.slug, {
          status: item.status,
          completedSteps: item.completedSteps,
          totalSteps: item.totalSteps,
        });
      }
    }
    return map;
  }, [overviewQuery.data]);

  if (trailsQuery.isLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#b38c31]" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1420px] px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
        {/* Cabeçalho */}
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#a07c34]">
              <Compass className="h-4 w-4" /> Trilhas Temáticas
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-[#102a43] dark:text-[#eeeade]">
              Foco bíblico e prático para desafios reais do negócio.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e7d74] dark:text-[#aab8af]">
              Sequências curtas e organizadas com começo, meio e fim. Resolva tensões pontuais de caixa, liderança e decisões sem abrir mão da sua jornada anual.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e5dfd1] bg-white/70 px-5 py-4 dark:border-white/10 dark:bg-white/[.03]">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#857a67]">Disponíveis</p>
            <div className="mt-1 flex items-baseline gap-2">
              <strong className="font-serif text-3xl text-[#102a43] dark:text-[#eeeade]">
                {trails.length}
              </strong>
              <span className="text-sm text-[#967934]">trilhas editoriais</span>
            </div>
          </div>
        </section>

        {/* Trilha Destaque (Ansiedade Financeira) */}
        <section className="mt-8 rounded-[28px] bg-gradient-to-br from-[#102a43] via-[#16385a] to-[#0d2338] p-7 text-white shadow-lg sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d9b45e]/20 px-3 py-1 text-xs font-semibold text-[#d9b45e]">
              <Sparkles className="h-3.5 w-3.5" /> Trilha em Destaque · 7 dias
            </span>
            <Badge variant="outline" className="border-white/20 text-xs text-[#d9b45e]">
              100% Gratuita
            </Badge>
          </div>
          <div className="mt-5 max-w-3xl">
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl text-white">
              Ansiedade Financeira: discernir o caixa com paz e prudência
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#cbd7e2]">
              Uma jornada pastoral e prática para não agir por impulso, separar fatos de suposições, dialogar com clareza sobre dinheiro e entregar a Deus aquilo que você não pode controlar.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href="/trilhas/ansiedade-financeira">
              <Button className="rounded-xl bg-[#d9b45e] px-6 text-sm font-semibold text-[#102a43] hover:bg-[#e4c375]">
                Acessar Trilha de 7 Dias <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <span className="text-xs text-[#9bb0c3]">
              7 etapas curtas · Leitura diária em 5 minutos
            </span>
          </div>
        </section>

        {/* Filtros */}
        <section className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDuration(undefined)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                selectedDuration === undefined
                  ? "bg-[#102a43] text-white"
                  : "bg-[#e9e7df] text-[#647789] hover:bg-[#dfdcd3] dark:bg-white/10 dark:text-[#cbd6ce]"
              }`}
            >
              Todas as durações
            </button>
            <button
              onClick={() => setSelectedDuration(7)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                selectedDuration === 7
                  ? "bg-[#102a43] text-white"
                  : "bg-[#e9e7df] text-[#647789] hover:bg-[#dfdcd3] dark:bg-white/10 dark:text-[#cbd6ce]"
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setSelectedDuration(14)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                selectedDuration === 14
                  ? "bg-[#102a43] text-white"
                  : "bg-[#e9e7df] text-[#647789] hover:bg-[#dfdcd3] dark:bg-white/10 dark:text-[#cbd6ce]"
              }`}
            >
              14 dias
            </button>
            <button
              onClick={() => setSelectedDuration(21)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                selectedDuration === 21
                  ? "bg-[#102a43] text-white"
                  : "bg-[#e9e7df] text-[#647789] hover:bg-[#dfdcd3] dark:bg-white/10 dark:text-[#cbd6ce]"
              }`}
            >
              21 dias
            </button>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Input
              value={searchChallenge}
              onChange={(e) => setSearchChallenge(e.target.value)}
              placeholder="Buscar por desafio ou tema..."
              className="h-9 rounded-xl border-[#ddd7c9] bg-white text-xs dark:border-white/10 dark:bg-white/5"
            />
          </div>
        </section>

        {/* Grade de Trilhas */}
        <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trails.map((trail) => {
            const userProgress = myProgressMap.get(trail.slug);
            const isCompleted = userProgress?.status === "completed";
            const inProgress = userProgress?.status === "active";

            return (
              <Link
                key={trail.slug}
                href={`/trilhas/${trail.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-[#e5dfd1] bg-white/80 p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#15263b]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#8b6f2e] dark:text-[#d9b45e]">
                      <Clock className="h-3.5 w-3.5" /> {trail.durationDays} dias
                    </span>
                    {isCompleted ? (
                      <Badge className="bg-[#487a57] text-white text-[10px]">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Concluída
                      </Badge>
                    ) : inProgress ? (
                      <Badge variant="outline" className="border-[#d9b45e] text-[#a07c34] text-[10px]">
                        Em andamento ({userProgress.completedSteps}/{userProgress.totalSteps})
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-[#ded7c8] text-[10px] text-[#78857d]">
                        {trail.accessLevel === "free" ? "Gratuita" : "Premium"}
                      </Badge>
                    )}
                  </div>

                  <h3 className="mt-4 font-serif text-xl font-semibold leading-tight text-[#102a43] group-hover:text-[#2f5d7c] dark:text-[#eeeade]">
                    {trail.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-[#6c7b72] dark:text-[#9fb0a5] line-clamp-3">
                    {trail.subtitle}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#f0ece1] pt-4 dark:border-white/10">
                  <div className="flex items-center justify-between text-xs font-medium text-[#2f5d7c] group-hover:text-[#102a43] dark:text-[#cbd7e2]">
                    <span>Ver detalhes da trilha</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        {trails.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-[#d7cfbe] p-12 text-center text-sm text-[#7d897f]">
            Nenhuma trilha encontrada para os filtros selecionados.
          </div>
        )}
      </div>
    </AppShell>
  );
}
