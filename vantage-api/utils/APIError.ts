// utils/APIError.ts
export class APIError extends Error {
  constructor(
    public code: string,
    public message: string,
    public status: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }

  static BadRequest(message: string, code = 'BAD_REQUEST', details?: any) {
    return new APIError(code, message, 400, details);
  }

  static InternalError(message: string, code = 'INTERNAL_SERVER_ERROR', details?: any) {
    return new APIError(code, message, 500, details);
  }

  static Unauthorized(message: string, code = 'UNAUTHORIZED', details?: any) {
    return new APIError(code, message, 401, details);
  }

  static NotFound(message: string, code = 'NOT_FOUND', details?: any) {
    return new APIError(code, message, 404, details);
  }

  static Forbidden(message: string, code = 'FORBIDDEN', details?: any) {
    return new APIError(code, message, 403, details);
  }

  static ValidationError(details: any) {
    return new APIError('VALIDATION_ERROR', 'Validation failed', 400, details);
  }
}
