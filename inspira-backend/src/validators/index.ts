// src/validators/index.ts
import { body, validationResult } from 'express-validator';

export const validateSignUp = [
  body('email').isEmail().withMessage('Please enter a valid email address.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('name').notEmpty().withMessage('Name is required.'),
  body('role').isIn(['student', 'teacher']).withMessage('Role must be either student or teacher.'),
  body('grade').optional().isString().withMessage('Grade must be a string.'),
];

export const validateSignIn = [
  body('email').isEmail().withMessage('Please enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

export const validateUpdateProgress = [
  body('subject').isIn(['math', 'science', 'technology', 'engineering']).withMessage('Subject must be one of the following: math, science, technology, engineering.'),
  body('activities_completed').isNumeric().withMessage('Activities completed must be a number.'),
  body('total_activities').isNumeric().withMessage('Total activities must be a number.'),
  body('points').isNumeric().withMessage('Points must be a number.'),
  body('badges').isArray().withMessage('Badges must be an array.'),
  body('current_level').isNumeric().withMessage('Current level must be a number.'),
];

export const validateCreateClass = [
  body('class_name').notEmpty().withMessage('Class name is required.'),
  body('grade').notEmpty().withMessage('Grade is required.'),
  body('subject').optional().isString().withMessage('Subject must be a string.'),
  body('description').optional().isString().withMessage('Description must be a string.'),
];

export const validateCreateAssignment = [
  body('title').notEmpty().withMessage('Title is required.'),
  body('type').isIn(['assignment', 'notice']).withMessage('Type must be either assignment or notice.'),
  body('subject').notEmpty().withMessage('Subject is required.'),
  body('target_grade').notEmpty().withMessage('Target grade is required.'),
  body('content').notEmpty().withMessage('Content is required.'),
]; 

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};