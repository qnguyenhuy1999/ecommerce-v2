# Frontend Standards

This repo has three Next.js apps, but they are not all at the same maturity level. Follow the structure and dependencies that already exist in the specific app you are editing.

## Current app patterns

### `apps/admin`

`admin` is the strongest frontend reference in the repo today.

- App Router under `src/app`
- feature folders under `src/features/<feature>/`
- shared query provider in `src/lib/query-client.tsx`
- shared API wrapper in `src/lib/api.ts`
- auth provider in `src/providers/auth-provider.tsx`
- TanStack Query for server state
- React Hook Form and Zod for form flows

### `apps/seller`

`seller` currently uses:

- App Router pages under `src/app`
- app-local components in `src/components`
- auth provider and middleware
- a small app-local API helper in `src/lib/api.ts`

It is flatter than `admin`. Keep that in mind before introducing deep abstractions.

### `apps/storefront`

`storefront` is currently minimal:

- App Router
- auth middleware/provider helpers
- thin layout and page structure

## Data fetching

Use the shared API client pattern:

```ts
import { createApiClient } from '@ecom/config/api-client'
```

In apps, wrap it with the app's base URL in `src/lib/api.ts`.

The shared client already:

- builds query strings
- sends `credentials: 'include'`
- sets JSON headers
- throws a typed `ApiError` for non-2xx responses

## State management

What exists today:

- TanStack Query in `apps/admin` for server state
- component-local state for local UI concerns
- React Hook Form in admin auth flows
- URL state via Next.js routes and search params where needed

There is no established Zustand layer in the current repo. Do not introduce one casually.

## Component placement

- route-specific UI belongs in the app
- feature-specific UI belongs in `src/features/<feature>/components` where that pattern already exists
- generic reusable UI belongs in `@ecom/core-ui`
- seller-specific reusable page compositions can live in `@ecom/ui-seller`

## Auth flow

Frontend auth currently relies on shared helpers from `@ecom/auth` and cookie-based sessions.

- middleware helpers live in `@ecom/auth/middleware`
- client/provider helpers live in `@ecom/auth/client`
- requests must preserve credentials

When building auth-sensitive pages, keep middleware, provider, and fetch behavior aligned.

## Styling

- use the app's existing global CSS and utility classes
- prefer `@ecom/core-ui` primitives when the component already exists there
- avoid duplicating API-safe helpers and layout primitives between apps

## Practical guidance

1. match the app's existing pattern first
2. only extract to a package after real reuse appears
3. use the shared API client and auth helpers instead of rebuilding them locally
