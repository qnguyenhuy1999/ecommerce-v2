import { AppError } from './app-error.js'

/**
 * Thrown when a business rule is violated (e.g., insufficient stock, order already shipped).
 * Maps to HTTP 422 Unprocessable Entity.
 */
export class BusinessRuleError extends AppError {
  constructor(message: string, code = 'BUSINESS_RULE_VIOLATION', details?: unknown) {
    super(message, {
      code,
      statusCode: 422,
      details,
    })
    this.name = 'BusinessRuleError'
  }
}
