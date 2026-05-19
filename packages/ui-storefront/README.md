# UI Storefront

Storefront-domain UI package for the customer-facing experience.

`@ecom/ui-storefront` builds storefront workflows on top of `@ecom/core-ui`. It owns customer-facing composition, page patterns, and local interaction models while staying free of data fetching and backend business logic.

## Primary goal for agents

When implementing a new storefront feature, default to building it in `ui-storefront` unless it is clearly generic enough for `core-ui`. This package is the owner of storefront terminology, customer journey composition, storefront-specific filters/actions, and dense local workflow state for customer-facing flows.

## Current focus

- Storefront page composition
- Storefront-specific compounds and section components
- Local UI state hooks
- Browsing, discovery, cart, checkout, and account-oriented views

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

- `core-ui` stays generic; storefront-specific page composition lives here.
- Repeated storefront page structures should become storefront-owned compounds instead of page-by-page duplication.
- Small shared UI-state helpers should live in `src/hooks` when reused across storefront features.
- Dense local workflows may use React Context plus `useReducer` when prop drilling becomes excessive, especially in checkout, account, or multi-step customer flows.

## Feature implementation rules

For new storefront features:

- Prefer composing existing `core-ui` primitives and `ui-storefront` compounds instead of adding one-off page markup.
- If two or more storefront pages repeat the same structure, create or extend a storefront-owned compound.
- Keep storefront filtering, customer actions, and journey-specific composition in `ui-storefront`, not `core-ui`.
- Keep API calls, server mutations, and business rules outside this package.

## Decision guide

Use `core-ui` when:

- The feature is generic across multiple product surfaces.
- The wording and behavior are domain-neutral.

Use `ui-storefront` when:

- The feature uses storefront-specific copy, actions, merchandising, or customer workflows.
- The feature is a storefront page section, journey pattern, or account/checkout flow.
- The feature is reusable inside storefront pages but not obviously outside storefront.

Use local context plus reducer when:

- One workflow has many sibling sections sharing the same editable or navigational state.
- Prop drilling would otherwise create large prop surfaces.
- The state is local to a single journey or page flow.

Avoid context when:

- The state is just local search/toggle/tab control for one list or gallery page.
- A small reusable hook is enough.

## Boundaries

Use `ui-storefront` for:

- Customer-facing terminology and actions
- Storefront page layouts and compounds
- Storefront-only search/filter/sort composition
- Checkout, cart, account, and browsing sections with local workflow state

Do not use `ui-storefront` for:

- Data fetching
- API calls
- Shared primitives already covered by `core-ui`
- Direct imports from `@ecom/core-ui/src/...`

## Preferred patterns by page type

### Discovery and listing pages

Examples: product listings, search results, category views, collection pages

- Use storefront-owned compounds for page shell + filter/sort/grid composition when the structure repeats.
- Keep card/list/grid props typed and reusable.
- Prefer controllable state hooks for search, sort, tabs, and toggles.
- Use `useDeferredValue` for client-side search/filtering when the displayed list updates on every keystroke.
- Use `startTransition` for non-urgent local filter changes when it improves responsiveness.

### Dense customer flows

Examples: checkout, account settings, multi-step onboarding, saved addresses/payment methods

- Use section files instead of one very large page file.
- Use local provider + reducer when many sections share editable state.
- Keep provider scope local to the workflow tree.
- Expose narrow hooks per concern instead of one giant bag of state.

## Export conventions

- Keep package exports stable through `src/index.ts`
- Prefer thin page entrypoints for major storefront pages and flows
- Split large files by behavior once they combine composition, state ownership, and many subcomponents

## File organization guidance

- `pages/<Feature>/` is the default home for page-specific composition and state.
- Move reusable storefront compounds to `organisms/` when shared by multiple pages.
- Move storefront-only hooks to `hooks/` when reused across multiple features.
- Keep feature-specific types and helpers next to the page unless shared more broadly.

## Checklist for new storefront features

Before implementing:

- Decide whether the owner is `core-ui` or `ui-storefront`.
- Check whether an existing storefront compound should be extended first.
- Decide whether local hook state is enough or whether a reducer/context boundary is warranted.
- Confirm the feature can be expressed without data fetching in this package.

Before finishing:

- Export new reusable pieces through the nearest `index.ts`.
- Add or update Storybook coverage when the component is reusable or visually important.
- Run:
  - `pnpm --filter @ecom/ui-storefront type-check`
  - `pnpm --filter @ecom/ui-storefront lint`

## Storybook

```bash
pnpm --filter @ecom/ui-storefront storybook
```

## Verification

```bash
pnpm --filter @ecom/ui-storefront type-check
pnpm --filter @ecom/ui-storefront lint
```
