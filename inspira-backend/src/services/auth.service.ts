import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const authService = {
  // Sign up: return { user, error }
  signUp: async (
    email: string,
    password: string,
    userData: { name: string; role: "student" | "teacher"; grade?: string }
  ) => {
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
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

  // Sign in: return { user, profile, error }
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

      // Optional role/grade override for frontend convenience
      const profile = {
        ...user,
        role: selectedRole || (user.role as "student" | "teacher"),
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

      // You can set token in cookies here via controller; here we just return it
      return { user: { ...user, token }, profile, error: null };
    } catch (err) {
      return { user: null, profile: null, error: "Login failed" };
    }
  },

  // Sign out: nothing to do server-side for stateless JWT; keep shape
  signOut: async () => {
    return { error: null };
  },

  // For now, a simple placeholder session method
  getSession: async () => {
    // You can decode JWT from headers/cookies in a real app
    return { session: null, error: null };
  },

  // Get user profile: return { profile, error }
  getUserProfile: async (userId: string) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: parseInt(userId, 10) } });
      if (!user) {
        return { profile: null, error: "User not found" };
      }
      return { profile: user, error: null };
    } catch (err) {
      return { profile: null, error: "Failed to fetch user" };
    }
  },
};