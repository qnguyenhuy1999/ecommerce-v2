# Caveman field notes (ecommerce-v2)

Few words. Less tokens. More code. Ugg.

## Repo grunt

PNPM + Turborepo monorepo. Node >=24, pnpm >=11.

- `apps/` — storefront, seller, admin (Next.js 16, React 19, Tailwind v4) + api-storefront, api-seller, api-admin, worker (NestJS + Prisma)
- `packages/` — `shared`, `contracts`, `nestjs-core`, `database`, `auth`, `redis`, `email`, `config`, `core-ui`, `ui-storefront`, `ui-seller`, `ui-admin`, `eslint-config`

Leaf rule: `@ecom/shared` and `@ecom/contracts` import nothing internal.

## Cave commands

```bash
pnpm dev            # all apps watch
pnpm build          # turbo build
pnpm lint           # eslint
pnpm type-check     # tsc
pnpm test           # unit
pnpm test:e2e       # e2e
pnpm format         # prettier write
pnpm db:generate    # prisma client
pnpm db:migrate     # prisma migrate dev
pnpm openapi:sync   # swagger gen + types
pnpm contracts:check# openapi + types sanity
```

Filter one pkg: `pnpm --filter @ecom/<name> <script>`.

## Fire rules

- TypeScript strict. No `any`. Ugg bad.
- Import enums from `@ecom/contracts`, never redefine.
- Use explicit shared layer: `@ecom/shared/constants`, not bare root.
- API shape = `ApiResponse` from `@ecom/contracts`. Filters/interceptors from `@ecom/nestjs-core`.
- Swagger is source of truth. Run `pnpm openapi:sync` after API changes.
- Conventional commits (`feat:`, `fix:`, `chore:` ...). Husky will grunt at you.
- No circular deps. `pnpm lint:circular` + `pnpm lint:deps` must pass.

## Deeper cave drawings

Docs in `docs/` (architecture, conventions, engineering standards). Read before inventing.

- `docs/conventions/folder-structure.md` — folder layout for apps and packages
- `docs/conventions/naming-conventions.md` — file, function, and enum naming rules
- `docs/conventions/ui-packages.md` — UI packages reference: atomic layers, server/client component rules, file naming, adding components (`@ecom/core-ui`, `@ecom/ui-seller`, `@ecom/ui-admin`, `@ecom/ui-storefront`)
- `docs/engineering/frontend-standards.md` — state management, data fetching, styling, a11y
- `docs/engineering/backend-standards.md` — NestJS patterns, service/controller rules
- `docs/engineering/api-standards.md` — API shape, Swagger, openapi sync
- `docs/engineering/testing-standards.md` — unit and e2e testing rules

## graphify

Knowledge graph at `graphify-out/`.

- Before architecture or codebase questions: read `graphify-out/GRAPH_REPORT.md`.
- If `graphify-out/wiki/index.md` exists, walk it instead of raw files.
- After editing code this session, keep graph fresh:
  ```bash
  python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
  ```
