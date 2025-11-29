// src/utils/helpers.ts
export const formatResponse = (data: any, message: string = 'Success') => {
  return {
    status: 'success',
    message,
    data,
  };
};

export const formatError = (error: any, message: string = 'An error occurred') => {
  return {
    status: 'error',
    message,
    error: error instanceof Error ? error.message : error,
  };
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};