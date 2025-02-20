import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  note: text("note"),
  photoUrl: text("photo_url"),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  timestamp: true,
  note: true,
  photoUrl: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Group activities by day for the timeline
export type DayGroup = {
  date: string;
  activities: Activity[];
};
