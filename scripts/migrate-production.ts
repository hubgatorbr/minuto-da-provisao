import mysql from "mysql2/promise";
import { devotionals } from "../shared/devotionals.ts";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const connection = await mysql.createConnection(databaseUrl);

const statements = [
  `CREATE TABLE IF NOT EXISTS users (id int AUTO_INCREMENT NOT NULL, openId varchar(64) NOT NULL, name text, email varchar(320), avatarUrl varchar(500), loginMethod varchar(64), role varchar(16) NOT NULL DEFAULT 'user', createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, lastSignedIn timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT users_id PRIMARY KEY (id), CONSTRAINT users_openId_unique UNIQUE (openId))`,
  `CREATE TABLE IF NOT EXISTS devotionals (id int AUTO_INCREMENT NOT NULL, dayNumber int NOT NULL, month varchar(32) NOT NULL, journey varchar(80) NOT NULL, title varchar(180) NOT NULL, theme varchar(100) NOT NULL, bibleReference varchar(120) NOT NULL, bibleTranslation varchar(64) NOT NULL DEFAULT 'ALMEIDA_PUBLIC_DOMAIN', catalogRevision varchar(32) NOT NULL DEFAULT 'editorial-v3', bibleText text, reflection text NOT NULL, practicalActions json NOT NULL, dailyQuestion text NOT NULL, prayer text NOT NULL, published boolean NOT NULL DEFAULT true, createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, CONSTRAINT devotionals_id PRIMARY KEY (id), CONSTRAINT devotionals_day_number_unique UNIQUE (dayNumber))`,
  `CREATE TABLE IF NOT EXISTS favorites (id int AUTO_INCREMENT NOT NULL, userId int NOT NULL, devotionalId int NOT NULL, createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT favorites_id PRIMARY KEY (id), CONSTRAINT favorites_user_devotional_unique UNIQUE (userId, devotionalId), CONSTRAINT favorites_userId_users_id_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT favorites_devotionalId_devotionals_id_fk FOREIGN KEY (devotionalId) REFERENCES devotionals(id) ON DELETE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS journal_entries (id int AUTO_INCREMENT NOT NULL, userId int NOT NULL, devotionalId int NOT NULL, content text NOT NULL, createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, CONSTRAINT journal_entries_id PRIMARY KEY (id), CONSTRAINT journal_entries_user_devotional_unique UNIQUE (userId, devotionalId), CONSTRAINT journal_entries_userId_users_id_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT journal_entries_devotionalId_devotionals_id_fk FOREIGN KEY (devotionalId) REFERENCES devotionals(id) ON DELETE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS user_preferences (userId int NOT NULL, goal varchar(240), mainChallenge varchar(100), interestArea varchar(100), notificationTime varchar(8) DEFAULT '07:00', notificationsEnabled boolean NOT NULL DEFAULT true, preferredTheme varchar(16) DEFAULT 'system', updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, CONSTRAINT user_preferences_userId PRIMARY KEY (userId), CONSTRAINT user_preferences_userId_users_id_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS user_progress (id int AUTO_INCREMENT NOT NULL, userId int NOT NULL, devotionalId int NOT NULL, completed boolean NOT NULL DEFAULT false, startedAt timestamp NULL, completedAt timestamp NULL, CONSTRAINT user_progress_id PRIMARY KEY (id), CONSTRAINT user_progress_user_devotional_unique UNIQUE (userId, devotionalId), CONSTRAINT user_progress_userId_users_id_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT user_progress_devotionalId_devotionals_id_fk FOREIGN KEY (devotionalId) REFERENCES devotionals(id) ON DELETE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS user_streaks (userId int NOT NULL, currentStreak int NOT NULL DEFAULT 0, longestStreak int NOT NULL DEFAULT 0, lastCompletedDate timestamp NULL, updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, CONSTRAINT user_streaks_userId PRIMARY KEY (userId), CONSTRAINT user_streaks_userId_users_id_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS achievements (id int AUTO_INCREMENT NOT NULL, name varchar(120) NOT NULL, description text NOT NULL, icon varchar(32) NOT NULL, requirementType varchar(32) NOT NULL, requirementValue int NOT NULL, createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT achievements_id PRIMARY KEY (id), CONSTRAINT achievements_name_unique UNIQUE (name))`,
  `CREATE TABLE IF NOT EXISTS user_achievements (id int AUTO_INCREMENT NOT NULL, userId int NOT NULL, achievementId int NOT NULL, unlockedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT user_achievements_id PRIMARY KEY (id), CONSTRAINT user_achievements_user_achievement_unique UNIQUE (userId, achievementId), CONSTRAINT user_achievements_userId_users_id_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT user_achievements_achievementId_achievements_id_fk FOREIGN KEY (achievementId) REFERENCES achievements(id) ON DELETE CASCADE)`,
  `ALTER TABLE users MODIFY COLUMN role varchar(16) NOT NULL DEFAULT 'user'`,
];

try {
  for (const statement of statements) {
    try { await connection.query(statement); } catch (error) {
      const message = String(error);
      if (!message.includes("Duplicate column") && !message.includes("already exists")) throw error;
    }
  }
  try { await connection.query("ALTER TABLE users ADD COLUMN avatarUrl varchar(500) NULL"); } catch (error) { if (!String(error).includes("Duplicate column") && !String(error).includes("already exists")) throw error; }

  const rows = devotionals.map(item => [item.dayNumber, item.month, item.journey, item.title, item.theme, item.bibleReference, item.bibleTranslation, item.catalogRevision, item.bibleText, item.reflection, JSON.stringify(item.practicalActions), item.dailyQuestion, item.prayer, item.published ? 1 : 0]);
  await connection.query(`INSERT INTO devotionals (dayNumber, month, journey, title, theme, bibleReference, bibleTranslation, catalogRevision, bibleText, reflection, practicalActions, dailyQuestion, prayer, published) VALUES ? ON DUPLICATE KEY UPDATE month=VALUES(month), journey=VALUES(journey), title=VALUES(title), theme=VALUES(theme), bibleReference=VALUES(bibleReference), bibleTranslation=VALUES(bibleTranslation), catalogRevision=VALUES(catalogRevision), bibleText=VALUES(bibleText), reflection=VALUES(reflection), practicalActions=VALUES(practicalActions), dailyQuestion=VALUES(dailyQuestion), prayer=VALUES(prayer), published=VALUES(published)`, [rows]);
  const achievementRows = [
    ["Primeiro Minuto", "Concluiu o primeiro devocional.", "trophy", "completed", 1],
    ["Uma Semana", "Construiu sete dias consecutivos de constância.", "flame", "streak", 7],
    ["Constância", "Alcançou trinta dias consecutivos.", "star", "streak", 30],
    ["Metade do Caminho", "Percorreu 182 dias da jornada.", "medal", "completed", 182],
    ["Um Ano de Propósito", "Concluiu os 365 dias da jornada.", "crown", "completed", 365],
  ];
  await connection.query(`INSERT INTO achievements (name, description, icon, requirementType, requirementValue) VALUES ? ON DUPLICATE KEY UPDATE description=VALUES(description), icon=VALUES(icon), requirementType=VALUES(requirementType), requirementValue=VALUES(requirementValue)`, [achievementRows]);
  console.log(`Database ready: ${rows.length} devotionals and ${achievementRows.length} achievements synchronized.`);
} finally { await connection.end(); }
