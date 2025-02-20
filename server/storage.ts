import { activities, type Activity, type InsertActivity } from "@shared/schema";

export interface IStorage {
  getActivities(): Promise<Activity[]>;
  getActivitiesByDate(date: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private activities: Map<number, Activity>;
  private currentId: number;

  constructor() {
    this.activities = new Map();
    this.currentId = 1;
  }

  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async getActivitiesByDate(date: string): Promise<Activity[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return Array.from(this.activities.values())
      .filter(activity => {
        const activityDate = activity.timestamp;
        return activityDate >= startOfDay && activityDate <= endOfDay;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = {
      id,
      timestamp: insertActivity.timestamp,
      note: insertActivity.note || null,
      photoUrl: insertActivity.photoUrl || null
    };
    this.activities.set(id, activity);
    return activity;
  }
}

export const storage = new MemStorage();