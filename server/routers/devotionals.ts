import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { devotionals as devotionalsTable } from "../../drizzle/schema";
import {
  getAdminStats,
  getDevotionalByDay,
  getUserState,
  listDevotionals,
  toggleCompleted,
  toggleFavorite,
  saveJournalEntry,
  updatePreferences,
  getDb,
} from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Área restrita à administração." });
  return next({ ctx });
});

const devotionalInput = z.object({
  id: z.number().int().positive().optional(),
  dayNumber: z.number().int().min(1).max(365),
  month: z.string().min(2).max(32),
  journey: z.string().min(2).max(80),
  title: z.string().min(3).max(180),
  theme: z.string().min(2).max(100),
  bibleReference: z.string().min(3).max(120),
  bibleTranslation: z.string().min(2).max(64).default("ALMEIDA_PUBLIC_DOMAIN"),
  bibleText: z.string().nullable().optional(),
  reflection: z.string().min(120),
  practicalActions: z.array(z.string().min(3)).min(3).max(5),
  dailyQuestion: z.string().min(5),
  prayer: z.string().min(20),
  published: z.boolean().default(false),
});

export const devotionalRouter = router({
  list: publicProcedure.input(z.object({ search: z.string().max(100).optional() }).optional()).query(({ input }) => listDevotionals(input?.search)),
  byDay: publicProcedure.input(z.object({ dayNumber: z.number().int().min(1).max(365) })).query(({ input }) => getDevotionalByDay(input.dayNumber)),
  state: protectedProcedure.query(({ ctx }) => getUserState(ctx.user.id)),
  toggleCompleted: protectedProcedure.input(z.object({ devotionalId: z.number().int().positive(), completed: z.boolean() })).mutation(async ({ ctx, input }) => {
    await toggleCompleted(ctx.user.id, input.devotionalId, input.completed);
    return { success: true };
  }),
  toggleFavorite: protectedProcedure.input(z.object({ devotionalId: z.number().int().positive(), favorite: z.boolean() })).mutation(async ({ ctx, input }) => {
    await toggleFavorite(ctx.user.id, input.devotionalId, input.favorite);
    return { success: true };
  }),
  saveJournal: protectedProcedure.input(z.object({ devotionalId: z.number().int().positive(), content: z.string().max(10000) })).mutation(async ({ ctx, input }) => {
    await saveJournalEntry(ctx.user.id, input.devotionalId, input.content);
    return { success: true };
  }),
  updatePreferences: protectedProcedure.input(z.object({
    goal: z.string().max(240).optional(),
    mainChallenge: z.string().max(100).optional(),
    interestArea: z.string().max(100).optional(),
    notificationTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
    notificationsEnabled: z.boolean().optional(),
    preferredTheme: z.string().max(16).optional(),
  })).mutation(async ({ ctx, input }) => {
    await updatePreferences(ctx.user.id, input);
    return { success: true };
  }),
  admin: router({
    stats: adminProcedure.query(() => getAdminStats()),
    list: adminProcedure.query(() => listDevotionals()),
    upsert: adminProcedure.input(devotionalInput).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Banco de dados indisponível." });
      const payload = { ...input, bibleText: input.bibleText ?? null };
      if (input.id) {
        await db.update(devotionalsTable).set(payload).where(eq(devotionalsTable.id, input.id));
      } else {
        await db.insert(devotionalsTable).values(payload);
      }
      return { success: true };
    }),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Banco de dados indisponível." });
      await db.delete(devotionalsTable).where(eq(devotionalsTable.id, input.id));
      return { success: true };
    }),
    publish: adminProcedure.input(z.object({ id: z.number().int().positive(), published: z.boolean() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Banco de dados indisponível." });
      await db.update(devotionalsTable).set({ published: input.published }).where(eq(devotionalsTable.id, input.id));
      return { success: true };
    }),
  }),
});
