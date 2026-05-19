# Ecommerce Marketplace

A multi-vendor marketplace monorepo built with PNPM workspaces, Turborepo, Next.js, NestJS, Prisma, and shared UI packages.

## Quick Start

Requirements:

- Node `>=24`
- pnpm `>=11`
- Docker for local Postgres and Redis

Setup:

```bash
git clone https://github.com/qnguyenhuy1999/ecommerce.git
cd ecommerce
pnpm install
cp .env.example .env
docker compose up -d
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Useful scripts:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm type-check
pnpm format
pnpm format:check
pnpm test
pnpm openapi:sync
pnpm contracts:check
```

## Workspace

Apps:

- `apps/storefront`
- `apps/seller`
- `apps/admin`
- `apps/api-storefront`
- `apps/api-seller`
- `apps/api-admin`

Packages:

- `@ecom/shared`
- `@ecom/contracts`
- `@ecom/nestjs-core`
- `@ecom/database`
- `@ecom/auth`
- `@ecom/config`
- `@ecom/redis`
- `@ecom/email`
- `@ecom/core-ui`
- `@ecom/ui-storefront`
- `@ecom/ui-seller`
- `@ecom/ui-admin`
- `@ecom/eslint-config`

`apps/worker` is not an active workspace package in the current repo. An empty placeholder directory may exist, but there is no package manifest or source tree to document.

## Docs

Read these files:

1. [docs/project-context.md](./docs/project-context.md)
2. [docs/engineering-rules.md](./docs/engineering-rules.md)
3. [docs/README.md](./docs/README.md)
