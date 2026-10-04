## What & why

Task: T-### PRD refs:

## Checklist

- [ ] `pnpm verify` passes (paste output summary)
- [ ] Tests added/updated (no test edited just to pass)
- [ ] Loading / empty / error states covered
- [ ] No new dependency (or approved + justified)
- [ ] No secrets, no TODO/mock in prod paths
- [ ] docs/PROGRESS.md updated; ADR added if needed
- [ ] Manually clicked through the acceptance criteria

## If this touches mobile (Android)

- [ ] No change to package name / signing / targetSdk (or ADR linked)
- [ ] New permissions listed here and justified: <none>
- [ ] Tested on an API 36 emulator (and a low-end device for UI-heavy changes)

## If this touches the database

- [ ] New migration (old ones untouched), RLS + policies + RLS tests, types regenerated

## Risks / assumptions
