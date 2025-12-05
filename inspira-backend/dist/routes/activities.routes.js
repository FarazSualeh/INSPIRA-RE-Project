"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activities_controller_1 = require("../controllers/activities.controller");
const router = (0, express_1.Router)();
// Get activities (optionally filtered by grade/subject)
router.get("/", (req, res) => activities_controller_1.activitiesController.getActivities(req, res));
// Create a new activity
router.post("/", (req, res) => activities_controller_1.activitiesController.createActivity(req, res));
// Update an existing activity
router.patch("/:id", (req, res) => activities_controller_1.activitiesController.updateActivity(req, res));
// Delete an activity
router.delete("/:id", (req, res) => activities_controller_1.activitiesController.deleteActivity(req, res));
exports.default = router;
