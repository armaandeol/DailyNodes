import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all activities
  app.get("/api/activities", async (_req, res) => {
    const activities = await storage.getActivities();
    res.json(activities);
  });

  // Get activities for a specific date
  app.get("/api/activities/:date", async (req, res) => {
    const activities = await storage.getActivitiesByDate(req.params.date);
    res.json(activities);
  });

  // Create new activity
  app.post("/api/activities", async (req, res) => {
    const parsed = insertActivitySchema.parse(req.body);
    const activity = await storage.createActivity(parsed);
    res.json(activity);
  });

  const httpServer = createServer(app);
  return httpServer;
}
