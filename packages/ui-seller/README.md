# UI Seller

Domain UI package for the **Seller Center** of the ecommerce platform.

Consumes `@ecom/core-ui` primitives and adds seller-specific components.

---

# Goal

Provide seller-specific UI components for:

- Product listing and management
- Order management
- Inventory tracking
- Store analytics
- Store settings

---

# Structure

```
src/
├── atoms/        Seller-specific atomic components
├── molecules/    Seller-specific molecule components
├── organisms/    Seller-specific organism components
├── layouts/      Seller shell layouts (sidebar, topbar, nav)
├── pages/        Full page compositions
├── hooks/        UI-only hooks
├── lib/
│   └── utils.ts
├── styles/
│   └── globals.css
└── index.ts
```

---

# Component Convention

Each component follows the same structure as `core-ui`:

```
ComponentName/
  ComponentName.tsx           # Pure UI, no business logic
  ComponentName.types.ts      # Props interface
  ComponentName.stories.tsx   # Storybook story
  index.ts                    # export * from './ComponentName'
```

---

# Atomic Design Layers

## Atoms

Seller-specific smallest building blocks that extend `core-ui` atoms.

Rules:
- No business logic
- Compose or extend `@ecom/core-ui` atoms
- Seller-specific variants only

## Molecules

Combinations of atoms forming seller-specific functional components.

Examples: ProductRow, OrderStatusBadge, InventoryCell

## Organisms

Complex seller UI sections.

Examples: ProductTable, OrderManagementPanel, StoreAnalyticsChart

## Layouts

Seller shell layout components.

Examples: SellerSidebar, SellerTopbar, SellerLayout

## Pages

Full page compositions assembled from layouts and organisms.

---

# Design Principles

- Consume `@ecom/core-ui` as the base layer — do not reimplement primitives
- No data fetching inside components
- No business logic in UI components
- Use `.client.tsx` suffix only for interactive components
- Export everything via `index.ts`

---

# Styling

- Tailwind CSS v4
- Inherits design tokens from `@ecom/core-ui`
- Seller-specific overrides in `src/styles/globals.css`

---

# Storybook

```bash
pnpm storybook   # port 6008
```

---

# Development Rules

## Do

- Extend `core-ui` components via composition
- Keep components reusable within the seller domain
- Support dark mode via Tailwind dark variant

## Don't

- Add business logic or data fetching
- Import directly from `src/primitives` of core-ui — use the public API
- Duplicate components that exist in `core-ui`
