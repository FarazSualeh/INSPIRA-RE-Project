"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAssignmentAsViewed = exports.deleteAssignment = exports.createAssignment = exports.getAssignmentsForGrade = void 0;
const assignment_service_1 = require("../services/assignment.service");
const assignmentService = new assignment_service_1.AssignmentService();
const getAssignmentsForGrade = async (req, res) => {
    const { grade } = req.params;
    try {
        const assignments = await assignmentService.getAssignmentsForGrade(grade);
        res.status(200).json({ assignments });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAssignmentsForGrade = getAssignmentsForGrade;
const createAssignment = async (req, res) => {
    const assignmentData = req.body;
    try {
        const assignment = await assignmentService.createAssignment(assignmentData);
        res.status(201).json({ assignment });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createAssignment = createAssignment;
const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    try {
        await assignmentService.deleteAssignment(assignmentId);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteAssignment = deleteAssignment;
const markAssignmentAsViewed = async (req, res) => {
    const { assignmentId } = req.params;
    const { studentId } = req.body;
    try {
        await assignmentService.markAsViewed(assignmentId, studentId);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.markAssignmentAsViewed = markAssignmentAsViewed;
