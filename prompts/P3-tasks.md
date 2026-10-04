Inputs: @docs/PRD.md @docs/ARCHITECTURE.md @docs/API_CONTRACT.md @docs/tasks/T-000-template.md.
Split the PRD into vertical-slice tasks (UI + API + DB + tests per slice). Each task
<= 1 day, <= 5 files where possible, with dependencies. Create docs/TASKS.md
(ordered list with status) and one docs/tasks/T-###.md per task using the template,
including allowed files, forbidden files, tests to write first and verify steps.
Order: foundation -> auth -> core feature 1 ... -> polish. Flag any task that is too big.
