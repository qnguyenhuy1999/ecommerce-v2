# Folder Structure Conventions

## NestJS Apps (`apps/api-*`)

Each module follows this structure:

```
src/
├── <module>/
│   ├── <module>.controller.ts    # HTTP layer — route handlers
│   ├── <module>.service.ts       # Business logic
│   ├── <module>.module.ts        # NestJS module definition
│   ├── dto/                      # Request/response DTOs (class-validator)
│   │   ├── create-<entity>.dto.ts
│   │   └── update-<entity>.dto.ts
│   ├── mappers/                  # Entity ↔ DTO transformations (optional)
│   └── policies/                 # Authorization policies (optional)
├── common/
│   ├── decorators/               # Custom decorators
│   ├── guards/                   # Auth guards
│   └── pipes/                    # Custom pipes
├── app.module.ts
└── main.ts
```

## Next.js Apps (`apps/storefront`, `apps/seller`, `apps/admin`)

```
src/
├── app/                          # Next.js App Router pages
│   ├── (dashboard)/              # Route groups
│   └── layout.tsx
├── features/                     # Domain-specific feature modules
│   └── <feature>/
│       ├── components/           # Feature-specific components
│       ├── hooks/                # Feature-specific hooks
│       ├── api/                  # API call functions (fetchX)
│       └── types.ts              # Feature-specific types
├── components/                   # Shared app-level components (layout, etc.)
├── lib/                          # App-level utilities (api client, query-client)
├── providers/                    # React context providers
└── middleware.ts                 # Next.js middleware
```

## Packages

```
packages/
├── shared/                       # Leaf — universal primitives
│   └── src/
│       ├── constants/            # Exported constants (cache-keys, events, queues, etc.)
│       ├── errors/               # Typed error classes (AppError, ValidationError, etc.)
│       ├── pagination/           # Layered pagination (core, prisma, react, nestjs)
│       └── utils/                # Pure utility functions
├── contracts/                    # Leaf — domain types & enums
│   └── src/
│       ├── enums/                # All domain enums
│       ├── http/                 # ApiResponse, ApiErrorResponse types
│       ├── product/              # Product-related contracts
│       ├── order/                # Order-related contracts
│       ├── auth/                 # Auth-related contracts
│       └── common/               # Shared DTO base classes
├── nestjs-core/                  # NestJS infrastructure
│   └── src/
│       ├── nestjs/               # Filters, interceptors, logger module
│       └── openapi/              # Swagger document builder
├── core-ui/                      # Base React component library
│   └── src/
│       ├── components/           # Reusable UI components
│       ├── tokens/               # Design tokens (spacing, radius, shadow, z-index, typography)
│       ├── providers/            # Theme provider
│       └── styles/               # Global CSS
└── config/                       # Runtime config, ESLint flat configs, Prettier/commitlint, TS presets
    └── src/tooling/              # Shared tooling config sources
```

## Dependency Boundaries (enforced)

- `shared` and `contracts` are **leaves** — no internal imports allowed
- UI packages cannot import `@ecom/database`, `@ecom/nestjs-core`, or server pagination layers
- Backend packages cannot import `@ecom/shared/pagination/react`
- `@ecom/contracts` cannot import `@nestjs/swagger`
- No circular dependencies (enforced by `madge` and `dependency-cruiser`)
