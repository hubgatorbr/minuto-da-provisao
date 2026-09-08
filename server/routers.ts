import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { getJourneyStats, updateUserAvatar } from "./db";
import { devotionalRouter } from "./routers/devotionals";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, cookieOptions);
      return { success: true } as const;
    }),
  }),
  devotional: devotionalRouter,
  journey: router({
    stats: protectedProcedure.query(({ ctx }) => getJourneyStats(ctx.user.id)),
  }),
  profile: router({
    updateAvatar: protectedProcedure.input(z.object({ dataUrl: z.string().max(7_000_000) })).mutation(async ({ ctx, input }) => {
      const match = input.dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/);
      if (!match) throw new Error("Formato de imagem não suportado. Use JPG, PNG ou WEBP.");
      const contentType = match[1] === "image/jpg" ? "image/jpeg" : match[1];
      const buffer = Buffer.from(match[2], "base64");
      if (buffer.byteLength > 5 * 1024 * 1024) throw new Error("A foto deve ter no máximo 5 MB.");
      const uploaded = await storagePut(`avatars/user-${ctx.user.id}`, buffer, contentType);
      const user = await updateUserAvatar(ctx.user.id, uploaded.url);
      return { success: true, user };
    }),
    removeAvatar: protectedProcedure.mutation(async ({ ctx }) => {
      const user = await updateUserAvatar(ctx.user.id, null);
      return { success: true, user };
    }),
  }),
});

export type AppRouter = typeof appRouter;
