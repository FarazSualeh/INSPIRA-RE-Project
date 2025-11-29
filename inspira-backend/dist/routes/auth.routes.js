"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// Sign up a new user
router.post("/signup", (req, res) => auth_controller_1.authController.signUp(req, res));
// Sign in existing user
router.post("/login", (req, res) => auth_controller_1.authController.signIn(req, res));
// Sign out current user
router.post("/logout", (req, res) => auth_controller_1.authController.signOut(req, res));
// Get current session
router.get("/session", (req, res) => auth_controller_1.authController.getSession(req, res));
// Get current user profile
router.get("/profile/:userId", (req, res) => auth_controller_1.authController.getUserProfile(req, res));
exports.default = router;
