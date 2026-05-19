# Pull Request Checklist

Use this checklist as a practical gate before requesting review.

## Always check

- [ ] `pnpm lint`
- [ ] `pnpm type-check`
- [ ] `pnpm format:check`
- [ ] no new circular imports with `pnpm lint:circular`
- [ ] no dependency-boundary regressions with `pnpm lint:deps`

## If you changed backend APIs

- [ ] OpenAPI output regenerated with `pnpm openapi:sync`
- [ ] generated contract types updated in `packages/contracts/src/generated`
- [ ] Swagger JSON changes reviewed, not committed blindly
- [ ] request/response shapes still match `@ecom/contracts/http`
- [ ] new DTOs validated with `class-validator`

## If you changed frontend behavior

- [ ] API calls still go through the shared client pattern in `src/lib/api.ts` or `@ecom/config/api-client`
- [ ] auth-sensitive requests still send credentials correctly
- [ ] loading, empty, and error states are handled
- [ ] UI changes align with existing `@ecom/core-ui` and app conventions

## If you changed shared packages

- [ ] package exports still match the files that consumers import
- [ ] build/type-check scripts still make sense for the package
- [ ] cross-package imports stay intentional and minimal
- [ ] generated files are not edited by hand unless that is the established workflow

## If you changed data or auth flows

- [ ] cookie/session behavior still works with current `sid` session cookie handling
- [ ] port, CORS, SMTP, Redis, or env defaults remain aligned with `@ecom/config`
- [ ] new environment variables were added to `.env.example`

## Testing

- [ ] existing tests were updated where behavior changed
- [ ] new logic has tests where the package already supports them
- [ ] if no tests were added, the PR description explains the gap

## Documentation

- [ ] relevant docs in `docs/` updated if architecture, workflow, or behavior changed
- [ ] README updated if the change affects setup, scripts, or developer workflow

## Commit and review hygiene

- [ ] commit messages follow Conventional Commits
- [ ] screenshots or request examples included when they help review
- [ ] known limitations or follow-up work called out explicitly
