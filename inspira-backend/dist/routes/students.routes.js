"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const students_controller_1 = require("../controllers/students.controller");
const router = (0, express_1.Router)();
// Route to get student progress for all subjects
router.get("/:userId/progress", (req, res) => students_controller_1.studentsController.getProgress(req, res));
// Route to update student progress
router.patch("/:userId/progress/:subject", (req, res) => students_controller_1.studentsController.updateProgress(req, res));
// Route to get available activities for student's grade
router.get("/activities", (req, res) => students_controller_1.studentsController.getActivities(req, res));
// Route to submit quiz result
router.post("/quiz-results", (req, res) => students_controller_1.studentsController.submitQuizResult(req, res));
// Route to get student achievements
router.get("/:userId/achievements", (req, res) => students_controller_1.studentsController.getAchievements(req, res));
exports.default = router;
