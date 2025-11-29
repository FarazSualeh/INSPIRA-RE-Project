import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './students.routes';
import teacherRoutes from './teachers.routes';
import activityRoutes from './activities.routes';
import assignmentRoutes from './assignments.routes';

const router = Router();

// Set up routes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/activities', activityRoutes);
router.use('/assignments', assignmentRoutes);

export default router;