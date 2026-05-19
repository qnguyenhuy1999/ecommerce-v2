# Testing Standards

Testing in this repository is currently limited. This document separates the current state from the direction you should follow when expanding coverage.

## Current state

- The root script `pnpm test` exists and Turbo will run package `test` scripts where they are defined.
- `@ecom/shared` currently has a real `test` script using Vitest.
- `packages/shared/src/pagination/core/__tests__/cursor-stability.test.ts` is the clearest example of the existing test style.
- `packages/database` contains test files, but the package does not currently expose a `test` script in `package.json`.
- There is a root `pnpm test:e2e` script, but there are no active package-level `test:e2e` scripts or a committed end-to-end test harness in the current tree.

## What this means in practice

When you touch code:

- update existing tests if behavior changes
- add tests in packages that already support them
- do not claim end-to-end coverage that does not exist
- call out testing gaps explicitly in the PR when you cannot cover a change

## Preferred tools

- Vitest for package and utility tests
- package-local test files near the code or under a focused `__tests__` folder

## File naming

Current examples in the repo:

- `*.test.ts`
- `*.service.test.ts`

Use the naming convention already present in the package you are editing.

## What to prioritize

- pagination logic
- shared utilities
- auth/session helpers
- service-level business rules
- data-shaping and mapping logic
- bug fixes that are easy to regress

## What not to over-test

- passive module wiring with no real logic
- boilerplate re-exports
- third-party library behavior

## Recommended direction for new coverage

If you add meaningful logic to a package with no test script yet:

1. add a package-local `test` script
2. use Vitest unless there is a strong reason not to
3. keep tests close to the module being exercised
4. make the package runnable through the root Turbo `pnpm test` flow

## Commands

Current reliable commands:

```bash
pnpm test
pnpm --filter @ecom/shared test
```

Treat `pnpm test:e2e` as reserved workflow infrastructure until actual e2e packages are added.
