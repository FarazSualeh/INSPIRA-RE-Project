"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teachers_controller_1 = require("../controllers/teachers.controller");
const router = (0, express_1.Router)();
// Get all classes for a teacher
router.get('/:teacherId/classes', teachers_controller_1.getClasses);
// Create a new class
router.post('/classes', teachers_controller_1.createClass);
// Get students in a class
router.get('/classes/:classId/students', teachers_controller_1.getClassStudents);
// Get analytics for all students in teacher's classes
router.get('/:teacherId/analytics', teachers_controller_1.getClassAnalytics);
// Create assignment or notice for students
router.post('/assignments', teachers_controller_1.createAssignment);
// Get all assignments created by teacher
router.get('/:teacherId/assignments', teachers_controller_1.getTeacherAssignments);
// Delete an assignment
router.delete('/assignments/:assignmentId', teachers_controller_1.deleteAssignment);
exports.default = router;
