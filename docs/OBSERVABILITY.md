# Observability

| Signal   | Tool                  | What we watch                               | Alert when                              |
| -------- | --------------------- | ------------------------------------------- | --------------------------------------- |
| Errors   | Sentry (web + mobile) | new issues, regressions per release         | new issue in a release; error spike     |
| Uptime   | external monitor      | `/api/health` (DB + auth reachable)         | 2 consecutive failures                  |
| Latency  | host metrics / Sentry | p95 per route                               | p95 above target for 10 min             |
| Product  | PostHog               | KPIs from `docs/PRD.md` §3 funnels          | funnel step drops sharply after release |
| Mobile   | Play Console vitals   | crash rate, ANR rate                        | worse than previous release             |
| Database | Supabase dashboard    | slow queries, connections, storage, backups | backup failure; connection saturation   |

Rules: structured JSON logs with request id; **no PII, tokens or passwords in logs or analytics**;
scrub user identifiers before sending to third parties; every alert has an owner and a runbook link.
