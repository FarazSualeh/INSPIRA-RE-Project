"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomId = exports.validateEmail = exports.formatError = exports.formatResponse = void 0;
// src/utils/helpers.ts
const formatResponse = (data, message = 'Success') => {
    return {
        status: 'success',
        message,
        data,
    };
};
exports.formatResponse = formatResponse;
const formatError = (error, message = 'An error occurred') => {
    return {
        status: 'error',
        message,
        error: error instanceof Error ? error.message : error,
    };
};
exports.formatError = formatError;
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
exports.validateEmail = validateEmail;
const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
};
exports.generateRandomId = generateRandomId;
