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
  userAchievements,
  userPreferences,
  userProgress,
  users,
  userStreaks,
} from "../drizzle/schema";
import { devotionals as devotionalSeeds } from "../shared/devotionals";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let seedPromise: Promise<void> | null = null;
let achievementPromise: Promise<void> | null = null;

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
