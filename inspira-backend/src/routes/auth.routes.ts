import { Router, Request, Response } from "express";
import { authController } from "../controllers/auth.controller";

const router = Router();

// Sign up a new user
router.post("/signup", (req: Request, res: Response) =>
  authController.signUp(req, res)
);

// Sign in existing user
router.post("/login", (req: Request, res: Response) =>
  authController.signIn(req, res)
);

// Sign out current user
router.post("/logout", (req: Request, res: Response) =>
  authController.signOut(req, res)
);

// Get current session
router.get("/session", (req: Request, res: Response) =>
  authController.getSession(req, res)
);

// Get current user profile
router.get("/profile/:userId", (req: Request, res: Response) =>
  authController.getUserProfile(req, res)
);

export default router;
