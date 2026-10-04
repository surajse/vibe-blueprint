# Freshness log

Koi dated fact bina source aur date ke repo me nahi (Q99).
Future event = future tense. Har row quarterly re-verify karo
(`.github/workflows/freshness.yml` yaad dilata hai).

| Fact                                                                                                               | Source                                                 | Checked    |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ---------- |
| Node 24 Active LTS ends 2026-10-20 (scheduled); maintenance after, EOL 2028-04-30                                  | Node.js release schedule (`schedule.json`)             | 2026-10-04 |
| Node 26 enters LTS 2026-10-28 (scheduled)                                                                          | Node.js release schedule                               | 2026-10-04 |
| From Node 27: one major/year (April), every release becomes LTS, 6-month alpha channel                             | Node.js blog announcement                              | 2026-10-04 |
| CodeQL Action v3 will be deprecated in December 2026 (announced 2025-10-28); v4 is current                         | GitHub changelog 2025-10-28                            | 2026-10-04 |
| Action majors in this repo: checkout v7, setup-node v7, pnpm/action-setup v6, gitleaks-action v3, codeql-action v4 | Action READMEs, verified in `.github/workflows/ci.yml` | 2026-10-04 |
| gitleaks-action requires `GITLEAKS_LICENSE` for organization-owned repos (personal repos: no license needed)       | gitleaks-action README                                 | 2026-10-04 |
| pnpm 12.9.1 is npm `latest`                                                                                        | `npm view pnpm version`                                | 2026-10-04 |
| Node 24.21.0 is the latest LTS                                                                                     | nodejs.org release index                               | 2026-10-04 |
| Play: new apps and updates must target API 36 from 2026-08-31                                                      | Play Console Help: Target API level requirements       | 2026-10-04 |
| Play: personal accounts created after 2023-11-13 need a closed test with 12 testers for 14 days                    | Play Console Help                                      | 2026-10-04 |
| Cursor: project rules are `.mdc` only; precedence Team > Project > User                                            | Cursor docs                                            | 2026-10-04 |
