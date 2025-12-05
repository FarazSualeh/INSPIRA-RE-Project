import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import { getUserById } from '../services/auth.service';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rawUserId = req.headers['x-user-id'] as string;

    if (!rawUserId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    // Convert string → number
    const userId = parseInt(rawUserId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Now valid with express.d.ts included
    next();

  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
