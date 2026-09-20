CREATE TABLE `payment_audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`stripeEventId` varchar(120) NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`payload` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payment_audit_logs_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_audit_logs_stripeEventId_unique` UNIQUE(`stripeEventId`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planId` enum('free','starter','premium') NOT NULL DEFAULT 'free',
	`status` enum('active','trialing','past_due','canceled','incomplete','expired') NOT NULL DEFAULT 'trialing',
	`stripeCustomerId` varchar(120),
	`stripeSubscriptionId` varchar(120),
	`stripePriceId` varchar(120),
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`trialStart` timestamp,
	`trialEnd` timestamp,
	`cancelAtPeriodEnd` boolean NOT NULL DEFAULT false,
	`canceledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_user_unique` UNIQUE(`userId`),
	CONSTRAINT `subscriptions_stripe_subscription_unique` UNIQUE(`stripeSubscriptionId`)
);
--> statement-breakpoint
CREATE TABLE `thematic_trail_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trailId` int NOT NULL,
	`devotionalId` int NOT NULL,
	`position` int NOT NULL,
	`trailIntro` text,
	`actionPrompt` text,
	`reviewQuestion` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `thematic_trail_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `thematic_trail_items_trail_position_unique` UNIQUE(`trailId`,`position`),
	CONSTRAINT `thematic_trail_items_trail_devotional_unique` UNIQUE(`trailId`,`devotionalId`)
);
--> statement-breakpoint
CREATE TABLE `thematic_trails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(180) NOT NULL,
	`subtitle` varchar(240) NOT NULL,
	`description` text NOT NULL,
	`challenge` varchar(120) NOT NULL,
	`durationDays` int NOT NULL,
	`accessLevel` enum('free','premium') NOT NULL DEFAULT 'free',
	`coverColor` varchar(32) NOT NULL DEFAULT '#102a43',
	`published` boolean NOT NULL DEFAULT true,
	`catalogRevision` varchar(32) NOT NULL DEFAULT 'editorial-v4.5',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `thematic_trails_id` PRIMARY KEY(`id`),
	CONSTRAINT `thematic_trails_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `user_trail_item_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userTrailProgressId` int NOT NULL,
	`trailItemId` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`journalContent` text,
	CONSTRAINT `user_trail_item_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_trail_item_progress_progress_item_unique` UNIQUE(`userTrailProgressId`,`trailItemId`)
);
--> statement-breakpoint
CREATE TABLE `user_trail_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trailId` int NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`lastPosition` int NOT NULL DEFAULT 1,
	`status` enum('active','completed','paused') NOT NULL DEFAULT 'active',
	CONSTRAINT `user_trail_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_trail_progress_user_trail_unique` UNIQUE(`userId`,`trailId`)
);
--> statement-breakpoint
ALTER TABLE `payment_audit_logs` ADD CONSTRAINT `payment_audit_logs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `thematic_trail_items` ADD CONSTRAINT `thematic_trail_items_trailId_thematic_trails_id_fk` FOREIGN KEY (`trailId`) REFERENCES `thematic_trails`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `thematic_trail_items` ADD CONSTRAINT `thematic_trail_items_devotionalId_devotionals_id_fk` FOREIGN KEY (`devotionalId`) REFERENCES `devotionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_trail_item_progress` ADD CONSTRAINT `user_trail_item_progress_userTrailProgressId_user_trail_progress_id_fk` FOREIGN KEY (`userTrailProgressId`) REFERENCES `user_trail_progress`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_trail_item_progress` ADD CONSTRAINT `user_trail_item_progress_trailItemId_thematic_trail_items_id_fk` FOREIGN KEY (`trailItemId`) REFERENCES `thematic_trail_items`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_trail_progress` ADD CONSTRAINT `user_trail_progress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_trail_progress` ADD CONSTRAINT `user_trail_progress_trailId_thematic_trails_id_fk` FOREIGN KEY (`trailId`) REFERENCES `thematic_trails`(`id`) ON DELETE cascade ON UPDATE no action;