import { AppError } from './app-error.js'

/**
 * Thrown when input data fails validation rules.
 * Maps to HTTP 400 Bad Request.
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, {
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details,
    })
    this.name = 'ValidationError'
  }
}
