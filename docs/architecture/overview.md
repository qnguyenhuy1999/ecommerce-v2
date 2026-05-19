# Architecture Overview

This repository is a PNPM + Turborepo monorepo for a multi-vendor marketplace. It combines:

- three Next.js 16 applications in `apps/storefront`, `apps/seller`, and `apps/admin`
- three NestJS 11 APIs in `apps/api-storefront`, `apps/api-seller`, and `apps/api-admin`
- shared workspace packages under `packages/` for contracts, auth, database, config, UI, email, Redis, and common utilities

## Current workspace layout

```text
apps/
  storefront        Next.js customer app
  seller            Next.js seller console
  admin             Next.js admin console
  api-storefront    NestJS storefront API
  api-seller        NestJS seller API
  api-admin         NestJS admin API

packages/
  shared            shared constants, errors, utils, pagination helpers
  contracts         enums, DTOs, API response types, generated OpenAPI types
  database          Prisma client and Nest database module
  auth              session helpers, cookie config, Next auth helpers
  config            runtime config, env helpers, API client, tooling presets
  nestjs-core       response interceptor, exception filter, logger, OpenAPI helpers
  redis             Redis Nest module and service
  email             email Nest module and service
  core-ui           base UI primitives, layouts, tokens, Storybook
  ui-seller         seller-facing page components and layouts
  ui-admin          admin UI package shell, currently minimal
  ui-storefront     storefront UI package shell, currently minimal
```

There is no `apps/worker` source tree in the current repository, even though some older docs and comments still mention one.

## How the apps fit together

### Frontend apps

- `apps/storefront` is currently a thin Next.js app with auth middleware and minimal page structure.
- `apps/seller` contains route pages, auth middleware, shared app components, and a small local API wrapper.
- `apps/admin` is the most feature-complete frontend. It uses feature folders, TanStack Query, shared API helpers, and `@ecom/core-ui`.

### Backend apps

- `apps/api-storefront` currently centers on auth and session endpoints.
- `apps/api-seller` contains the broadest backend surface: orders, warehouse, chat, analytics, queue processors, AI tools, shipping, coupons, approvals, and related seller workflows.
- `apps/api-admin` covers moderation and operations domains such as users, sellers, products, reviews, refunds, promotions, banners, notifications, categories, and audit logs.

## Shared boundaries

### Core shared packages

- `@ecom/shared` is the lowest-level utility package. It contains constants, typed error classes, utility helpers, and layered pagination helpers for core, NestJS, Prisma, and React consumers.
- `@ecom/contracts` is the transport and domain contract package used across apps. It exports enums, auth DTOs, HTTP response types, and generated OpenAPI client types.
- `@ecom/nestjs-core` standardizes API behavior with the global exception filter, response interceptor, logger module, and OpenAPI decorators/builders.
- `@ecom/config` centralizes runtime defaults such as ports, CORS origins, Redis and SMTP config, plus shared API client and toolchain presets.

### UI packages

- `@ecom/core-ui` is the main design-system package. It contains reusable primitives, atoms, molecules, organisms, layouts, tokens, providers, and Storybook stories.
- `@ecom/ui-seller` contains seller-specific layouts and page compositions.
- `@ecom/ui-admin` and `@ecom/ui-storefront` currently expose package shells and shared styles, but do not yet contain the same breadth of components as `@ecom/core-ui` or `@ecom/ui-seller`.

## API behavior

All three NestJS apps share the same bootstrap pattern:

- `cookie-parser`
- CORS with credentials enabled
- `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform`
- `AllExceptionsFilter` from `@ecom/nestjs-core`
- `ResponseInterceptor` from `@ecom/nestjs-core`
- OpenAPI document generation via `buildSwaggerDocument`

Response types come from `@ecom/contracts/http`. Successful responses are wrapped with `success`, `data`, `timestamp`, and optional `message`/`meta`. Error responses include `success`, `message`, `error`, `statusCode`, `timestamp`, and `path`.

## Ports and routes

Default local ports come from `@ecom/config`:

- Storefront app: `3000`
- Seller app: `3001`
- Admin app: `3002`
- Storefront API: `4000`
- Admin API: `4002`
- Seller API: `4003`

Notable API route conventions:

- `api-admin` sets a global prefix of `/admin`
- `api-seller` does not set a global prefix
- `api-storefront` does not set a global prefix

Swagger UI is mounted per app:

- storefront API: `/api/docs`
- seller API: `/docs`
- admin API: `/docs`
