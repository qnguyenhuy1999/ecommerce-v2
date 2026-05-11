# Naming Conventions

## Layer-Specific Verb Prefixes

| Layer | Verb | Example |
|-------|------|---------|
| Controller methods | `find`, `create`, `update`, `remove` | `findAll()`, `findOne()`, `create()`, `update()`, `remove()` |
| Service methods | `find`, `create`, `update`, `remove`, `validate` | `findById()`, `createProduct()` |
| React hooks | `use` | `useProducts()`, `useAuth()` |
| Client API calls | `fetch` | `fetchProducts()`, `fetchOrderById()` |
| Event handlers | `handle`, `on` | `handleSubmit()`, `onOrderCreated()` |
| Boolean variables | `is`, `has`, `can`, `should` | `isLoading`, `hasPermission` |
| Factories | `create`, `build` | `createOrderDto()`, `buildQuery()` |

## Avoid

- `get` prefix in controllers (use `find` for queries)
- `load` / `retrieve` (use `fetch` for client, `find` for server)
- Mixing verbs within the same layer

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| NestJS module | `<name>.module.ts` | `products.module.ts` |
| NestJS controller | `<name>.controller.ts` | `products.controller.ts` |
| NestJS service | `<name>.service.ts` | `products.service.ts` |
| DTO | `<action>-<entity>.dto.ts` | `create-product.dto.ts` |
| React component | `PascalCase.tsx` | `ProductCard.tsx` |
| React hook | `use<Name>.ts` | `useProducts.ts` |
| Constants | `kebab-case.ts` | `cache-keys.ts` |
| Types/interfaces | `<name>.types.ts` or inline | `product.types.ts` |

## Enum Naming

- Enum names: `PascalCase` singular (`OrderStatus`, not `OrderStatuses`)
- Enum values: `UPPER_SNAKE_CASE` (`PENDING`, `IN_PROGRESS`)
- All domain enums live in `@ecom/contracts/enums`

## Package Naming

- Workspace packages: `@ecom/<kebab-case-name>`
- Internal imports: always use the package name, never relative paths across package boundaries
