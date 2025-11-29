import { Router } from "express";
import {
  getAssignmentsForGrade,
  createAssignment,
  deleteAssignment,
  markAssignmentAsViewed,
} from "../controllers/assignments.controller";

const router = Router();

// Get assignments for a grade
router.get("/grade/:grade", getAssignmentsForGrade);

// Teacher creates an assignment/notice
router.post("/", createAssignment);

// Delete an assignment
router.delete("/:assignmentId", deleteAssignment);

// Mark assignment as viewed by a student
router.post("/:assignmentId/view", markAssignmentAsViewed);

export default router;
