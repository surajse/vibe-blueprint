# Testing

> Pyramid: many unit → some integration → few e2e. A bug fix starts with a
> failing regression test. Conventions enforced via `.cursor/rules/050-testing.mdc`.

## Unit (Vitest)

- Target: services, utils, Zod schemas in `packages/shared`.
- Style: Arrange-Act-Assert, behavior not implementation, descriptive names.
- No real network calls.

## Integration

- Route handlers + repositories against a local/test database.
- **RLS tests mandatory:** owner can access own rows; another user cannot;
  anonymous is denied.

## E2E

- Web: Playwright. Mobile: Maestro.
- Cover critical journeys from docs/PRD.md only (keep the suite small and fast).
- Run against preview deploys in CI.

## Rules

- Never modify an existing test to make it pass unless the spec changed — say so explicitly.
- New behavior ships with tests (unit; e2e for user flows).
- `pnpm verify` (format, lint, typecheck, test, build) is the Definition of Done.
