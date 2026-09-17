import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  Achievement,
  Devotional,
  achievements,
  devotionals,
  favorites,
  InsertUser,
  journalEntries,
  thematicTrails,
  thematicTrailItems,
  userAchievements,
  userPreferences,
  userProgress,
  userTrailProgress,
  userTrailItemProgress,
  users,
  userStreaks,
} from "../drizzle/schema";
import { devotionals as devotionalSeeds } from "../shared/devotionals";
import { thematicTrailSeeds } from "../shared/thematic-trails";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let seedPromise: Promise<void> | null = null;
let achievementPromise: Promise<void> | null = null;
let trailsPromise: Promise<void> | null = null;

export const achievementSeeds = [
  { name: "Primeiro Minuto", description: "Concluiu o primeiro devocional.", icon: "trophy", requirementType: "completed", requirementValue: 1 },
  { name: "Uma Semana", description: "Construiu sete dias consecutivos de constância.", icon: "flame", requirementType: "streak", requirementValue: 7 },
  { name: "Constância", description: "Alcançou trinta dias consecutivos.", icon: "star", requirementType: "streak", requirementValue: 30 },
  { name: "Metade do Caminho", description: "Percorreu 182 dias da jornada.", icon: "medal", requirementType: "completed", requirementValue: 182 },
  { name: "Um Ano de Propósito", description: "Concluiu os 365 dias da jornada.", icon: "crown", requirementType: "completed", requirementValue: 365 },
] as const;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  (["name", "email", "loginMethod"] as const).forEach(field => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function updateUserAvatar(userId: number, avatarUrl: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable while saving avatar");
  await db.update(users).set({ avatarUrl }).where(eq(users.id, userId));
  return getUserById(userId);
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0];
}

export async function ensureDevotionalCatalogue() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const db = await getDb();
    if (!db) return;
    const existing = await db.select({ dayNumber: devotionals.dayNumber, catalogRevision: devotionals.catalogRevision }).from(devotionals);
    const catalogIsCurrent = existing.length === devotionalSeeds.length && devotionalSeeds.every(seed => existing.some(row => row.dayNumber === seed.dayNumber && row.catalogRevision === seed.catalogRevision));
    if (catalogIsCurrent) return;
    for (const seed of devotionalSeeds) {
      const row = existing.find(item => item.dayNumber === seed.dayNumber);
      if (row) {
        if (row.catalogRevision === seed.catalogRevision) continue;
        await db.update(devotionals).set({ ...seed }).where(eq(devotionals.dayNumber, seed.dayNumber));
      } else await db.insert(devotionals).values(seed);
    }
  })().catch(error => { seedPromise = null; throw error; });
  return seedPromise;
}

export async function ensureAchievements() {
  if (achievementPromise) return achievementPromise;
  achievementPromise = (async () => {
    const db = await getDb();
    if (!db) return;
    const existing = await db.select({ name: achievements.name }).from(achievements);
    for (const seed of achievementSeeds) if (!existing.some(item => item.name === seed.name)) await db.insert(achievements).values(seed);
  })().catch(error => { achievementPromise = null; throw error; });
  return achievementPromise;
}

