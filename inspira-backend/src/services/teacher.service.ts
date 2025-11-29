import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Teacher service functions
export const teacherService = {
  // Get all classes for a teacher
  getClasses: async (teacherId: string) => {
    return await prisma.class.findMany({
      where: { teacherId: Number(teacherId) },
    });
  },

  // Create a new class
  createClass: async (classData: {
    teacherId: string;
    className: string;
    grade: string;
    subject?: string;
    description?: string;
  }) => {
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
  getClassStudents: async (_classId: string) => {
    return [];
  },

  // Get analytics for all students in teacher's classes (placeholder)
  getClassAnalytics: async (_teacherId: string) => {
    return null;
  },

  // Create assignment or notice for students
  createAssignment: async (assignmentData: {
    teacherId: string;
    title: string;
    type: "assignment" | "notice";
    subject: string;
    targetGrade: string;
    content: string;
    attachment?: {
      name: string;
      type: string;
      data: string; // Base64 encoded file data
    };
  }) => {
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
  getTeacherAssignments: async (teacherId: string) => {
    return await prisma.assignment.findMany({
      where: { teacherId: Number(teacherId) },
      orderBy: { createdAt: "desc" },
    });
  },

  // Delete an assignment
  deleteAssignment: async (assignmentId: string) => {
    return await prisma.assignment.delete({
      where: { id: Number(assignmentId) },
    });
  },
};