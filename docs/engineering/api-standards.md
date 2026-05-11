# API Standards

## Response Shape

All API responses follow the `ApiResponse` contract from `@ecom/contracts`:

```typescript
// Success response
interface ApiSuccessResponse<T> {
  success: true
  data: T
  timestamp: string
}

// Error response
interface ApiErrorResponse {
  success: false
  error: {
    code: string      // Machine-readable error code (e.g., "VALIDATION_ERROR")
    message: string   // Human-readable message
    details?: unknown // Additional context (validation errors array, etc.)
  }
  timestamp: string
}
```

## Error Codes

Use typed error classes from `@ecom/shared/errors`:

| Error Class | HTTP Status | Code |
|-------------|-------------|------|
| `ValidationError` | 400 | `VALIDATION_ERROR` |
| `NotFoundError` | 404 | `NOT_FOUND` |
| `PermissionError` | 403 | `PERMISSION_DENIED` |
| `BusinessRuleError` | 422 | Custom (e.g., `INSUFFICIENT_STOCK`) |
| `ExternalServiceError` | 502 | `EXTERNAL_SERVICE_ERROR` |
| `AppError` (base) | 500 | `APP_ERROR` |

## Pagination

Paginated endpoints use the shared pagination utilities from `@ecom/shared/pagination`:

```typescript
// Request query params
interface PaginationQuery {
  page?: number    // 1-based, default 1
  limit?: number   // default 20, max 100
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Response wrapper
interface PaginatedResponse<T> {
  items: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
```

## Validation

- Use `class-validator` decorators on DTOs
- Global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`
- Validation errors are automatically formatted by `AllExceptionsFilter`

## Authentication

- JWT-based with access + refresh tokens
- Access token in `Authorization: Bearer <token>` header
- Refresh token in HTTP-only cookie
- Guards applied per-route or per-controller

## Versioning

- No URL versioning currently — breaking changes detected via OpenAPI diff in CI
- Future: prefix versioning (`/v2/...`) when needed
