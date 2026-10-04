# Changelog

All notable changes to this template are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versions follow [Semantic Versioning](https://semver.org/).

## [0.2.0] — 2026-10-04

### Fixed

- `.gitignore` / `.cursorignore` ignored `.env.example` (`.env.*`) although docs require it committed and visible to the AI. Added `!.env.example`.
- `prompts/P6-feature-loop.md` pointed to "Section 7-T" of a long document; it is now self-contained.
- `prompts/P8`, `P9` and `docs/ARCHITECTURE.md` referenced `docs/ENVIRONMENTS.md` and `docs/RELEASE.md`, which did not exist. Created, and added `scripts/check-docs.mjs` to `pnpm verify` so dead references can never ship again.
- `docs/TECH_STACK.md` claimed "no versions written" directly above a pinned-versions table; wording corrected.
- Dependabot opened surprise major bumps (TypeScript 6, Vitest 5). Majors for the toolchain are now manual; minors/patches are grouped.
- `docs/SECURITY.md` was the only security document; added a real vulnerability-reporting policy at `.github/SECURITY.md`.
- ESLint rules promised in `AGENTS.md` (no `any`, no unexplained `@ts-ignore`) are now enforced.

### Added

- Android / Google Play: `docs/PLAY_STORE.md`, `.cursor/rules/035-android-play.mdc`, `prompts/P10-play-store.md`, EAS example workflow.
- Website launch: `docs/WEB_LAUNCH.md`, Playwright example workflow.
- `docs/ENVIRONMENTS.md`, `docs/RELEASE.md`, `docs/RUNBOOK.md`, `docs/OBSERVABILITY.md`, `docs/TOOLING.md`, `docs/AUDIT-2026-10-04.md`.
- Cross-tool adapters: `CLAUDE.md`, `.agents/skills/vibe-task-loop/SKILL.md`.
- pnpm `catalog:` as the single source of truth for shared dev-tool versions.
- CI: least-privilege permissions, concurrency, timeouts, `pnpm audit`, dependency review, CODEOWNERS, issue-template config.

## [0.1.0] — 2026-10-04

### Added

- Master Bootstrap Prompt flow: root config, walking skeleton, guardrails,
  docs, prompts library, GitHub automation, community files.
- `packages/shared` walking skeleton: `slugify` + Vitest tests, green from commit 1.
- `AGENTS.md` + six `.cursor/rules/*.mdc` (core, security, web-nextjs,
  mobile-expo, database, testing) with validated frontmatter.
- Docs: PRD/ARCHITECTURE/TECH_STACK templates, DATA_MODEL, API_CONTRACT,
  DESIGN_SYSTEM, SECURITY, TESTING, PROGRESS, TASKS, ADR + task templates,
  full `BLUEPRINT.md` playbook.
- Prompts library: P0–P9 phase prompts + T/D/R/V/H/M reusable prompts.
- CI: `pnpm verify` + gitleaks + CodeQL; PR/issue templates; Dependabot
  (npm + github-actions, weekly).
- Pinned toolchain (verified 2026-10-04): Node 24.20.0, pnpm 12.9.1,
  turbo 2.11.7, typescript 5.9.3, vitest 4.1.11, eslint 10.12.0,
  typescript-eslint 8.71.0, prettier 3.9.9.
- GitHub Actions pinned to current majors (verified 2026-10-04): checkout v7,
  setup-node v7, pnpm/action-setup v6, gitleaks-action v3, codeql-action v4.
