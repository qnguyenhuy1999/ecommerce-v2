# UI Admin

Admin-domain UI package for internal operations and management surfaces.

`@ecom/ui-admin` builds admin workflows on top of `@ecom/core-ui`. It owns admin-specific composition, page patterns, and local interaction models while staying free of data fetching and backend business logic.

## Primary goal for agents

When implementing a new admin feature, default to building it in `ui-admin` unless it is clearly generic enough for `core-ui`. This package is the owner of admin terminology, management-flow composition, admin-specific filters/actions, and dense local workflow state for internal tools.

## Current focus

- Admin page composition
- Admin-specific compounds and section components
- Local UI state hooks
- Dashboards, moderation, management, reporting, and internal operations views

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

- `core-ui` stays generic; admin-specific page composition lives here.
- Repeated admin page structures should become admin-owned compounds instead of page-by-page duplication.
- Small shared UI-state helpers should live in `src/hooks` when reused across admin features.
- Dense local workflows may use React Context plus `useReducer` when prop drilling becomes excessive, especially in moderation, user management, or multi-section admin editors.

## Feature implementation rules

For new admin features:

- Prefer composing existing `core-ui` primitives and `ui-admin` compounds instead of adding one-off page markup.
- If two or more admin pages repeat the same structure, create or extend an admin-owned compound.
- Keep admin filtering, management actions, and workflow-specific composition in `ui-admin`, not `core-ui`.
- Keep API calls, server mutations, and business rules outside this package.

## Decision guide

Use `core-ui` when:

- The feature is generic across multiple product surfaces.
- The wording and behavior are domain-neutral.

Use `ui-admin` when:

- The feature uses admin-specific statuses, copy, actions, governance, reporting, or management workflows.
- The feature is an admin page section, management pattern, or internal editor flow.
- The feature is reusable inside admin pages but not obviously outside admin.

Use local context plus reducer when:

- One workflow has many sibling sections sharing the same editable or operational state.
- Prop drilling would otherwise create large prop surfaces.
- The state is local to a single admin flow or page.

Avoid context when:

- The state is just local search/toggle/tab control for one table or dashboard section.
- A small reusable hook is enough.

## Boundaries

Use `ui-admin` for:

- Admin terminology and actions
- Admin page layouts and compounds
- Admin-only table/filter/management composition
- Moderation, management, dashboard, and editor sections with local workflow state

Do not use `ui-admin` for:

- Data fetching
- API calls
- Shared primitives already covered by `core-ui`
- Direct imports from `@ecom/core-ui/src/...`

## Preferred patterns by page type

### Data-heavy list and management pages

Examples: users, orders review, sellers review, reports, moderation queues

- Use admin-owned compounds for page shell + filter/table/action composition when the structure repeats.
- Keep table column definitions typed, without `unknown` casts.
- Prefer controllable state hooks for search, filters, tabs, and toggles.
- Use `useDeferredValue` for client-side filtering when the displayed data updates on every keystroke.
- Use `startTransition` for non-urgent local filter changes when it improves responsiveness.

### Dense admin flows

Examples: user detail editors, configuration flows, moderation review panels, multi-section forms

- Use section files instead of one very large page file.
- Use local provider + reducer when many sections share editable state.
- Keep provider scope local to the workflow tree.
- Expose narrow hooks per concern instead of one giant bag of state.

## Export conventions

- Keep package exports stable through `src/index.ts`
- Prefer thin page entrypoints for major admin pages and flows
- Split large files by behavior once they combine composition, state ownership, and many subcomponents

## File organization guidance

- `pages/<Feature>/` is the default home for page-specific composition and state.
- Move reusable admin compounds to `organisms/` when shared by multiple pages.
- Move admin-only hooks to `hooks/` when reused across multiple features.
- Keep feature-specific types and helpers next to the page unless shared more broadly.

## Checklist for new admin features

Before implementing:

- Decide whether the owner is `core-ui` or `ui-admin`.
- Check whether an existing admin compound should be extended first.
- Decide whether local hook state is enough or whether a reducer/context boundary is warranted.
- Confirm the feature can be expressed without data fetching in this package.

Before finishing:

- Export new reusable pieces through the nearest `index.ts`.
- Add or update Storybook coverage when the component is reusable or visually important.
- Run:
  - `pnpm --filter @ecom/ui-admin type-check`
  - `pnpm --filter @ecom/ui-admin lint`

## Storybook

```bash
pnpm --filter @ecom/ui-admin storybook
```

## Verification

```bash
pnpm --filter @ecom/ui-admin type-check
pnpm --filter @ecom/ui-admin lint
```
