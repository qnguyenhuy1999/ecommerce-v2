# Architecture Overview

This is a **PNPM + Turborepo** monorepo with domain-oriented packages and three vertical slices (storefront, seller, admin).

## High-Level Dependency Graph

```
apps/* ──► @ecom/contracts (stable boundary — enums, API types)
apps/* ──► @ecom/shared (universal primitives — constants, utils, pagination)
apps/* ──► @ecom/nestjs-core (NestJS infra — filters, interceptors, logger)
apps/* ──► @ecom/core-ui (base React components)
apps/* ──► @ecom/database (Prisma client + repositories)
apps/* ──► @ecom/auth (authentication domain)
apps/* ──► @ecom/config (env validation, port helpers)

@ecom/core-ui ──► @ecom/shared
@ecom/nestjs-core ──► @ecom/contracts
@ecom/database ──► @ecom/contracts
@ecom/auth ──► @ecom/database
```

## Leaf Package Rule

`@ecom/shared` and `@ecom/contracts` are **leaf packages** — they must never import other internal workspace packages. This is enforced by:

1. ESLint `no-restricted-imports` rules in `@ecom/eslint-config`
2. `dependency-cruiser` rules in `.dependency-cruiser.js`

## App Responsibilities

| App | Stack | Purpose |
|-----|-------|---------|
| `apps/storefront` | Next.js | Consumer shopping experience |
| `apps/seller` | Next.js | Seller dashboard |
| `apps/admin` | Next.js | Platform admin |
| `apps/api-storefront` | NestJS | Customer-facing REST API |
| `apps/api-seller` | NestJS | Seller management REST API |
| `apps/api-admin` | NestJS | Platform admin REST API |
| `apps/worker` | NestJS | Background job processor (planned) |

## API Response Contract

All NestJS APIs return a unified `ApiResponse` shape defined in `@ecom/contracts`:

```typescript
// Success
{ success: true, data: T, timestamp: string }

// Error
{ success: false, error: { code: string, message: string, details?: unknown }, timestamp: string }
```

This is enforced by `ResponseInterceptor` and `AllExceptionsFilter` from `@ecom/nestjs-core`.
