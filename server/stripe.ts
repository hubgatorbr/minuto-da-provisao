import Stripe from "stripe";
import { PLANS, PlanId } from "../shared/plans";

// Configuração segura do Stripe SDK
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia" as any,
    })
  : null;

export function isStripeConfigured(): boolean {
  return Boolean(stripe && STRIPE_SECRET_KEY);
}

export function getPriceIdForPlan(planId: PlanId): string | null {
  if (planId === "starter") {
    return process.env.STRIPE_PRICE_STARTER || null;
  }
  if (planId === "premium") {
    return process.env.STRIPE_PRICE_PREMIUM || null;
  }
  return null;
}

export async function createCheckoutSession(params: {
  userId: number;
  userEmail?: string | null;
  userName?: string | null;
  planId: "starter" | "premium";
  stripeCustomerId?: string | null;
  origin: string;
}) {
  const { userId, userEmail, userName, planId, stripeCustomerId, origin } = params;
  const plan = PLANS[planId];
  if (!plan) throw new Error("Plano inválido.");

  // Se o Stripe não estiver com chaves ativas no ambiente (por exemplo em preview ou testes locais sem chaves),
  // retornamos uma URL simulada/sandbox controlada ou mensagem orientadora
  if (!stripe) {
    console.warn("[Stripe] STRIPE_SECRET_KEY não configurada. Operando em modo de demonstração.");
    return {
      url: `${origin}/planos?simulated_success=true&plan=${planId}`,
      sessionId: `mock_session_${planId}_${Date.now()}`,
      isMock: true,
    };
  }

  let customerId = stripeCustomerId;
  if (!customerId && userEmail) {
    const existing = await stripe.customers.list({ email: userEmail, limit: 1 });
    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    } else {
      const created = await stripe.customers.create({
        email: userEmail,
        name: userName || undefined,
        metadata: { userId: String(userId) },
      });
      customerId = created.id;
    }
  }

  const priceId = getPriceIdForPlan(planId);

  // Se houver Price ID configurado no Stripe Dashboard, usamos price.
  // Caso contrário, usamos line_items com price_data recorrente dinâmico em BRL.
  const lineItem = priceId
    ? { price: priceId, quantity: 1 }
    : {
        price_data: {
          currency: "brl",
          product_data: {
            name: `Minuto da Provisão — Plano ${plan.name}`,
            description: plan.tagline,
          },
          unit_amount: plan.priceMonthly,
          recurring: {
            interval: "month" as const,
          },
        },
        quantity: 1,
      };

  const session = await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    customer_email: customerId ? undefined : userEmail || undefined,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [lineItem],
    success_url: `${origin}/planos?success=true&session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
    cancel_url: `${origin}/planos?canceled=true`,
    metadata: {
      userId: String(userId),
      planId,
    },
    subscription_data: {
      metadata: {
        userId: String(userId),
        planId,
      },
    },
    allow_promotion_codes: true,
  });

  return {
    url: session.url,
    sessionId: session.id,
    isMock: false,
  };
}

export async function createCustomerPortalSession(params: {
  stripeCustomerId: string;
  returnUrl: string;
}) {
  if (!stripe) {
    return { url: `${params.returnUrl}?portal_mock=true` };
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: params.stripeCustomerId,
    return_url: params.returnUrl,
  });

  return { url: session.url };
}
