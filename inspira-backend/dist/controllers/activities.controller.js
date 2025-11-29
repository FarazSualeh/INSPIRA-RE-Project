"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activitiesController = void 0;
const activity_service_1 = require("../services/activity.service");
// Controller for handling activity-related requests
exports.activitiesController = {
    // Get available activities for a specific grade
    getActivities: async (req, res) => {
        const { grade, subject } = req.query;
        try {
            const activities = await activity_service_1.activityService.getActivities(grade, subject);
            res.status(200).json({ activities });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Create a new activity
    createActivity: async (req, res) => {
        const activityData = req.body;
        try {
            const newActivity = await activity_service_1.activityService.createActivity(activityData);
            res.status(201).json({ activity: newActivity });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Update an existing activity
    updateActivity: async (req, res) => {
        const { id } = req.params;
        const updates = req.body;
        try {
            const updatedActivity = await activity_service_1.activityService.updateActivity(id, updates);
            res.status(200).json({ activity: updatedActivity });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Delete an activity
    deleteActivity: async (req, res) => {
        const { id } = req.params;
        try {
            await activity_service_1.activityService.deleteActivity(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
