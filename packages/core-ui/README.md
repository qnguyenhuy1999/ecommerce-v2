# 📘 UI Core (Design System)

This package contains the **core design system (ui-core)** used across:

- Storefront
- Seller Center
- Admin Panel

It acts as the **foundation layer** for all UI packages.

---

# 🎯 Goal

Provide **reusable, scalable, and consistent UI primitives** that:

- Ensure design consistency across all domains
- Reduce duplication
- Improve development speed
- Support Next.js (RSC) architecture

---

# 🧱 Responsibilities

`ui-core` is responsible for:

- Base components (Button, Input, Modal, etc.)
- Design tokens (CSS variables)
- Shared UI patterns
- Wrapping primitives/ui primitives

---

# 🧩 Atomic Design System

The core UI follows **Atomic Design principles**:

atoms → molecules → organisms

---

## 🟢 Atoms

Smallest UI building blocks.

Examples:

- Button
- Input
- Badge
- Avatar

👉 Rules:
- No business logic
- Highly reusable
- Minimal styling variants

---

## 🔵 Molecules

Combination of atoms forming functional components.

Examples:

- InputField (Label + Input + Error)
- SearchBox
- FormControl

👉 Rules:
- Still generic
- No domain-specific logic

---

## 🟣 Organisms

More complex reusable UI sections.

Examples:

- Modal
- Dropdown
- FormSection

👉 Rules:
- Can manage internal state (optional)
- Still NOT tied to business domain

---

⚠️ Note:
- `ui-core` should NOT contain templates or page-level components
- Domain-specific components belong in:
  - ui-storefront
  - ui-seller
  - ui-admin

---

# 🧩 Component Structure

Each component follows a modular structure:

ComponentName/
  ComponentName.tsx              # Pure UI (no "use client")
  ComponentName.client.tsx       # Optional (interactive)
  ComponentName.server.tsx       # Optional (server logic)

  ComponentName.types.ts
  ComponentName.styles.ts

  ComponentName.stories.tsx
  ComponentName.fixtures.ts

  index.ts

---

# 🧠 Design Principles

## 1. Pure UI First

- No business logic
- No data fetching
- No side effects

---

## 2. Opt-in Client Components

Use `.client.tsx` only when needed:

- Event handlers
- React hooks
- Interactivity

---

## 3. Server-first Compatibility

Use `.server.tsx` for:

- Data fetching
- Server-only logic

---

## 4. Controlled Exports

Always export via `index.ts`:

export * from "./ComponentName"

---

# 🎨 Styling System

- Tailwind CSS v4
- CSS Variables (Design Tokens)

Example:

:root {
  --color-primary: oklch(0.68 0.2 40);
  --radius: 0.5rem;
}

---

# 🧩 shadcn/ui Strategy

- Use shadcn as base primitives
- Wrap into internal components
- Do NOT use shadcn directly in apps

---

# 📚 Storybook

Used for:

- Component documentation
- Visual testing
- Collaboration

Run:
pnpm storybook

---

# 🧪 Fixtures

Each component includes fixtures for:

- Storybook
- Unit tests
- API mocking (MSW)
- E2E testing

---

# ⚙️ Development Rules

## ✅ Do

- Keep components reusable
- Use composition over props
- Support variants
- Keep logic outside UI

---

## ❌ Don't

- Add business logic
- Fetch data inside components
- Overuse `.client.tsx`

---

# 🚀 Scope

This package ONLY contains:

- Generic UI components (atoms, molecules, organisms)
- No domain-specific logic

---

# 🏁 Summary

`ui-core` is the **single source of truth for all base UI components**, enabling:

- Scalability
- Consistency
- Maintainability
