import { Request, Response } from "express";
import { assignmentService } from "../services/assignment.service";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

export const getAssignmentsForGrade = async (req: Request, res: Response) => {
  const { grade } = req.params;

  try {
    const assignments = await assignmentService.getAssignmentsForGrade(grade);
    res.status(200).json({ assignments });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
};

export const createAssignment = async (req: Request, res: Response) => {
  const assignmentData = req.body;

  try {
    const assignment = await assignmentService.createAssignment(assignmentData);
    res.status(201).json({ assignment });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  const { assignmentId } = req.params;

  try {
    await assignmentService.deleteAssignment(assignmentId);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
};

export const markAssignmentAsViewed = async (
  req: Request,
  res: Response
) => {
  const { assignmentId } = req.params;
  const { studentId } = req.body;

  try {
    await assignmentService.markAsViewed(assignmentId, studentId);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
};
