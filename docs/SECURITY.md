# Security

> Threat model filled in P2. Baseline rules are always on via
> `.cursor/rules/010-security.mdc` and enforced in CI (CodeQL, gitleaks).

## Threat model

| Asset                | Threat                                    | Mitigation                                                |
| -------------------- | ----------------------------------------- | --------------------------------------------------------- |
| User data (Postgres) | Cross-user access                         | RLS on every table + RLS tests                            |
| API                  | Injection / bad input                     | Zod validation at every boundary                          |
| API                  | Unauthorized actions                      | Session-derived `userId`; authz on every route            |
| Secrets              | Leak via repo/client                      | Typed env module; `.env*` never committed; gitleaks in CI |
| Sessions             | Hijack                                    | Supabase Auth; short-lived JWT; secure storage on mobile  |
| Abuse                | Credential stuffing / expensive endpoints | Rate limiting on auth + expensive routes                  |

## Checklist (verify in P7)

- [ ] RLS enabled + policies + tests on every table
- [ ] Zod validation on every endpoint, form, webhook
- [ ] No secrets in client bundles (mobile + web)
- [ ] Security headers + HTTPS only
- [ ] Rate limits on auth and expensive endpoints
- [ ] Dependency audit clean; Dependabot on
- [ ] gitleaks + CodeQL green
- [ ] Least-privilege API keys; PII minimized; audit logs for sensitive actions
- [ ] Backups configured + restore drilled
