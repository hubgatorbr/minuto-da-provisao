import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PLANS, PLAN_FEATURES_TABLE, canAccessAudio, canAccessTrail } from "../../shared/plans";
import { getUserSubscription, getUserById } from "../db";
import { createCheckoutSession, createCustomerPortalSession, isStripeConfigured } from "../stripe";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

export const planRouter = router({
  // Lista pública de planos e tabela comparativa
  catalog: publicProcedure.query(() => {
    return {
      plans: Object.values(PLANS),
      featuresTable: PLAN_FEATURES_TABLE,
      isStripeConfigured: isStripeConfigured(),
    };
  }),

  // Status de assinatura do usuário autenticado
  mySubscription: protectedProcedure.query(async ({ ctx }) => {
    const sub = await getUserSubscription(ctx.user.id);
    const audioAccess = canAccessAudio(sub);
    return {
      ...sub,
      planDetails: PLANS[sub.planId],
      canAccessAudio: audioAccess,
    };
  }),

  // Iniciar sessão de Checkout no Stripe para Starter ou Premium
  createCheckout: protectedProcedure
    .input(
      z.object({
        planId: z.enum(["starter", "premium"]),
        origin: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getUserById(ctx.user.id);
      const sub = await getUserSubscription(ctx.user.id);
      const origin = input.origin || "http://localhost:3000";

      const session = await createCheckoutSession({
        userId: ctx.user.id,
        userEmail: user?.email ?? ctx.user.email,
        userName: user?.name ?? ctx.user.name,
        planId: input.planId,
        stripeCustomerId: sub.stripeCustomerId,
        origin,
      });

      return session;
    }),

  // Gerar link para o Portal do Cliente do Stripe (gerenciar cartão/cancelar)
  createPortalSession: protectedProcedure
    .input(
      z.object({
        returnUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sub = await getUserSubscription(ctx.user.id);
      if (!sub.stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Nenhuma assinatura ativa encontrada no Stripe para este usuário.",
        });
      }

      return createCustomerPortalSession({
        stripeCustomerId: sub.stripeCustomerId,
        returnUrl: input.returnUrl,
      });
    }),
});
