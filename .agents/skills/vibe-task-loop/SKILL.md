---
name: vibe-task-loop
description: Run one task from docs/TASKS.md the safe way (plan, failing tests, scoped implementation, pnpm verify, memory update). Use when asked to implement a task, feature, or bug fix in this repository.
---

# Vibe task loop

1. Read `AGENTS.md`, `docs/PROGRESS.md`, and the task file `docs/tasks/T-xxx.md`.
2. Restate the goal, acceptance criteria and the exact files you will touch. Wait for approval if > 5 files.
3. Write failing tests first and show them failing.
4. Implement inside the task's allowed-files list. No new dependencies, no drive-by refactors.
5. Run `pnpm verify` and paste the real output. If it fails twice, stop and report evidence.
6. Update `docs/PROGRESS.md` (state, decisions, "Gotchas learned").
   Never invent APIs, packages, env vars, columns or paths — verify against files or official docs.
