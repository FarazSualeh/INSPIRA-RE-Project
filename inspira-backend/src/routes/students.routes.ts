import { Router } from "express";
import { studentsController } from "../controllers/students.controller";

const router = Router();

// Route to get student progress for all subjects
router.get("/:userId/progress", (req, res) =>
  studentsController.getProgress(req, res)
);

// Route to update student progress
router.patch("/:userId/progress/:subject", (req, res) =>
  studentsController.updateProgress(req, res)
);

// Route to get available activities for student's grade
router.get("/activities", (req, res) =>
  studentsController.getActivities(req, res)
);

// Route to submit quiz result
router.post("/quiz-results", (req, res) =>
  studentsController.submitQuizResult(req, res)
);

// Route to get student achievements
router.get("/:userId/achievements", (req, res) =>
  studentsController.getAchievements(req, res)
);

export default router;
