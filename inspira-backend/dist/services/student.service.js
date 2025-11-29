"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.studentService = {
    getProgress: async (userId) => {
        try {
            const progress = await prisma.studentProgress.findMany({
                where: { userId: Number(userId) },
            });
            return { progress, error: null };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch progress";
            return { progress: null, error: message };
        }
    },
    updateProgress: async (userId, subject, updates) => {
        try {
            const updatedProgress = await prisma.studentProgress.updateMany({
                where: {
                    userId: Number(userId),
                    subject,
                },
                data: updates,
            });
            return { progress: updatedProgress, error: null };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update progress";
            return { progress: null, error: message };
        }
    },
    getActivities: async (grade, subject) => {
        try {
            const activities = await prisma.activity.findMany({
                where: {
                    gradeLevel: grade,
                    ...(subject && { subject }),
                },
            });
            return { activities, error: null };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch activities";
            return { activities: [], error: message };
        }
    },
    submitQuizResult: async (result) => {
        try {
            const quizResult = await prisma.quizResult.create({
                data: {
                    user: { connect: { id: Number(result.user_id) } },
                    activity: { connect: { id: Number(result.activity_id) } },
                    score: result.score,
                    maxScore: result.max_score,
                    timeTakenSeconds: result.time_taken_seconds ?? null,
                    answersJson: JSON.stringify(result.answers ?? {}),
                    pointsEarned: result.points_earned,
                },
            });
            return { result: quizResult, error: null };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to submit quiz result";
            return { result: null, error: message };
        }
    },
    getAchievements: async (userId) => {
        try {
            const achievements = await prisma.achievement.findMany({
                where: { userId: Number(userId) },
            });
            return { achievements, error: null };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch achievements";
            return { achievements: [], error: message };
        }
    },
};
