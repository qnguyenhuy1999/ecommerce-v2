# UI Admin

Domain UI package for the **Admin Panel** of the ecommerce platform.

Consumes `@ecom/core-ui` primitives and adds admin-specific components.

---

# Goal

Provide admin-specific UI components for:

- User & role management
- Analytics dashboards
- System configuration
- Reports and data tables

---

# Structure

```
src/
├── atoms/        Admin-specific atomic components
├── molecules/    Admin-specific molecule components
├── organisms/    Admin-specific organism components
├── layouts/      Admin shell layouts (sidebar, topbar, nav)
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

Admin-specific smallest building blocks that extend `core-ui` atoms.

Rules:

- No business logic
- Compose or extend `@ecom/core-ui` atoms
- Admin-specific variants only

## Molecules

Combinations of atoms forming admin-specific functional components.

Examples: StatsCard, UserRow, RoleTag

## Organisms

Complex admin UI sections.

Examples: AdminTable, UserManagementPanel, AnalyticsChart

## Layouts

Admin shell layout components.

Examples: AdminSidebar, AdminTopbar, AdminLayout

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
- Admin-specific overrides in `src/styles/globals.css`

---

# Storybook

```bash
pnpm storybook   # port 6007
```

---

# Development Rules

## Do

- Extend `core-ui` components via composition
- Keep components reusable within the admin domain
- Support dark mode via Tailwind dark variant

## Don't

- Add business logic or data fetching
- Import directly from `src/primitives` of core-ui — use the public API
- Duplicate components that exist in `core-ui`
