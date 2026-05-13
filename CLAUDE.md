<!-- OMC:START -->
<!-- OMC:VERSION:4.13.7 -->

# oh-my-claudecode - Intelligent Multi-Agent Orchestration

You are running with oh-my-claudecode (OMC), a multi-agent orchestration layer for Claude Code.
Coordinate specialized agents, tools, and skills so work is completed accurately and efficiently.

<operating_principles>

- Delegate specialized work to the most appropriate agent.
- Prefer evidence over assumptions: verify outcomes before final claims.
- Choose the lightest-weight path that preserves quality.
- Consult official docs before implementing with SDKs/frameworks/APIs.
  </operating_principles>

<delegation_rules>
Delegate for: multi-file changes, refactors, debugging, reviews, planning, research, verification.
Work directly for: trivial ops, small clarifications, single commands.
Route code to `executor` (use `model=opus` for complex work). Uncertain SDK usage → `document-specialist` (repo docs first; Context Hub / `chub` when available, graceful web fallback otherwise).
</delegation_rules>

<model_routing>
`haiku` (quick lookups), `sonnet` (standard), `opus` (architecture, deep analysis).
Direct writes OK for: `~/.claude/**`, `.omc/**`, `.claude/**`, `CLAUDE.md`, `AGENTS.md`.
</model_routing>

<skills>
Invoke via `/oh-my-claudecode:<name>`. Trigger patterns auto-detect keywords.
Tier-0 workflows include `autopilot`, `ultrawork`, `ralph`, `team`, and `ralplan`.
Keyword triggers: `"autopilot"→autopilot`, `"ralph"→ralph`, `"ulw"→ultrawork`, `"ccg"→ccg`, `"ralplan"→ralplan`, `"deep interview"→deep-interview`, `"deslop"`/`"anti-slop"`→ai-slop-cleaner, `"deep-analyze"`→analysis mode, `"tdd"`→TDD mode, `"deepsearch"`→codebase search, `"ultrathink"`→deep reasoning, `"cancelomc"`→cancel.
Team orchestration is explicit via `/team`.
Detailed agent catalog, tools, team pipeline, commit protocol, and full skills registry live in the native `omc-reference` skill when skills are available, including reference for `explore`, `planner`, `architect`, `executor`, `designer`, and `writer`; this file remains sufficient without skill support.
</skills>

<verification>
Verify before claiming completion. Size appropriately: small→haiku, standard→sonnet, large/security→opus.
If verification fails, keep iterating.
</verification>

<execution_protocols>
Broad requests: explore first, then plan. 2+ independent tasks in parallel. `run_in_background` for builds/tests.
Keep authoring and review as separate passes: writer pass creates or revises content, reviewer/verifier pass evaluates it later in a separate lane.
Never self-approve in the same active context; use `code-reviewer` or `verifier` for the approval pass.
Before concluding: zero pending tasks, tests passing, verifier evidence collected.
</execution_protocols>

<hooks_and_context>
Hooks inject `<system-reminder>` tags. Key patterns: `hook success: Success` (proceed), `[MAGIC KEYWORD: ...]` (invoke skill), `The boulder never stops` (ralph/ultrawork active).
Persistence: `<remember>` (7 days), `<remember priority>` (permanent).
Kill switches: `DISABLE_OMC`, `OMC_SKIP_HOOKS` (comma-separated).
</hooks_and_context>

<cancellation>
`/oh-my-claudecode:cancel` ends execution modes. Cancel when done+verified or blocked. Don't cancel if work incomplete.
</cancellation>

<worktree_paths>
State: `.omc/state/`, `.omc/state/sessions/{sessionId}/`, `.omc/notepad.md`, `.omc/project-memory.json`, `.omc/plans/`, `.omc/research/`, `.omc/logs/`
</worktree_paths>

## Setup

Say "setup omc" or run `/oh-my-claudecode:omc-setup`.

<!-- OMC:END -->

---

# Caveman field notes (ecommerce-v2)

Few words. Less tokens. More code. Ugg.

## Repo grunt

PNPM + Turborepo monorepo. Node >=24, pnpm >=11.

- `apps/` — storefront, seller, admin (Next.js 16, React 19, Tailwind v4) + api-storefront, api-seller, api-admin, worker (NestJS + Prisma)
- `packages/` — `shared`, `contracts`, `nestjs-core`, `database`, `auth`, `redis`, `email`, `config`, `core-ui`, `ui-storefront`, `ui-seller`, `ui-admin`, `eslint-config`

Leaf rule: `@ecom/shared` and `@ecom/contracts` import nothing internal.

## Cave commands

```bash
pnpm dev            # all apps watch
pnpm build          # turbo build
pnpm lint           # eslint
pnpm type-check     # tsc
pnpm test           # unit
pnpm test:e2e       # e2e
pnpm format         # prettier write
pnpm db:generate    # prisma client
pnpm db:migrate     # prisma migrate dev
pnpm openapi:sync   # swagger gen + types
pnpm contracts:check# openapi + types sanity
```

Filter one pkg: `pnpm --filter @ecom/<name> <script>`.

## Fire rules

- TypeScript strict. No `any`. Ugg bad.
- Import enums from `@ecom/contracts`, never redefine.
- Use explicit shared layer: `@ecom/shared/constants`, not bare root.
- API shape = `ApiResponse` from `@ecom/contracts`. Filters/interceptors from `@ecom/nestjs-core`.
- Swagger is source of truth. Run `pnpm openapi:sync` after API changes.
- Conventional commits (`feat:`, `fix:`, `chore:` ...). Husky will grunt at you.
- No circular deps. `pnpm lint:circular` + `pnpm lint:deps` must pass.

## Deeper cave drawings

Docs in `docs/` (architecture, conventions, engineering standards). Read before inventing.

## graphify

Knowledge graph at `graphify-out/`.

- Before architecture or codebase questions: read `graphify-out/GRAPH_REPORT.md`.
- If `graphify-out/wiki/index.md` exists, walk it instead of raw files.
- After editing code this session, keep graph fresh:
  ```bash
  python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
  ```
