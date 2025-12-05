"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getErrorMessage = (error) => error instanceof Error ? error.message : "Internal server error";
exports.assignmentService = {
    createAssignment: async (assignmentData) => {
        try {
            const assignment = await prisma.assignment.create({
                data: {
                    teacherId: Number(assignmentData.teacherId),
                    title: assignmentData.title,
                    type: assignmentData.type,
                    subject: assignmentData.subject,
                    targetGrade: assignmentData.targetGrade,
                    content: assignmentData.content,
                    attachment: assignmentData.attachment
                        ? JSON.stringify(assignmentData.attachment)
                        : null,
                },
            });
            return { assignment, error: null };
        }
        catch (error) {
            return { assignment: null, error: getErrorMessage(error) };
        }
    },
    getAssignmentsForGrade: async (grade) => {
        try {
            const assignments = await prisma.assignment.findMany({
                where: { targetGrade: grade },
                orderBy: { createdAt: "desc" },
            });
            return { assignments, error: null };
        }
        catch (error) {
            return { assignments: [], error: getErrorMessage(error) };
        }
    },
    getAssignmentById: async (assignmentId) => {
        try {
            const assignment = await prisma.assignment.findUnique({
                where: { id: Number(assignmentId) },
            });
            return { assignment, error: null };
        }
        catch (error) {
            return { assignment: null, error: getErrorMessage(error) };
        }
    },
    deleteAssignment: async (assignmentId) => {
        try {
            await prisma.assignment.delete({
                where: { id: Number(assignmentId) },
            });
            return { error: null };
        }
        catch (error) {
            return { error: getErrorMessage(error) };
        }
    },
    // For now, just a no-op marker; there is no viewedBy relation in the schema
    markAsViewed: async (assignmentId, _studentId) => {
        try {
            // In future you could add a separate table or JSON field to track views
            await prisma.assignment.update({
                where: { id: Number(assignmentId) },
                data: {}, // no structural change for now
            });
            return { error: null };
        }
        catch (error) {
            return { error: getErrorMessage(error) };
        }
    },
};
