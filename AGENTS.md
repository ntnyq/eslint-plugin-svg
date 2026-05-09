# AGENTS.md

Agent guidance for eslint-plugin-svg.

## Purpose

This repository is an ESLint plugin for SVG files. Keep changes small, typed, and covered by tests.

## Quick Start

- Install: `pnpm install`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Test: `pnpm test`
- Build: `pnpm build`
- Docs dev server: `pnpm docs:dev`
- Docs build: `pnpm docs:build`

Use Node versions supported by `package.json` engines.

## Project Map

- `src/rules`: Rule implementations.
- `src/configs/index.ts`: Presets (including `recommended`).
- `src/rules/index.ts`: Rule registry exported by plugin.
- `src/utils/createRule.ts`: Shared rule factory (`createESLintRule`) and docs URL generation.
- `tests/rules`: Rule tests using `eslint-vitest-rule-tester`.
- `tests/internal.ts`: Shared test runner wrapper configured with `svg-eslint-parser`.
- `docs/rules`: Rule documentation pages.

For user-facing behavior and docs, prefer linking existing docs instead of duplicating details:

- Main overview: [README](./README.md)
- User docs home: [docs/index.md](./docs/index.md)
- Rule docs index: [docs/rules/index.md](./docs/rules/index.md)

## Rule Change Workflow

When adding or changing a rule, keep all related files in sync:

1. Implement or update rule logic in `src/rules/<rule-name>.ts` using `createESLintRule`.
2. Export/register rule in `src/rules/index.ts` (keep sorted in the `@keep-sorted` block).
3. If rule is recommended, update `src/configs/index.ts` (also sorted in `@keep-sorted` block).
4. Add or update tests in `tests/rules/<rule-name>.test.ts` using `run(...)` from `tests/internal.ts`.
5. Add or update docs in `docs/rules/<rule-name>.md` and update the rules table in `docs/rules/index.md`.
6. If rule list changed, update the rules table in `README.md`.

## Conventions And Pitfalls

- ESM + TypeScript strict mode is enabled; keep type exports and imports clean.
- Parser assumptions are SVG-specific (`svg-eslint-parser`) in both preset config and tests.
- Keep names consistent across `RULE_NAME`, file names, docs file names, and test names.
- Preserve existing ordering around `@keep-sorted` markers.
- Do not edit build output (`dist/`) manually.

## Validation Before Finishing

Run at least:

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm test`

If docs or config behavior changed, also run:

1. `pnpm docs:build`
2. `pnpm build`
