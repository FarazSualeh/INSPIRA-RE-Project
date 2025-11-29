"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Teacher service functions
exports.teacherService = {
    // Get all classes for a teacher
    getClasses: async (teacherId) => {
        return await prisma.class.findMany({
            where: { teacherId: Number(teacherId) },
        });
    },
    // Create a new class
    createClass: async (classData) => {
        return await prisma.class.create({
            data: {
                teacherId: Number(classData.teacherId),
                className: classData.className,
                grade: classData.grade,
                subject: classData.subject ?? null,
                description: classData.description ?? null,
                studentCount: 0,
            },
        });
    },
    // Get students in a class (placeholder)
    getClassStudents: async (_classId) => {
        return [];
    },
    // Get analytics for all students in teacher's classes (placeholder)
    getClassAnalytics: async (_teacherId) => {
        return null;
    },
    // Create assignment or notice for students
    createAssignment: async (assignmentData) => {
        return await prisma.assignment.create({
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
    },
    // Get all assignments created by teacher
    getTeacherAssignments: async (teacherId) => {
        return await prisma.assignment.findMany({
            where: { teacherId: Number(teacherId) },
            orderBy: { createdAt: "desc" },
        });
    },
    // Delete an assignment
    deleteAssignment: async (assignmentId) => {
        return await prisma.assignment.delete({
            where: { id: Number(assignmentId) },
        });
    },
};
