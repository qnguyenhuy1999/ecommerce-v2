# UI Packages Conventions

This repository has one mature shared UI package and three app-facing UI packages at different stages of adoption.

## Package roles

| Package               | Current role                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `@ecom/core-ui`       | Main design-system package with reusable primitives, composed components, layouts, tokens, styles, and Storybook stories |
| `@ecom/ui-seller`     | Seller-specific layouts and page compositions                                                                            |
| `@ecom/ui-admin`      | Admin UI package shell, currently minimal                                                                                |
| `@ecom/ui-storefront` | Storefront UI package shell, currently minimal                                                                           |

## Dependency direction

Use this direction:

```text
@ecom/core-ui
  ^
  +-- @ecom/ui-seller
  +-- @ecom/ui-admin
  +-- @ecom/ui-storefront
```

Do not make the app UI packages depend on each other.

## What belongs in `@ecom/core-ui`

Put code in `@ecom/core-ui` when it is:

- generic across more than one app
- not tied to seller-only or admin-only business behavior
- useful as a design-system primitive or composition

Current structure:

```text
src/
  atoms/
  molecules/
  organisms/
  layouts/
  primitives/ui/
  hooks/
  lib/
  providers/
  styles/
  tokens/
```

Examples already in the package:

- primitives such as `button`, `input`, `card`, `table`, `sheet`, `select`
- composed components such as `DataTable`, `Sidebar`, `StatCard`, `Timeline`, `Tooltip`
- layouts such as `ConsoleLayout` and `ConsolePageLayout`

## What belongs in `@ecom/ui-seller`

Put code in `@ecom/ui-seller` when it is clearly seller-facing and reusable across seller pages, but not generic enough for `@ecom/core-ui`.

Current structure:

```text
src/
  layouts/
  pages/
    Dashboard/
    ProductDetail/
    Products/
  styles/
```

This package is page-composition oriented today. Follow that pattern unless there is a strong reason to refactor it.

## What belongs in `@ecom/ui-admin` and `@ecom/ui-storefront`

These packages are currently thin:

```text
src/
  lib/
  styles/
  index.ts
```

Use them only when you are extracting reusable app-specific UI out of `apps/admin` or `apps/storefront`. Do not create package churn for one-off components.

## Naming and structure guidance

- In apps, route and feature components commonly use kebab-case filenames.
- In UI packages, component directories and files commonly use PascalCase.
- Keep stories next to the component in shared UI packages when Storybook coverage exists.
- Keep package `index.ts` exports intentional. Do not export internal helpers by default.

## Styling

- Shared base styles live in each package under `src/styles/globals.css`.
- `@ecom/core-ui` is the source of design tokens.
- Prefer reusing existing primitives and layout helpers before adding new visual patterns.

## Placement rule of thumb

1. If the component is generic and reusable across apps, start in `@ecom/core-ui`.
2. If it is seller-specific and likely reused across seller pages, use `@ecom/ui-seller`.
3. If it is only used once or tightly coupled to one route, keep it in the app for now.
