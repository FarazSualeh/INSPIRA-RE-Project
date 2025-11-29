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
                grade_level: grade,
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
            data: activityData,
        });
        return newActivity;
    },
    /**
     * Update an existing activity
     */
    updateActivity: async (activityId, updates) => {
        const updatedActivity = await prisma.activity.update({
            where: { id: activityId },
            data: updates,
        });
        return updatedActivity;
    },
    /**
     * Delete an activity
     */
    deleteActivity: async (activityId) => {
        await prisma.activity.delete({
            where: { id: activityId },
        });
    },
};
exports.default = exports.activityService;
