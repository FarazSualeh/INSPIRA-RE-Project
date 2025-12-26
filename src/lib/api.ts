/**
 * REST API Client Configuration
 * Works with Python Django + MongoDB backend
 */

const apiBaseUrl =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000/api";
const apiKey = import.meta.env?.VITE_API_KEY || "";

// API is configured if we have a base URL (always true with Django backend)
// Demo mode is disabled - always connect to real backend
export const isApiConfigured = !!apiBaseUrl;

// Backward compatibility alias
export const isSupabaseConfigured = isApiConfigured;

// Generic API caller
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(apiKey && { "X-API-Key": apiKey }),
    ...(options.headers || {}),
  };

  const base = apiBaseUrl.replace(/\/+$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const response = await fetch(`${base}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const text = await response.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "API request failed");
  }

  return data;
};

// Types (adapt as needed to your Prisma models)
export interface UserProfile {
  _id: string;
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher";
  grade: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentProgress {
  _id: string;
  user_id: string;
  subject: "math" | "science" | "technology" | "engineering";
  activities_completed: number;
  total_activities: number;
  points: number;
  badges: string[];
  current_level: number;
  created_at: string;
  updated_at: string;
}

export interface Class {
  _id: string;
  teacher_id: string;
  class_name: string;
  grade: string;
  subject: string | null;
  description: string | null;
  student_count: number;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  _id: string;
  subject: "math" | "science" | "technology" | "engineering";
  title: string;
  description: string | null;
  grade_level: string;
  activity_type: "quiz" | "game" | "challenge" | "experiment";
  difficulty: "easy" | "medium" | "hard";
  points_reward: number;
  estimated_time_minutes: number | null;
  content: any;
  created_at: string;
  updated_at: string;
}

export interface QuizResult {
  _id: string;
  user_id: string;
  activity_id: string;
  score: number;
  max_score: number;
  time_taken_seconds: number | null;
  answers: any;
  points_earned: number;
  completed_at: string;
}

export interface Achievement {
  _id: string;
  user_id: string;
  achievement_type: "badge" | "trophy" | "certificate" | "streak";
  achievement_name: string;
  achievement_icon: string | null;
  subject: string | null;
  earned_at: string;
}

// AUTH HELPERS (routes mounted at /auth)
export const authHelpers = {
  signUp: async (
    email: string,
    password: string,
    userData: {
      name: string;
      role: "student" | "teacher";
      grade?: string;
    }
  ) => {
    if (!isApiConfigured) {
      console.info(
        "ℹ️ Running in DEMO MODE - All data is temporary and stored locally."
      );
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        created_at: new Date().toISOString(),
      };
      return { user: mockUser, error: null };
    }

    try {
      const response = await apiCall("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          name: userData.name,
          role: userData.role,
          grade: userData.grade || null,
        }),
      });

      return { user: response.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  signIn: async (
    email: string,
    password: string,
    selectedRole?: "student" | "teacher",
    selectedGrade?: string
  ) => {
    if (!isApiConfigured) {
      if (!sessionStorage.getItem("demoModeLogged")) {
        console.info(
          "ℹ️ Running in DEMO MODE - All data is temporary and stored locally."
        );
        sessionStorage.setItem("demoModeLogged", "true");
      }

      if (email.includes("@") && password.length >= 4) {
        const mockProfile: UserProfile = {
          id: Math.random().toString(36).substr(2, 9),
          _id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split("@")[0],
          role: (selectedRole || "student") as "student" | "teacher",
          grade:
            selectedRole === "student" ? selectedGrade || "8" : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return {
          user: { id: mockProfile.id, email },
          profile: mockProfile,
          error: null,
        };
      } else {
        return {
          user: null,
          profile: null,
          error: "Invalid credentials",
        };
      }
    }

    try {
      const response = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          selectedRole,
          selectedGrade,
        }),
      });

      return {
        user: response.user,
        profile: response.profile,
        error: null,
      };
    } catch (error: any) {
      return {
        user: null,
        profile: null,
        error: error.message,
      };
    }
  },

  signOut: async () => {
    if (!isApiConfigured) {
      return { error: null };
    }
    try {
      await apiCall("/auth/logout", { method: "POST" });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  getSession: async () => {
    if (!isApiConfigured) {
      return { session: null, error: null };
    }
    try {
      const response = await apiCall("/auth/session", {
        method: "GET",
      });
      return { session: response.session, error: null };
    } catch (error: any) {
      return { session: null, error: error.message };
    }
  },

  getUserProfile: async (userId: string) => {
    if (!isApiConfigured) {
      return { profile: null, error: null };
    }
    try {
      const response = await apiCall(`/auth/profile/${userId}`, {
        method: "GET",
      });
      const profile = response.profile;
      return {
        profile: { ...profile, id: profile._id },
        error: null,
      };
    } catch (error: any) {
      return { profile: null, error: error.message };
    }
  },
};

// STUDENT HELPERS (routes mounted at /students)
export const studentHelpers = {
  getProgress: async (userId: string) => {
    if (!isApiConfigured) {
      return { progress: [], error: null };
    }
    try {
      const response = await apiCall(`/students/${userId}/progress`, {
        method: "GET",
      });
      return { progress: response.progress, error: null };
    } catch (error: any) {
      return { progress: [], error: error.message };
    }
  },

  updateProgress: async (
    userId: string,
    subject: string,
    updates: any
  ) => {
    if (!isApiConfigured) {
      return { progress: null, error: null };
    }
    try {
      const response = await apiCall(
        `/students/${userId}/progress/${subject}`,
        {
          method: "PATCH",
          body: JSON.stringify(updates),
        }
      );
      return { progress: response, error: null };
    } catch (error: any) {
      return { progress: null, error: error.message };
    }
  },

  getActivities: async (grade: string, subject?: string) => {
    if (!isApiConfigured) {
      return { activities: [], error: null };
    }
    try {
      const params = new URLSearchParams({ grade });
      if (subject) params.append("subject", subject);

      const response = await apiCall(
        `/students/activities?${params.toString()}`,
        { method: "GET" }
      );
      return { activities: response.activities, error: null };
    } catch (error: any) {
      return { activities: [], error: error.message };
    }
  },

  submitQuizResult: async (result: {
    user_id: string;
    activity_id: string;
    score: number;
    max_score: number;
    time_taken_seconds?: number;
    answers?: any;
    points_earned: number;
  }) => {
    if (!isApiConfigured) {
      return { result: null, error: null };
    }
    try {
      const response = await apiCall("/students/quiz-results", {
        method: "POST",
        body: JSON.stringify(result),
      });
      return { result: response, error: null };
    } catch (error: any) {
      return { result: null, error: error.message };
    }
  },

  getAchievements: async (userId: string) => {
    if (!isApiConfigured) {
      return { achievements: [], error: null };
    }
    try {
      const response = await apiCall(
        `/students/${userId}/achievements`,
        { method: "GET" }
      );
      return {
        achievements: response.achievements,
        error: null,
      };
    } catch (error: any) {
      return { achievements: [], error: error.message };
    }
  },
};

// TEACHER HELPERS (routes mounted at /teachers)
export const teacherHelpers = {
  getClasses: async (teacherId: string) => {
    if (!isApiConfigured) {
      return { classes: [], error: null };
    }
    try {
      const response = await apiCall(
        `/teachers/${teacherId}/classes`,
        { method: "GET" }
      );
      return { classes: response.classes, error: null };
    } catch (error: any) {
      return { classes: [], error: error.message };
    }
  },

  createClass: async (classData: {
    teacher_id: string;
    class_name: string;
    grade: string;
    subject?: string;
    description?: string;
  }) => {
    if (!isApiConfigured) {
      return { class: null, error: null };
    }
    try {
      const response = await apiCall("/teachers/classes", {
        method: "POST",
        body: JSON.stringify(classData),
      });
      return { class: response, error: null };
    } catch (error: any) {
      return { class: null, error: error.message };
    }
  },

  getClassStudents: async (classId: string) => {
    if (!isApiConfigured) {
      return { students: [], error: null };
    }
    try {
      const response = await apiCall(
        `/teachers/classes/${classId}/students`,
        { method: "GET" }
      );
      return { students: response.students, error: null };
    } catch (error: any) {
      return { students: [], error: error.message };
    }
  },

  getClassAnalytics: async (teacherId: string) => {
    if (!isApiConfigured) {
      return { analytics: null, error: null };
    }
    try {
      const response = await apiCall(
        `/teachers/${teacherId}/analytics`,
        { method: "GET" }
      );
      return { analytics: response.analytics, error: null };
    } catch (error: any) {
      return { analytics: null, error: error.message };
    }
  },

  createAssignment: async (assignmentData: {
    teacher_id: string;
    title: string;
    type: "assignment" | "notice";
    subject: string;
    target_grade: string;
    content: string;
    attachment?: {
      name: string;
      type: string;
      data: string;
    };
  }) => {
    if (!isApiConfigured) {
      const stored = localStorage.getItem("teacherAssignments");
      const assignments = stored ? JSON.parse(stored) : [];
      const newAssignment = {
        id: Math.random().toString(36).substr(2, 9),
        _id: Math.random().toString(36).substr(2, 9),
        ...assignmentData,
        teacherName: "Demo Teacher",
        createdAt: new Date().toISOString(),
      };
      assignments.push(newAssignment);
      localStorage.setItem(
        "teacherAssignments",
        JSON.stringify(assignments)
      );
      return { assignment: newAssignment, error: null };
    }

    try {
      const response = await apiCall("/teachers/assignments", {
        method: "POST",
        body: JSON.stringify(assignmentData),
      });
      return { assignment: response, error: null };
    } catch (error: any) {
      return { assignment: null, error: error.message };
    }
  },

  getTeacherAssignments: async (teacherId: string) => {
    if (!isApiConfigured) {
      const stored = localStorage.getItem("teacherAssignments");
      const assignments = stored ? JSON.parse(stored) : [];
      return { assignments, error: null };
    }

    try {
      const response = await apiCall(
        `/teachers/${teacherId}/assignments`,
        { method: "GET" }
      );
      return { assignments: response.assignments, error: null };
    } catch (error: any) {
      return { assignments: [], error: error.message };
    }
  },

  deleteAssignment: async (
    assignmentId: string,
    teacherId: string
  ) => {
    if (!isApiConfigured) {
      const stored = localStorage.getItem("teacherAssignments");
      const assignments = stored ? JSON.parse(stored) : [];
      const filtered = assignments.filter(
        (a: any) => a.id !== assignmentId && a._id !== assignmentId
      );
      localStorage.setItem(
        "teacherAssignments",
        JSON.stringify(filtered)
      );
      return { error: null };
    }

    try {
      await apiCall(`/teachers/assignments/${assignmentId}`, {
        method: "DELETE",
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};

// ASSIGNMENT HELPERS (routes mounted at /assignments)
export const assignmentHelpers = {
  getAssignmentsForGrade: async (grade: string) => {
    if (!isApiConfigured) {
      const stored = localStorage.getItem("teacherAssignments");
      const allAssignments = stored ? JSON.parse(stored) : [];
      const filtered = allAssignments.filter(
        (a: any) =>
          a.target_grade === grade || a.targetGrade === grade
      );
      return { assignments: filtered, error: null };
    }

    try {
      const response = await apiCall(
        `/assignments/grade/${encodeURIComponent(grade)}`,
        { method: "GET" }
      );
      return { assignments: response.assignments, error: null };
    } catch (error: any) {
      return { assignments: [], error: error.message };
    }
  },

  markAsViewed: async (
    assignmentId: string,
    studentId: string
  ) => {
    if (!isApiConfigured) {
      return { error: null };
    }

    try {
      await apiCall(`/assignments/${assignmentId}/view`, {
        method: "POST",
        body: JSON.stringify({ student_id: studentId }),
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};

// ACTIVITIES HELPERS (routes mounted at /activities)
export const activitiesHelpers = {
  getActivities: async (params: { grade?: string; subject?: string } = {}) => {
    if (!isApiConfigured) {
      return { activities: [], error: null };
    }
    try {
      const search = new URLSearchParams();
      if (params.grade) search.set("grade", params.grade);
      if (params.subject) search.set("subject", params.subject);

      const query = search.toString();
      const response = await apiCall(
        `/activities${query ? `?${query}` : ""}`,
        { method: "GET" }
      );
      return { activities: response.activities, error: null };
    } catch (error: any) {
      return { activities: [], error: error.message };
    }
  },

  createActivity: async (activity: any) => {
    if (!isApiConfigured) {
      return { activity: null, error: null };
    }
    try {
      const response = await apiCall("/activities", {
        method: "POST",
        body: JSON.stringify(activity),
      });
      return { activity: response, error: null };
    } catch (error: any) {
      return { activity: null, error: error.message };
    }
  },

  updateActivity: async (id: string, updates: any) => {
    if (!isApiConfigured) {
      return { activity: null, error: null };
    }
    try {
      const response = await apiCall(`/activities/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      return { activity: response, error: null };
    } catch (error: any) {
      return { activity: null, error: error.message };
    }
  },

  deleteActivity: async (id: string) => {
    if (!isApiConfigured) {
      return { error: null };
    }
    try {
      await apiCall(`/activities/${id}`, {
        method: "DELETE",
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};

export default {
  authHelpers,
  studentHelpers,
  teacherHelpers,
  assignmentHelpers,
  activitiesHelpers,
};
