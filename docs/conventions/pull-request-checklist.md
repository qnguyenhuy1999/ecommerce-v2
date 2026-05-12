# Pull Request Checklist

Before requesting review, ensure:

## Code Quality

- [ ] `pnpm lint` passes with no new warnings
- [ ] `pnpm type-check` passes
- [ ] `pnpm format:check` passes
- [ ] No circular dependencies introduced (`pnpm lint:circular`)
- [ ] Dependency boundaries respected (`pnpm lint:deps`)

## Architecture

- [ ] No hardcoded magic numbers — use constants from `@ecom/shared/constants`
- [ ] Domain errors use typed classes from `@ecom/shared/errors`
- [ ] New enums/types added to `@ecom/contracts` (not local to an app)
- [ ] No `console.log` — use the Pino logger (`EcomLoggerModule`)
- [ ] API endpoints return `ApiResponse` shape (enforced by interceptor)

## Testing

- [ ] Unit tests cover new business logic
- [ ] Edge cases and error paths tested
- [ ] No flaky tests introduced

## Documentation

- [ ] Public API changes reflected in OpenAPI spec (`pnpm swagger:gen:all`)
- [ ] Breaking changes documented in PR description
- [ ] New environment variables added to `.env.example`

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(products): add bulk import endpoint
fix(orders): handle race condition in stock reservation
refactor(auth): extract token validation to shared service
```

Allowed types: `feat`, `fix`, `refactor`, `perf`, `docs`, `chore`, `test`, `ci`, `build`, `revert`
