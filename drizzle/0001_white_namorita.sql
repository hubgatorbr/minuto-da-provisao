CREATE TABLE `devotionals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dayNumber` int NOT NULL,
	`month` varchar(32) NOT NULL,
	`journey` varchar(80) NOT NULL,
	`title` varchar(180) NOT NULL,
	`theme` varchar(100) NOT NULL,
	`bibleReference` varchar(120) NOT NULL,
	`bibleTranslation` varchar(32) NOT NULL DEFAULT 'NVI',
	`bibleText` text,
	`reflection` text NOT NULL,
	`practicalActions` json NOT NULL,
	`dailyQuestion` text NOT NULL,
	`prayer` text NOT NULL,
	`published` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `devotionals_id` PRIMARY KEY(`id`),
	CONSTRAINT `devotionals_day_number_unique` UNIQUE(`dayNumber`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`devotionalId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `favorites_user_devotional_unique` UNIQUE(`userId`,`devotionalId`)
);
--> statement-breakpoint
CREATE TABLE `journal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`devotionalId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journal_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `journal_entries_user_devotional_unique` UNIQUE(`userId`,`devotionalId`)
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`userId` int NOT NULL,
	`goal` varchar(240),
	`mainChallenge` varchar(100),
	`interestArea` varchar(100),
	`notificationTime` varchar(8) DEFAULT '07:00',
	`notificationsEnabled` boolean NOT NULL DEFAULT true,
	`preferredTheme` varchar(16) DEFAULT 'system',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_preferences_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `user_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`devotionalId` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`startedAt` timestamp,
	`completedAt` timestamp,
	CONSTRAINT `user_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_progress_user_devotional_unique` UNIQUE(`userId`,`devotionalId`)
);
--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_devotionalId_devotionals_id_fk` FOREIGN KEY (`devotionalId`) REFERENCES `devotionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD CONSTRAINT `journal_entries_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD CONSTRAINT `journal_entries_devotionalId_devotionals_id_fk` FOREIGN KEY (`devotionalId`) REFERENCES `devotionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_preferences` ADD CONSTRAINT `user_preferences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_progress` ADD CONSTRAINT `user_progress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_progress` ADD CONSTRAINT `user_progress_devotionalId_devotionals_id_fk` FOREIGN KEY (`devotionalId`) REFERENCES `devotionals`(`id`) ON DELETE cascade ON UPDATE no action;