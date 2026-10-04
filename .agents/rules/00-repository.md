# Repository rules — Google Antigravity IDE shim

@AGENTS.md

This workspace's canonical agent instructions live in `AGENTS.md` at the repo
root. It is the single source of truth; this file only guarantees Antigravity
discovers it.

Key files the agent should read every session:

- `AGENTS.md` — session protocol, hard rules, definition of done
- `docs/PROGRESS.md` — current state + gotchas (living memory)
- `docs/TASKS.md` + `docs/tasks/T-xxx.md` — what to build next
- `docs/PRD.md`, `docs/ARCHITECTURE.md` — what and how
- `prompts/` — phase prompts P0–P9 and reusable T/D/R/V/H/M prompts

Note: `.cursor/rules/*.mdc` are Cursor-specific and not read by Antigravity.
Their substance is already covered by `AGENTS.md`.
