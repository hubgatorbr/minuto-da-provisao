import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  Devotional,
  devotionals,
  favorites,
  InsertUser,
  journalEntries,
  userPreferences,
  userProgress,
  users,
} from "../drizzle/schema";
import { devotionals as devotionalSeeds } from "../shared/devotionals";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let seedPromise: Promise<void> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function ensureDevotionalCatalogue() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const db = await getDb();
    if (!db) return;
    const existing = await db.select({ dayNumber: devotionals.dayNumber, bibleTranslation: devotionals.bibleTranslation, catalogRevision: devotionals.catalogRevision }).from(devotionals);
    const catalogIsCurrent = existing.length === devotionalSeeds.length
      && existing.every(row => row.catalogRevision === devotionalSeeds[0]?.catalogRevision);
    if (catalogIsCurrent) return;

    // The translation identifier doubles as a lightweight catalogue revision.
    // This migrates the regenerated editorial once without overwriting later admin edits.
    for (const seed of devotionalSeeds) {
      const row = existing.find(item => item.dayNumber === seed.dayNumber);
      if (row) {
        await db.update(devotionals).set({
          month: seed.month,
          journey: seed.journey,
          title: seed.title,
          theme: seed.theme,
          bibleReference: seed.bibleReference,
          bibleTranslation: seed.bibleTranslation,
          catalogRevision: seed.catalogRevision,
          bibleText: seed.bibleText,
          reflection: seed.reflection,
          practicalActions: seed.practicalActions,
          dailyQuestion: seed.dailyQuestion,
          prayer: seed.prayer,
          published: seed.published,
        }).where(eq(devotionals.dayNumber, seed.dayNumber));
      } else {
        await db.insert(devotionals).values(seed);
      }
    }
  })().catch(error => {
    seedPromise = null;
    throw error;
  });
  return seedPromise;
}

export async function listDevotionals(search?: string) {
  const db = await getDb();
  if (!db) return devotionalSeeds as unknown as Devotional[];
  await ensureDevotionalCatalogue();
  const base = db.select().from(devotionals).where(eq(devotionals.published, true));
  if (!search?.trim()) return base.orderBy(asc(devotionals.dayNumber));
  const term = `%${search.trim()}%`;
  return db.select().from(devotionals).where(and(
    eq(devotionals.published, true),
    or(
      like(devotionals.title, term),
      like(devotionals.theme, term),
      like(devotionals.journey, term),
      like(devotionals.bibleReference, term),
      like(devotionals.reflection, term)
    )
  )).orderBy(asc(devotionals.dayNumber));
}

export async function getDevotionalByDay(dayNumber: number) {
  const db = await getDb();
  if (!db) return devotionalSeeds.find(item => item.dayNumber === dayNumber) as unknown as Devotional | undefined;
  await ensureDevotionalCatalogue();
  const result = await db.select().from(devotionals).where(and(eq(devotionals.dayNumber, dayNumber), eq(devotionals.published, true))).limit(1);
  return result[0];
}

export async function getUserState(userId: number): Promise<{ completedIds: number[]; completedDays: number[]; favoriteIds: number[]; entries: any[]; preferences: any }> {
  const db = await getDb();
  if (!db) return { completedIds: [], completedDays: [], favoriteIds: [], entries: [], preferences: undefined };
  const [progress, favoriteRows, entries, preferences] = await Promise.all([
    db.select({ devotionalId: userProgress.devotionalId, dayNumber: devotionals.dayNumber }).from(userProgress).innerJoin(devotionals, eq(userProgress.devotionalId, devotionals.id)).where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true))),
    db.select().from(favorites).where(eq(favorites.userId, userId)),
    db.select({
      id: journalEntries.id,
      devotionalId: journalEntries.devotionalId,
      content: journalEntries.content,
      createdAt: journalEntries.createdAt,
      updatedAt: journalEntries.updatedAt,
      dayNumber: devotionals.dayNumber,
      title: devotionals.title,
      theme: devotionals.theme,
    }).from(journalEntries).innerJoin(devotionals, eq(journalEntries.devotionalId, devotionals.id)).where(eq(journalEntries.userId, userId)).orderBy(desc(journalEntries.updatedAt)),
    db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1),
  ]);
  return {
    completedIds: progress.map(row => row.devotionalId),
    completedDays: progress.map(row => row.dayNumber),
    favoriteIds: favoriteRows.map(row => row.devotionalId),
    entries,
    preferences: preferences[0],
  };
}

export async function toggleCompleted(userId: number, devotionalId: number, completed: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable while saving devotional progress");
  await db.insert(userProgress).values({
    userId,
    devotionalId,
    completed,
    startedAt: new Date(),
    completedAt: completed ? new Date() : null,
  }).onDuplicateKeyUpdate({ set: { completed, completedAt: completed ? new Date() : null } });
}

export async function toggleFavorite(userId: number, devotionalId: number, favorite: boolean) {
  const db = await getDb();
  if (!db) return;
  if (favorite) {
    await db.insert(favorites).values({ userId, devotionalId }).onDuplicateKeyUpdate({ set: { devotionalId } });
  } else {
    await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.devotionalId, devotionalId)));
  }
}

export async function saveJournalEntry(userId: number, devotionalId: number, content: string) {
  const db = await getDb();
  if (!db) return;
  if (!content.trim()) {
    await db.delete(journalEntries).where(and(eq(journalEntries.userId, userId), eq(journalEntries.devotionalId, devotionalId)));
    return;
  }
  await db.insert(journalEntries).values({ userId, devotionalId, content: content.trim() }).onDuplicateKeyUpdate({ set: { content: content.trim(), updatedAt: new Date() } });
}

export async function updatePreferences(userId: number, data: { goal?: string; mainChallenge?: string; interestArea?: string; notificationTime?: string; notificationsEnabled?: boolean; preferredTheme?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(userPreferences).values({ userId, ...data }).onDuplicateKeyUpdate({ set: { ...data, updatedAt: new Date() } });
}

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { users: 0, activeUsers: 0, completions: 0, completionRate: 0, topDevotionals: [] };
  await ensureDevotionalCatalogue();
  const [userCount] = await db.select({ value: sql<number>`count(*)` }).from(users);
  const [activeCount] = await db.select({ value: sql<number>`count(distinct ${userProgress.userId})` }).from(userProgress).where(eq(userProgress.completed, true));
  const [completionCount] = await db.select({ value: sql<number>`count(*)` }).from(userProgress).where(eq(userProgress.completed, true));
  const topDevotionals = await db.select({
    id: devotionals.id,
    dayNumber: devotionals.dayNumber,
    title: devotionals.title,
    count: sql<number>`count(${userProgress.id})`,
  }).from(devotionals).leftJoin(userProgress, and(eq(userProgress.devotionalId, devotionals.id), eq(userProgress.completed, true))).groupBy(devotionals.id).orderBy(desc(sql`count(${userProgress.id})`)).limit(5);
  return {
    users: Number(userCount?.value ?? 0),
    activeUsers: Number(activeCount?.value ?? 0),
    completions: Number(completionCount?.value ?? 0),
    completionRate: Number(userCount?.value ?? 0) ? Math.round((Number(completionCount?.value ?? 0) / (Number(userCount?.value ?? 0) * 365)) * 100) : 0,
    topDevotionals,
  };
}
