# Testing Standards

## Test Types

| Type              | Tool                | Location                     | Runs In         |
| ----------------- | ------------------- | ---------------------------- | --------------- |
| Unit tests        | Vitest              | `*.spec.ts` alongside source | `pnpm test`     |
| Integration tests | Vitest + Supertest  | `*.integration.spec.ts`      | `pnpm test`     |
| E2E tests         | Playwright / Vitest | `test/` directory in app     | `pnpm test:e2e` |

## Unit Tests

- Test business logic in isolation (services, utilities, hooks)
- Mock external dependencies (database, HTTP clients, Redis)
- One assertion per test when possible
- Use descriptive test names: `it('should throw BusinessRuleError when stock is insufficient')`

## Integration Tests

- Test controller + service + database together
- Use a test database (seeded per test suite)
- Verify the full request/response cycle including validation and error handling

## What to Test

- ✅ Business rules and edge cases
- ✅ Error paths and validation failures
- ✅ Data transformations and mappings
- ✅ Authorization logic
- ❌ Framework boilerplate (NestJS module wiring)
- ❌ Simple CRUD with no business logic
- ❌ Third-party library internals

## Naming Convention

```
<module>.spec.ts          # Unit test
<module>.integration.spec.ts  # Integration test
```

## Running Tests

```bash
pnpm test                 # All unit tests (via Turbo)
pnpm test:e2e             # All E2E tests (via Turbo)
pnpm --filter @ecom/shared test  # Single package
```
