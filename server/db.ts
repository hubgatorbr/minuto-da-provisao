import { and, desc, eq, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  devotionals,
  favorites,
  InsertUser,
  journalEntries,
  users,
  userPreferences,
  userProgress,
} from "../drizzle/schema";
import { devotionals as editorialDevotionals } from "../shared/devotionals";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

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

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  } else {
    values.lastSignedIn = new Date();
    updateSet.lastSignedIn = values.lastSignedIn;
  }
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

type PublicDevotional = typeof editorialDevotionals[number] & { id: number };

type UserState = {
  completedIds: number[];
  completedDays: number[];
  favoriteIds: number[];
  entries: Array<{
    id: number;
    devotionalId: number;
    content: string;
    updatedAt: Date;
    dayNumber: number;
    title: string;
    theme: string;
  }>;
  preferences: typeof userPreferences.$inferSelect | null;
};

function editorialFallback(search?: string): PublicDevotional[] {
  const needle = search?.trim().toLowerCase();
  return editorialDevotionals
    .filter(item => !needle || [item.title, item.theme, item.journey, item.bibleReference, item.reflection].join(" ").toLowerCase().includes(needle))
    .map((item, index) => ({ ...item, id: index + 1 }));
}

export async function listDevotionals(search?: string) {
  const db = await getDb();
  if (!db) return editorialFallback(search);
  try {
    const rows = search?.trim()
      ? await db.select().from(devotionals).where(and(eq(devotionals.published, true), like(devotionals.title, `%${search.trim()}%`))).orderBy(devotionals.dayNumber)
      : await db.select().from(devotionals).where(eq(devotionals.published, true)).orderBy(devotionals.dayNumber);
    return rows.length ? rows : editorialFallback(search);
  } catch (error) {
    console.warn("[Database] Falling back to the editorial devotional catalogue:", error instanceof Error ? error.message : error);
    return editorialFallback(search);
  }
}

export async function getDevotionalByDay(dayNumber: number) {
  const db = await getDb();
  if (!db) return editorialFallback().find(item => item.dayNumber === dayNumber);
  try {
    const rows = await db.select().from(devotionals).where(and(eq(devotionals.dayNumber, dayNumber), eq(devotionals.published, true))).limit(1);
    return rows[0] ?? editorialFallback().find(item => item.dayNumber === dayNumber);
  } catch (error) {
    console.warn("[Database] Falling back to the editorial devotional catalogue:", error instanceof Error ? error.message : error);
    return editorialFallback().find(item => item.dayNumber === dayNumber);
  }
}

export async function getUserState(userId: number): Promise<UserState> {
  const db = await getDb();
  if (!db) return { completedIds: [], completedDays: [], favoriteIds: [], entries: [], preferences: null };

  const [progressRows, favoriteRows, entryRows, preferenceRows] = await Promise.all([
    db.select({ devotionalId: userProgress.devotionalId, completed: userProgress.completed }).from(userProgress).where(eq(userProgress.userId, userId)),
    db.select({ devotionalId: favorites.devotionalId }).from(favorites).where(eq(favorites.userId, userId)),
    db.select({ id: journalEntries.id, devotionalId: journalEntries.devotionalId, content: journalEntries.content, updatedAt: journalEntries.updatedAt, dayNumber: devotionals.dayNumber, title: devotionals.title, theme: devotionals.theme }).from(journalEntries).innerJoin(devotionals, eq(journalEntries.devotionalId, devotionals.id)).where(eq(journalEntries.userId, userId)).orderBy(desc(journalEntries.updatedAt)),
    db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1),
  ]);
  const completed = progressRows.filter(row => row.completed);
  return {
    completedIds: completed.map(row => row.devotionalId),
    completedDays: completed.map(row => row.devotionalId),
    favoriteIds: favoriteRows.map(row => row.devotionalId),
    entries: entryRows,
    preferences: preferenceRows[0] ?? null,
  };
}

export async function toggleCompleted(userId: number, devotionalId: number, completed: boolean) {
  const db = await getDb();
  if (!db) return;
  const now = new Date();
  await db.insert(userProgress).values({ userId, devotionalId, completed, startedAt: now, completedAt: completed ? now : null }).onDuplicateKeyUpdate({ set: { completed, completedAt: completed ? now : null } });
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
  await db.insert(journalEntries).values({ userId, devotionalId, content }).onDuplicateKeyUpdate({ set: { content, updatedAt: new Date() } });
}

export async function updatePreferences(userId: number, input: { goal?: string; mainChallenge?: string; interestArea?: string; notificationTime?: string; notificationsEnabled?: boolean; preferredTheme?: string }) {
  const db = await getDb();
  if (!db) return;
  const values = { userId, ...input };
  await db.insert(userPreferences).values(values).onDuplicateKeyUpdate({ set: input });
}

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { users: 0, activeUsers: 0, completions: 0, completionRate: 0 };
  const [userRows, activeRows, completionRows, devotionalRows] = await Promise.all([
    db.select({ id: users.id }).from(users),
    db.select({ id: users.id }).from(users).where(eq(users.role, "user")),
    db.select({ id: userProgress.id }).from(userProgress).where(eq(userProgress.completed, true)),
    db.select({ id: devotionals.id }).from(devotionals).where(eq(devotionals.published, true)),
  ]);
  const denominator = Math.max(1, userRows.length * Math.max(1, devotionalRows.length));
  return { users: userRows.length, activeUsers: activeRows.length, completions: completionRows.length, completionRate: Math.round((completionRows.length / denominator) * 100) };
}