export async function ensureThematicTrails() {
  if (trailsPromise) return trailsPromise;
  trailsPromise = (async () => {
    const db = await getDb();
    if (!db) return;
    await ensureDevotionalCatalogue();
    for (const trail of thematicTrailSeeds) {
      const existingTrail = await db.select().from(thematicTrails).where(eq(thematicTrails.slug, trail.slug)).limit(1);
      let trailId: number;
      if (existingTrail.length === 0) {
        const [result] = await db.insert(thematicTrails).values({
          slug: trail.slug,
          title: trail.title,
          subtitle: trail.subtitle,
          description: trail.description,
          challenge: trail.challenge,
          durationDays: trail.durationDays,
          accessLevel: trail.accessLevel,
          coverColor: trail.coverColor,
          published: trail.published,
          catalogRevision: trail.catalogRevision,
        });
        trailId = Number(result.insertId);
      } else {
        trailId = existingTrail[0].id;
        await db.update(thematicTrails).set({
          title: trail.title,
          subtitle: trail.subtitle,
          description: trail.description,
          challenge: trail.challenge,
          durationDays: trail.durationDays,
          accessLevel: trail.accessLevel,
          coverColor: trail.coverColor,
          published: trail.published,
          catalogRevision: trail.catalogRevision,
        }).where(eq(thematicTrails.id, trailId));
      }

      if (trail.items.length > 0) {
        for (const item of trail.items) {
          const devRow = await db.select({ id: devotionals.id }).from(devotionals).where(eq(devotionals.dayNumber, item.dayNumber)).limit(1);
          if (devRow.length === 0) continue;
          const devotionalId = devRow[0].id;
          const existingItem = await db.select().from(thematicTrailItems).where(
            and(eq(thematicTrailItems.trailId, trailId), eq(thematicTrailItems.position, item.position))
          ).limit(1);
          if (existingItem.length === 0) {
            await db.insert(thematicTrailItems).values({
              trailId,
              devotionalId,
              position: item.position,
              trailIntro: item.trailIntro ?? null,
              actionPrompt: item.actionPrompt ?? null,
              reviewQuestion: item.reviewQuestion ?? null,
            });
          } else {
            await db.update(thematicTrailItems).set({
              devotionalId,
              trailIntro: item.trailIntro ?? null,
              actionPrompt: item.actionPrompt ?? null,
              reviewQuestion: item.reviewQuestion ?? null,
            }).where(eq(thematicTrailItems.id, existingItem[0].id));
          }
        }
      }
    }
  })().catch(error => { trailsPromise = null; throw error; });
  return trailsPromise;
}

export async function listThematicTrails(filters?: {
  challenge?: string;
  durationDays?: number;
  accessLevel?: "free" | "premium";
}) {
  const db = await getDb();
  if (!db) {
    return thematicTrailSeeds
      .filter(t => t.published)
      .filter(t => !filters?.challenge || t.challenge.toLowerCase().includes(filters.challenge.toLowerCase()))
      .filter(t => !filters?.durationDays || t.durationDays === filters.durationDays)
      .filter(t => !filters?.accessLevel || t.accessLevel === filters.accessLevel)
      .map(t => ({
        id: 0,
        slug: t.slug,
        title: t.title,
        subtitle: t.subtitle,
        description: t.description,
        challenge: t.challenge,
        durationDays: t.durationDays,
        accessLevel: t.accessLevel,
        coverColor: t.coverColor,
        itemCount: t.items.length,
      }));
  }
  await ensureThematicTrails();
  const conditions = [eq(thematicTrails.published, true)];
  if (filters?.challenge) conditions.push(like(thematicTrails.challenge, `%${filters.challenge}%`));
  if (filters?.durationDays) conditions.push(eq(thematicTrails.durationDays, filters.durationDays));
  if (filters?.accessLevel) conditions.push(eq(thematicTrails.accessLevel, filters.accessLevel));

  const rows = await db.select({
    id: thematicTrails.id,
    slug: thematicTrails.slug,
    title: thematicTrails.title,
    subtitle: thematicTrails.subtitle,
    description: thematicTrails.description,
    challenge: thematicTrails.challenge,
    durationDays: thematicTrails.durationDays,
    accessLevel: thematicTrails.accessLevel,
    coverColor: thematicTrails.coverColor,
    itemCount: sql<number>`count(${thematicTrailItems.id})`,
  })
  .from(thematicTrails)
  .leftJoin(thematicTrailItems, eq(thematicTrails.id, thematicTrailItems.trailId))
  .where(and(...conditions))
  .groupBy(thematicTrails.id)
  .orderBy(asc(thematicTrails.id));

  return rows.map(r => ({ ...r, itemCount: Number(r.itemCount) }));
}

