import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000', // Frontend URL
  // Add other allowed origins here
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

export const corsMiddleware = cors(corsOptions);