import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { ApiErrorResponse } from '@ecom/contracts'
import type { Response } from 'express'

/** Duck-typed shape of our AppError from @ecom/shared/errors. */
interface AppErrorLike extends Error {
  code: string
  statusCode: number
  details?: unknown
}

function isAppError(err: unknown): err is AppErrorLike {
  return (
    err instanceof Error &&
    'code' in err &&
    'statusCode' in err &&
    typeof (err as AppErrorLike).code === 'string' &&
    typeof (err as AppErrorLike).statusCode === 'number'
  )
}

/** Duck-typed shape of a Prisma known request error (avoids importing @ecom/database). */
interface PrismaKnownError extends Error {
  code: string
  meta?: Record<string, unknown>
}

function isPrismaKnownError(err: unknown): err is PrismaKnownError {
  return (
    err instanceof Error &&
    'code' in err &&
    typeof (err as Record<string, unknown>).code === 'string' &&
    /^P\d{4}$/.test((err as PrismaKnownError).code)
  )
}

function isPrismaValidationError(err: unknown): err is Error {
  return err instanceof Error && err.constructor.name === 'PrismaClientValidationError'
}

/** Map common Prisma error codes to HTTP status + canonical error code. */
function mapPrismaError(err: PrismaKnownError): {
  status: number
  code: string
  message: string
  details?: unknown
} {
  switch (err.code) {
    case 'P2002':
      return {
        status: HttpStatus.CONFLICT,
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
        message: 'A record with the given data already exists.',
        details: err.meta,
      }
    case 'P2025':
      return {
        status: HttpStatus.NOT_FOUND,
        code: 'RECORD_NOT_FOUND',
        message: 'The requested record was not found.',
        details: err.meta,
      }
    case 'P2003':
      return {
        status: HttpStatus.BAD_REQUEST,
        code: 'FOREIGN_KEY_CONSTRAINT_VIOLATION',
        message: 'A related record was not found.',
        details: err.meta,
      }
    case 'P2014':
      return {
        status: HttpStatus.BAD_REQUEST,
        code: 'RELATION_VIOLATION',
        message: 'The change would violate a required relation.',
        details: err.meta,
      }
    default:
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: `PRISMA_${err.code}`,
        message: 'A database error occurred.',
        details: err.meta,
      }
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const timestamp = new Date().toISOString()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let code = 'INTERNAL_SERVER_ERROR'
    let message = 'Internal server error'
    let details: unknown = undefined

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      code = HttpStatus[status] ?? 'HTTP_ERROR'
      const body = exception.getResponse()
      if (typeof body === 'string') {
        message = body
      } else if (typeof body === 'object' && body !== null) {
        const obj = body as Record<string, unknown>
        message = typeof obj.message === 'string' ? obj.message : message
        // NestJS validation pipes put an array in obj.message; surface it as details
        if (Array.isArray(obj.message)) {
          details = obj.message
          message = 'Validation failed'
        }
        if (obj.errors !== undefined) {
          details = obj.errors
        }
      }
    } else if (isAppError(exception)) {
      // Handle typed domain errors from @ecom/shared/errors
      status = exception.statusCode
      code = exception.code
      message = exception.message
      details = exception.details
      if (status >= 500) {
        this.logger.error(exception.message, exception.stack)
      }
    } else if (isPrismaKnownError(exception)) {
      const mapped = mapPrismaError(exception)
      status = mapped.status
      code = mapped.code
      message = mapped.message
      details = mapped.details
    } else if (isPrismaValidationError(exception)) {
      status = HttpStatus.BAD_REQUEST
      code = 'PRISMA_VALIDATION_ERROR'
      message = 'Invalid query parameters.'
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack)
    }

    const body: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
      timestamp,
    }

    response.status(status).json(body)
  }
}