export async function getThematicTrailBySlug(slug: string, userId?: number) {
  const db = await getDb();
  if (!db) {
    const seed = thematicTrailSeeds.find(t => t.slug === slug);
    if (!seed) return undefined;
    return {
      ...seed,
      id: 0,
      itemCount: seed.items.length,
      items: seed.items.map(item => {
        const dev = devotionalSeeds.find(d => d.dayNumber === item.dayNumber);
        return {
          id: item.position,
          position: item.position,
          dayNumber: item.dayNumber,
          trailIntro: item.trailIntro ?? null,
          actionPrompt: item.actionPrompt ?? null,
          reviewQuestion: item.reviewQuestion ?? null,
          devotional: dev ? {
            id: dev.dayNumber,
            dayNumber: dev.dayNumber,
            title: dev.title,
            theme: dev.theme,
            bibleReference: dev.bibleReference,
            bibleTranslation: dev.bibleTranslation,
            bibleText: dev.bibleText,
            reflection: dev.reflection,
            practicalActions: dev.practicalActions,
            dailyQuestion: dev.dailyQuestion,
            prayer: dev.prayer,
          } : undefined,
        };
      }),
      userProgress: undefined,
    };
  }
  await ensureThematicTrails();
  const trailRows = await db.select().from(thematicTrails).where(eq(thematicTrails.slug, slug)).limit(1);
  if (trailRows.length === 0) return undefined;
  const trail = trailRows[0];

  const items = await db.select({
    id: thematicTrailItems.id,
    position: thematicTrailItems.position,
    trailIntro: thematicTrailItems.trailIntro,
    actionPrompt: thematicTrailItems.actionPrompt,
    reviewQuestion: thematicTrailItems.reviewQuestion,
    devotional: devotionals,
  })
  .from(thematicTrailItems)
  .innerJoin(devotionals, eq(thematicTrailItems.devotionalId, devotionals.id))
  .where(eq(thematicTrailItems.trailId, trail.id))
  .orderBy(asc(thematicTrailItems.position));

  let progressData: {
    id: number;
    startedAt: Date;
    completedAt: Date | null;
    lastPosition: number;
    status: "active" | "completed" | "paused";
    completedItemIds: number[];
    completedPositions: number[];
  } | undefined = undefined;

  if (userId) {
    const progRows = await db.select().from(userTrailProgress).where(
      and(eq(userTrailProgress.userId, userId), eq(userTrailProgress.trailId, trail.id))
    ).limit(1);
    if (progRows.length > 0) {
      const p = progRows[0];
      const itemProgRows = await db.select({
        trailItemId: userTrailItemProgress.trailItemId,
        position: thematicTrailItems.position,
      })
      .from(userTrailItemProgress)
      .innerJoin(thematicTrailItems, eq(userTrailItemProgress.trailItemId, thematicTrailItems.id))
      .where(eq(userTrailItemProgress.userTrailProgressId, p.id));

      progressData = {
        id: p.id,
        startedAt: p.startedAt,
        completedAt: p.completedAt,
        lastPosition: p.lastPosition,
        status: p.status,
        completedItemIds: itemProgRows.map(i => i.trailItemId),
        completedPositions: itemProgRows.map(i => i.position),
      };
    }
  }

  return {
    ...trail,
    itemCount: items.length,
    items,
    userProgress: progressData,
  };
}

export async function startUserTrail(userId: number, trailSlug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await ensureThematicTrails();
  const trailRows = await db.select().from(thematicTrails).where(eq(thematicTrails.slug, trailSlug)).limit(1);
  if (trailRows.length === 0) throw new Error("Trilha não encontrada");
  const trail = trailRows[0];

  await db.insert(userTrailProgress).values({
    userId,
    trailId: trail.id,
    startedAt: new Date(),
    lastPosition: 1,
    status: "active",
  }).onDuplicateKeyUpdate({
    set: {
      status: "active",
    },
  });

  return getThematicTrailBySlug(trailSlug, userId);
}

