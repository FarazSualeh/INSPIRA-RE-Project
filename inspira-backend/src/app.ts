import express from 'express';
import cors from 'cors';
import { setupRoutes } from './routes';
import { errorHandler } from './middleware/error.middleware';
import { corsOptions } from './config/cors';

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Setup routes
setupRoutes(app);

// Error handling middleware
app.use(errorHandler);

export default app;