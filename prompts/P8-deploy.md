Set up deployment per @docs/ARCHITECTURE.md ("Deployment topology") and @docs/ENVIRONMENTS.md:
Vercel for web (preview per PR), Supabase production project with migrations applied
via CI (staging first), EAS Build + Submit for Android (see @docs/PLAY_STORE.md),
the environment variable register in docs/ENVIRONMENTS.md, Sentry and PostHog wired
with PII scrubbing (@docs/OBSERVABILITY.md), a /api/health endpoint, uptime
monitoring, and database backups with one restore drill.
Do NOT put real secrets in the repo or in chat; produce a checklist of secrets I
must add manually in each dashboard. Verify with a preview deployment checklist.
