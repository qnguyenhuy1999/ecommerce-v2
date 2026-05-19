import { AppError } from './app-error.js'

/**
 * Thrown when an external service (payment gateway, email provider, etc.) fails.
 * Maps to HTTP 502 Bad Gateway.
 */
export class ExternalServiceError extends AppError {
  public readonly service: string

  constructor(service: string, message?: string, cause?: Error) {
    const options = cause
      ? {
          code: 'EXTERNAL_SERVICE_ERROR',
          statusCode: 502,
          cause,
        }
      : {
          code: 'EXTERNAL_SERVICE_ERROR',
          statusCode: 502,
        }

    super(message ?? `External service "${service}" is unavailable or returned an error.`, {
      ...options,
    })
    this.name = 'ExternalServiceError'
    this.service = service
  }
}
