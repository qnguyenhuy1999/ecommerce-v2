import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable, map } from 'rxjs'

export interface NestApiResponse<T> {
  success: boolean
  data: T
  meta?: Record<string, unknown>
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, NestApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<NestApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          const paginated = data as unknown as { data: T; meta: Record<string, unknown> }
          return { success: true, data: paginated.data as T, meta: paginated.meta }
        }
        return { success: true, data }
      }),
    )
  }
}
