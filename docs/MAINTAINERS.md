# Maintainers

This file is for people who **build or maintain the `vibe-blueprint` template itself**.
If you want to build an _app_ with the template, stop here — go to `prompts/P0-discovery.md`.

## The rule that rules them all

**The repo's real files are the source of truth. This playbook (`docs/BLUEPRINT.md`)
describes them and links to them — it never embeds their content.**

The one time the playbook embedded copies (of `AGENTS.md`, the CI workflow), they
drifted within weeks. Q14 applies to us too: GitHub repo = single source of truth.

## Master Bootstrap Prompt (rebuild / audit the template)

**Setup:** fresh clone of the template repo. Cursor (or any agent) — Agent mode, new chat.
Paste the prompt below.

```text
ROLE
You are a senior staff engineer maintaining the open-source template "vibe-blueprint".
Its purpose: make AI-assisted ("vibe") coding reliable by keeping context in files,
enforcing strict rules, slicing work into small tasks, and verifying everything with
automated gates.

SOURCE OF TRUTH
The repo's real files are the source of truth — AGENTS.md, .cursor/rules/*.mdc,
docs/, prompts/, scripts/, .github/, package.json. docs/BLUEPRINT.md is the playbook:
it explains the system and links to the files, but its summaries are never authoritative.
If the playbook and a real file disagree, the real file wins and the playbook gets fixed.

HARD CONSTRAINTS
- Do NOT invent versions, URLs, action pins, SHAs, or policy facts. Verify each one:
  packages with `npm view <pkg> version`, GitHub Actions with `git ls-remote --tags`,
  Play/Node/Cursor facts against the official docs. Anything unverifiable gets marked
  UNVERIFIED, not guessed.
- Dated facts (versions, policies, action majors) live in docs/FRESHNESS.md with a
  source and a checked date — never only in a comment.
- Rules files use the .mdc extension with frontmatter (description, globs, alwaysApply).
- No new dependencies without asking. Repo must be GREEN from commit 1.
- Do NOT scaffold apps/web or apps/mobile (that happens per-project in prompt P4).

PROCESS: work in phases. After each phase run the verification, show the REAL output,
and wait for me to reply "continue". Never batch phases.

PHASE A — Root config
package.json (scripts: verify -> node scripts/verify.mjs), pnpm-workspace.yaml,
turbo.json, tsconfig.base.json (strict), .prettierrc, .editorconfig, .gitignore,
.nvmrc (exact Node version, never "lts/*" — pick per docs/FRESHNESS.md), eslint config,
.cursorignore. Verify: `pnpm install` succeeds.

PHASE B — Walking skeleton
packages/shared: one pure function + Vitest test + lint/typecheck/test/build scripts.
Verify: `pnpm verify` passes. Paste the output.

PHASE C — AI guardrails
AGENTS.md and .cursor/rules/*.mdc (000-core, 010-security, 020-web-nextjs,
030-mobile-expo, 035-android-play, 040-database, 050-testing). MCP example config
(`mcp.json.example`, placeholders only, no real keys) in `.cursor/`. Verify: list files, valid frontmatter.

PHASE D — Docs
docs/: BLUEPRINT.md (playbook, links not embeds), QA.md (150-question debate),
FRESHNESS.md, PRD.md, ARCHITECTURE.md, TECH_STACK.md, DATA_MODEL.md, API_CONTRACT.md,
DESIGN_SYSTEM.md, SECURITY.md, TESTING.md, PROGRESS.md, TASKS.md, BACKLOG.md,
GLOSSARY.md, UX.md, DATA_INVENTORY.md, ENVIRONMENTS.md, RELEASE.md, RUNBOOK.md,
OBSERVABILITY.md, WEB_LAUNCH.md, TOOLING.md, PLAY_STORE.md, MAINTAINERS.md (this file),
decisions/ADR-0000-template.md, tasks/T-000-template.md. No lorem ipsum.

PHASE E — Prompts library
prompts/: P0-discovery.md, P1-prd.md, P2-architecture.md, P2b-ux-wireframes.md,
P3-tasks.md, P4-scaffold.md, P5-database-auth.md, P6-feature.md, P7-hardening.md,
P8-deploy.md, P9-release.md, P10-play-store.md, T-task.md, D-debug.md, R-recovery.md,
V-review.md, H-audit.md, M-memory.md.

PHASE F — GitHub automation
.github/workflows/ci.yml (least privilege, concurrency, timeouts, gitleaks with
GITLEAKS_LICENSE for org repos, CodeQL, dependency audit + review),
.github/workflows/freshness.yml (quarterly re-verify issue), PULL_REQUEST_TEMPLATE.md,
ISSUE_TEMPLATE/bug.md, ISSUE_TEMPLATE/feature.md, dependabot.yml (npm + github-actions,
weekly). Check the latest major of every Action before pinning.

PHASE G — Community files
README.md (what/why, 5-minute quick start, Mermaid workflow, folder map, FAQ),
LICENSE (MIT), CONTRIBUTING.md, CODE_OF_CONDUCT.md, CHANGELOG.md, SECURITY.md.

FINAL CHECK
Run `pnpm verify` (includes the docs cross-reference check). Then report: file tree,
assumptions made, anything UNVERIFIED, suggested commit message. Then stop.
If a command fails twice, stop and report the evidence. Do not attempt a third blind fix.
```

## Maintainer checklist (every change)

1. Change the **real file**, not the playbook's description of it.
2. If the playbook describes the file, update the description/link in the same commit.
3. Dated fact? Add/update the row in `docs/FRESHNESS.md` (fact | source | checked date).
4. New doc referenced from AI-facing files? `scripts/check-docs.mjs` (via `pnpm verify`)
   will fail if the file doesn't exist — that's the point.
5. `pnpm verify` green before push. Small commits, Conventional Commits.
