# Changelog

All notable changes to this template are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versions follow [Semantic Versioning](https://semver.org/).

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
