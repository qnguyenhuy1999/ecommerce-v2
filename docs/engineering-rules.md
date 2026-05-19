# Engineering Rules

## General

- Keep docs short and update source-of-truth docs when workflow or architecture changes.
- Match the nearest established pattern in the app or package you are editing.
- Do not introduce new abstractions or folder patterns without repeated need.
- Use TypeScript strict mode. Avoid `any`.
- Use Conventional Commits.

## Imports and boundaries

- Import workspace code through `@ecom/<name>` entrypoints.
- Prefer narrow exports when they exist, such as `@ecom/shared/constants` or `@ecom/contracts/http`.
- Do not redefine shared enums or response shapes in app code.
- Keep `@ecom/shared` and `@ecom/contracts` free of other internal package dependencies.
- Check dependency boundaries with `pnpm lint:deps` and cycles with `pnpm lint:circular`.

## Naming

- NestJS files use standard suffixes: `.module.ts`, `.controller.ts`, `.service.ts`, `.guard.ts`, `.decorator.ts`, `.gateway.ts`.
- DTO files use descriptive kebab-case.
- Hooks start with `use`.
- App-level React components commonly use kebab-case filenames.
- UI package components commonly use PascalCase files and folders.
- Prefer the naming already used in the local module over repo-wide renames.

## Frontend

- Follow the local app pattern before copying structure from another app.
- Use app-local `src/lib/api.ts` wrappers around `@ecom/config/api-client`.
- Preserve `credentials: 'include'` on auth-sensitive requests.
- Put generic reusable UI in `@ecom/core-ui`.
- Put seller-specific reusable UI in `@ecom/ui-seller`.
- Keep route-specific or one-off UI inside the app.
- Do not introduce new global state libraries casually.

## Backend

- Keep controllers thin and services responsible for business logic.
- Use DTOs with `class-validator` for request validation.
- Return domain data and let `ResponseInterceptor` wrap responses.
- Use shared filters, interceptors, config helpers, constants, and typed errors where available.
- Keep bootstrap behavior aligned with the existing API apps.

## API and contracts

- `@ecom/contracts/http` is the response-shape source of truth.
- Browser-facing auth is session-cookie based.
- After API contract changes, run `pnpm openapi:sync`.
- Do not hand-edit generated OpenAPI artifacts or generated contract types.

## UI placement

Use this order:

1. `@ecom/core-ui` for generic reusable UI
2. app-specific UI packages only when reuse inside that app family is clear
3. app-local components for route-specific code

Do not make `@ecom/ui-*` packages depend on each other.

## Testing

- Update existing tests when behavior changes.
- Add tests first in packages that already support them.
- Prefer Vitest for package-level tests.
- Keep tests close to the code they cover.
- Be explicit about testing gaps when coverage is missing.
- Treat `pnpm test:e2e` as reserved infrastructure unless an actual package-level e2e target exists.

## Review

Before review, check:

- `pnpm lint`
- `pnpm type-check`
- `pnpm format:check`
- `pnpm lint:circular`
- `pnpm lint:deps`

If backend APIs changed, also check:

- `pnpm openapi:sync`
- generated contract output was reviewed, not committed blindly
- request and response shapes still match shared contracts

If shared docs or workflow changed, update:

- `README.md`
- `docs/project-context.md`
- `docs/engineering-rules.md`
