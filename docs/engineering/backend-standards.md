# Backend Standards

## Module Structure

Every NestJS module follows the controller → service → repository pattern:

- **Controller**: HTTP concerns only (parsing params, calling service, returning response)
- **Service**: Business logic, orchestration, validation
- **Repository**: Data access (thin Prisma wrappers when needed)

## Error Handling

- Throw typed errors from `@ecom/shared/errors` — never raw `Error` or string literals
- `AllExceptionsFilter` in `@ecom/nestjs-core` maps them to the `ApiErrorResponse` shape
- Log 5xx errors automatically; 4xx errors are informational (not logged as errors)

## Logging

- Use `EcomLoggerModule` from `@ecom/nestjs-core` (Pino-based)
- Import `Logger` from `@nestjs/common` in services: `private readonly logger = new Logger(MyService.name)`
- Never use `console.log` — ESLint enforces `no-console`
- Include correlation IDs via the `x-request-id` header (auto-propagated by Pino)

## Configuration

- All env vars are validated at startup via Zod schemas in `@ecom/config/env`
- Use helper functions from `@ecom/config` (e.g., `getAdminPort()`, `getRedisConfig()`)
- Never read `process.env` directly in service code

## Database

- Prisma is the ORM — schema lives in `packages/database/prisma/schema.prisma`
- Use transactions for multi-step mutations
- Add indexes for frequently queried columns
- Use `@ecom/shared/pagination/prisma` for paginated queries

## Security

- Input validation via `class-validator` + global `ValidationPipe`
- Rate limiting via `@nestjs/throttler` (configured per-app via `@ecom/config`)
- CORS configured per-app with validated origins
- Secrets never logged or returned in responses
