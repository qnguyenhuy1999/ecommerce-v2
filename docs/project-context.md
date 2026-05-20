# Project Context

## Repo

- Monorepo name: `ecommerce`
- Tooling: PNPM workspaces + Turborepo
- Stack: Next.js 16, React 19, NestJS 11, Prisma 7, Tailwind CSS v4, TypeScript strict
- Runtime requirements: Node `>=24`, pnpm `>=11`

## Workspace

### Apps

| App                   | Package                | Port   | Notes                                                                                                                 |
| --------------------- | ---------------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| `apps/storefront`     | `@ecom/storefront`     | `3000` | Customer-facing Next.js app. Currently thin.                                                                          |
| `apps/seller`         | `@ecom/seller`         | `3001` | Seller dashboard. Flatter structure than admin.                                                                       |
| `apps/admin`          | `@ecom/admin`          | `3002` | Admin dashboard. Strongest frontend reference — uses feature folders, TanStack Query, react-hook-form, Zod, Recharts. |
| `apps/api-storefront` | `@ecom/api-storefront` | `4000` | NestJS API. Centered on auth and session flows.                                                                       |
| `apps/api-seller`     | `@ecom/api-seller`     | `4003` | NestJS API. Broadest backend surface. Includes BullMQ job queues and Socket.IO WebSockets.                            |
| `apps/api-admin`      | `@ecom/api-admin`      | `4002` | NestJS API. Uses `/admin` route prefix.                                                                               |

`apps/worker` is an empty placeholder directory with no package manifest or source tree.

### Packages

| Package               | Description                                                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@ecom/shared`        | Constants, errors, utils, and pagination helpers. Leaf package — imports nothing internal.                                                                      |
| `@ecom/contracts`     | Enums, DTOs, HTTP response types, and generated OpenAPI types. Leaf package — imports nothing internal except `@ecom/shared`.                                   |
| `@ecom/nestjs-core`   | Shared NestJS filters (`AllExceptionsFilter`), interceptors (`ResponseInterceptor`), structured logging (nestjs-pino), and OpenAPI helpers.                     |
| `@ecom/database`      | Prisma client (`@prisma/client` + `@prisma/adapter-pg`) and NestJS database module.                                                                             |
| `@ecom/auth`          | Session and cookie helpers, bcrypt utils, Next.js auth client, protected-route helper, and middleware.                                                          |
| `@ecom/config`        | Runtime config, Zod-validated env helpers, API client factory, and shared toolchain presets (ESLint, Prettier, commitlint, tsconfig).                           |
| `@ecom/redis`         | NestJS Redis module and service (ioredis).                                                                                                                      |
| `@ecom/email`         | NestJS email module and service (Nodemailer + Handlebars templates).                                                                                            |
| `@ecom/core-ui`       | Generic design system: Tailwind tokens, shadcn/radix components, TanStack Table, Recharts, Sonner toasts, Vaul drawer, ThemeProvider. Storybook on port `6006`. |
| `@ecom/ui-storefront` | Storefront-specific reusable UI built on `@ecom/core-ui`. Storybook on port `6009`.                                                                             |
| `@ecom/ui-seller`     | Seller-specific reusable UI built on `@ecom/core-ui`. Includes CVA variants and Recharts. Storybook on port `6008`.                                             |
| `@ecom/ui-admin`      | Admin UI shell built on `@ecom/core-ui`. Storybook on port `6007`.                                                                                              |
| `@ecom/eslint-config` | Shared ESLint config (re-exported from `@ecom/config`).                                                                                                         |

## Architecture rules

- `@ecom/shared` and `@ecom/contracts` are leaf packages. Do not add other internal package imports to them.
- Cross-package imports must use package entrypoints (`@ecom/<name>`), not relative paths into sibling workspaces.
- `@ecom/core-ui` is the generic UI layer. App-specific UI stays in the app unless it is clearly reusable.
- `@ecom/ui-*` packages must not depend on each other.

## API baseline

All three API apps share this bootstrap pattern:

- `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform`
- `AllExceptionsFilter` from `@ecom/nestjs-core`
- `ResponseInterceptor` from `@ecom/nestjs-core`
- Swagger generation via `@ecom/nestjs-core/openapi`
- Cookie-based auth/session for browser traffic
- Rate limiting via `@nestjs/throttler`

`api-admin` uses the `/admin` global route prefix. `api-storefront` and `api-seller` do not.

`api-seller` additionally uses BullMQ (`@nestjs/bullmq`) for background jobs and Socket.IO (`@nestjs/websockets`, `@nestjs/platform-socket.io`) for real-time events.

## Local ports

| Service                 | Port   |
| ----------------------- | ------ |
| storefront app          | `3000` |
| seller app              | `3001` |
| admin app               | `3002` |
| api-storefront          | `4000` |
| api-admin               | `4002` |
| api-seller              | `4003` |
| Postgres                | `5432` |
| Redis                   | `6379` |
| Mailpit SMTP            | `1025` |
| Mailpit web UI          | `8025` |
| core-ui Storybook       | `6006` |
| ui-admin Storybook      | `6007` |
| ui-seller Storybook     | `6008` |
| ui-storefront Storybook | `6009` |

## Swagger URLs

| API            | URL                              |
| -------------- | -------------------------------- |
| api-storefront | `http://localhost:4000/api/docs` |
| api-seller     | `http://localhost:4003/docs`     |
| api-admin      | `http://localhost:4002/docs`     |

