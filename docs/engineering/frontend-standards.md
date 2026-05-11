# Frontend Standards

## State Management

| Data Type | Tool | Location |
|-----------|------|----------|
| Server state (API data) | TanStack Query | Feature hooks (`useProducts()`) |
| Client-only UI state | Zustand | Feature stores or component state |
| Form state | React Hook Form | Component-local |
| URL state | Next.js `searchParams` | Page components |

**Rule**: If data comes from the server, it belongs in TanStack Query — not Zustand.

## Data Fetching

- API calls live in `features/<feature>/api/` and use the `fetch` verb prefix
- All API calls go through the shared API client in `src/lib/api.ts`
- Use TanStack Query for caching, deduplication, and background refetching

## Component Architecture

- **Feature components**: Live in `features/<feature>/components/`
- **Shared app components**: Live in `src/components/`
- **Design system components**: Live in `@ecom/core-ui` or `@ecom/ui-<app>`

## Styling

- Tailwind CSS v4 with design tokens from `@ecom/core-ui/tokens`
- Use `class-variance-authority` (CVA) for component variants
- Use `tailwind-merge` + `clsx` for conditional classes
- Avoid inline `style={{}}` — use Tailwind utilities or token-based CSS variables

## Accessibility

- All interactive elements must be keyboard-accessible
- Use semantic HTML (`button`, `nav`, `main`, `article`)
- Images require `alt` text
- Form inputs require associated labels
- Use Radix UI primitives for complex interactions (modals, dropdowns, etc.)

## Performance

- Use `next/image` for all images
- Lazy-load below-the-fold content with `React.lazy` or dynamic imports
- Minimize client-side JavaScript — prefer Server Components where possible
- Use `React.memo` only when profiling shows a measurable benefit
