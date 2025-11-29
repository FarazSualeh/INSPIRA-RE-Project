"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.validateCreateAssignment = exports.validateCreateClass = exports.validateUpdateProgress = exports.validateSignIn = exports.validateSignUp = void 0;
// src/validators/index.ts
const express_validator_1 = require("express-validator");
exports.validateSignUp = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address.'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required.'),
    (0, express_validator_1.body)('role').isIn(['student', 'teacher']).withMessage('Role must be either student or teacher.'),
    (0, express_validator_1.body)('grade').optional().isString().withMessage('Grade must be a string.'),
];
exports.validateSignIn = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address.'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required.'),
];
exports.validateUpdateProgress = [
    (0, express_validator_1.body)('subject').isIn(['math', 'science', 'technology', 'engineering']).withMessage('Subject must be one of the following: math, science, technology, engineering.'),
    (0, express_validator_1.body)('activities_completed').isNumeric().withMessage('Activities completed must be a number.'),
    (0, express_validator_1.body)('total_activities').isNumeric().withMessage('Total activities must be a number.'),
    (0, express_validator_1.body)('points').isNumeric().withMessage('Points must be a number.'),
    (0, express_validator_1.body)('badges').isArray().withMessage('Badges must be an array.'),
    (0, express_validator_1.body)('current_level').isNumeric().withMessage('Current level must be a number.'),
];
exports.validateCreateClass = [
    (0, express_validator_1.body)('class_name').notEmpty().withMessage('Class name is required.'),
    (0, express_validator_1.body)('grade').notEmpty().withMessage('Grade is required.'),
    (0, express_validator_1.body)('subject').optional().isString().withMessage('Subject must be a string.'),
    (0, express_validator_1.body)('description').optional().isString().withMessage('Description must be a string.'),
];
exports.validateCreateAssignment = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required.'),
    (0, express_validator_1.body)('type').isIn(['assignment', 'notice']).withMessage('Type must be either assignment or notice.'),
    (0, express_validator_1.body)('subject').notEmpty().withMessage('Subject is required.'),
    (0, express_validator_1.body)('target_grade').notEmpty().withMessage('Target grade is required.'),
    (0, express_validator_1.body)('content').notEmpty().withMessage('Content is required.'),
];
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validateRequest = validateRequest;