export async function toggleTrailItemCompleted(userId: number, trailSlug: string, position: number, completed: boolean, journalContent?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await ensureThematicTrails();
  const trailRows = await db.select().from(thematicTrails).where(eq(thematicTrails.slug, trailSlug)).limit(1);
  if (trailRows.length === 0) throw new Error("Trilha não encontrada");
  const trail = trailRows[0];

  let progressRow = (await db.select().from(userTrailProgress).where(
    and(eq(userTrailProgress.userId, userId), eq(userTrailProgress.trailId, trail.id))
  ).limit(1))[0];

  if (!progressRow) {
    const [res] = await db.insert(userTrailProgress).values({
      userId,
      trailId: trail.id,
      startedAt: new Date(),
      lastPosition: position,
      status: "active",
    });
    progressRow = {
      id: Number(res.insertId),
      userId,
      trailId: trail.id,
      startedAt: new Date(),
      completedAt: null,
      lastPosition: position,
      status: "active",
    };
  }

  const itemRows = await db.select().from(thematicTrailItems).where(
    and(eq(thematicTrailItems.trailId, trail.id), eq(thematicTrailItems.position, position))
  ).limit(1);
  if (itemRows.length === 0) throw new Error("Etapa da trilha não encontrada");
  const trailItem = itemRows[0];

  if (completed) {
    await db.insert(userTrailItemProgress).values({
      userTrailProgressId: progressRow.id,
      trailItemId: trailItem.id,
      completedAt: new Date(),
      journalContent: journalContent?.trim() || null,
    }).onDuplicateKeyUpdate({
      set: {
        completedAt: new Date(),
        journalContent: journalContent?.trim() || null,
      },
    });
  } else {
    await db.delete(userTrailItemProgress).where(
      and(
        eq(userTrailItemProgress.userTrailProgressId, progressRow.id),
        eq(userTrailItemProgress.trailItemId, trailItem.id)
      )
    );
  }

  const totalItems = await db.select({ count: sql<number>`count(*)` })
    .from(thematicTrailItems)
    .where(eq(thematicTrailItems.trailId, trail.id));
  const completedItems = await db.select({ count: sql<number>`count(*)` })
    .from(userTrailItemProgress)
    .where(eq(userTrailItemProgress.userTrailProgressId, progressRow.id));

  const totalCount = Number(totalItems[0]?.count ?? 0);
  const doneCount = Number(completedItems[0]?.count ?? 0);
  const isCompleted = totalCount > 0 && doneCount >= totalCount;

  await db.update(userTrailProgress).set({
    lastPosition: position,
    status: isCompleted ? "completed" : "active",
    completedAt: isCompleted ? new Date() : null,
  }).where(eq(userTrailProgress.id, progressRow.id));

  return getThematicTrailBySlug(trailSlug, userId);
}

export async function getUserTrailsOverview(userId: number) {
  const db = await getDb();
  if (!db) return [];
  await ensureThematicTrails();

  const rows = await db.select({
    id: thematicTrails.id,
    slug: thematicTrails.slug,
    title: thematicTrails.title,
    subtitle: thematicTrails.subtitle,
    challenge: thematicTrails.challenge,
    durationDays: thematicTrails.durationDays,
    accessLevel: thematicTrails.accessLevel,
    coverColor: thematicTrails.coverColor,
    startedAt: userTrailProgress.startedAt,
    completedAt: userTrailProgress.completedAt,
    lastPosition: userTrailProgress.lastPosition,
    status: userTrailProgress.status,
    completedSteps: sql<number>`count(${userTrailItemProgress.id})`,
    totalSteps: sql<number>`(select count(*) from thematic_trail_items where trailId = thematic_trails.id)`,
  })
  .from(userTrailProgress)
  .innerJoin(thematicTrails, eq(userTrailProgress.trailId, thematicTrails.id))
  .leftJoin(userTrailItemProgress, eq(userTrailProgress.id, userTrailItemProgress.userTrailProgressId))
  .where(eq(userTrailProgress.userId, userId))
  .groupBy(userTrailProgress.id, thematicTrails.id)
  .orderBy(desc(userTrailProgress.startedAt));

  return rows.map(r => ({
    ...r,
    completedSteps: Number(r.completedSteps),
    totalSteps: Number(r.totalSteps),
  }));
}

export async function listDevotionals(search?: string) {
  const db = await getDb();
  if (!db) return devotionalSeeds as unknown as Devotional[];
  await ensureDevotionalCatalogue();
  if (!search?.trim()) return db.select().from(devotionals).where(eq(devotionals.published, true)).orderBy(asc(devotionals.dayNumber));
  const term = `%${search.trim()}%`;
  return db.select().from(devotionals).where(and(eq(devotionals.published, true), or(like(devotionals.title, term), like(devotionals.theme, term), like(devotionals.journey, term), like(devotionals.bibleReference, term), like(devotionals.reflection, term)))).orderBy(asc(devotionals.dayNumber));
}

