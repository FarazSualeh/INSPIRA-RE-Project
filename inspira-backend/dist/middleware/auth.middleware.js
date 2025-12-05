"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_service_1 = require("../services/auth.service");
const authMiddleware = async (req, res, next) => {
    try {
        const rawUserId = req.headers['x-user-id'];
        if (!rawUserId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }
        // Convert string → number
        const userId = parseInt(rawUserId, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        const user = await (0, auth_service_1.getUserById)(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user; // Now valid with express.d.ts included
        next();
    }
    catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.authMiddleware = authMiddleware;