## Shared scripts

| Script                 | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `pnpm dev`             | Start all apps in watch mode                      |
| `pnpm build`           | Turbo build                                       |
| `pnpm lint`            | ESLint                                            |
| `pnpm lint:circular`   | Circular dependency check (madge)                 |
| `pnpm lint:deps`       | Dependency boundary check (dependency-cruiser)    |
| `pnpm type-check`      | TypeScript check                                  |
| `pnpm format`          | Prettier write                                    |
| `pnpm format:check`    | Prettier check                                    |
| `pnpm test`            | Unit tests                                        |
| `pnpm test:e2e`        | E2E tests                                         |
| `pnpm db:generate`     | Prisma client generation                          |
| `pnpm db:migrate`      | Prisma migrate dev                                |
| `pnpm db:deploy`       | Prisma migrate deploy (production)                |
| `pnpm db:seed`         | Seed database                                     |
| `pnpm openapi:sync`    | Swagger JSON generation + OpenAPI type generation |
| `pnpm contracts:check` | Full OpenAPI + validate + type-check contracts    |

## Local setup

```bash
git clone https://github.com/qnguyenhuy1999/ecommerce.git
cd ecommerce
pnpm install
cp .env.example .env
# edit .env as needed
docker compose -f docker-compose.infra.yml up -d
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

To run the full stack in Docker instead:

```bash
pnpm build
docker compose up -d
```

## Environment variables

High-signal vars from `.env.example`:

| Variable                                                                       | Description                     |
| ------------------------------------------------------------------------------ | ------------------------------- |
| `DATABASE_URL`                                                                 | Postgres connection string      |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`                                   | Redis connection                |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Email / SMTP config             |
| `APP_URL`                                                                      | Base app URL                    |
| `CORS_ORIGINS`                                                                 | Comma-separated allowed origins |
| `COOKIE_DOMAIN`, `COOKIE_SAMESITE`, `COOKIE_SECURE`                            | Cookie settings                 |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`                                      | JWT signing secrets             |
| `STOREFRONT_API_PORT`, `ADMIN_API_PORT`, `SELLER_API_PORT`                     | API listen ports                |
| `NEXT_PUBLIC_STOREFRONT_API_URL`                                               | Storefront API URL (browser)    |
| `NEXT_PUBLIC_ADMIN_API_URL`                                                    | Admin API URL (browser)         |
| `NEXT_PUBLIC_SELLER_API_URL`                                                   | Seller API URL (browser)        |
| `NEXT_PUBLIC_APP_URL`                                                          | App URL (browser)               |
| `NODE_ENV`                                                                     | `development` or `production`   |

For local email testing, point SMTP at Mailpit (`SMTP_HOST=localhost`, `SMTP_PORT=1025`). The Mailpit web UI is at `http://localhost:8025`.
