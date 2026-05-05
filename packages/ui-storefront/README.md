# UI Storefront

Domain UI package for the **Customer-Facing Storefront** of the ecommerce platform.

Consumes `@ecom/core-ui` primitives and adds storefront-specific components.

---

# Goal

Provide storefront-specific UI components for:

- Product browsing and detail views
- Shopping cart
- Checkout flow
- Search and filtering
- Customer profile

---

# Structure

```
src/
├── atoms/        Storefront-specific atomic components
├── molecules/    Storefront-specific molecule components
├── organisms/    Storefront-specific organism components
├── layouts/      Storefront shell layouts (header, footer, nav)
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

Storefront-specific smallest building blocks that extend `core-ui` atoms.

Rules:
- No business logic
- Compose or extend `@ecom/core-ui` atoms
- Storefront-specific variants only

## Molecules

Combinations of atoms forming storefront-specific functional components.

Examples: ProductCard, PriceTag, RatingStars, CartItem

## Organisms

Complex storefront UI sections.

Examples: ProductGrid, CartDrawer, CheckoutForm, SearchBar

## Layouts

Storefront shell layout components.

Examples: StorefrontHeader, StorefrontFooter, StorefrontLayout

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
- Storefront-specific overrides in `src/styles/globals.css`

---

# Storybook

```bash
pnpm storybook   # port 6009
```

---

# Development Rules

## Do

- Extend `core-ui` components via composition
- Keep components reusable within the storefront domain
- Support dark mode via Tailwind dark variant

## Don't

- Add business logic or data fetching
- Import directly from `src/primitives` of core-ui — use the public API
- Duplicate components that exist in `core-ui`
