"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
exports.authController = {
    signUp: async (req, res) => {
        const { email, password, name, role, grade } = req.body;
        try {
            const result = await auth_service_1.authService.signUp(email, password, {
                name,
                role,
                grade,
            });
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            return res.status(201).json({ user: result.user });
        }
        catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },
    signIn: async (req, res) => {
        const { email, password, selectedRole, selectedGrade } = req.body;
        try {
            const result = await auth_service_1.authService.signIn(email, password, selectedRole, selectedGrade);
            if (result.error) {
                return res.status(401).json({ error: result.error });
            }
            return res
                .status(200)
                .json({ user: result.user, profile: result.profile });
        }
        catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },
    signOut: async (req, res) => {
        try {
            const result = await auth_service_1.authService.signOut();
            if (result?.error) {
                return res.status(400).json({ error: result.error });
            }
            // Frontend expects 204
            return res.status(204).send();
        }
        catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },
    getSession: async (req, res) => {
        try {
            const result = await auth_service_1.authService.getSession();
            if (result?.error) {
                return res.status(400).json({ error: result.error });
            }
            return res.status(200).json({ session: result.session });
        }
        catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },
    getUserProfile: async (req, res) => {
        const { userId } = req.params;
        try {
            const result = await auth_service_1.authService.getUserProfile(userId);
            if (result.error) {
                return res.status(404).json({ error: result.error });
            }
            return res.status(200).json({ profile: result.profile });
        }
        catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },
};
