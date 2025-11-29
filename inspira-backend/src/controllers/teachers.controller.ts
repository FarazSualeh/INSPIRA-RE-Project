import { Request, Response } from 'express';
import { teacherService } from '../services/teacher.service';

// Get all classes for a teacher
export const getClasses = async (req: Request, res: Response) => {
  const teacherId = req.params.teacherId;
  try {
    const classes = await teacherService.getClasses(teacherId);
    res.status(200).json({ classes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new class
export const createClass = async (req: Request, res: Response) => {
  const classData = req.body;
  try {
    const newClass = await teacherService.createClass(classData);
    res.status(201).json({ class: newClass });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get students in a class
export const getClassStudents = async (req: Request, res: Response) => {
  const classId = req.params.classId;
  try {
    const students = await teacherService.getClassStudents(classId);
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics for all students in teacher's classes
export const getClassAnalytics = async (req: Request, res: Response) => {
  const teacherId = req.params.teacherId;
  try {
    const analytics = await teacherService.getClassAnalytics(teacherId);
    res.status(200).json({ analytics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create assignment or notice for students
export const createAssignment = async (req: Request, res: Response) => {
  const assignmentData = req.body;
  try {
    const assignment = await teacherService.createAssignment(assignmentData);
    res.status(201).json({ assignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all assignments created by teacher
export const getTeacherAssignments = async (req: Request, res: Response) => {
  const teacherId = req.params.teacherId;
  try {
    const assignments = await teacherService.getTeacherAssignments(teacherId);
    res.status(200).json({ assignments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an assignment
export const deleteAssignment = async (req: Request, res: Response) => {
  const assignmentId = req.params.assignmentId;
  const teacherId = req.params.teacherId;
  try {
    await teacherService.deleteAssignment(assignmentId, teacherId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};