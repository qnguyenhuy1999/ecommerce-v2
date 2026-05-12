import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import type { ApiResponse } from '@ecom/contracts'
import type { Observable } from 'rxjs'
import { map } from 'rxjs'

type AnyApiResponse = ApiResponse<unknown> | ApiResponse<{ items: unknown[] }>

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, AnyApiResponse> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<AnyApiResponse> {
    return next.handle().pipe(
      map((data): AnyApiResponse => {
        const timestamp = new Date().toISOString()
        if (data && typeof data === 'object' && 'items' in data && 'meta' in data) {
          const paginated = data as { items: unknown[]; meta: Record<string, unknown> }
          return {
            success: true as const,
            data: { items: paginated.items },
            meta: paginated.meta,
            timestamp,
          }
        }
        return { success: true as const, data: data as unknown, timestamp }
      }),
    )
  }
}
