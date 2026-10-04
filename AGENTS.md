# AGENTS.md — Read this first, every session

## Project

<APP_NAME>: <one-line description>.
Sources of truth: docs/PRD.md (what), docs/ARCHITECTURE.md (how),
docs/TASKS.md (what next), docs/PROGRESS.md (current state + gotchas).

## Session start protocol (mandatory)

1. Read docs/PROGRESS.md and the current task file docs/tasks/T-xxx.md.
2. Restate: the task, acceptance criteria, and the exact files you will touch.
3. If the change touches more than 5 files, STOP and wait for my approval.
4. Search the codebase before creating anything (existing util / component / type?).

## Hard rules

- NEVER invent APIs, packages, env vars, table/column names or file paths.
  Verify by reading the file, the official docs, or `npm view <pkg>`.
  If unsure, say "I don't know — I need X" instead of guessing.
- No new dependency without my approval (state name, why, size, alternatives).
- Scope fence: touch only the files listed in the task. No drive-by refactors,
  renames or formatting changes.
- No placeholders, TODOs, mock data or stubbed functions in production paths.
- Never edit tests to make them pass unless the spec changed (say so explicitly).
- Never read, print or commit secrets or .env* files.
- TypeScript strict. No `any`. No `@ts-ignore` without a comment explaining why.
- Android/Play: never change the app package name, signing keys or targetSdk downwards;
  follow docs/PLAY_STORE.md. `NEXT_PUBLIC_*` / `EXPO_PUBLIC_*` values are public — no secrets.
- Respect layers: UI -> hook -> api client -> route handler -> service
  -> repository -> DB. Never skip a layer.

## Definition of Done (all required)

- `pnpm verify` passes (format, lint, typecheck, test, build). Paste real output.
- New behavior has tests (unit; e2e for user flows).
- Loading, empty, error and offline states handled.
- docs/PROGRESS.md updated; ADR added if a decision was made.

## When stuck

After 2 failed attempts: stop. Summarize what you tried, the evidence (logs),
and 2 hypotheses. Do not attempt a third blind fix.

## Response format for every task

Plan -> Changes (file list) -> Verification output -> Risks/Assumptions -> Next step.
