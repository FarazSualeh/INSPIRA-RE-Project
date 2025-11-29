"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.studentService = {
    getProgress: async (userId) => {
        try {
            const progress = await prisma.studentProgress.findMany({
                where: { user_id: userId },
            });
            return { progress, error: null };
        }
        catch (error) {
            return { progress: null, error: error.message };
        }
    },
    updateProgress: async (userId, subject, updates) => {
        try {
            const updatedProgress = await prisma.studentProgress.update({
                where: {
                    user_id_subject: {
                        user_id: userId,
                        subject: subject,
                    },
                },
                data: updates,
            });
            return { progress: updatedProgress, error: null };
        }
        catch (error) {
            return { progress: null, error: error.message };
        }
    },
    getActivities: async (grade, subject) => {
        try {
            const activities = await prisma.activity.findMany({
                where: {
                    grade_level: grade,
                    ...(subject && { subject }),
                },
            });
            return { activities, error: null };
        }
        catch (error) {
            return { activities: [], error: error.message };
        }
    },
    submitQuizResult: async (result) => {
        try {
            const quizResult = await prisma.quizResult.create({
                data: result,
            });
            return { result: quizResult, error: null };
        }
        catch (error) {
            return { result: null, error: error.message };
        }
    },
    getAchievements: async (userId) => {
        try {
            const achievements = await prisma.achievement.findMany({
                where: { user_id: userId },
            });
            return { achievements, error: null };
        }
        catch (error) {
            return { achievements: [], error: error.message };
        }
    },
};
