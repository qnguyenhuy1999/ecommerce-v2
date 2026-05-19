# Core UI

Shared design-system package for all product surfaces:

- `ui-storefront`
- `ui-seller`
- `ui-admin`

`@ecom/core-ui` owns the generic UI foundation. Domain packages should compose it, not duplicate it.

## Primary goal for agents

When implementing new UI work, treat `core-ui` as the reusable base layer only. If a component, label, action, filter model, or workflow is specific to one domain, it should usually live in that domain package instead of here.

## What belongs here

- Design tokens in `src/tokens`
- Global styles and providers
- Generic atoms, molecules, organisms, and layouts
- Wrapped primitives under `src/primitives`
- Reusable console shell pieces shared across seller/admin-style apps

## What does not belong here

- Seller-, admin-, or storefront-specific language or workflows
- Domain filtering logic
- Page-specific composition for one product area
- Data fetching or business logic

## Decision rules

Put a feature in `core-ui` only if most of these are true:

- It is reusable across at least two product surfaces.
- Its naming is domain-neutral.
- Its props do not encode seller/admin/storefront business states.
- It can be documented in Storybook without explaining domain rules.

Keep a feature out of `core-ui` if any of these are true:

- It contains product-area status tabs, action bars, or workflow copy.
- It is a page compound for one app.
- It needs domain fixtures to make sense.
- It primarily exists to support one current page.

## Current structure

```text
src/
  atoms/
  molecules/
  organisms/
  layouts/
  hooks/
  providers/
  primitives/
  tokens/
  styles/
  lib/
  index.ts
```

## Layering rules

- `core-ui` exports public building blocks only.
- Domain packages must import from the public `@ecom/core-ui` API, never from internal paths.
- Prefer composition over inheritance.
- Keep components generic enough to work across multiple apps.
- Interactive behavior is fine when it is still domain-agnostic.

## Preferred patterns

- Build small generic compounds when a repeated interaction pattern is still domain-neutral.
- Expose typed building blocks rather than page-specific wrappers.
- Keep table, layout, and form primitives generic; let domain packages provide filters, status labels, and action composition.
- Accept controlled and uncontrolled usage when the component is expected to be embedded in many contexts.

## Authoring guidelines

- Use `.client.tsx` only when hooks or event handlers are required.
- Keep prop APIs typed and reusable.
- Avoid baking product-specific status labels, filters, or actions into generic components.
- Export everything through package-level `index.ts` files.

## File organization guidance

- Split files when they own both state and many visual subcomponents.
- Prefer one folder per reusable component or compound.
- Keep helpers/types close to the owning component unless they are shared broadly.
- Do not introduce thin pass-through files unless they preserve a public API boundary.

## Checklist for new features

Before adding code here, verify:

- The feature is genuinely cross-domain.
- It does not require seller/admin/storefront wording in the public API.
- The component can be demonstrated with generic fixtures.
- A domain package is not the better owner.

## Storybook

```bash
pnpm --filter @ecom/core-ui storybook
```

## Verification

```bash
pnpm --filter @ecom/core-ui type-check
pnpm --filter @ecom/core-ui lint
```
