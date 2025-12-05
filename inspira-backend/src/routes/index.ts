import { Express } from 'express';
import activitiesRoutes from './activities.routes';
import assignmentsRoutes from './assignments.routes';
import authRoutes from './auth.routes';
import studentsRoutes from './students.routes';
import teachersRoutes from './teachers.routes';

const setupRoutes = (app: Express) => {
  app.use('/activities', activitiesRoutes);
  app.use('/assignments', assignmentsRoutes);
  app.use('/auth', authRoutes);
  app.use('/students', studentsRoutes);
  app.use('/teachers', teachersRoutes);
};

export default setupRoutes;
