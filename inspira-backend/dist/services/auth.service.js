"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
exports.authService = {
    // Sign up: return { user, error }
    signUp: async (email, password, userData) => {
        try {
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                return { user: null, error: "Email already registered" };
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
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
        }
        catch (err) {
            return { user: null, error: "Failed to create user" };
        }
    },
    // Sign in: return { user, profile, error }
    signIn: async (email, password, selectedRole, selectedGrade) => {
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return { user: null, profile: null, error: "Invalid credentials" };
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return { user: null, profile: null, error: "Invalid credentials" };
            }
            // Optional role/grade override for frontend convenience
            const profile = {
                ...user,
                role: selectedRole || user.role,
                grade: (selectedRole || user.role) === "student"
                    ? selectedGrade || user.grade
                    : null,
            };
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
            // You can set token in cookies here via controller; here we just return it
            return { user: { ...user, token }, profile, error: null };
        }
        catch (err) {
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
    getUserProfile: async (userId) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: parseInt(userId, 10) } });
            if (!user) {
                return { profile: null, error: "User not found" };
            }
            return { profile: user, error: null };
        }
        catch (err) {
            return { profile: null, error: "Failed to fetch user" };
        }
    },
};
