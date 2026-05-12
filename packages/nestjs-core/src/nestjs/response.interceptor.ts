import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import type { ApiSuccess } from '@ecom/contracts'
import type { Observable } from 'rxjs'
import { map } from 'rxjs'

type PaginatedData = { items: unknown[]; meta: Record<string, unknown> }

function isPaginatedData(data: unknown): data is PaginatedData {
  if (!data || typeof data !== 'object') return false
  const candidate = data as Record<string, unknown>
  return Array.isArray(candidate.items) && typeof candidate.meta === 'object' && candidate.meta !== null
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiSuccess<unknown>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiSuccess<unknown>> {
    return next.handle().pipe(
      map((data): ApiSuccess<unknown> => {
        const timestamp = new Date().toISOString()
        if (isPaginatedData(data)) {
          return {
            success: true as const,
            data: { items: data.items },
            meta: data.meta,
            timestamp,
          }
        }
        return { success: true as const, data, timestamp }
      }),
    )
  }
}
