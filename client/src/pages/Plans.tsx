import AppShell from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Check,
  Crown,
  ExternalLink,
  Flame,
  HelpCircle,
  Loader2,
  Lock,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Plans() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const catalogQuery = trpc.plans.catalog.useQuery();
  const subQuery = trpc.plans.mySubscription.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const checkoutMutation = trpc.plans.createCheckout.useMutation({
    onSuccess: (data) => {
      setLoadingPlan(null);
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err: any) => {
      setLoadingPlan(null);
      toast.error(err.message || "Não foi possível iniciar o checkout.");
    },
  });

  const portalMutation = trpc.plans.createPortalSession.useMutation({
    onSuccess: (data: any) => {
      if (data.url) window.location.href = data.url;
    },
    onError: (err: any) => {
      toast.error(err.message || "Erro ao abrir o portal de assinante.");
    },
  });

  const handleSelectPlan = (planId: "free" | "starter" | "premium") => {
    if (!isAuthenticated) {
      toast.message("Faça login para escolher seu plano.");
      startLogin();
      return;
    }

    if (planId === "free") {
      navigate("/app");
      return;
    }

    setLoadingPlan(planId);
    checkoutMutation.mutate({
      planId,
      origin: window.location.origin,
    });
  };

  const handleManageBilling = () => {
    portalMutation.mutate({
      returnUrl: window.location.href,
    });
  };

  const mySub = subQuery.data;
  const plans = catalogQuery.data?.plans ?? [];
  const featuresTable = catalogQuery.data?.featuresTable ?? [];

  if (catalogQuery.isLoading) {
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
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d9b45e]/20 px-3 py-1 text-xs font-semibold text-[#a07c34] uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Planos e Assinatura
          </span>
          <h1 className="mt-3 font-serif text-3xl font-semibold sm:text-5xl text-[#102a43] dark:text-[#eeeade]">
            Escolha o plano ideal para a sua jornada.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#647789] dark:text-[#aab8af]">
            Comece gratuitamente por 7 dias com acesso total e continue recebendo
            inspiração, direção e sabedoria todos os dias para seus negócios e sua vida.
          </p>

          {/* Banner de status da assinatura se o usuário estiver logado */}
          {isAuthenticated && mySub && (
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[#d9b45e]/30 bg-[#faf6eb] px-5 py-3 text-sm text-[#7e6022] dark:border-white/10 dark:bg-[#1a2f44] dark:text-[#f4e6be]">
              <span>
                Seu plano atual:{" "}
                <strong className="uppercase font-semibold">
                  {mySub.planDetails?.name || mySub.planId}
                </strong>
                {mySub.isTrialing && (
                  <span className="ml-2 font-normal">
                    (Degustação completa · {mySub.trialDaysRemaining} dias restantes)
                  </span>
                )}
                {mySub.status === "active" && !mySub.isTrialing && (
                  <span className="ml-2 font-normal">· Assinatura Ativa</span>
                )}
              </span>
              {mySub.stripeCustomerId && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleManageBilling}
                  disabled={portalMutation.isPending}
                  className="rounded-xl border-[#b59247] text-xs font-medium text-[#7e6022] hover:bg-[#eddcb2] dark:text-[#eddcb2]"
                >
                  Gerenciar assinatura Stripe <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Grid dos 3 Planos */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 items-stretch">
          {plans.map((p) => {
            const isCurrent =
              isAuthenticated &&
              mySub &&
              ((p.id === "free" && mySub.isTrialing) ||
                (p.id === mySub.planId && !mySub.isTrialing && mySub.isActive));

            const isPremium = p.id === "premium";

            return (
              <div
                key={p.id}
                className={`relative flex flex-col justify-between rounded-[28px] p-7 transition-all ${
                  p.highlight
                    ? "border-2 border-[#d9b45e] bg-gradient-to-b from-[#ffffff] via-[#fcfbf7] to-[#f7f4ea] shadow-[0_16px_40px_rgba(217,180,94,.18)] dark:bg-none dark:bg-[#152a3e]"
                    : "border border-[#e6dfd0] bg-white shadow-sm dark:border-white/10 dark:bg-[#122334]"
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#102a43] px-3.5 py-1 text-xs font-semibold text-[#d9b45e] border border-[#d9b45e]/40 shadow-md uppercase tracking-wider">
                      ★ {p.badge}
                    </Badge>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-semibold text-[#102a43] dark:text-[#eeeade]">
                      {p.name}
                    </h2>
                    {isCurrent && (
                      <span className="rounded-full bg-[#2f5d7c]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#2f5d7c] dark:text-[#a0c5df]">
                        Plano Atual
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#6b7c73] dark:text-[#9eaeb3]">
                    {p.tagline}
                  </p>

                  <div className="mt-5 border-y border-[#eee8db] py-4 dark:border-white/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif text-4xl font-bold text-[#102a43] dark:text-[#eeeade]">
                        {p.displayPrice}
                      </span>
                      <span className="text-xs text-[#718291]">
                        {p.period}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#8c9ba5]">
                      {p.id === "free"
                        ? "Sem cobrança automática ao final do teste"
                        : "Cobrança mensal segura com Stripe"}
                    </p>
                  </div>

                  {/* Lista de Recursos */}
                  <ul className="mt-6 space-y-3">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#485950] dark:text-[#c4d1c9]">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d9b45e]/20 text-[#a07c34]">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Button
                    onClick={() => handleSelectPlan(p.id)}
                    disabled={Boolean(loadingPlan) || (isCurrent && p.id === "free")}
                    className={`h-12 w-full rounded-xl text-sm font-semibold transition-all ${
                      p.highlight
                        ? "bg-[#102a43] text-[#d9b45e] hover:bg-[#1a446c] shadow-md"
                        : "bg-[#102a43] text-white hover:bg-[#1a446c]"
                    }`}
                  >
                    {loadingPlan === p.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isCurrent ? (
                      "Seu plano atual"
                    ) : (
                      p.buttonText
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabela Comparativa Detalhada */}
        <section className="mt-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#102a43] dark:text-[#eeeade]">
              Comparativo completo dos planos
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#647789] dark:text-[#aab8af]">
              Transparência total para você saber exatamente o que está incluído em cada opção.
            </p>
          </div>

          <div className="overflow-x-auto rounded-[24px] border border-[#e6dfd0] bg-white shadow-sm dark:border-white/10 dark:bg-[#122334]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#eee8db] bg-[#faf8f4] dark:border-white/10 dark:bg-[#172d42]">
                  <th className="p-4 sm:p-5 font-semibold text-[#102a43] dark:text-[#eeeade]">
                    Recurso
                  </th>
                  <th className="p-4 sm:p-5 text-center font-semibold text-[#102a43] dark:text-[#eeeade]">
                    Gratuito — 7 dias
                  </th>
                  <th className="p-4 sm:p-5 text-center font-semibold text-[#102a43] dark:text-[#eeeade]">
                    Starter — R$ 9,90/mês
                  </th>
                  <th className="p-4 sm:p-5 text-center font-semibold text-[#b38c31] bg-[#fbf6ea] dark:bg-[#1c3750]">
                    Premium — R$ 14,90/mês
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee8db] dark:divide-white/10">
                {featuresTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#fafaf7] dark:hover:bg-white/[.02]">
                    <td className="p-4 sm:p-5 font-medium text-[#2d3e34] dark:text-[#d3ded7]">
                      {row.name}
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Check className="h-4 w-4" /> Sim
                          </span>
                        ) : (
                          <span className="text-[#a1b0ba]">Não</span>
                        )
                      ) : (
                        <span className="font-medium text-[#102a43] dark:text-white">
                          {row.free}
                        </span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      {typeof row.starter === "boolean" ? (
                        row.starter ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Check className="h-4 w-4" /> Sim
                          </span>
                        ) : (
                          <span className="text-[#a1b0ba]">Não</span>
                        )
                      ) : (
                        <span className="font-medium text-[#102a43] dark:text-white">
                          {row.starter}
                        </span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-[#fbf6ea]/40 dark:bg-[#1c3750]/40 font-semibold text-[#102a43] dark:text-[#f4e6be]">
                      {typeof row.premium === "boolean" ? (
                        row.premium ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Check className="h-4 w-4" /> Sim
                          </span>
                        ) : (
                          <span className="text-[#a1b0ba]">Não</span>
                        )
                      ) : (
                        <span className="font-bold text-[#b38c31]">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Garantia e FAQ de Pagamento */}
        <section className="mt-14 rounded-[28px] border border-[#e5dfd1] bg-[#f9f7f2] p-6 sm:p-8 dark:border-white/10 dark:bg-[#142637]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#102a43] text-[#d9b45e]">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#102a43] dark:text-[#eeeade]">
                Pagamento seguro e cancelamento a qualquer momento
              </h3>
              <p className="mt-1 text-xs sm:text-sm leading-6 text-[#687a71] dark:text-[#a6b6ad]">
                Todas as transações são processadas com criptografia de ponta a ponta pela Stripe.
                Você pode gerenciar ou cancelar sua assinatura quando desejar, com um único clique.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
