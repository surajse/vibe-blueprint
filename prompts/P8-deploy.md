Set up deployment per @docs/ARCHITECTURE.md section "Deployment":
Vercel for web (preview per PR), Supabase production project with migrations
applied via CI, EAS Build/Update for Android, environment variable matrix
(local / preview / production) documented in docs/ENVIRONMENTS.md, Sentry and
PostHog wired with PII scrubbing, a /api/health endpoint, and database backups.
Do NOT put real secrets in the repo or in chat; produce a checklist of secrets I
must add manually in each dashboard. Verify with a preview deployment checklist.
