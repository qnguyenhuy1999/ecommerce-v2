````md
# UI Packages — Conventions

This document is for both humans and AI agents. Keep components consistent, reusable, and easy to place in the right package.

Applies to:

- `@ecom/core-ui`
- `@ecom/ui-seller`
- `@ecom/ui-admin`
- `@ecom/ui-storefront`

---

## 1. Package responsibilities

| Package | Responsibility |
|---|---|
| `@ecom/core-ui` | Shared primitives, design tokens, and generic reusable components |
| `@ecom/ui-seller` | Seller console components, layouts, and domain-specific UI |
| `@ecom/ui-admin` | Admin panel components, layouts, and domain-specific UI |
| `@ecom/ui-storefront` | Buyer-facing storefront components, layouts, and domain-specific UI |

### Dependency direction

App UI packages may depend on `@ecom/core-ui`.

They must not depend on each other.

```txt
@ecom/core-ui
    ↑         ↑         ↑
ui-seller  ui-admin  ui-storefront
````

Always import shared primitives from `@ecom/core-ui`.

```tsx
// Good
import { Button, Card, Input } from '@ecom/core-ui'

// Bad
import { Button } from '@ecom/ui-admin'
```

---

## 2. Context scenario

The same product concept appears in different apps, but each app owns different domain behavior.

| Area           | Package               | Example                 | Domain behavior                             |
| -------------- | --------------------- | ----------------------- | ------------------------------------------- |
| Seller console | `@ecom/ui-seller`     | `SellerProductTable`    | Edit product, update stock, publish product |
| Admin panel    | `@ecom/ui-admin`      | `AdminProductTable`     | Approve, reject, suspend, view seller       |
| Storefront     | `@ecom/ui-storefront` | `StorefrontProductCard` | View product, price, rating, add to cart    |

Shared UI such as `Button`, `Badge`, `Card`, `Table`, and `Input` should come from `@ecom/core-ui`.

---

## 3. Folder structure

Each UI package follows the same structure.

```txt
src/
├── atoms/        # Smallest UI primitives
├── molecules/    # Small compositions of atoms
├── organisms/    # Full UI sections
├── layouts/      # Page shells and layout templates
├── pages/        # Page-level compositions, rarely used
├── hooks/        # UI-specific React hooks
├── lib/          # Utilities such as cn, formatters, mappers
└── styles/       # Package-level CSS
```

---

## 4. Layer rules

| Layer       | Use for                      | Rules                                               |
| ----------- | ---------------------------- | --------------------------------------------------- |
| `atoms`     | Smallest UI units            | Single responsibility, no business logic            |
| `molecules` | Small compositions           | Compose atoms, may have limited local UI state      |
| `organisms` | Self-contained page sections | Compose atoms/molecules, may know domain data shape |
| `layouts`   | Full-page shells             | Accept `children`, no business logic                |

Examples:

```txt
atoms:      Button, Input, Badge, Avatar
molecules:  SearchInput, FormField, UserMenu
organisms:  ProductTable, OrderSummary, SellerHeader
layouts:    SellerDashboardLayout, AdminConsoleLayout
```

Decision guide:

* If it is a primitive, use `atoms`.
* If it combines primitives, use `molecules`.
* If it owns a full section of a page, use `organisms`.
* If it wraps the page, use `layouts`.

---

## 5. Compound components

Use compound components when a component has multiple related parts and needs a flexible API.

### Example

```tsx
<Card>
  <Card.Header>
    <Card.Title>Product details</Card.Title>
  </Card.Header>

  <Card.Content>
    Product information goes here.
  </Card.Content>

  <Card.Footer>
    <Button>Save</Button>
  </Card.Footer>
</Card>
```

### When to use

Use compound components for:

* Components with named sections
* Components with shared internal state or context
* Components that would otherwise have too many props
* Reusable UI patterns that need flexible composition

Good examples:

```txt
Card
Modal
Tabs
Dropdown
FormField
DataTable
PageHeader
```

Avoid compound components when:

* The component is simple
* Props are clearer
* There is only one valid structure
* Children do not share context or state

---

## 6. Compound component context scenario

### Problem

A `DataTable` is needed in many places:

* Seller product list
* Admin product moderation
* Customer list
* Order history

A prop-heavy API becomes hard to maintain.

```tsx
<DataTable
  title="Products"
  columns={columns}
  rows={rows}
  filters={filters}
  actions={actions}
  emptyText="No products found"
  pagination={pagination}
  showToolbar
  showSearch
  showFilters
  showPagination
/>
```

### Prefer compound API

```tsx
<DataTable data={products}>
  <DataTable.Toolbar>
    <SearchInput placeholder="Search products" />
    <ProductStatusFilter />
  </DataTable.Toolbar>

  <DataTable.Content columns={columns} />

  <DataTable.Empty>
    No products found.
  </DataTable.Empty>

  <DataTable.Pagination />
</DataTable>
```

This keeps the structure consistent while allowing each app to control its own content.

---

## 7. Compound components with context

Use React context only when child components need shared data from the parent.

Good use cases:

* Shared IDs
* Accessibility attributes
* Selected state
* Open/closed state
* Validation state
* Parent-level config

Example:

```tsx
<FormField id="email" error="Email is required">
  <FormField.Label>Email</FormField.Label>
  <FormField.Input placeholder="Enter your email" />
  <FormField.Error />
