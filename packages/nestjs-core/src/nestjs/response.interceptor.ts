import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import type { ApiResponse } from '@ecom/contracts'
import { Observable, map } from 'rxjs'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const timestamp = new Date().toISOString()
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          const paginated = data as unknown as { data: T; meta: Record<string, unknown> }
          return { success: true as const, data: paginated.data, meta: paginated.meta, timestamp }
        }
        return { success: true as const, data, timestamp }
      }),
    )
  }
}
