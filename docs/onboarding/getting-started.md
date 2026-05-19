# Getting Started

## Prerequisites

| Tool    | Version                                      |
| ------- | -------------------------------------------- |
| Node.js | `>=24`                                       |
| PNPM    | `>=11`                                       |
| Docker  | recent version, for local Postgres and Redis |

## Initial setup

```bash
git clone https://github.com/qnguyenhuy1999/ecommerce-v2.git
cd ecommerce-v2
pnpm install
```

Copy the environment file:

```bash
cp .env.example .env
```

If you are working in PowerShell and prefer native commands:

```powershell
Copy-Item .env.example .env
```

## Local services

Bring up infrastructure:

```bash
docker compose up -d
```

Then prepare Prisma:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## Run the workspace

Start the full repo:

```bash
pnpm dev
```

Important note: the repo currently contains three frontend apps and three API apps. There is no active `apps/worker` source tree.

## Default local URLs

### Frontends

- storefront: `http://localhost:3000`
- seller: `http://localhost:3001`
- admin: `http://localhost:3002`

### APIs

- storefront API: `http://localhost:4000`
- seller API: `http://localhost:4003`
- admin API: `http://localhost:4002`

### Swagger

- storefront API docs: `http://localhost:4000/api/docs`
- seller API docs: `http://localhost:4003/docs`
- admin API docs: `http://localhost:4002/docs`

Remember that `api-admin` also applies the `/admin` route prefix to its endpoints.

## Useful commands

```bash
pnpm lint
pnpm type-check
pnpm format
pnpm format:check
pnpm build
pnpm test
pnpm openapi:sync
pnpm contracts:check
```

## Storybook

UI packages expose Storybook individually:

```bash
pnpm --filter @ecom/core-ui storybook
pnpm --filter @ecom/ui-admin storybook
pnpm --filter @ecom/ui-seller storybook
pnpm --filter @ecom/ui-storefront storybook
```

Default ports:

- `@ecom/core-ui`: `6006`
- `@ecom/ui-admin`: `6007`
- `@ecom/ui-seller`: `6008`
- `@ecom/ui-storefront`: `6009`

## Environment variables you will likely touch

From `.env.example`:

- `DATABASE_URL`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `CORS_ORIGINS`
- `COOKIE_DOMAIN`, `COOKIE_SAMESITE`, `COOKIE_SECURE`
- `STOREFRONT_API_PORT`, `ADMIN_API_PORT`, `SELLER_API_PORT`
- `NEXT_PUBLIC_STOREFRONT_API_URL`
- `NEXT_PUBLIC_ADMIN_API_URL`
- `NEXT_PUBLIC_SELLER_API_URL`

## Where to read next

- [Architecture Overview](../architecture/overview.md)
- [Folder Structure](../conventions/folder-structure.md)
- [UI Packages](../conventions/ui-packages.md)
- [API Standards](../engineering/api-standards.md)
- [Frontend Standards](../engineering/frontend-standards.md)
- [Backend Standards](../engineering/backend-standards.md)
- [Testing Standards](../engineering/testing-standards.md)
