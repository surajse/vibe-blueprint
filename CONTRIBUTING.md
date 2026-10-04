# Contributing to vibe-blueprint

## The one rule

**Repo = memory. Tests = truth. Small task = less hallucination.**
Every contribution should make AI-assisted coding more reliable, not just bigger.

## How to contribute

1. Fork, then create a short branch: `feat/<what>` or `fix/<what>`.
2. Keep the diff small and reviewable. One concern per PR.
3. Run `pnpm verify` — it must pass (format, lint, typecheck, test, build). Paste the output summary in your PR.
4. Follow the PR template checklist (`.github/PULL_REQUEST_TEMPLATE.md`).
5. Update `docs/PROGRESS.md` if your change affects the workflow, and add an ADR in `docs/decisions/` if you made a real decision.

## "Gotchas learned" contributions (especially welcome)

Found a way AI coding tools silently go wrong? Add it:

- To the relevant prompt in `prompts/`, or
- To `docs/BLUEPRINT.md` (the 50-question debate / troubleshooting playbook), or
- As a new rule in `.cursor/rules/` (keep rules under 500 lines; always-on rules share a ~2000-token budget).

Format: **symptom → root cause → fix**, with evidence (what you ran, what the
output was). No advice without evidence.

## What we don't merge

- New dependencies without justification (name, why, size, alternatives).
- Placeholders, TODOs, or mock data in production paths.
- Tests edited to pass without a spec change.
- Secrets, keys, or personal data — gitleaks runs on every PR.

## Dogfooding

The best contributions come from building a real app P0→P9 from this template
and reporting where the prompts, rules, or gates failed you. See
`docs/BLUEPRINT.md` §13.7.

## Code of conduct

Be kind. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
