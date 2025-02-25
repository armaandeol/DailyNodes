CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"note" text,
	"photo_url" text
);
