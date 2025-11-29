import { Request, Response } from 'express';
import { activityService } from '../services/activity.service';

// Controller for handling activity-related requests
export const activitiesController = {
  // Get available activities for a specific grade
  getActivities: async (req: Request, res: Response) => {
    const { grade, subject } = req.query;

    try {
      const activities = await activityService.getActivities(grade as string, subject as string);
      res.status(200).json({ activities });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a new activity
  createActivity: async (req: Request, res: Response) => {
    const activityData = req.body;

    try {
      const newActivity = await activityService.createActivity(activityData);
      res.status(201).json({ activity: newActivity });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update an existing activity
  updateActivity: async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    try {
      const updatedActivity = await activityService.updateActivity(id, updates);
      res.status(200).json({ activity: updatedActivity });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete an activity
  deleteActivity: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await activityService.deleteActivity(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};