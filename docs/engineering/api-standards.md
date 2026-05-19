# API Standards

This document describes the API conventions implemented in the current NestJS apps.

## Runtime response shape

Successful responses are normalized by `ResponseInterceptor` from `@ecom/nestjs-core`.

Primary response types live in `@ecom/contracts/http`:

```ts
interface ApiSuccessResponse<T> {
  success: true
  message?: string
  data: T
  meta?: Record<string, unknown>
  timestamp: string
}

interface ApiPaginatedSuccessResponse<T> {
  success: true
  message?: string
  data: { items: T[] }
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  timestamp: string
}

interface ApiErrorResponse {
  success: false
  message: string
  error: {
    code: string
    message: string
    details?: unknown
  }
  statusCode: number
  timestamp: string
  path: string
}
```

Return plain domain data from controllers and services. Let the interceptor wrap it.

## Validation and error handling

All API apps currently enable:

- `ValidationPipe`
  - `whitelist: true`
  - `forbidNonWhitelisted: true`
  - `transform: true`
- `AllExceptionsFilter`

Use `class-validator` DTOs for request validation. Use typed errors from `@ecom/shared/errors` for domain failures when possible.

## Pagination

The repo already contains shared pagination helpers in `@ecom/shared/pagination`:

- `core` for shared types and builders
- `nestjs` for DTOs
- `prisma` for query helpers
- `react` for client-side helpers

Query DTOs usually extend shared Nest pagination DTOs such as `OffsetPaginationDto`.

## Authentication model

Current browser-facing auth is session-cookie based, not pure bearer-token based.

- the session cookie name is `sid`
- cookie behavior comes from `@ecom/auth/getSessionCookieOptions`
- frontend fetches use `credentials: 'include'`
- guards resolve session data from the incoming request

JWT-related environment variables exist, but the main request flow in the current apps is based on session cookies and guard/session providers.

## OpenAPI

Each API app generates its own Swagger document through `buildSwaggerDocument` from `@ecom/nestjs-core/openapi`.

Current JSON output targets:

- `apps/api-storefront/openapi/storefront.json`
- `apps/api-seller/openapi/seller.json`
- `apps/api-admin/openapi/admin.json`

Regenerate them with:

```bash
pnpm openapi:sync
```

That command runs Swagger generation and refreshes generated contract types.

## Route conventions

- `api-admin` uses a global `/admin` prefix
- `api-seller` routes are mounted without a global prefix
- `api-storefront` routes are mounted without a global prefix

Swagger UI paths:

- storefront API: `/api/docs`
- seller API: `/docs`
- admin API: `/docs`

## Controller guidance

- keep controllers thin
- use DTOs for request shape
- use guards and decorators for auth and permissions
- return service results directly unless a response needs cookie or header handling
- use `@ecom/nestjs-core/openapi` decorators for response documentation
