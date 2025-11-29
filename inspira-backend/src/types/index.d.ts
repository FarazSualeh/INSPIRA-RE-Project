// src/types/index.d.ts
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher";
  grade?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProgress {
  userId: string;
  subject: "math" | "science" | "technology" | "engineering";
  activitiesCompleted: number;
  totalActivities: number;
  points: number;
  badges: string[];
  currentLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  teacherId: string;
  className: string;
  grade: string;
  subject?: string | null;
  description?: string | null;
  studentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  subject: "math" | "science" | "technology" | "engineering";
  title: string;
  description?: string | null;
  gradeLevel: string;
  activityType: "quiz" | "game" | "challenge" | "experiment";
  difficulty: "easy" | "medium" | "hard";
  pointsReward: number;
  estimatedTimeMinutes?: number | null;
  content: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizResult {
  id: string;
  userId: string;
  activityId: string;
  score: number;
  maxScore: number;
  timeTakenSeconds?: number | null;
  answers: any;
  pointsEarned: number;
  completedAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementType: "badge" | "trophy" | "certificate" | "streak";
  achievementName: string;
  achievementIcon?: string | null;
  subject?: string | null;
  earnedAt: Date;
}