import { Router } from 'express';
import {
  getClasses,
  createClass,
  getClassStudents,
  getClassAnalytics,
  createAssignment,
  getTeacherAssignments,
  deleteAssignment,
} from '../controllers/teachers.controller';

const router = Router();

// Get all classes for a teacher
router.get('/:teacherId/classes', getClasses);

// Create a new class
router.post('/classes', createClass);

// Get students in a class
router.get('/classes/:classId/students', getClassStudents);

// Get analytics for all students in teacher's classes
router.get('/:teacherId/analytics', getClassAnalytics);

// Create assignment or notice for students
router.post('/assignments', createAssignment);

// Get all assignments created by teacher
router.get('/:teacherId/assignments', getTeacherAssignments);

// Delete an assignment
router.delete('/assignments/:assignmentId', deleteAssignment);

export default router;