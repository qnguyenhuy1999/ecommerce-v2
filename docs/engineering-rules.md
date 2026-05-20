# Engineering Rules

## General

- Keep docs short and update source-of-truth docs when workflow or architecture changes.
- Match the nearest established pattern in the app or package you are editing.
- Do not introduce new abstractions or folder patterns without repeated need.
- Use TypeScript strict mode. Avoid `any`.
- Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.). Husky enforces this on commit.

## Imports and boundaries

- Import workspace code through `@ecom/<name>` entrypoints, not relative paths into sibling workspaces.
- Prefer narrow exports when they exist: `@ecom/shared/constants`, `@ecom/contracts/http`, `@ecom/contracts/enums`, etc.
- Do not redefine shared enums or response shapes in app code. Import from `@ecom/contracts`.
- Keep `@ecom/shared` and `@ecom/contracts` free of other internal package dependencies.
- `@ecom/ui-*` packages must not depend on each other.
- Check dependency boundaries with `pnpm lint:deps` and cycles with `pnpm lint:circular`.

## Naming

- NestJS files use standard suffixes: `.module.ts`, `.controller.ts`, `.service.ts`, `.guard.ts`, `.decorator.ts`, `.gateway.ts`.
- DTO files use descriptive kebab-case names.
- React hooks start with `use`.
- App-level React components commonly use kebab-case filenames.
- UI package components commonly use PascalCase files and folders.
- Prefer the naming already used in the local module over repo-wide renames.

## Frontend

- Follow the local app pattern before copying structure from another app.
- `apps/admin` is the strongest frontend reference for feature folder structure and data-fetching patterns.
- Use app-local `src/lib/api.ts` wrappers around `@ecom/config/api-client`.
- Preserve `credentials: 'include'` on auth-sensitive requests.
- Put generic reusable UI in `@ecom/core-ui`.
- Put seller-specific reusable UI in `@ecom/ui-seller`.
- Keep route-specific or one-off UI inside the app.
- Do not introduce new global state libraries casually.

## Backend

- Keep controllers thin. Services own business logic.
- Use DTOs with `class-validator` for all request validation.
- Return domain data from services and let `ResponseInterceptor` wrap the response shape.
- Use shared filters, interceptors, config helpers, constants, and typed errors from `@ecom/nestjs-core` and `@ecom/shared`.
- Keep bootstrap behavior aligned with the existing API apps (see `API baseline` in `project-context.md`).
- `api-admin` uses the `/admin` global route prefix. Do not add a prefix to `api-storefront` or `api-seller`.
- For background jobs, use BullMQ via `@nestjs/bullmq` (already wired in `api-seller`).
- For real-time events, use Socket.IO via `@nestjs/websockets` (already wired in `api-seller`).

## API and contracts

- `@ecom/contracts/http` is the response-shape source of truth.
- Browser-facing auth is session-cookie based.
- After any API contract change, run `pnpm openapi:sync`.
- Do not hand-edit generated OpenAPI JSON files or generated contract types under `@ecom/contracts/generated`.

## Database

- Prisma schema lives in `packages/database/prisma/schema.prisma`.
- Run `pnpm db:generate` after schema changes to regenerate the Prisma client.
- Run `pnpm db:migrate` for dev migrations. Use `pnpm db:deploy` for production.
- Do not import Prisma client directly in frontend apps. Use `@ecom/database`.
- Enums in the schema should stay in sync with enums in `@ecom/contracts/enums`.

## UI placement

Use this order:

1. `@ecom/core-ui` for generic reusable UI (design system components, tokens, providers)
2. App-specific UI packages (`@ecom/ui-seller`, `@ecom/ui-admin`, `@ecom/ui-storefront`) only when reuse within that app family is clear
3. App-local components for route-specific or one-off UI

## Storybook

Each UI package has its own Storybook instance:

| Package               | Port   |
| --------------------- | ------ |
| `@ecom/core-ui`       | `6006` |
| `@ecom/ui-admin`      | `6007` |
| `@ecom/ui-seller`     | `6008` |
| `@ecom/ui-storefront` | `6009` |

Run with `pnpm --filter @ecom/<name> storybook`.

## Testing

- Update existing tests when behavior changes.
- Add tests first in packages that already have a test setup (e.g. `@ecom/shared` uses Vitest).
- Prefer Vitest for package-level tests.
- Keep tests close to the code they cover.
- Be explicit about testing gaps when coverage is missing.
- Treat `pnpm test:e2e` as reserved infrastructure unless an actual package-level e2e target exists.

## Pre-review checklist

Before opening a PR, verify:

```bash
pnpm lint
pnpm type-check
pnpm format:check
pnpm lint:circular
pnpm lint:deps
```

If backend APIs changed:

```bash
pnpm openapi:sync
# review generated output before committing
pnpm contracts:check
```

If shared docs or workflow changed, update:

- `README.md`
- `docs/project-context.md`
- `docs/engineering-rules.md`