export async function getDevotionalByDay(dayNumber: number) {
  const db = await getDb();
  if (!db) return devotionalSeeds.find(item => item.dayNumber === dayNumber) as unknown as Devotional | undefined;
  await ensureDevotionalCatalogue();
  const result = await db.select().from(devotionals).where(and(eq(devotionals.dayNumber, dayNumber), eq(devotionals.published, true))).limit(1);
  return result[0];
}

export async function getUserState(userId: number): Promise<{ completedIds: number[]; completedDays: number[]; favoriteIds: number[]; entries: Array<{ id: number; devotionalId: number; content: string; createdAt: Date; updatedAt: Date; dayNumber: number; title: string; theme: string }>; preferences: { goal: string | null; mainChallenge: string | null; interestArea: string | null; notificationTime: string | null; notificationsEnabled: boolean; preferredTheme: string | null } | undefined }> {
  const db = await getDb();
  if (!db) return { completedIds: [], completedDays: [], favoriteIds: [], entries: [], preferences: undefined };
  const [progress, favoriteRows, entries, preferences] = await Promise.all([
    db.select({ devotionalId: userProgress.devotionalId, dayNumber: devotionals.dayNumber }).from(userProgress).innerJoin(devotionals, eq(userProgress.devotionalId, devotionals.id)).where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true))),
    db.select().from(favorites).where(eq(favorites.userId, userId)),
    db.select({ id: journalEntries.id, devotionalId: journalEntries.devotionalId, content: journalEntries.content, createdAt: journalEntries.createdAt, updatedAt: journalEntries.updatedAt, dayNumber: devotionals.dayNumber, title: devotionals.title, theme: devotionals.theme }).from(journalEntries).innerJoin(devotionals, eq(journalEntries.devotionalId, devotionals.id)).where(eq(journalEntries.userId, userId)).orderBy(desc(journalEntries.updatedAt)),
    db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1),
  ]);
  return { completedIds: progress.map(row => row.devotionalId), completedDays: progress.map(row => row.dayNumber), favoriteIds: favoriteRows.map(row => row.devotionalId), entries, preferences: preferences[0] };
}

async function recomputeJourney(userId: number) {
  const db = await getDb();
  if (!db) return { currentStreak: 0, longestStreak: 0, completedCount: 0 };
  const rows = await db.select({ dayNumber: devotionals.dayNumber }).from(userProgress).innerJoin(devotionals, eq(userProgress.devotionalId, devotionals.id)).where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true)));
  const days = Array.from(new Set(rows.map(row => row.dayNumber))).sort((a, b) => a - b);
  const { currentStreak, longestStreak } = calculateStreak(days);
  await db.insert(userStreaks).values({ userId, currentStreak, longestStreak, lastCompletedDate: days.length ? new Date() : null }).onDuplicateKeyUpdate({ set: { currentStreak, longestStreak, lastCompletedDate: days.length ? new Date() : null, updatedAt: new Date() } });
  return { currentStreak, longestStreak, completedCount: days.length };
}

export function calculateStreak(days: number[]) {
  const sorted = Array.from(new Set(days)).sort((a, b) => a - b);
  let longestStreak = 0; let run = 0; let previous = -2;
  for (const day of sorted) { run = day === previous + 1 ? run + 1 : 1; longestStreak = Math.max(longestStreak, run); previous = day; }
  let currentStreak = 0;
  for (let index = sorted.length - 1; index >= 0; index -= 1) { if (index === sorted.length - 1 || sorted[index + 1] === sorted[index] + 1) currentStreak += 1; else break; }
  return { currentStreak, longestStreak };
}

async function syncAchievements(userId: number, metrics: { currentStreak: number; completedCount: number }) {
  const db = await getDb();
  if (!db) return;
  await ensureAchievements();
  const all = await db.select().from(achievements);
  const earned = await db.select({ achievementId: userAchievements.achievementId }).from(userAchievements).where(eq(userAchievements.userId, userId));
  const earnedIds = new Set(earned.map(item => item.achievementId));
  for (const item of all) {
    const value = item.requirementType === "streak" ? metrics.currentStreak : metrics.completedCount;
    if (value >= item.requirementValue && !earnedIds.has(item.id)) await db.insert(userAchievements).values({ userId, achievementId: item.id }).onDuplicateKeyUpdate({ set: { achievementId: item.id } });
  }
}

