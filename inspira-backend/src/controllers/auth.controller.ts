// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  signUp: async (req: Request, res: Response) => {
    const { email, password, name, role, grade } = req.body;

    try {
      const result = await authService.signUp(email, password, {
        name,
        role,
        grade,
      });

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(201).json({ user: result.user });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  signIn: async (req: Request, res: Response) => {
    const { email, password, selectedRole, selectedGrade } = req.body;

    try {
      const result = await authService.signIn(
        email,
        password,
        selectedRole,
        selectedGrade
      );

      if (result.error) {
        return res.status(401).json({ error: result.error });
      }

      return res
        .status(200)
        .json({ user: result.user, profile: result.profile });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  signOut: async (req: Request, res: Response) => {
    try {
      const result = await authService.signOut();

      if (result?.error) {
        return res.status(400).json({ error: result.error });
      }

      // Frontend expects 204
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  getSession: async (req: Request, res: Response) => {
    try {
      const result = await authService.getSession();

      if (result?.error) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json({ session: result.session });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  getUserProfile: async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const result = await authService.getUserProfile(userId);

      if (result.error) {
        return res.status(404).json({ error: result.error });
      }

      return res.status(200).json({ profile: result.profile });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};