"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const students_controller_1 = require("../controllers/students.controller");
const router = (0, express_1.Router)();
// Route to get student progress for all subjects
router.get('/:userId/progress', students_controller_1.getProgress);
// Route to update student progress
router.patch('/:userId/progress/:subject', students_controller_1.updateProgress);
// Route to get available activities for student's grade
router.get('/activities', students_controller_1.getActivities);
// Route to submit quiz result
router.post('/quiz-results', students_controller_1.submitQuizResult);
// Route to get student achievements
router.get('/:userId/achievements', students_controller_1.getAchievements);
exports.default = router;
