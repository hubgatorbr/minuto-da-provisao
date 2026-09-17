import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getThematicTrailBySlug,
  getUserTrailsOverview,
  listThematicTrails,
  startUserTrail,
  toggleTrailItemCompleted,
} from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

export const trailRouter = router({
  // PROCEDIMENTOS PÚBLICOS
  list: publicProcedure
    .input(
      z.object({
        challenge: z.string().optional(),
        durationDays: z.number().int().positive().optional(),
        accessLevel: z.enum(["free", "premium"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return listThematicTrails(input);
    }),

  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const trail = await getThematicTrailBySlug(input.slug, ctx.user?.id);
      if (!trail) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Trilha temática não encontrada.",
        });
      }
      return trail;
    }),

  // PROCEDIMENTOS PROTEGIDOS (USUÁRIO AUTENTICADO)
  myOverview: protectedProcedure.query(async ({ ctx }) => {
    return getUserTrailsOverview(ctx.user.id);
  }),

  start: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return startUserTrail(ctx.user.id, input.slug);
    }),

  toggleStep: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        position: z.number().int().positive(),
        completed: z.boolean(),
        journalContent: z.string().max(10000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return toggleTrailItemCompleted(
        ctx.user.id,
        input.slug,
        input.position,
        input.completed,
        input.journalContent
      );
    }),
});
