import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Activity service functions
export const activityService = {
  /**
   * Get available activities for a specific grade and subject
   */
  getActivities: async (grade: string, subject?: string) => {
    const activities = await prisma.activity.findMany({
      where: {
        grade_level: grade,
        ...(subject && { subject }),
      },
    });
    return activities;
  },

  /**
   * Create a new activity
   */
  createActivity: async (activityData: {
    subject: string;
    title: string;
    description?: string;
    grade_level: string;
    activity_type: string;
    difficulty: string;
    points_reward: number;
    estimated_time_minutes?: number;
    content: any;
  }) => {
    const newActivity = await prisma.activity.create({
      data: activityData,
    });
    return newActivity;
  },

  /**
   * Update an existing activity
   */
  updateActivity: async (activityId: string, updates: any) => {
    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: updates,
    });
    return updatedActivity;
  },

  /**
   * Delete an activity
   */
  deleteActivity: async (activityId: string) => {
    await prisma.activity.delete({
      where: { id: activityId },
    });
  },
};

export default activityService;