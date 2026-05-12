# Ecommerce Marketplace

A production-grade, multi-vendor e-commerce marketplace (Shopee-like) built as a **PNPM + Turborepo** monorepo with **Next.js** frontends, **NestJS** APIs, and a shared component system powered by **Storybook**.

## Tech Stack

| Layer         | Technology                                        |
| ------------- | ------------------------------------------------- |
| Frontend      | Next.js (App Router) · React 19 · Tailwind CSS v4 |
| Backend API   | NestJS · Prisma · PostgreSQL                      |
| UI Components | Radix UI · shadcn · Storybook 10                  |
| Monorepo      | PNPM 11 · Turborepo                               |
| Language      | TypeScript (strict, end-to-end)                   |
| Node          | >= 24                                             |

## Architecture

```
ecommerce/
├── apps/
│   ├── storefront/        # Next.js — consumer shopping app
│   ├── seller/            # Next.js — seller dashboard
│   ├── admin/             # Next.js — platform admin dashboard
│   ├── api-storefront/    # NestJS — customer-facing REST API
│   ├── api-seller/        # NestJS — seller management REST API
│   ├── api-admin/         # NestJS — platform admin REST API
│   └── worker/            # NestJS — background job processor
│
├── packages/
│   ├── shared/            # Universal primitives: constants, utils, pagination (layered)
│   ├── contracts/         # Stable boundary: all domain enums, API types, transport contracts
│   ├── nestjs-core/       # NestJS infrastructure: filters, interceptors
│   ├── database/          # Prisma client + repositories
│   ├── auth/              # Authentication domain
│   ├── redis/             # Redis client
│   ├── email/             # Email service
│   ├── config/            # App configuration & env validation
│   ├── core-ui/           # Base React component library (Storybook :6006)
│   ├── ui-storefront/     # Storefront-specific UI components (Storybook :6009)
│   ├── ui-seller/         # Seller-specific UI components (Storybook :6008)
│   ├── ui-admin/          # Admin-specific UI components (Storybook :6007)
│   └── eslint-config/     # Shared ESLint config + TypeScript presets
│
├── turbo.json             # Turborepo pipeline configuration
└── pnpm-workspace.yaml    # Workspace package definitions
```

## Getting Started

### Prerequisites

| Tool    | Version |
| ------- | ------- |
| Node.js | >= 24   |
| PNPM    | >= 11   |

### Installation

```bash
git clone https://github.com/qnguyenhuy1999/ecommerce-v2.git
cd ecommerce-v2
pnpm install
```

### Development

```bash
# Start all apps & packages in watch mode
pnpm dev

# Build all packages
pnpm build

# Lint everything
pnpm lint

# Type-check everything
pnpm type-check

# Format code with Prettier
pnpm format
```

### Database (Prisma)

```bash
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Run database migrations
pnpm db:seed        # Seed sample data
```

## Package Responsibilities

### Apps

| Package               | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `apps/storefront`     | Consumer-facing shopping experience — browsing, cart, checkout       |
| `apps/seller`         | Seller dashboard — product management, orders, analytics             |
| `apps/admin`          | Platform admin — user management, moderation, settings               |
| `apps/api-storefront` | Customer-facing REST API — auth, catalog, cart, orders               |
| `apps/api-seller`     | Seller management REST API — inventory, fulfillment                  |
| `apps/api-admin`      | Platform admin REST API — KYC, platform config                       |
| `apps/worker`         | Background job processor — emails, queues, scheduled tasks (planned) |

### Shared Packages

| Package               | Description                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `@ecom/shared`        | Universal primitives — constants, utils, pagination (core/prisma/react/nestjs layers)                                    |
| `@ecom/contracts`     | Stable boundary — ALL domain enums, API schemas, transport contracts (`ApiResponse`)                                     |
| `@ecom/nestjs-core`   | NestJS infrastructure — `AllExceptionsFilter`, `ResponseInterceptor`                                                     |
| `@ecom/database`      | Prisma client + repository helpers                                                                                       |
| `@ecom/auth`          | Authentication domain (may import database)                                                                              |
| `@ecom/redis`         | Redis client wrapper                                                                                                     |
| `@ecom/email`         | Email service base                                                                                                       |
| `@ecom/config`        | Centralised app configuration & env validation                                                                           |
| `@ecom/core-ui`       | Base React component library — buttons, inputs, modals, sidebar, theme provider (Radix UI + shadcn)                      |
| `@ecom/ui-storefront` | Storefront-specific components — product cards, storefront chrome                                                        |
| `@ecom/ui-seller`     | Seller-specific components — stat cards, charts (Recharts)                                                               |
| `@ecom/ui-admin`      | Admin-specific components — data grids, admin shell                                                                      |
| `@ecom/eslint-config` | Shared ESLint 9 flat config presets + TypeScript config presets (`base`, `library`, `react-library`, `nextjs`, `nestjs`) |

