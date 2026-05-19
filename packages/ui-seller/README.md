# UI Seller

Seller-domain UI package for the Seller Center.

`@ecom/ui-seller` builds seller workflows on top of `@ecom/core-ui`. It owns seller-specific composition, page patterns, and local interaction models while staying free of data fetching and backend business logic.

## Primary goal for agents

When implementing a new seller feature, default to building it in `ui-seller` unless it is clearly generic enough for `core-ui`. This package is the owner of seller terminology, seller page composition, seller-specific filters/actions, and dense local workflow state.

## Current focus

- Seller page composition
- Seller-specific compounds and section components
- Local UI state hooks
- Product, order, inventory, promotions, and returns/refunds views

## Current structure

```text
src/
  atoms/
  molecules/
  organisms/
  hooks/
  layouts/
  pages/
  styles/
  lib/
  index.ts
```

## Important patterns

- `core-ui` stays generic; seller-specific page composition lives here.
- `SellerListPage` is the shared compound for seller list screens such as Products, Orders, Inventory, and Returns/Refunds.
- Small shared UI-state helpers live in `src/hooks`, for example controllable controlled/uncontrolled state.
- Dense local workflows may use React Context plus `useReducer` when prop drilling becomes excessive.
  `ProductDetail` is the current example of that pattern.

## Feature implementation rules

For new seller features:

- Prefer composing existing `core-ui` primitives and `ui-seller` compounds instead of adding one-off page markup.
- If two or more seller pages repeat the same page structure, create or extend a seller-owned compound.
- Keep list-page filtering, status tabs, and seller action bars in `ui-seller`, not `core-ui`.
- Keep API calls, server mutations, and business rules outside this package.

## Decision guide

Use `core-ui` when:

- The feature is generic across multiple product surfaces.
- The wording and behavior are domain-neutral.

Use `ui-seller` when:

- The feature uses seller-specific statuses, copy, actions, or workflows.
- The feature is a seller page section, list pattern, or editor flow.
- The feature is reusable inside seller pages but not obviously outside seller.

Use local context plus reducer when:

- One workflow has many sibling sections sharing the same editable state.
- Prop drilling would otherwise create large prop surfaces.
- The state is local to a single page or editor flow.

Avoid context when:

- The state is just local search/toggle/tab control for one list page.
- A small reusable hook is enough.

## Boundaries

Use `ui-seller` for:

- Seller terminology and actions
- Seller page layouts and compounds
- Seller-only table/filter composition
- Seller editor sections and local workflow state

Do not use `ui-seller` for:

- Data fetching
- API calls
- Shared primitives already covered by `core-ui`
- Direct imports from `@ecom/core-ui/src/...`

## Preferred patterns by page type

### List pages

Examples: products, orders, inventory, returns/refunds

- Use `SellerListPage` for page shell + filter/table composition.
- Keep table column definitions typed, without `unknown` casts.
- Prefer controllable state hooks for search, tabs, and toggles.
- Use `useDeferredValue` for client-side search filtering when the displayed list updates on every keystroke.
- Use `startTransition` for non-urgent local filter changes when it improves responsiveness.

### Dense editors

Examples: product detail or future multi-section seller forms

- Use section files instead of one very large page file.
- Use local provider + reducer when many sections share editable state.
- Keep provider scope local to the workflow tree.
- Expose narrow hooks per concern instead of one giant bag of state.

## Export conventions

- Keep package exports stable through `src/index.ts`
- Prefer thin page entrypoints such as `Products.tsx` and `ProductDetail.tsx`
- Split large files by behavior once they combine composition, state ownership, and many subcomponents

## File organization guidance

- `pages/<Feature>/` is the default home for page-specific composition and state.
- Move reusable seller compounds to `organisms/` when shared by multiple pages.
- Move seller-only hooks to `hooks/` when reused across multiple features.
- Keep feature-specific types and helpers next to the page unless shared more broadly.

## Checklist for new seller features

Before implementing:

- Decide whether the owner is `core-ui` or `ui-seller`.
- Check whether an existing seller compound should be extended first.
- Decide whether local hook state is enough or whether a reducer/context boundary is warranted.
- Confirm the feature can be expressed without data fetching in this package.

Before finishing:

- Export new reusable pieces through the nearest `index.ts`.
- Add or update Storybook coverage when the component is reusable or visually important.
- Run:
  - `pnpm --filter @ecom/ui-seller type-check`
  - `pnpm --filter @ecom/ui-seller lint`

## Storybook

```bash
pnpm --filter @ecom/ui-seller storybook
```

## Verification

```bash
pnpm --filter @ecom/ui-seller type-check
pnpm --filter @ecom/ui-seller lint
```
