Audit the whole repo against @docs/SECURITY.md and @docs/PRD.md.
Check: RLS coverage on every table, input validation on every endpoint, authz
on every route, rate limiting, secret handling, dependency audit, CORS, headers,
accessibility (labels, contrast, focus, screen reader), loading/empty/error states
on every screen, offline behavior on mobile, performance (bundle size, N+1 queries,
indexes). Output a table: finding | severity | file | fix. Fix Critical/High items
as separate small commits, each with a test. Do not refactor unrelated code.
