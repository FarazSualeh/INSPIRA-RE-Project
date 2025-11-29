import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

export const assignmentService = {
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
      data: string; // Base64
    };
  }) => {
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
    } catch (error: unknown) {
      return { assignment: null, error: getErrorMessage(error) };
    }
  },

  getAssignmentsForGrade: async (grade: string) => {
    try {
      const assignments = await prisma.assignment.findMany({
        where: { targetGrade: grade },
        orderBy: { createdAt: "desc" },
      });
      return { assignments, error: null };
    } catch (error: unknown) {
      return { assignments: [], error: getErrorMessage(error) };
    }
  },

  getAssignmentById: async (assignmentId: string) => {
    try {
      const assignment = await prisma.assignment.findUnique({
        where: { id: Number(assignmentId) },
      });
      return { assignment, error: null };
    } catch (error: unknown) {
      return { assignment: null, error: getErrorMessage(error) };
    }
  },

  deleteAssignment: async (assignmentId: string) => {
    try {
      await prisma.assignment.delete({
        where: { id: Number(assignmentId) },
      });
      return { error: null };
    } catch (error: unknown) {
      return { error: getErrorMessage(error) };
    }
  },

  // For now, just a no-op marker; there is no viewedBy relation in the schema
  markAsViewed: async (assignmentId: string, _studentId: string) => {
    try {
      // In future you could add a separate table or JSON field to track views
      await prisma.assignment.update({
        where: { id: Number(assignmentId) },
        data: {}, // no structural change for now
      });
      return { error: null };
    } catch (error: unknown) {
      return { error: getErrorMessage(error) };
    }
  },
};
