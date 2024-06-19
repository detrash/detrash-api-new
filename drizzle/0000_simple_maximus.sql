CREATE TABLE IF NOT EXISTS "todo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" varchar NOT NULL,
	"isCompleted" boolean DEFAULT false NOT NULL,
	"createdAt" time DEFAULT now() NOT NULL
);
