import { Router } from 'express';
import {
  createAssignment,
  getAssignmentsForGrade,
  getTeacherAssignments,
  deleteAssignment,
  markAsViewed,
} from '../controllers/assignments.controller';

const router = Router();

// Route to create a new assignment
router.post('/', createAssignment);

// Route to get assignments for a specific grade
router.get('/grade/:grade', getAssignmentsForGrade);

// Route to get all assignments created by a teacher
router.get('/teacher/:teacherId', getTeacherAssignments);

// Route to delete an assignment
router.delete('/:assignmentId/teacher/:teacherId', deleteAssignment);

// Route to mark an assignment as viewed by a student
router.post('/:assignmentId/view', markAsViewed);

export default router;