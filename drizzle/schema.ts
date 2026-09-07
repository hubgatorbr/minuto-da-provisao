import { boolean, int, json, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const devotionals = mysqlTable(
  "devotionals",
  {
    id: int("id").autoincrement().primaryKey(),
    dayNumber: int("dayNumber").notNull(),
    month: varchar("month", { length: 32 }).notNull(),
    journey: varchar("journey", { length: 80 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    theme: varchar("theme", { length: 100 }).notNull(),
    bibleReference: varchar("bibleReference", { length: 120 }).notNull(),
    bibleTranslation: varchar("bibleTranslation", { length: 64 }).notNull().default("ALMEIDA_PUBLIC_DOMAIN"),
    catalogRevision: varchar("catalogRevision", { length: 32 }).notNull().default("editorial-v4"),
    bibleText: text("bibleText"),
    reflection: text("reflection").notNull(),
    practicalActions: json("practicalActions").$type<string[]>().notNull(),
    dailyQuestion: text("dailyQuestion").notNull(),
    prayer: text("prayer").notNull(),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("devotionals_day_number_unique").on(table.dayNumber)]
);

export const userProgress = mysqlTable(
  "user_progress",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    devotionalId: int("devotionalId").notNull().references(() => devotionals.id, { onDelete: "cascade" }),
    completed: boolean("completed").notNull().default(false),
    startedAt: timestamp("startedAt"),
    completedAt: timestamp("completedAt"),
  },
  table => [uniqueIndex("user_progress_user_devotional_unique").on(table.userId, table.devotionalId)]
);

export const journalEntries = mysqlTable(
  "journal_entries",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    devotionalId: int("devotionalId").notNull().references(() => devotionals.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("journal_entries_user_devotional_unique").on(table.userId, table.devotionalId)]
);

export const favorites = mysqlTable(
  "favorites",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    devotionalId: int("devotionalId").notNull().references(() => devotionals.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("favorites_user_devotional_unique").on(table.userId, table.devotionalId)]
);

export const userPreferences = mysqlTable("user_preferences", {
  userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  goal: varchar("goal", { length: 240 }),
  mainChallenge: varchar("mainChallenge", { length: 100 }),
  interestArea: varchar("interestArea", { length: 100 }),
  notificationTime: varchar("notificationTime", { length: 8 }).default("07:00"),
  notificationsEnabled: boolean("notificationsEnabled").notNull().default(true),
  preferredTheme: varchar("preferredTheme", { length: 16 }).default("system"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Devotional = typeof devotionals.$inferSelect;
