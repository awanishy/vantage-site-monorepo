import { Request, Response, NextFunction } from 'express';
import { APIError } from '@/utils/APIError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  console.error(err);
  if (err instanceof APIError) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
    return;
  }

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.message
      }
    });
    return;
  }

  // Handle duplicate key errors
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    res.status(400).json({
      error: {
        code: 'DUPLICATE_ERROR',
        message: 'Duplicate entry',
        details: err.message
      }
    });
    return;
  }

  // Default error
  console.error(err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};
