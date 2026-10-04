Attach: @AGENTS.md @docs/PROGRESS.md @docs/ARCHITECTURE.md @docs/tasks/T-xxx.md

Task: implement T-xxx exactly as written in its task file.
Step 1 (no code): restate the goal, acceptance criteria, files you will touch, and
any ambiguity. List assumptions. Wait for my "go".
Step 2: write failing tests first. Show them failing.
Step 3: implement, touching only allowed files. No new dependencies, no refactors.
Step 4: run `pnpm verify` and paste the real output.
Step 5: self-review against the checklist in AGENTS.md; list risks.
Step 6: update docs/PROGRESS.md (including any "Gotchas learned").
If anything is unknown, say "I don't know" and ask. Never guess APIs or names.
