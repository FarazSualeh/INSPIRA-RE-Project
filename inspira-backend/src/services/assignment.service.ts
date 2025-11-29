import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const assignmentService = {
  createAssignment: async (assignmentData) => {
    try {
      const assignment = await prisma.assignment.create({
        data: assignmentData,
      });
      return { assignment, error: null };
    } catch (error) {
      return { assignment: null, error: error.message };
    }
  },

  getAssignmentsForGrade: async (grade) => {
    try {
      const assignments = await prisma.assignment.findMany({
        where: { target_grade: grade },
      });
      return { assignments, error: null };
    } catch (error) {
      return { assignments: [], error: error.message };
    }
  },

  getAssignmentById: async (assignmentId) => {
    try {
      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
      });
      return { assignment, error: null };
    } catch (error) {
      return { assignment: null, error: error.message };
    }
  },

  deleteAssignment: async (assignmentId) => {
    try {
      await prisma.assignment.delete({
        where: { id: assignmentId },
      });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  markAsViewed: async (assignmentId, studentId) => {
    try {
      await prisma.assignment.update({
        where: { id: assignmentId },
        data: {
          viewedBy: {
            connect: { id: studentId },
          },
        },
      });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
};