## UI Development with Storybook

Each UI package ships with [Storybook](https://storybook.js.org/) for isolated component development and visual testing.

```bash
# Core UI components (port 6006)
pnpm --filter @ecom/core-ui storybook

# Admin UI components (port 6007)
pnpm --filter @ecom/ui-admin storybook

# Seller UI components (port 6008)
pnpm --filter @ecom/ui-seller storybook

# Storefront UI components (port 6009)
pnpm --filter @ecom/ui-storefront storybook
```

Build all Storybook static sites:

```bash
pnpm --filter @ecom/core-ui build-storybook
pnpm --filter @ecom/ui-admin build-storybook
pnpm --filter @ecom/ui-seller build-storybook
pnpm --filter @ecom/ui-storefront build-storybook
```

## Environment Setup

### Environment Variables

Copy the example env file and fill in the values:

```bash
cp .env.example .env
```

Key variables:

| Variable                    | Description                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `DATABASE_URL`              | PostgreSQL connection string                                                          |
| `REDIS_HOST` / `REDIS_PORT` | Redis connection                                                                      |
| `JWT_ACCESS_SECRET`         | JWT signing secret                                                                    |
| `STRIPE_SECRET_KEY`         | Stripe API key                                                                        |
| `NEXT_PUBLIC_API_URL`       | API base URL for frontend apps                                                        |
| `COOKIE_DOMAIN`             | Cookie domain (e.g. `.example.com` for subdomains)                                    |
| `COOKIE_SAMESITE`           | `lax` (default), `strict`, or `none` — use `none` for cross-site deployments          |
| `COOKIE_SECURE`             | `true/false` — defaults to `true` in production; required when `COOKIE_SAMESITE=none` |

Notes:

- `SameSite=lax` is usually fine for local dev (e.g. `localhost:3000` -> `localhost:4000`) and subdomains on the same registrable domain (e.g. `api.example.com` + `store.example.com`).
- If your frontend and API are on different "sites" (different registrable domains), browsers will not send cookies on cross-site `fetch`/XHR unless you use `SameSite=None` + `Secure` (HTTPS).

### TypeScript Configuration

Shared presets are available via `@ecom/eslint-config`:

```jsonc
// For a Next.js app
{ "extends": "@ecom/eslint-config/nextjs.json" }

// For a NestJS service
{ "extends": "@ecom/eslint-config/nestjs.json" }

// For a shared library
{ "extends": "@ecom/eslint-config/library.json" }

// For a React component library
{ "extends": "@ecom/eslint-config/react-library.json" }
```

### ESLint Configuration

Shared flat configs are available via `@ecom/eslint-config`:

```js
// For a standard package
import config from '@ecom/eslint-config'

// For a React component library
import config from '@ecom/eslint-config/react-library'
```

## Scripts Reference

```bash
# ─── Development ───
pnpm dev              # Start all apps & packages in watch mode
pnpm build            # Build all packages
pnpm lint             # Lint all packages (ESLint)
pnpm type-check       # Run TypeScript type checking
pnpm format           # Auto-format with Prettier
pnpm format:check     # Check formatting without writing

# ─── Testing ───
pnpm test             # Run unit tests
pnpm test:e2e         # Run end-to-end tests

# ─── Database ───
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run Prisma migrations
pnpm db:seed          # Seed the database
```

## License

Private — All rights reserved.

## Documentation

Detailed documentation lives in the [`docs/`](./docs) directory:

- [Architecture Overview](./docs/architecture/overview.md)
- [Folder Structure](./docs/conventions/folder-structure.md)
- [Naming Conventions](./docs/conventions/naming-conventions.md)
- [API Standards](./docs/engineering/api-standards.md)
- [Frontend Standards](./docs/engineering/frontend-standards.md)
- [Backend Standards](./docs/engineering/backend-standards.md)
- [Testing Standards](./docs/engineering/testing-standards.md)
- [PR Checklist](./docs/conventions/pull-request-checklist.md)
- [Getting Started](./docs/onboarding/getting-started.md)

---

## Governance & Scaling

### Package Creation Rules

- **Create** only for isolated, reusable logic across 3+ apps.
- **Merge** if <5 exports or overlapping responsibility.
- **Leaf rule**: `shared` and `contracts` must never import other internal packages.

### Import Standards

- ✅ `import { X } from '@ecom/contracts'`
- ✅ `import { Y } from '@ecom/shared/constants'`
- ❌ `import { Z } from '@ecom/shared/pagination'` (use explicit layers)

### Future Roadmap

- **Domain Extraction**: Extract `@ecom/domain-*` when logic crosses 3+ apps.
- **Grouping**: Group into `infrastructure/`, `domains/`, `ui/` when package count >25.
