"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentsController = void 0;
const student_service_1 = require("../services/student.service");
// Controller for handling student-related requests
exports.studentsController = {
    // Get student progress for all subjects
    getProgress: async (req, res) => {
        const userId = req.params.userId;
        try {
            const progress = await student_service_1.studentService.getProgress(userId);
            res.status(200).json({ progress });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Update student progress
    updateProgress: async (req, res) => {
        const userId = req.params.userId;
        const subject = req.params.subject;
        const updates = req.body;
        try {
            const progress = await student_service_1.studentService.updateProgress(userId, subject, updates);
            res.status(200).json({ progress });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Get available activities for student's grade
    getActivities: async (req, res) => {
        const { grade, subject } = req.query;
        try {
            const activities = await student_service_1.studentService.getActivities(grade, subject);
            res.status(200).json({ activities });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Submit quiz result
    submitQuizResult: async (req, res) => {
        const result = req.body;
        try {
            const submittedResult = await student_service_1.studentService.submitQuizResult(result);
            res.status(201).json({ result: submittedResult });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Get student achievements
    getAchievements: async (req, res) => {
        const userId = req.params.userId;
        try {
            const achievements = await student_service_1.studentService.getAchievements(userId);
            res.status(200).json({ achievements });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
