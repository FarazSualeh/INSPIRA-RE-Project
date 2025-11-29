import { Router } from "express";
import { activitiesController } from "../controllers/activities.controller";

const router = Router();

// Get activities (optionally filtered by grade/subject)
router.get("/", (req, res) =>
  activitiesController.getActivities(req, res)
);

// Create a new activity
router.post("/", (req, res) =>
  activitiesController.createActivity(req, res)
);

// Update an existing activity
router.patch("/:id", (req, res) =>
  activitiesController.updateActivity(req, res)
);

// Delete an activity
router.delete("/:id", (req, res) =>
  activitiesController.deleteActivity(req, res)
);

export default router;
