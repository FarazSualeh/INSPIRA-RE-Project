"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignments_controller_1 = require("../controllers/assignments.controller");
const router = (0, express_1.Router)();
// Get assignments for a grade
router.get("/grade/:grade", assignments_controller_1.getAssignmentsForGrade);
// Teacher creates an assignment/notice
router.post("/", assignments_controller_1.createAssignment);
// Delete an assignment
router.delete("/:assignmentId", assignments_controller_1.deleteAssignment);
// Mark assignment as viewed by a student
router.post("/:assignmentId/view", assignments_controller_1.markAssignmentAsViewed);
exports.default = router;
