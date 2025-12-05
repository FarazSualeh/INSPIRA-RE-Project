"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Activity service functions
exports.activityService = {
    /**
     * Get available activities for a specific grade and subject
     */
    getActivities: async (grade, subject) => {
        const activities = await prisma.activity.findMany({
            where: {
                gradeLevel: grade,
                ...(subject && { subject }),
            },
        });
        return activities;
    },
    /**
     * Create a new activity
     */
    createActivity: async (activityData) => {
        const newActivity = await prisma.activity.create({
            data: {
                subject: activityData.subject,
                title: activityData.title,
                description: activityData.description,
                gradeLevel: activityData.grade_level,
                activityType: activityData.activity_type,
                difficulty: activityData.difficulty,
                pointsReward: activityData.points_reward,
                estimatedTimeMinutes: activityData.estimated_time_minutes,
                contentJson: activityData.content,
            },
        });
        return newActivity;
    },
    /**
     * Update an existing activity
     */
    updateActivity: async (activityId, updates) => {
        const updatedActivity = await prisma.activity.update({
            where: { id: Number(activityId) },
            data: updates,
        });
        return updatedActivity;
    },
    /**
     * Delete an activity
     */
    deleteActivity: async (activityId) => {
        await prisma.activity.delete({
            where: { id: Number(activityId) },
        });
    },
};
exports.default = exports.activityService;
