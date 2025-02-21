import { activities, type Activity, type InsertActivity } from "@shared/schema";
import { db } from "./db";
import { desc, eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm"; // Add this import

export interface IStorage {
  getActivities(): Promise<Activity[]>;
  getActivitiesByDate(date: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity>;
}

export class DatabaseStorage implements IStorage {
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(desc(activities.timestamp));
  }

  async getActivitiesByDate(date: string): Promise<Activity[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db
      .select()
      .from(activities)
      .where(and(
        sql`${activities.timestamp} >= ${startOfDay.toISOString()}`,
        sql`${activities.timestamp} <= ${endOfDay.toISOString()}`
      ))
      .orderBy(desc(activities.timestamp));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity> {
    const [updatedActivity] = await db
      .update(activities)
      .set(activity)
      .where(eq(activities.id, id))
      .returning();
    return updatedActivity;
  }
}

export const storage = new DatabaseStorage();