export async function getJourneyStats(userId: number) {
  const db = await getDb();
  if (!db) return { completedCount: 0, currentStreak: 0, longestStreak: 0, achievements: [], nextAchievement: achievementSeeds[0] };
  const metrics = await recomputeJourney(userId);
  await ensureAchievements();
  await syncAchievements(userId, metrics);
  const all = await db.select().from(achievements).orderBy(asc(achievements.requirementValue));
  const unlocked = await db.select({ achievementId: userAchievements.achievementId, unlockedAt: userAchievements.unlockedAt }).from(userAchievements).where(eq(userAchievements.userId, userId));
  const unlockedMap = new Map(unlocked.map(item => [item.achievementId, item.unlockedAt]));
  const result = all.map(item => ({ ...item, unlockedAt: unlockedMap.get(item.id) ?? null, unlocked: unlockedMap.has(item.id) }));
  return { ...metrics, achievements: result, nextAchievement: result.find(item => !item.unlocked) ?? result[result.length - 1] };
}

export async function toggleCompleted(userId: number, devotionalId: number, completed: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable while saving devotional progress");
  await db.insert(userProgress).values({ userId, devotionalId, completed, startedAt: new Date(), completedAt: completed ? new Date() : null }).onDuplicateKeyUpdate({ set: { completed, completedAt: completed ? new Date() : null } });
  const metrics = await recomputeJourney(userId);
  await syncAchievements(userId, metrics);
}

export async function toggleFavorite(userId: number, devotionalId: number, favorite: boolean) {
  const db = await getDb();
  if (!db) return;
  if (favorite) await db.insert(favorites).values({ userId, devotionalId }).onDuplicateKeyUpdate({ set: { devotionalId } });
  else await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.devotionalId, devotionalId)));
}

export async function saveJournalEntry(userId: number, devotionalId: number, content: string) {
  const db = await getDb();
  if (!db) return;
  if (!content.trim()) { await db.delete(journalEntries).where(and(eq(journalEntries.userId, userId), eq(journalEntries.devotionalId, devotionalId))); return; }
  await db.insert(journalEntries).values({ userId, devotionalId, content: content.trim() }).onDuplicateKeyUpdate({ set: { content: content.trim(), updatedAt: new Date() } });
}

export async function updatePreferences(userId: number, data: { goal?: string; mainChallenge?: string; interestArea?: string; notificationTime?: string; notificationsEnabled?: boolean; preferredTheme?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(userPreferences).values({ userId, ...data }).onDuplicateKeyUpdate({ set: { ...data, updatedAt: new Date() } });
}

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { users: 0, activeUsers: 0, completions: 0, completionRate: 0, topDevotionals: [], achievements: [] };
  await ensureDevotionalCatalogue(); await ensureAchievements();
  const [userCount] = await db.select({ value: sql<number>`count(*)` }).from(users);
  const [activeCount] = await db.select({ value: sql<number>`count(distinct ${userProgress.userId})` }).from(userProgress).where(eq(userProgress.completed, true));
  const [completionCount] = await db.select({ value: sql<number>`count(*)` }).from(userProgress).where(eq(userProgress.completed, true));
  const topDevotionals = await db.select({ id: devotionals.id, dayNumber: devotionals.dayNumber, title: devotionals.title, count: sql<number>`count(${userProgress.id})` }).from(devotionals).leftJoin(userProgress, and(eq(userProgress.devotionalId, devotionals.id), eq(userProgress.completed, true))).groupBy(devotionals.id).orderBy(desc(sql`count(${userProgress.id})`)).limit(5);
  const achievementStats = await db.select({ name: achievements.name, description: achievements.description, requirementValue: achievements.requirementValue, unlocked: sql<number>`count(${userAchievements.id})` }).from(achievements).leftJoin(userAchievements, eq(userAchievements.achievementId, achievements.id)).groupBy(achievements.id);
  return { users: Number(userCount?.value ?? 0), activeUsers: Number(activeCount?.value ?? 0), completions: Number(completionCount?.value ?? 0), completionRate: Number(userCount?.value ?? 0) ? Math.round((Number(completionCount?.value ?? 0) / (Number(userCount?.value ?? 0) * 365)) * 100) : 0, topDevotionals, achievements: achievementStats };
}
