"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAssignmentAsViewed = exports.deleteAssignment = exports.createAssignment = exports.getAssignmentsForGrade = void 0;
const assignment_service_1 = require("../services/assignment.service");
const getErrorMessage = (error) => error instanceof Error ? error.message : "Internal server error";
const getAssignmentsForGrade = async (req, res) => {
    const { grade } = req.params;
    try {
        const assignments = await assignment_service_1.assignmentService.getAssignmentsForGrade(grade);
        res.status(200).json({ assignments });
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
};
exports.getAssignmentsForGrade = getAssignmentsForGrade;
const createAssignment = async (req, res) => {
    const assignmentData = req.body;
    try {
        const assignment = await assignment_service_1.assignmentService.createAssignment(assignmentData);
        res.status(201).json({ assignment });
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
};
exports.createAssignment = createAssignment;
const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    try {
        await assignment_service_1.assignmentService.deleteAssignment(assignmentId);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
};
exports.deleteAssignment = deleteAssignment;
const markAssignmentAsViewed = async (req, res) => {
    const { assignmentId } = req.params;
    const { studentId } = req.body;
    try {
        await assignment_service_1.assignmentService.markAsViewed(assignmentId, studentId);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
};
exports.markAssignmentAsViewed = markAssignmentAsViewed;
