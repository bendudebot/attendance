import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 * Use after express-validator checks
 */
export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Async error handler wrapper
 * Catches errors and passes them to Express error handler
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Standard error response helper
 */
export const errorResponse = (res: Response, status: number, message: string) => {
  return res.status(status).json({ error: message });
};

/**
 * Not found error
 */
export const notFound = (res: Response, resource: string = 'Resource') => {
  return errorResponse(res, 404, `${resource} not found`);
};

/**
 * Access denied error
 */
export const accessDenied = (res: Response) => {
  return errorResponse(res, 403, 'Access denied');
};

/**
 * Check if user has access to a resource (class/student)
 */
export const hasAccess = (
  userRole: string,
  userId: string,
  resourceOwnerId: string
): boolean => {
  return userRole === 'ADMIN' || userId === resourceOwnerId;
};
