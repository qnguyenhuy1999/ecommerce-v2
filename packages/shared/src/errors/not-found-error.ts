import { AppError } from './app-error.js'

/**
 * Thrown when a requested resource does not exist.
 * Maps to HTTP 404 Not Found.
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string | number) {
    const msg = identifier
      ? `${resource} with id "${identifier}" was not found.`
      : `${resource} was not found.`
    super(msg, {
      code: 'NOT_FOUND',
      statusCode: 404,
    })
    this.name = 'NotFoundError'
  }
}
