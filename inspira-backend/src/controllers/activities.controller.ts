import { Request, Response } from "express";
import { activityService } from "../services/activity.service";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

export const activitiesController = {
  getActivities: async (req: Request, res: Response) => {
    const { grade, subject } = req.query;
    try {
      const activities = await activityService.getActivities(
        grade as string,
        subject as string
      );
      res.status(200).json({ activities });
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },

  createActivity: async (req: Request, res: Response) => {
    const activityData = req.body;
    try {
      const newActivity = await activityService.createActivity(activityData);
      res.status(201).json({ activity: newActivity });
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },

  updateActivity: async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const updatedActivity = await activityService.updateActivity(id, updates);
      res.status(200).json({ activity: updatedActivity });
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },

  deleteActivity: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await activityService.deleteActivity(id);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};
