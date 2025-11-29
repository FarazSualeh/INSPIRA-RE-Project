import { Request, Response } from 'express';
import { AssignmentService } from '../services/assignment.service';

const assignmentService = new AssignmentService();

export const getAssignmentsForGrade = async (req: Request, res: Response) => {
  const { grade } = req.params;

  try {
    const assignments = await assignmentService.getAssignmentsForGrade(grade);
    res.status(200).json({ assignments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAssignment = async (req: Request, res: Response) => {
  const assignmentData = req.body;

  try {
    const assignment = await assignmentService.createAssignment(assignmentData);
    res.status(201).json({ assignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  const { assignmentId } = req.params;

  try {
    await assignmentService.deleteAssignment(assignmentId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAssignmentAsViewed = async (req: Request, res: Response) => {
  const { assignmentId } = req.params;
  const { studentId } = req.body;

  try {
    await assignmentService.markAsViewed(assignmentId, studentId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};