import { AppError } from './app-error.js'

/**
 * Thrown when the authenticated user lacks permission for the requested action.
 * Maps to HTTP 403 Forbidden.
 */
export class PermissionError extends AppError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, {
      code: 'PERMISSION_DENIED',
      statusCode: 403,
    })
    this.name = 'PermissionError'
  }
}
