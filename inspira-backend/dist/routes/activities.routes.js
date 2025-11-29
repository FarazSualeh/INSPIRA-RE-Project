"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activities_controller_1 = require("../controllers/activities.controller");
const router = (0, express_1.Router)();
// Get available activities for a specific grade and subject
router.get('/', activities_controller_1.activityController.getActivities);
// Create a new activity
router.post('/', activities_controller_1.activityController.createActivity);
// Update an existing activity
router.patch('/:id', activities_controller_1.activityController.updateActivity);
// Delete an activity
router.delete('/:id', activities_controller_1.activityController.deleteActivity);
exports.default = router;
