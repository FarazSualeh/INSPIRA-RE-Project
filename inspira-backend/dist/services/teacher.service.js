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
            where: { teacherId },
        });
    },
    // Create a new class
    createClass: async (classData) => {
        return await prisma.class.create({
            data: {
                teacherId: classData.teacherId,
                className: classData.className,
                grade: classData.grade,
                subject: classData.subject,
                description: classData.description,
            },
        });
    },
    // Get students in a class
    getClassStudents: async (classId) => {
        return await prisma.student.findMany({
            where: { classId },
        });
    },
    // Get analytics for all students in teacher's classes
    getClassAnalytics: async (teacherId) => {
        return await prisma.analytics.findMany({
            where: { teacherId },
        });
    },
    // Create assignment or notice for students
    createAssignment: async (assignmentData) => {
        return await prisma.assignment.create({
            data: {
                teacherId: assignmentData.teacherId,
                title: assignmentData.title,
                type: assignmentData.type,
                subject: assignmentData.subject,
                targetGrade: assignmentData.targetGrade,
                content: assignmentData.content,
                attachment: assignmentData.attachment,
            },
        });
    },
    // Get all assignments created by teacher
    getTeacherAssignments: async (teacherId) => {
        return await prisma.assignment.findMany({
            where: { teacherId },
        });
    },
    // Delete an assignment
    deleteAssignment: async (assignmentId) => {
        return await prisma.assignment.delete({
            where: { id: assignmentId },
        });
    },
};
