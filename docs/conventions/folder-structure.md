# Folder Structure Conventions

This document describes the patterns that exist in the repository today. Use the nearest existing pattern in the same app or package instead of forcing one universal layout everywhere.

## NestJS apps

### `apps/api-admin`

`api-admin` is organized by domain module:

```text
src/
  auth/
    decorators/
    guards/
    auth.controller.ts
    auth.module.ts
    auth.service.ts
    session.provider.ts
  common/
    decorators/
    interceptors/
  <domain>/
    dto/
    <domain>.controller.ts
    <domain>.module.ts
    <domain>.service.ts
  app.module.ts
  generate-openapi.ts
  main.ts
```

Examples of domain folders: `users`, `sellers`, `products`, `reviews`, `refunds`, `dashboard`, `banners`, `notifications`, `categories`, `promotions`, `audit-logs`.

### `apps/api-seller`

`api-seller` follows the same domain-first layout, but it also includes specialized subfolders where needed:

```text
src/
  auth/
    decorators/
    dto/
    guards/
  common/
    config/
  queue/
    processors/
  order/
    dto/
    repositories/
  chat/
    dto/
    chat.gateway.ts
  email/
    templates/
  <domain>/
    dto/
    <domain>.controller.ts
    <domain>.module.ts
    <domain>.service.ts
  app.module.ts
  generate-openapi.ts
  main.ts
```

Use feature-local `repositories/`, `templates/`, or `processors/` folders only when a module actually needs them.

### `apps/api-storefront`

`api-storefront` is currently much smaller and centered on auth:

```text
src/
  auth/
    decorators/
    guards/
    auth.controller.ts
    auth.module.ts
    auth.service.ts
    session.provider.ts
  email/
    templates/
  app.module.ts
  generate-openapi.ts
  main.ts
```

## Next.js apps

### `apps/admin`

`admin` is the strongest example of the current frontend structure:

```text
src/
  app/
    (dashboard)/
    login/
    layout.tsx
    page.tsx
  components/
    layout/
  features/
    <feature>/
      api/
      components/
      hooks/
      schemas/      optional
  lib/
    api.ts
    api-types.ts
    query-client.tsx
  providers/
  middleware.ts
```

Use `features/<feature>/` when the code has its own API calls, hooks, and UI composition.

### `apps/seller`

`seller` is flatter than `admin`:

```text
src/
  app/
    <route>/page.tsx
    layout.tsx
    page.tsx
  components/
  hooks/
  lib/
    api.ts
  middleware/
  providers/
  middleware.ts
```

Most seller routes render app-local components directly today.

### `apps/storefront`

`storefront` is currently minimal:

```text
src/
  app/
    layout.tsx
    page.tsx
  hooks/
  middleware/
  providers/
  middleware.ts
```

Do not invent a deeper feature structure in `storefront` unless the app actually grows into it.

## Shared packages

### `packages/core-ui`

`core-ui` is the main UI reference for package layout:

```text
src/
  atoms/
  molecules/
  organisms/
  layouts/
  primitives/
    ui/
  hooks/
  lib/
  providers/
  styles/
  tokens/
  index.ts
```

### `packages/ui-seller`

`ui-seller` is page-oriented instead of atomic:

```text
src/
  layouts/
  pages/
    <PageName>/
  styles/
  index.ts
```

### `packages/ui-admin` and `packages/ui-storefront`

These packages currently contain lightweight shells:

```text
src/
  lib/
  styles/
  index.ts
```

Add app-specific reusable UI here only when it is shared enough to justify package ownership.

### Utility and platform packages

Common current layouts:

```text
packages/shared/src/
  constants/
  errors/
  pagination/
    core/
    nestjs/
    prisma/
    react/
  utils/

packages/contracts/src/
  auth/
  common/
  enums/
  generated/
  http/
  order/
  product/

packages/config/src/
  env/
  tooling/

packages/nestjs-core/src/
  nestjs/
  openapi/

packages/database/src/
  client.ts
  prisma.service.ts
  database.module.ts
  generated/

packages/auth/src/
  next/
  session.service.ts
  cookie.config.ts
  helpers.ts
```

## Practical rule

Before creating a new folder:

1. find the closest existing example in the same app or package
2. follow that local pattern
3. only introduce a new structural pattern when repeated use justifies it
