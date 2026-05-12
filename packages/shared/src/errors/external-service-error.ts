import { AppError } from './app-error.js'

/**
 * Thrown when an external service (payment gateway, email provider, etc.) fails.
 * Maps to HTTP 502 Bad Gateway.
 */
export class ExternalServiceError extends AppError {
  public readonly service: string

  constructor(service: string, message?: string, cause?: Error) {
    super(message ?? `External service "${service}" is unavailable or returned an error.`, {
      code: 'EXTERNAL_SERVICE_ERROR',
      statusCode: 502,
      ...(cause !== undefined ? { cause } : {}),
    })
    this.name = 'ExternalServiceError'
    this.service = service
  }
}
