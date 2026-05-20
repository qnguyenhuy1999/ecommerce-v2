# Ecommerce Marketplace

A multi-vendor marketplace monorepo built with PNPM workspaces, Turborepo, Next.js, NestJS, Prisma, and shared UI packages.

## Requirements

- Node `>=24`
- pnpm `>=11`
- Docker (for local Postgres, Redis, and Mailpit)

## Quick Start

```bash
git clone https://github.com/qnguyenhuy1999/ecommerce.git
cd ecommerce
pnpm install
cp .env.example .env
docker compose -f docker-compose.infra.yml up -d
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

> Use `docker-compose.infra.yml` for infra-only (Postgres, Redis, Mailpit) when running apps via `pnpm dev`.
> Use `docker-compose.yml` to run the full stack in containers.

## Scripts

| Script                 | Description                               |
| ---------------------- | ----------------------------------------- |
| `pnpm dev`             | Start all apps in watch mode              |
| `pnpm build`           | Build all packages and apps via Turborepo |
| `pnpm lint`            | Run ESLint across the monorepo            |
| `pnpm lint:circular`   | Check for circular dependencies           |
| `pnpm lint:deps`       | Check dependency boundary rules           |
| `pnpm type-check`      | Run `tsc --noEmit` across all packages    |
| `pnpm format`          | Prettier write                            |
| `pnpm format:check`    | Prettier check                            |
| `pnpm test`            | Run unit tests                            |
| `pnpm test:e2e`        | Run e2e tests                             |
| `pnpm db:generate`     | Generate Prisma client                    |
| `pnpm db:migrate`      | Run Prisma migrations (dev)               |
| `pnpm db:deploy`       | Run Prisma migrations (production)        |
| `pnpm db:seed`         | Seed the database                         |
| `pnpm openapi:sync`    | Generate Swagger JSON + contract types    |
| `pnpm contracts:check` | Full OpenAPI + type sanity check          |

Filter to a single package: `pnpm --filter @ecom/<name> <script>`

## Workspace

### Apps

| App                   | Package                | Port   | Description                            |
| --------------------- | ---------------------- | ------ | -------------------------------------- |
| `apps/storefront`     | `@ecom/storefront`     | `3000` | Customer-facing Next.js storefront     |
| `apps/seller`         | `@ecom/seller`         | `3001` | Seller dashboard (Next.js)             |
| `apps/admin`          | `@ecom/admin`          | `3002` | Admin dashboard (Next.js)              |
| `apps/api-storefront` | `@ecom/api-storefront` | `4000` | Storefront NestJS API                  |
| `apps/api-seller`     | `@ecom/api-seller`     | `4003` | Seller NestJS API (BullMQ, WebSockets) |
| `apps/api-admin`      | `@ecom/api-admin`      | `4002` | Admin NestJS API                       |

`apps/worker` is an empty placeholder directory with no package manifest.

### Packages

| Package               | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `@ecom/shared`        | Constants, errors, utils, and pagination helpers                        |
| `@ecom/contracts`     | Enums, DTOs, HTTP response types, and generated API types               |
| `@ecom/nestjs-core`   | Shared NestJS filters, interceptors, logging, and OpenAPI helpers       |
| `@ecom/database`      | Prisma client and database module                                       |
| `@ecom/auth`          | Session, cookie, Next.js auth, and middleware helpers                   |
| `@ecom/config`        | Runtime config, env helpers, API client, and toolchain presets          |
| `@ecom/redis`         | Redis NestJS module and service                                         |
| `@ecom/email`         | Email NestJS module and service (Nodemailer + Handlebars)               |
| `@ecom/core-ui`       | Shared design system, Tailwind tokens, and Storybook base (port `6006`) |
| `@ecom/ui-storefront` | Storefront-specific reusable UI (Storybook port `6009`)                 |
| `@ecom/ui-seller`     | Seller-specific reusable UI (Storybook port `6008`)                     |
| `@ecom/ui-admin`      | Admin UI shell (Storybook port `6007`)                                  |
| `@ecom/eslint-config` | Shared ESLint config                                                    |

### Dependency boundaries

- `@ecom/shared` and `@ecom/contracts` are leaf packages — they import nothing internal.
- Cross-package imports must go through package entrypoints (`@ecom/<name>`), not relative paths.
- `@ecom/ui-*` packages must not depend on each other.

## Local infrastructure

`docker-compose.infra.yml` starts Postgres, Redis, and Mailpit:

```bash
docker compose -f docker-compose.infra.yml up -d
```

| Service     | Port                       | Notes            |
| ----------- | -------------------------- | ---------------- |
| Postgres 16 | `5432`                     | Database         |
| Redis 7     | `6379`                     | Cache / queues   |
| Mailpit     | `1025` (SMTP), `8025` (UI) | Local email trap |

## Swagger / OpenAPI

| API              | Swagger URL                      |
| ---------------- | -------------------------------- |
| `api-storefront` | `http://localhost:4000/api/docs` |
| `api-seller`     | `http://localhost:4003/docs`     |
| `api-admin`      | `http://localhost:4002/docs`     |

After any API change, run `pnpm openapi:sync` to regenerate types.

## Docs

1. [docs/project-context.md](./docs/project-context.md) — repo structure, packages, ports, and setup facts
2. [docs/engineering-rules.md](./docs/engineering-rules.md) — conventions, workflow, and review rules
3. [docs/README.md](./docs/README.md) — docs index
