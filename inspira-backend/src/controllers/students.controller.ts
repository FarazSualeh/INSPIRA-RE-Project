import { Request, Response } from "express";
import { studentService } from "../services/student.service";

// Controller for handling student-related requests
export const studentsController = {
  // Get student progress for all subjects
  getProgress: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
      const progress = await studentService.getProgress(userId);
      res.status(200).json({ progress });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  },

  // Update student progress
  updateProgress: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const subject = req.params.subject;
    const updates = req.body;
    try {
      const progress = await studentService.updateProgress(
        userId,
        subject,
        updates
      );
      res.status(200).json({ progress });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  },

  // Get available activities for student's grade
  getActivities: async (req: Request, res: Response) => {
    const { grade, subject } = req.query;
    try {
      const activities = await studentService.getActivities(
        grade as string,
        subject as string
      );
      res.status(200).json({ activities });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  },

  // Submit quiz result
  submitQuizResult: async (req: Request, res: Response) => {
    const result = req.body;
    try {
      const submittedResult =
        await studentService.submitQuizResult(result);
      res.status(201).json({ result: submittedResult });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  },

  // Get student achievements
  getAchievements: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
      const achievements = await studentService.getAchievements(userId);
      res.status(200).json({ achievements });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  },
};