</FormField>
```

The parent provides `id` and `error` through context, so children do not need repeated props.

### Context rule

If a child component must be used inside a parent, throw a clear error.

```ts
throw new Error('FormField compound components must be used inside <FormField>.')
```

---

## 8. Where compound components live

| Type                        | Package               | Examples                                      |
| --------------------------- | --------------------- | --------------------------------------------- |
| Generic reusable pattern    | `@ecom/core-ui`       | `Card`, `Modal`, `Tabs`, `FormField`, `Table` |
| Seller-specific pattern     | `@ecom/ui-seller`     | `SellerProductTable`, `SellerOnboardingSteps` |
| Admin-specific pattern      | `@ecom/ui-admin`      | `AdminModerationTable`, `AdminUserPanel`      |
| Storefront-specific pattern | `@ecom/ui-storefront` | `ProductGallery`, `CheckoutSummary`           |

Rule:

* If it is generic, put it in `@ecom/core-ui`.
* If it contains domain logic, put it in the matching app UI package.

---

## 9. File naming

| File                        | Use for                                    |
| --------------------------- | ------------------------------------------ |
| `ComponentName.tsx`         | Default component, server-safe if possible |
| `ComponentName.client.tsx`  | Client component requiring `'use client'`  |
| `ComponentName.context.tsx` | React context for a component family       |
| `ComponentName.types.ts`    | Shared types and interfaces                |
| `ComponentName.utils.ts`    | Pure helpers and defaults                  |
| `ComponentName.fixtures.ts` | Static data for stories/tests              |
| `ComponentName.stories.tsx` | Storybook stories                          |
| `index.ts`                  | Barrel exports                             |

Each component lives in its own folder.

```txt
src/<layer>/<ComponentName>/
├── ComponentName.tsx
├── ComponentName.types.ts
├── ComponentName.stories.tsx
└── index.ts
```

For compound components with context:

```txt
src/<layer>/<ComponentName>/
├── ComponentName.tsx
├── ComponentName.context.tsx
├── ComponentName.types.ts
├── ComponentName.stories.tsx
└── index.ts
```

Only add files that are needed.

---

## 10. Server vs client components

Default to server components.

Add `'use client'` only when the component directly needs:

* `useState`
* `useReducer`
* `useEffect`
* `useLayoutEffect`
* Browser APIs
* Client-side context
* Client-side event handlers

Do not add `'use client'` to:

* Components that only render markup
* Components that only pass props down
* Layout shells
* Server-safe components

---

## 11. Client island pattern

A server component may render a client component as an isolated interactive island.

```tsx
// ServerSection.tsx
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
  return (
    <select>
      {items.map((item) => (
        <option key={item}>{item}</option>
      ))}
    </select>
  )
}
```

When a component family has both server and client parts, split them:

```txt
ComponentName.tsx          # Server shell
ComponentName.client.tsx   # Client island
ComponentName.context.tsx  # Client context, if needed
ComponentName.types.ts     # Shared types
```

---

## 12. Adding a component

1. Choose the package.
2. Choose the layer.
3. Decide whether it should be a compound component.
4. Create `src/<layer>/<ComponentName>/`.
5. Add implementation, types, stories, and exports.
6. Export from the package `src/index.ts`.

### Package decision

Use `@ecom/core-ui` when the component is generic.

Use an app UI package when the component contains domain-specific behavior.

### Compound decision

Use compound style for structured component families.

```tsx
<PageHeader>
  <PageHeader.Breadcrumbs />
  <PageHeader.Title>Products</PageHeader.Title>
  <PageHeader.Actions>
    <Button>Add product</Button>
  </PageHeader.Actions>
</PageHeader>
```

Use simple props for simple components.

```tsx
<Avatar src={user.avatarUrl} alt={user.name} />
```

---

## 13. Storybook

Each package has its own Storybook instance.

```bash
pnpm --filter @ecom/<package-name> storybook
```

Stories live next to the component.

```txt
ComponentName.stories.tsx
```

Use autodocs.

```tsx
const meta = {
  title: 'Molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
}

export default meta
```

For compound components, show real usage.

```tsx
export const Default = {
  render: () => (
    <FormField id="email" error="Email is required">
      <FormField.Label>Email</FormField.Label>
      <FormField.Input placeholder="Enter your email" />
      <FormField.Error />
    </FormField>
  ),
}
```

Recommended story scenarios:

```txt
Default
WithError
Disabled
Required
LongContent
```

---

## 14. Type-check and lint

```bash
pnpm --filter @ecom/<package-name> type-check
pnpm --filter @ecom/<package-name> lint

pnpm type-check
pnpm lint
```

TypeScript rules:

* Use strict TypeScript.
* Do not use `any`.
* Use `unknown` with type guards when the shape is unknown.

```ts
function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}
```

---

## 15. Quick rules for agents

When generating or editing UI code:

1. Reuse primitives from `@ecom/core-ui`.
2. Do not create cross-dependencies between app UI packages.
3. Put generic components in `@ecom/core-ui`.
4. Put domain-specific components in the matching app package.
5. Default to server components.
6. Use `'use client'` only when required.
7. Use compound components for flexible component families.
8. Use context only when children need shared parent state/config.
9. Add Storybook stories next to the component.
10. Do not use `any`.

---

## 16. Summary

Keep UI packages separated by responsibility.

Use `@ecom/core-ui` for shared primitives and generic patterns.

Use app UI packages for domain-specific UI.

Prefer server components.

Use client components only for interactivity.

Use compound components when a component has multiple related parts and needs flexible composition.
