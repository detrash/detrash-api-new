DO $$ BEGIN
 CREATE TYPE "public"."enum_reviewAnswer" AS ENUM('RED', 'GREEN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."enum_reviewStatus" AS ENUM('FINAL', 'RETRY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kycs" (
	"inspectionId" varchar PRIMARY KEY NOT NULL,
	"applicantId" varchar NOT NULL,
	"correlationId" varchar NOT NULL,
	"externalUserId" varchar NOT NULL,
	"levelName" varchar NOT NULL,
	"type" varchar NOT NULL,
	"reviewStatus" varchar NOT NULL,
	"moderationComment" text,
	"clientComment" text,
	"reviewAnswer" "enum_reviewAnswer" NOT NULL,
	"rejectLabels" varchar[],
	"reviewRejectType" "enum_reviewStatus",
	"createdAtMs" varchar NOT NULL
);
