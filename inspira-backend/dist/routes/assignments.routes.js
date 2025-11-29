"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignments_controller_1 = require("../controllers/assignments.controller");
const router = (0, express_1.Router)();
// Route to create a new assignment
router.post('/', assignments_controller_1.createAssignment);
// Route to get assignments for a specific grade
router.get('/grade/:grade', assignments_controller_1.getAssignmentsForGrade);
// Route to get all assignments created by a teacher
router.get('/teacher/:teacherId', assignments_controller_1.getTeacherAssignments);
// Route to delete an assignment
router.delete('/:assignmentId/teacher/:teacherId', assignments_controller_1.deleteAssignment);
// Route to mark an assignment as viewed by a student
router.post('/:assignmentId/view', assignments_controller_1.markAsViewed);
exports.default = router;
