import type { Express, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import { STRIPE_WEBHOOK_SECRET, stripe } from "./stripe";
import { logPaymentEvent, upsertSubscriptionFromStripe } from "./db";

export function registerStripeWebhook(app: Express) {
  // O endpoint de webhook do Stripe DEVE receber o raw body (Buffer) para validação da assinatura
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;

      let event: Stripe.Event;

      try {
        if (stripe && STRIPE_WEBHOOK_SECRET && sig) {
          event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            STRIPE_WEBHOOK_SECRET
          );
        } else {
          // Fallback para desenvolvimento e testes
          event = JSON.parse(req.body.toString());
        }
      } catch (err: any) {
        console.error(`[Stripe Webhook Error]: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      try {
        // Registrar o evento para auditoria
        await logPaymentEvent({
          stripeEventId: event.id,
          eventType: event.type,
          payload: JSON.stringify(event.data.object),
        });

        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId
              ? parseInt(session.metadata.userId, 10)
              : null;
            const planId = (session.metadata?.planId as "starter" | "premium") || "premium";

            if (userId && session.subscription) {
              const subscriptionId =
                typeof session.subscription === "string"
                  ? session.subscription
                  : session.subscription.id;

              const customerId =
                typeof session.customer === "string"
                  ? session.customer
                  : session.customer?.id || "";

              await upsertSubscriptionFromStripe({
                userId,
                planId,
                status: "active",
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
              });
              console.log(`[Stripe] Checkout completado para usuário ${userId}, plano ${planId}`);
            }
            break;
          }

          case "customer.subscription.updated":
          case "customer.subscription.created": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.userId
              ? parseInt(subscription.metadata.userId, 10)
              : null;
            const planId = (subscription.metadata?.planId as "starter" | "premium") || "premium";

            if (userId) {
              const statusMap: Record<string, "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "expired"> = {
                active: "active",
                trialing: "trialing",
                past_due: "past_due",
                canceled: "canceled",
                incomplete: "incomplete",
                incomplete_expired: "expired",
                unpaid: "past_due",
                paused: "canceled",
              };

              const currentPeriodStart = (subscription as any).current_period_start
                ? new Date((subscription as any).current_period_start * 1000)
                : null;
              const currentPeriodEnd = (subscription as any).current_period_end
                ? new Date((subscription as any).current_period_end * 1000)
                : null;

              await upsertSubscriptionFromStripe({
                userId,
                planId,
                status: statusMap[subscription.status] || "active",
                stripeCustomerId:
                  typeof subscription.customer === "string"
                    ? subscription.customer
                    : subscription.customer.id,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0]?.price?.id || null,
                currentPeriodStart,
                currentPeriodEnd,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
              });
              console.log(`[Stripe] Assinatura atualizada para usuário ${userId}: ${subscription.status}`);
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.userId
              ? parseInt(subscription.metadata.userId, 10)
              : null;

            if (userId) {
              await upsertSubscriptionFromStripe({
                userId,
                planId: "free",
                status: "canceled",
                stripeCustomerId:
                  typeof subscription.customer === "string"
                    ? subscription.customer
                    : subscription.customer.id,
                stripeSubscriptionId: subscription.id,
              });
              console.log(`[Stripe] Assinatura cancelada para usuário ${userId}`);
            }
            break;
          }

          default:
            // Outros eventos são registrados no log de auditoria
            break;
        }

        res.json({ received: true });
      } catch (err: any) {
        console.error("[Stripe Webhook Handler Error]", err);
        res.status(500).send("Webhook handler failed.");
      }
    }
  );
}
