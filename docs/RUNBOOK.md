# Incident runbook

## Severity

| Sev | Meaning                               | Response               |
| --- | ------------------------------------- | ---------------------- |
| 1   | Down, data loss/leak, payments broken | Immediately, all hands |
| 2   | Core journey degraded for many users  | Within 1 hour          |
| 3   | Minor bug, workaround exists          | Next working day       |

## First 15 minutes

1. **Declare** the incident, name one incident lead, open a notes doc with a timeline.
2. **Stabilize first, diagnose second:** roll back the last deploy (Vercel rollback / halt Play staged rollout).
3. Check Sentry (new issues by release), host status pages, Supabase dashboard, recent migrations.
4. If a **secret leaked**: rotate it immediately (provider dashboard), then audit access logs.
5. If **data exposure** is possible: preserve logs, disable the affected endpoint, follow legal/privacy obligations.

## After

- Write a blameless postmortem within 3 days: timeline, root cause, what detected it, what fixes it permanently.
- Add a regression test and a line in `docs/PROGRESS.md` → "Gotchas learned".
