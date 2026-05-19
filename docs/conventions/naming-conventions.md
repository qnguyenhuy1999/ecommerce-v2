# Naming Conventions

Use the naming already established in the surrounding code. The repo is not fully uniform, but there are clear patterns worth preserving.

## Files

| Type               | Convention                                                | Examples                                                           |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------------------ |
| NestJS module      | `<name>.module.ts`                                        | `users.module.ts`, `order.module.ts`                               |
| NestJS controller  | `<name>.controller.ts`                                    | `auth.controller.ts`, `warehouse.controller.ts`                    |
| NestJS service     | `<name>.service.ts`                                       | `products.service.ts`, `chat.service.ts`                           |
| NestJS gateway     | `<name>.gateway.ts`                                       | `chat.gateway.ts`                                                  |
| Decorator          | `<name>.decorator.ts`                                     | `current-user.decorator.ts`                                        |
| Guard              | `<name>.guard.ts`                                         | `auth.guard.ts`, `permission.guard.ts`                             |
| DTO                | descriptive kebab-case                                    | `user-query.dto.ts`, `update-order-status.dto.ts`, `banner.dto.ts` |
| React component    | `kebab-case.tsx` in apps, `PascalCase.tsx` in UI packages | `dashboard-page.tsx`, `ConsoleLayout.tsx`                          |
| React hook         | `use-<name>.ts` or `use-<name>.tsx`                       | `use-users.ts`, `use-protected-route.ts`                           |
| Feature API module | `<feature>.api.ts`                                        | `users.api.ts`, `products.api.ts`                                  |
| Utility file       | descriptive kebab-case or `<Name>.utils.ts`               | `build-query.ts`, `ConsoleLayout.utils.ts`                         |
| Shared type file   | `<Name>.types.ts` or inline exports                       | `DataTable.types.ts`, `Products.types.ts`                          |

## Controller and service methods

The backend currently uses a mix of verbs. Prefer the verb style already used inside the same module.

Common controller method names in this repo:

- `findAll`
- `findById`
- `list`
- `getById`
- `create`
- `update`
- `updateStatus`
- action verbs such as `suspend`, `ban`, `activate`

Common service method names:

- `findAll`
- `findById`
- `list`
- `getStatusCounts`
- `updateStatus`
- `getShopId`

Do not rename code just to force one global verb standard if the local module is already consistent.

## React naming

- Hooks start with `use`.
- Providers end with `Provider`.
- Route-level components in apps often end with `-page`.
- Shared UI package components use PascalCase folder and file names, for example `ConsoleLayout`, `DataTable`, `StatCard`.

## Package names and imports

- Workspace packages use the `@ecom/<name>` convention.
- Import across package boundaries with package names, not relative paths.
- Prefer the narrow exported entrypoint when available, for example:
  - `@ecom/config/api-client`
  - `@ecom/contracts/http`
  - `@ecom/shared/constants`
  - `@ecom/nestjs-core/openapi`

## Enums and constants

- Enum names use PascalCase singular names such as `OrderStatus`.
- Enum values use `UPPER_SNAKE_CASE`.
- Shared constants live under `@ecom/shared/constants`.

## DTO naming guidance

Use the filename that best matches the role of the DTO:

- query DTOs: `<domain>-query.dto.ts`
- action DTOs: `<action>-<domain>.dto.ts`
- grouped DTOs for a module: `<domain>.dto.ts`

Choose the pattern that matches neighboring files in the same module.
