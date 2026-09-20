import { boolean, int, json, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const devotionals = mysqlTable("devotionals", {
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
}, table => [uniqueIndex("devotionals_day_number_unique").on(table.dayNumber)]);

export const userProgress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  devotionalId: int("devotionalId").notNull().references(() => devotionals.id, { onDelete: "cascade" }),
  completed: boolean("completed").notNull().default(false),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
}, table => [uniqueIndex("user_progress_user_devotional_unique").on(table.userId, table.devotionalId)]);

export const journalEntries = mysqlTable("journal_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  devotionalId: int("devotionalId").notNull().references(() => devotionals.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("journal_entries_user_devotional_unique").on(table.userId, table.devotionalId)]);

export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  devotionalId: int("devotionalId").notNull().references(() => devotionals.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [uniqueIndex("favorites_user_devotional_unique").on(table.userId, table.devotionalId)]);

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

export const userStreaks = mysqlTable("user_streaks", {
  userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  currentStreak: int("currentStreak").notNull().default(0),
  longestStreak: int("longestStreak").notNull().default(0),
  lastCompletedDate: timestamp("lastCompletedDate"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 32 }).notNull(),
  requirementType: varchar("requirementType", { length: 32 }).notNull(),
  requirementValue: int("requirementValue").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: int("achievementId").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
}, table => [uniqueIndex("user_achievements_user_achievement_unique").on(table.userId, table.achievementId)]);

export const thematicTrails = mysqlTable("thematic_trails", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  subtitle: varchar("subtitle", { length: 240 }).notNull(),
  description: text("description").notNull(),
  challenge: varchar("challenge", { length: 120 }).notNull(),
  durationDays: int("durationDays").notNull(),
  accessLevel: mysqlEnum("accessLevel", ["free", "premium"]).notNull().default("free"),
  coverColor: varchar("coverColor", { length: 32 }).notNull().default("#102a43"),
  published: boolean("published").notNull().default(true),
  catalogRevision: varchar("catalogRevision", { length: 32 }).notNull().default("editorial-v4.5"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const thematicTrailItems = mysqlTable("thematic_trail_items", {
  id: int("id").autoincrement().primaryKey(),
  trailId: int("trailId").notNull().references(() => thematicTrails.id, { onDelete: "cascade" }),
  devotionalId: int("devotionalId").notNull().references(() => devotionals.id, { onDelete: "cascade" }),
  position: int("position").notNull(),
  trailIntro: text("trailIntro"),
  actionPrompt: text("actionPrompt"),
  reviewQuestion: text("reviewQuestion"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("thematic_trail_items_trail_position_unique").on(table.trailId, table.position),
  uniqueIndex("thematic_trail_items_trail_devotional_unique").on(table.trailId, table.devotionalId),
]);

export const userTrailProgress = mysqlTable("user_trail_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  trailId: int("trailId").notNull().references(() => thematicTrails.id, { onDelete: "cascade" }),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  lastPosition: int("lastPosition").notNull().default(1),
  status: mysqlEnum("status", ["active", "completed", "paused"]).notNull().default("active"),
}, table => [
  uniqueIndex("user_trail_progress_user_trail_unique").on(table.userId, table.trailId),
]);

export const userTrailItemProgress = mysqlTable("user_trail_item_progress", {
  id: int("id").autoincrement().primaryKey(),
  userTrailProgressId: int("userTrailProgressId").notNull().references(() => userTrailProgress.id, { onDelete: "cascade" }),
  trailItemId: int("trailItemId").notNull().references(() => thematicTrailItems.id, { onDelete: "cascade" }),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  journalContent: text("journalContent"),
}, table => [
  uniqueIndex("user_trail_item_progress_progress_item_unique").on(table.userTrailProgressId, table.trailItemId),
  ]);

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: mysqlEnum("planId", ["free", "starter", "premium"]).notNull().default("free"),
  status: mysqlEnum("status", ["active", "trialing", "past_due", "canceled", "incomplete", "expired"]).notNull().default("trialing"),
  stripeCustomerId: varchar("stripeCustomerId", { length: 120 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 120 }),
  stripePriceId: varchar("stripePriceId", { length: 120 }),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  trialStart: timestamp("trialStart"),
  trialEnd: timestamp("trialEnd"),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").notNull().default(false),
  canceledAt: timestamp("canceledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("subscriptions_user_unique").on(table.userId),
  uniqueIndex("subscriptions_stripe_subscription_unique").on(table.stripeSubscriptionId),
]);

export const paymentAuditLogs = mysqlTable("payment_audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id, { onDelete: "set null" }),
  stripeEventId: varchar("stripeEventId", { length: 120 }).notNull().unique(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  payload: text("payload"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export type PaymentAuditLog = typeof paymentAuditLogs.$inferSelect;
export type Devotional = typeof devotionals.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type ThematicTrail = typeof thematicTrails.$inferSelect;
export type InsertThematicTrail = typeof thematicTrails.$inferInsert;
export type ThematicTrailItem = typeof thematicTrailItems.$inferSelect;
export type InsertThematicTrailItem = typeof thematicTrailItems.$inferInsert;
export type UserTrailProgress = typeof userTrailProgress.$inferSelect;
export type InsertUserTrailProgress = typeof userTrailProgress.$inferInsert;
export type UserTrailItemProgress = typeof userTrailItemProgress.$inferSelect;
export type InsertUserTrailItemProgress = typeof userTrailItemProgress.$inferInsert;
