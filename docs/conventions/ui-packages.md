# UI Packages — Conventions

Conventions that apply to all UI packages: `@ecom/core-ui`, `@ecom/ui-seller`, `@ecom/ui-admin`, `@ecom/ui-storefront`.

---

## Package responsibilities

| Package               | Purpose                                                                               |
| --------------------- | ------------------------------------------------------------------------------------- |
| `@ecom/core-ui`       | Shared primitives, design tokens, and base components consumed by all app UI packages |
| `@ecom/ui-seller`     | Seller console — domain-specific components and layouts                               |
| `@ecom/ui-admin`      | Admin panel — domain-specific components and layouts                                  |
| `@ecom/ui-storefront` | Buyer-facing storefront — domain-specific components and layouts                      |

**Dependency direction:** app UI packages depend on `@ecom/core-ui`. They never depend on each other.

```
@ecom/core-ui
    ↑         ↑         ↑
ui-seller  ui-admin  ui-storefront
```

Always import shared primitives from `@ecom/core-ui`. Never re-implement what already exists there.

---

## Folder structure

Every UI package uses the same atomic folder layout:

```
src/
├── atoms/        # Smallest indivisible UI units
├── molecules/    # Compositions of atoms
├── organisms/    # Complex, self-contained UI sections
├── layouts/      # Full-page shells and layout templates
├── pages/        # Page-level compositions (rare — prefer app-level pages)
├── hooks/        # UI-specific React hooks
├── lib/          # Utilities (cn, formatters, etc.)
└── styles/       # Package-level CSS
```

### Layer definitions

**atoms** — Single-responsibility, no business logic. No internal state beyond what the primitive requires.

**molecules** — Compose two or more atoms. May have limited local state.

**organisms** — Self-contained sections with their own data shape. Compose molecules and atoms.

**layouts** — Full-page shells. Compose organisms and accept `children`. No business logic.

When in doubt about which layer a component belongs to: if it can be broken into smaller pieces, it is not an atom. If it owns a full section of a page, it is an organism. If it wraps the whole page, it is a layout.

---

## File naming

| File                        | When to use                                                                    |
| --------------------------- | ------------------------------------------------------------------------------ |
| `ComponentName.tsx`         | Default — server component or framework-agnostic component                     |
| `ComponentName.client.tsx`  | Requires `'use client'` — state, effects, browser APIs, or client-only context |
| `ComponentName.types.ts`    | Shared TypeScript interfaces and types for a component family                  |
| `ComponentName.utils.ts`    | Pure helper functions and default values for a component family                |
| `ComponentName.fixtures.ts` | Static data used as defaults or in Storybook stories                           |
| `ComponentName.stories.tsx` | Storybook stories                                                              |
| `index.ts`                  | Barrel export — use when a folder exports multiple named items                 |

Each component lives in its own folder named after the component:

```
src/<layer>/<ComponentName>/
├── <ComponentName>.tsx
├── <ComponentName>.types.ts     # if the type surface is non-trivial
├── <ComponentName>.utils.ts     # if helpers or defaults are needed
├── <ComponentName>.fixtures.ts  # if static data is needed
├── <ComponentName>.stories.tsx
└── index.ts                     # if multiple named exports
```

---

## Server vs client components

**Default to server components.** Add `'use client'` only when the component directly needs:

- `useState` or `useReducer`
- `useEffect` or `useLayoutEffect`
- Browser APIs (`window`, `document`, `localStorage`, etc.)
- A context whose provider is a client component
- Event handlers that require client-side interactivity beyond standard HTML

**Never add `'use client'` to:**

- Components that only render markup and pass props down
- Layout shells that compose client islands as children
- Components that only use server-safe hooks (`use`, `cache`, async functions)

### Client island pattern

A server component can render a client component as a child. The client component becomes an isolated island of interactivity. Pass all required data as props from the server.

```tsx
// ServerSection.tsx — no 'use client'
import { ClientDropdown } from './ClientDropdown.client'

export function ServerSection({ items }: { items: string[] }) {
  return (
    <section>
      <h2>Section</h2>
      <ClientDropdown items={items} />
    </section>
  )
}
```

```tsx
// ClientDropdown.client.tsx
'use client'

export function ClientDropdown({ items }: { items: string[] }) {
  // state, effects, browser APIs allowed here
}
```

When a component family has both server and client parts, split them:

```
<ComponentName>.tsx          # Server shell — orchestrates layout, passes props
<ComponentName>.client.tsx   # Client island — isolated interactivity
<ComponentName>.types.ts     # Shared types used by both
```

---

## Adding a component

1. Decide the layer (atom / molecule / organism / layout).
2. Create `src/<layer>/<ComponentName>/` folder.
3. Add the implementation file. If it needs client interactivity, split into `.tsx` + `.client.tsx`.
4. Add a `.stories.tsx` file.
5. Export from the package `src/index.ts`.

For `@ecom/core-ui` — the component must be generic and reusable across apps. No domain logic.

For app-specific packages — the component may contain domain logic but must import primitives from `@ecom/core-ui`, not redefine them.

---

## Storybook

Each package has its own Storybook instance. Run with:

```bash
pnpm --filter @ecom/<package-name> storybook
```

Place stories next to the component (`ComponentName.stories.tsx`). Use `tags: ['autodocs']` for automatic prop documentation.

---

## Type-check and lint

```bash
pnpm --filter @ecom/<package-name> type-check
pnpm --filter @ecom/<package-name> lint

# All packages at once
pnpm type-check
pnpm lint
```

TypeScript is strict. No `any`. Use `unknown` + type guards when the shape is truly unknown.
