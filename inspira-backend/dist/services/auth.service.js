"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.getUserById = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// Get user by ID (numeric)
async function getUserById(id) {
    return client_1.default.user.findUnique({
        where: { id },
    });
}
exports.getUserById = getUserById;
exports.authService = {
    // Sign up
    signUp: async (email, password, userData) => {
        try {
            const existing = await client_1.default.user.findUnique({
                where: { email },
            });
            if (existing) {
                return { user: null, error: "Email already registered" };
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const user = await client_1.default.user.create({
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
    // Sign in
    signIn: async (email, password, selectedRole, selectedGrade) => {
        try {
            const user = await client_1.default.user.findUnique({ where: { email } });
            if (!user) {
                return { user: null, profile: null, error: "Invalid credentials" };
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return { user: null, profile: null, error: "Invalid credentials" };
            }
            // Optional role/grade override for frontend logic convenience
            const profile = {
                ...user,
                role: selectedRole || user.role,
                grade: (selectedRole || user.role) === "student"
                    ? selectedGrade || user.grade
                    : null,
            };
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
            return { user: { ...user, token }, profile, error: null };
        }
        catch (err) {
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
    getUserProfile: async (userId) => {
        try {
            const id = parseInt(userId, 10);
            const user = await client_1.default.user.findUnique({ where: { id } });
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
