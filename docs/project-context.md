# Project Context

## Repo

- Monorepo name: `ecommerce`
- Tooling: PNPM workspaces + Turborepo
- Stack: Next.js 16, React 19, NestJS 11, Prisma, Tailwind CSS v4, TypeScript strict
- Runtime requirements: Node `>=24`, pnpm `>=11`

## Workspace

### Apps

- `apps/storefront`: customer-facing Next.js app
- `apps/seller`: seller dashboard Next.js app
- `apps/admin`: admin dashboard Next.js app
- `apps/api-storefront`: storefront NestJS API
- `apps/api-seller`: seller NestJS API
- `apps/api-admin`: admin NestJS API

`apps/worker` is not an active workspace package in the current repo. An empty placeholder directory may exist, but there is no package manifest or source tree to document.

### Packages

- `@ecom/shared`: shared constants, errors, utils, and pagination helpers
- `@ecom/contracts`: enums, DTOs, HTTP response types, and generated API types
- `@ecom/nestjs-core`: shared NestJS filters, interceptors, logging, and OpenAPI helpers
- `@ecom/database`: Prisma client and database module
- `@ecom/auth`: session, cookie, Next.js auth, and middleware helpers
- `@ecom/config`: runtime config, env helpers, API client, and toolchain presets
- `@ecom/redis`: Redis module and service
- `@ecom/email`: email module and service
- `@ecom/core-ui`: shared design-system package and Storybook base
- `@ecom/ui-seller`: seller-specific reusable UI
- `@ecom/ui-admin`: admin-specific UI shell
- `@ecom/ui-storefront`: storefront UI shell
- `@ecom/eslint-config`: shared lint config

## Architecture rules

- `@ecom/shared` and `@ecom/contracts` are leaf packages. Do not make them import other internal packages.
- Cross-package imports should use package entrypoints, not relative paths into sibling workspaces.
- `@ecom/core-ui` is the generic UI layer. App-specific UI stays in the app unless it is clearly reusable.

## Current patterns

- `apps/admin` is the strongest frontend reference. It uses feature folders, TanStack Query, and shared API helpers.
- `apps/seller` is flatter and more app-local than `admin`.
- `apps/storefront` is currently thin.
- `apps/api-seller` has the broadest backend surface.
- `apps/api-storefront` is smaller and centered on auth and session flows.

## API baseline

All API apps currently use:

- `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform`
- `AllExceptionsFilter` from `@ecom/nestjs-core`
- `ResponseInterceptor` from `@ecom/nestjs-core`
- Swagger generation through `@ecom/nestjs-core/openapi`
- cookie-based auth/session flows for browser traffic

`api-admin` uses the `/admin` route prefix. `api-storefront` and `api-seller` do not.

## Local ports

- storefront app: `3000`
- seller app: `3001`
- admin app: `3002`
- storefront API: `4000`
- admin API: `4002`
- seller API: `4003`

Swagger URLs:

- storefront API: `/api/docs`
- seller API: `/docs`
- admin API: `/docs`

## Shared scripts

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm type-check`
- `pnpm format`
- `pnpm format:check`
- `pnpm test`
- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm openapi:sync`
- `pnpm contracts:check`

## Local setup

Typical setup:

1. `git clone https://github.com/qnguyenhuy1999/ecommerce.git`
2. `cd ecommerce`
3. `pnpm install`
4. copy `.env.example` to `.env`
5. `docker compose up -d`
6. `pnpm db:generate`
7. `pnpm db:migrate`
8. `pnpm db:seed`

High-signal env vars:

- `DATABASE_URL`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `CORS_ORIGINS`
- `COOKIE_DOMAIN`, `COOKIE_SAMESITE`, `COOKIE_SECURE`
- `STOREFRONT_API_PORT`, `ADMIN_API_PORT`, `SELLER_API_PORT`
- `NEXT_PUBLIC_STOREFRONT_API_URL`
- `NEXT_PUBLIC_ADMIN_API_URL`
- `NEXT_PUBLIC_SELLER_API_URL`
