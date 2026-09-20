export type PlanId = "free" | "starter" | "premium";

export interface PlanFeature {
  name: string;
  free: string | boolean;
  starter: string | boolean;
  premium: string | boolean;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  badge?: string;
  tagline: string;
  priceMonthly: number; // em centavos (990 = R$ 9,90)
  displayPrice: string;
  period: string;
  trialDays?: number;
  highlight?: boolean;
  description: string;
  buttonText: string;
  features: string[];
}

export const PLAN_FEATURES_TABLE: PlanFeature[] = [
  { name: "Devocionais diários", free: true, starter: true, premium: true },
  { name: "Áudios dos devocionais", free: true, starter: false, premium: true },
  { name: "Trilhas exclusivas", free: true, starter: false, premium: true },
  { name: "Dashboard personalizado", free: true, starter: true, premium: true },
  { name: "Favoritar conteúdos", free: true, starter: true, premium: true },
  { name: "Diário de Bordo", free: true, starter: true, premium: true },
  { name: "Gamificação", free: true, starter: true, premium: true },
  { name: "Notificações diárias", free: true, starter: true, premium: true },
  { name: "Suporte", free: false, starter: "Sim", premium: "Prioritário" },
];

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Gratuito",
    tagline: "Experimente todos os recursos do Minuto da Provisão.",
    priceMonthly: 0,
    displayPrice: "R$ 0",
    period: "7 dias de acesso total",
    trialDays: 7,
    description: "Ideal para experimentar a rotina completa com áudios, trilhas e reflexões.",
    buttonText: "Começar gratuitamente",
    features: [
      "Acesso completo por 7 dias",
      "Devocionais diários com áudios",
      "Trilhas exclusivas liberadas",
      "Dashboard personalizado e Diário de Bordo",
      "Gamificação e Notificações diárias",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    tagline: "Mantenha sua rotina diária de fé e propósito.",
    priceMonthly: 990,
    displayPrice: "R$ 9,90",
    period: "/mês",
    description: "O essencial para acompanhar os devocionais em texto e manter a constância.",
    buttonText: "Assinar Starter",
    features: [
      "Acesso contínuo aos devocionais diários",
      "Dashboard personalizado de progresso",
      "Diário de Bordo para suas reflexões",
      "Favoritar conteúdos e Gamificação",
      "Notificações diárias e Suporte",
      "Sem áudios e sem trilhas exclusivas",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    badge: "Mais completo",
    highlight: true,
    tagline: "Tenha a experiência completa do Minuto da Provisão.",
    priceMonthly: 1490,
    displayPrice: "R$ 14,90",
    period: "/mês",
    description: "Apenas R$ 5,00 a mais que o Starter para desbloquear áudios e todas as trilhas.",
    buttonText: "Assinar Premium",
    features: [
      "Tudo incluído no Starter",
      "Todos os áudios dos devocionais em voz natural",
      "Acesso ilimitado a todas as Trilhas exclusivas",
      "Suporte prioritário",
      "Novas atualizações e séries especiais futuras",
    ],
  },
};

export function canAccessAudio(status: {
  planId: PlanId;
  isActive: boolean;
  isTrialing: boolean;
}): boolean {
  if (status.isTrialing) return true;
  if (!status.isActive) return false;
  return status.planId === "premium";
}

export function canAccessTrail(
  trailAccessLevel: "free" | "premium",
  status: {
    planId: PlanId;
    isActive: boolean;
    isTrialing: boolean;
  }
): boolean {
  if (trailAccessLevel === "free") return true;
  if (status.isTrialing) return true;
  if (!status.isActive) return false;
  return status.planId === "premium";
}
