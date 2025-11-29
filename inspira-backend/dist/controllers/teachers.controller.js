"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssignment = exports.getTeacherAssignments = exports.createAssignment = exports.getClassAnalytics = exports.getClassStudents = exports.createClass = exports.getClasses = void 0;
const teacher_service_1 = require("../services/teacher.service");
// Get all classes for a teacher
const getClasses = async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
        const classes = await teacher_service_1.teacherService.getClasses(teacherId);
        res.status(200).json({ classes });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({ error: message });
    }
};
exports.getClasses = getClasses;
// Create a new class
const createClass = async (req, res) => {
    const classData = req.body;
    try {
        const newClass = await teacher_service_1.teacherService.createClass(classData);
        res.status(201).json({ class: newClass });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({ error: message });
    }
};
exports.createClass = createClass;
// Get students in a class
const getClassStudents = async (req, res) => {
    const classId = req.params.classId;
    try {
        const students = await teacher_service_1.teacherService.getClassStudents(classId);
        res.status(200).json({ students });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({ error: message });
    }
};
exports.getClassStudents = getClassStudents;
// Get analytics for all students in teacher's classes
const getClassAnalytics = async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
        const analytics = await teacher_service_1.teacherService.getClassAnalytics(teacherId);
        res.status(200).json({ analytics });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({ error: message });
    }
};
exports.getClassAnalytics = getClassAnalytics;
// Create assignment or notice for students
const createAssignment = async (req, res) => {
    const assignmentData = req.body;
    try {
        const assignment = await teacher_service_1.teacherService.createAssignment(assignmentData);
        res.status(201).json({ assignment });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({ error: message });
    }
};
exports.createAssignment = createAssignment;
// Get all assignments created by teacher
const getTeacherAssignments = async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
        const assignments = await teacher_service_1.teacherService.getTeacherAssignments(teacherId);
        res.status(200).json({ assignments });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({ error: message });
    }
};
exports.getTeacherAssignments = getTeacherAssignments;
// Delete an assignment
const deleteAssignment = async (req, res) => {
    const assignmentId = req.params.assignmentId;
    try {
        await teacher_service_1.teacherService.deleteAssignment(assignmentId);
        res.status(204).send();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({ error: message });
    }
};
exports.deleteAssignment = deleteAssignment;
