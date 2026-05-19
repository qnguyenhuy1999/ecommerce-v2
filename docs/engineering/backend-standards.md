# Backend Standards

These standards reflect the current NestJS codebase in `apps/api-admin`, `apps/api-seller`, and `apps/api-storefront`.

## Bootstrap baseline

Each API app currently does the following in `main.ts`:

- creates the Nest app with `NestFactory.create`
- enables `cookie-parser`
- enables CORS with `credentials: true`
- installs a global `ValidationPipe`
- installs `AllExceptionsFilter`
- installs `ResponseInterceptor`
- builds Swagger output through `buildSwaggerDocument`
- reads ports and CORS defaults from `@ecom/config`

Start new backend behavior from that baseline instead of inventing app-specific bootstrapping.

## Module design

The dominant pattern is domain-first modules:

- controller for HTTP shape and route metadata
- service for orchestration and business rules
- DTO files under `dto/`
- optional `guards/`, `decorators/`, `repositories/`, `processors/`, or `templates/` subfolders when the feature needs them

Examples:

- admin: `users`, `products`, `refunds`, `audit-logs`
- seller: `order`, `warehouse`, `chat`, `queue`, `analytics`
- storefront: `auth`

## Controller expectations

- keep request parsing in controllers
- use decorators and guards instead of hand-rolled auth checks
- return raw result objects and let the response interceptor wrap them
- only manage cookies directly in controllers when the route is explicitly auth/session related

## Services

- keep business logic in services
- prefer injecting collaborators rather than hiding cross-module work in controllers
- use shared constants from `@ecom/shared/constants` when a stable constant already exists
- use typed shared errors instead of unstructured thrown strings

## Auth and session handling

The repo currently uses shared auth utilities from `@ecom/auth`:

- session helpers and `SessionService`
- cookie config and `SESSION_COOKIE_NAME`
- Next.js client and middleware helpers

Backend auth guards live inside each API app, but they rely on common auth primitives and session data conventions.

## Config and environment

Use `@ecom/config` helpers for runtime defaults:

- `getAdminPort`
- `getSellerPort`
- `getStorefrontPort`
- `getCorsOrigins`
- `getRedisConfig`
- `getSmtpConfig`

Avoid scattering duplicated port, Redis, SMTP, or CORS parsing logic across apps.

## OpenAPI and contracts

If you change controller DTOs or response shapes:

1. update the Nest controller/service code
2. run `pnpm openapi:sync`
3. review the generated JSON and contract types

The OpenAPI artifacts are part of the repo workflow, not an optional afterthought.

## Logging and operational concerns

`@ecom/nestjs-core` exports `EcomLoggerModule`, but current apps mostly use Nest's `Logger` directly in bootstrap and service code. Preserve the current pattern in the local module unless you are intentionally standardizing a broader logging refactor.

Do not add `console.log` for permanent diagnostics in backend code.
