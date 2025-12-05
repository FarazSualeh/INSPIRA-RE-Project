import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Get user by ID (numeric)
export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export const authService = {
  // Sign up
  signUp: async (
    email: string,
    password: string,
    userData: { name: string; role: "student" | "teacher"; grade?: string }
  ) => {
    try {
      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        return { user: null, error: "Email already registered" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role,
          grade: userData.grade || null,
        },
      });

      return { user, error: null };
    } catch (err) {
      return { user: null, error: "Failed to create user" };
    }
  },

  // Sign in
  signIn: async (
    email: string,
    password: string,
    selectedRole?: "student" | "teacher",
    selectedGrade?: string
  ) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return { user: null, profile: null, error: "Invalid credentials" };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { user: null, profile: null, error: "Invalid credentials" };
      }

      // Optional role/grade override for frontend logic convenience
      const profile = {
        ...user,
        role: selectedRole || user.role,
        grade:
          (selectedRole || user.role) === "student"
            ? selectedGrade || user.grade
            : null,
      };

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return { user: { ...user, token }, profile, error: null };
    } catch (err) {
      return { user: null, profile: null, error: "Login failed" };
    }
  },

  // Sign out
  signOut: async () => {
    return { error: null };
  },

  // Placeholder session method
  getSession: async () => {
    return { session: null, error: null };
  },

  // Get user profile
  getUserProfile: async (userId: string) => {
    try {
      const id = parseInt(userId, 10);

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return { profile: null, error: "User not found" };
      }

      return { profile: user, error: null };
    } catch (err) {
      return { profile: null, error: "Failed to fetch user" };
    }
  },
};