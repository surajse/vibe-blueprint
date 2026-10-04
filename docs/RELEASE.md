# Release process

## Versioning

- SemVer for the product (`MAJOR.MINOR.PATCH`), Conventional Commits drive the CHANGELOG.
- Android `versionCode` is auto-incremented by EAS (remote). Never reuse or lower it.

## Release checklist (copy per release)

- [ ] All P0 acceptance criteria in `docs/PRD.md` pass (automated where possible)
- [ ] `pnpm verify` green on the release commit; CI (CodeQL, gitleaks, audit) green
- [ ] E2E green on preview deploy (Playwright web, Maestro mobile)
- [ ] DB migrations reviewed; applied to staging first; backward-compatible with the previous app version
- [ ] `docs/SECURITY.md` checklist complete; `docs/WEB_LAUNCH.md` / `docs/PLAY_STORE.md` checklists complete
- [ ] CHANGELOG + release notes written; tag created
- [ ] Monitoring/alerts live (see `docs/OBSERVABILITY.md`); on-call person named
- [ ] Rollback plan confirmed (see `docs/RUNBOOK.md`)

## Rollback

- **Web:** instant rollback to the previous Vercel deployment.
- **Database:** never edit an old migration; ship a forward-fix migration. Keep migrations backward-compatible
  (expand → migrate → contract) so the previous app version keeps working.
- **Mobile:** Play cannot downgrade users. Halt the staged rollout, then ship a fixed build; use EAS Update
  (JS-only fixes) where policy allows.

## After release

- [ ] Watch crash-free rate, ANRs, error rate, p95 latency for 24h
- [ ] Update `docs/PROGRESS.md` and record lessons in "Gotchas learned"
