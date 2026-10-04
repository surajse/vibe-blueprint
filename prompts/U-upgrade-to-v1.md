# U — Upgrade vibe-blueprint to v1.0 (run in Cursor, Agent mode)
> **Phase-0 pre-verdict (maintainer, 2026-10-04):** D1–D15 were re-verified against the
> live repo before this prompt was filed. **Already fixed / not reproducible:** D1
> (BLUEPRINT.md is 601 lines, not 1,331), D2 (de-embedded in v0.3), D3 (tense fixed),
> D4 (`npm view pnpm dist-tags` → `latest: 12.9.1` — the README is correct),
> D5 (CI already hardened), D6 (`scripts/verify.mjs` is cross-platform), D8 (100 Q&As
> exist; now 150 with Q101–Q150 merged into `docs/QA.md`), D12 (`docs/AGENT_SECURITY.md`
> exists), D14 (docs already say flat `.mdc` only), D15 (no open PRs).
> **Still real:** D7 (Hinglish prose — deliberate), D9 (single stack), D10 (no CLI),
> D11 (receipts), D13 (no evals/examples). Start Phase 0 from this verdict; do not
> re-litigate the closed items.

## Before you paste (5 minutes, by hand)

1. Copy `QA-051-150.md` into your repo at `docs/qa/QA-051-150.md` and commit it.
2. In GitHub: Settings → Branches → protect `main` (PR + CI required).
3. Open the repo in Cursor → new chat → Agent mode → attach `@AGENTS.md @docs/PROGRESS.md @docs/qa/QA-051-150.md`.
4. Paste the prompt below. Run ONE phase per chat. After each phase: review the diff → merge the PR → start a new chat → paste the same prompt and say `Resume at Phase N`.

## Honest positioning vs GSD (Open GSD / `gsd-core`)

| Axis | GSD Core today | vibe-blueprint today | Where v1.0 can win |
| --- | --- | --- | --- |
| Install | `npx @opengsd/gsd-core@latest`, installs commands/skills into many agent runtimes | Copy files by hand | Zero-install files **plus** a tiny zero-dependency CLI |
| State | `.planning/` directory | `docs/PROGRESS.md` (manual) | `.vibe/` state + verification receipts |
| Reach | Active community, many runtimes | New, 0 stars | Cannot be claimed — must be earned with evals and adoption |
| Focus | General spec-driven build loop | Reliability + production | Play Store / web launch gates, security, 150-question failure KB, stack profiles |

Do not copy GSD code or prose. Win on: production gates, a 150-question failure knowledge base, machine-checkable "done", stack profiles, and published evals.

---

## THE PROMPT (copy everything inside the fence)

```
ROLE
You are a principal engineer and technical writer upgrading the open-source GitHub
template "vibe-blueprint" to v1.0. Mission: the most reliable, tool-agnostic starter
kit for building production websites, Android/mobile apps, APIs and software with AI
coding agents. "Reliable" means measurable: mistakes are caught by machines within
minutes, and context lives in files, not in chat.

GLOBAL RULES (apply to every phase)
G1  Verify, never assume. Any version, flag, file path, API, policy or product behaviour
    you did not read in this repo or an official source THIS session is UNVERIFIED.
    Verify with `npm view <pkg> version`, the GitHub API / releases page, or the official
    docs URL. Record claim + source URL + date checked in docs/FRESHNESS.md.
    If you cannot verify: write "UNVERIFIED" in the doc and list it in your final report.
G2  Never state future events in the past tense. Prefer "scheduled for" and cite a source,
    or remove the date from prose and keep it only in FRESHNESS.md.
G3  One phase per run. One branch per phase: `chore/upgrade-phase-N-<slug>`. Do not touch
    files outside the phase scope. If you think you must, STOP and ask.
G4  Before AND after every phase run `pnpm verify` and paste the REAL output.
    The repo must be green at the end of every phase.
G5  No new dependency unless the phase says so. State name, why, size, and `npm view`
    output. Prefer Node built-ins (node:test, node:util parseArgs, node:fs, node:crypto).
G6  Copy attached content (QA-051-150.md) verbatim. Only fix formatting. Never "improve"
    its wording unless told to.
G7  Do not delete content that has no replacement yet. Move, then link.
G8  After 2 failed attempts at anything: stop, report evidence and 2 hypotheses.
G9  At the end of each phase: update docs/PROGRESS.md, add "Gotchas learned", and give me
    (a) file list changed, (b) real command output, (c) UNVERIFIED items, (d) next phase.
    Then STOP and wait for my reply "continue".

KNOWN DEFECTS — HYPOTHESES TO CONFIRM IN PHASE 0 (do not trust; verify each)
D1  docs/BLUEPRINT.md is ~1,331 lines / ~58 KB and the bootstrap prompt says "read it
    completely" -> violates this repo's own context rules (Q28, Q29, Q71).
D2  BLUEPRINT.md embeds verbatim copies of AGENTS.md, rules, CI and templates that also
    exist as real files -> two sources of truth, guaranteed drift.
D3  Tense errors dated 2026-10-04: "Node 24 was active LTS until 2026-10-20",
    "Node 26 became LTS 2026-10-28", "codeql-action v3 was removed Dec 2026".
D4  Unverified versions: README says "Node 24.20.0, pnpm 12.9.1 — 2026-10-04".
    Evidence against pnpm 12.x: pnpm 11 shipped 2026-04-28 and 11.16.0 was published
    2026-07-22 (verify with `npm view pnpm dist-tags`). Also unverified: action majors
    actions/checkout@v7, actions/setup-node@v7, pnpm/action-setup@v6,
    gitleaks/gitleaks-action@v3, github/codeql-action@v4.
D5  ci.yml: check for a top-level `permissions: contents: read`, `concurrency`,
    `timeout-minutes`, and whether third-party Actions are pinned to commit SHAs.
    gitleaks-action may need a licence if the repo moves to a GitHub organisation.
D6  scripts/verify.sh is bash-only; `bash scripts/verify.sh` fails on native Windows.
D7  Prose is Hinglish; prompts are English -> blocks global adoption.
D8  Only 50 Q&As; target is 150.
D9  Single stack (Next.js + Expo + Supabase) but the claim is "universal".
D10 No installer, no generated per-tool adapters, no Agent Skills / commands.
D11 "Done = paste real output" is honour-system; nothing machine-checkable.
D12 No agent-safety doc: prompt injection, MCP trust, auto-run, destructive commands.
D13 No evals and no examples/ app although BLUEPRINT §13 recommends dogfooding.
D14 Cursor rule format: current docs describe `.cursor/rules/<name>/RULE.md` folders, but
    users report only flat `.mdc` files load. Q32 says ".md is ignored" without noting the
    mismatch. Re-verify in Cursor Settings -> Rules and in the official docs.
D15 Open Dependabot PR #1 (typescript 5.9.3 -> 6.0.3). Merge only if CI is green.

TARGET STRUCTURE (v1.0)
AGENTS.md                       canonical, <=150 lines, <=~2k tokens
docs/
  BLUEPRINT.md                  index only, <=150 lines, links to everything below
  playbook/                     why-ai-fails, 7-layers, daily-loop, golden-rules, faq
  qa/                           01-psychology Q1-25, 02-technical Q26-50, QA-051-150 (given)
  hi/                           original Hinglish text preserved (optional translation home)
  FRESHNESS.md                  claim | source URL | checked on | re-check by
  AGENT_SECURITY.md  TOOLING.md  STACK_SELECTION.md  METRICS.md
  launch/ ANDROID_PLAY.md  WEB.md  API.md
profiles/                       one folder per stack profile (see Phase 8)
core/                           single source for rules + skills (adapters are generated)
skills/                         Agent Skills (SKILL.md) for each workflow step
packages/cli/                   `vibe` CLI, zero runtime dependencies
.vibe/                          state.json, receipts/ (generated; receipts git-ignored)
evals/                          benchmark tasks + runner
examples/                       one dogfooded walkthrough
scripts/                        verify.mjs (cross-platform), check-docs.mjs, check-qa.mjs,
                                check-rules.mjs, context-budget.mjs, verify-versions.mjs

PHASE 0 — Recon and baseline (NO changes)
- Read AGENTS.md, README.md, package.json, scripts/*, .github/**, .cursor/rules/*,
  .agents/rules/*, docs/ (list sizes in lines + bytes), CHANGELOG.md, docs/AUDIT-2026-10-04.md
  and docs/FRESHNESS.md if they exist.
- Run `pnpm install` and `pnpm verify`; paste output.
- For each of D1–D15: write CONFIRMED / ALREADY FIXED / NOT REPRODUCIBLE with file:line
  evidence. Do not fix anything yet.
- Write docs/AUDIT-v1.md: table (ID | status | evidence | planned phase) + baseline metrics
  (BLUEPRINT.md lines, AGENTS.md token estimate = chars/4, always-on rules token estimate).
- Open one GitHub issue per CONFIRMED defect (or list them for me if you lack access).
STOP.

PHASE 1 — Truth and freshness (D3, D4)
- Create scripts/verify-versions.mjs (Node built-ins only): reads package.json,
  .nvmrc, pnpm-workspace.yaml catalog, and `uses:` lines in .github/workflows/*.yml; checks
  that each pinned npm version exists via the npm registry and each Action tag exists via the
  GitHub API (use GITHUB_TOKEN if set; handle rate limits; fail with a clear message).
  Offline mode: skip with a loud warning, never silently pass.
- Run it. Fix every wrong pin using VERIFIED values only. Fix .nvmrc with an exact version
  confirmed from nodejs.org/en/about/previous-releases or the official release index.
- Create docs/FRESHNESS.md. Move every dated/versioned/policy claim out of prose into it.
- Rewrite D3 sentences with correct tense or remove them. Update README "Tested with".
- Add a CI job that fails if any FRESHNESS.md row is older than 90 days.
Verify: `node scripts/verify-versions.mjs` passes; `pnpm verify` green.

PHASE 2 — Modularise docs (D1, D2)
- Split docs/BLUEPRINT.md into docs/playbook/*, docs/qa/*, docs/launch/*; no section may
  exceed ~250 lines. BLUEPRINT.md becomes an index of <=150 lines with links only.
- Remove every verbatim copy of a file that exists elsewhere; link to the real file.
- Update the Master Bootstrap Prompt (prompts/) so it reads files individually and never
  says "read BLUEPRINT.md completely".
- scripts/check-docs.mjs: fail on dead relative links, duplicate headings across index
  and children, and any doc >400 lines.
- scripts/context-budget.mjs: estimate tokens (chars/4) for AGENTS.md + always-on rules;
  fail if >2,500 tokens (budget configurable in .vibe/config.json).
Verify: both scripts pass inside `pnpm verify`.

PHASE 3 — 150-question knowledge base (D7, D8)
- Translate Q1–Q50 from Hinglish into clear English into docs/qa/01-psychology.md (Q1–25)
  and docs/qa/02-technical.md (Q26–50), same Q/A/Fix format, add [L1–L7] layer tags.
  Preserve the original Hinglish in docs/hi/ (move, do not delete).
- Keep docs/qa/QA-051-150.md verbatim (G6).
- Create docs/qa/INDEX.md: table Q# | topic | layer | file. Create a "Top 20" page
  linking the highest-impact Qs.
- scripts/check-qa.mjs: assert Q1..Q150 present exactly once, in order, each with A: and Fix:
  lines, and a valid layer tag. Wire into `pnpm verify`.
- Update README + AGENTS.md references from "50-question" to "150-question".
Verify: `node scripts/check-qa.mjs` -> "150 OK".

PHASE 4 — CI and cross-platform hardening (D5, D6)
- scripts/verify.mjs (Node): runs format:check, lint, typecheck, test, build, check-docs,
  check-qa, check-rules, context-budget, in order; stops on first failure; prints a summary
  table; writes a receipt (.vibe/receipts/<ISO-time>-<gitsha>.json) with commands, exit
  codes, durations, node/pnpm versions, git sha, dirty flag. Keep scripts/verify.sh as a
  thin wrapper. `pnpm verify` calls the .mjs file.
- Receipts are evidence of a real run, NOT proof; CI remains the authority. State this in docs.
- ci.yml: top-level `permissions: contents: read`; per-job elevation only where required
  (CodeQL: security-events: write); `concurrency` with cancel-in-progress for PRs;
  `timeout-minutes` on every job; matrix on ubuntu-latest and windows-latest for `verify`.
- Pin third-party Actions to full commit SHAs with the tag in a trailing comment. Obtain SHAs
  from the GitHub API for the tags verified in Phase 1. Dependabot config keeps them updated.
- Secrets scan: if gitleaks-action would need a licence for the repo type, use the gitleaks
  CLI step instead. Document the choice in an ADR.
- Triage Dependabot PR #1 (D15): rebase, run verify, merge only if green; else comment why.
Verify: CI green on both OSes in a PR; paste the run URL.

PHASE 5 — Agent safety and rules (D12, D14)
- docs/AGENT_SECURITY.md: prompt injection, untrusted content = data, MCP trust policy
  (pinned versions, read-only scopes, separate dev/prod creds), auto-run allowlist, forbidden
  commands (rm -rf, force-push, reset --hard, DROP, prod DB access), secrets handling,
  sandbox/devcontainer guidance. Cite sources where you reference tool behaviour (G1).
- Add rule `.cursor/rules/020-agent-safety.mdc` (alwaysApply) — <=15 lines.
- scripts/check-rules.mjs: every rule has valid frontmatter (description, globs, alwaysApply),
  is <500 lines, and is `.mdc`. Warn (not fail) if a RULE.md folder-style rule exists.
- docs/TOOLING.md: how rules load in Cursor today (document both formats and the mismatch
  with sources), plus a "verify in Settings -> Rules" step. AGENTS.md always works as fallback.
- Add git hook examples (pre-commit: secrets scan + format; pre-push: verify) using plain
  `.githooks/` + `git config core.hooksPath` (no new dependency).
Verify: check-rules passes; AGENTS.md still within budget.

PHASE 6 — Single source + adapters + CLI (D10, D11)
- core/: canonical rules and skill bodies. `vibe sync` generates, from core/, the adapters
  below. For EACH tool, verify the current file location and format in its official docs and
  record URL + date in FRESHNESS.md; if unverified, skip that adapter and say so.
    Cursor: .cursor/rules/*.mdc, .cursor/commands/*.md
    Claude Code: CLAUDE.md (points to AGENTS.md), .claude/skills/
    GitHub Copilot: .github/copilot-instructions.md
    Gemini CLI: GEMINI.md        Windsurf: .windsurf/rules/
  Generated files carry a header: "GENERATED from core/ — edit core/, run `vibe sync`".
  CI fails if `vibe sync` produces a diff.
- packages/cli (Node >= pinned LTS, ZERO runtime deps, node:test for tests):
    vibe init                scaffolds docs/, .vibe/, AGENTS.md into a project
    vibe doctor              checks versions, rules, docs links, budget, receipts
    vibe sync                regenerates adapters
    vibe task new "<title>"  creates docs/tasks/T-###.md from the template, next ID
    vibe verify              runs scripts/verify.mjs
    vibe handoff             regenerates the Handoff block in PROGRESS.md from .vibe/state.json
    vibe status              prints current phase, task, last receipt
- .vibe/state.json: {phase, currentTask, lastReceipt, gotchas[]}. PROGRESS.md "Current state"
  is a rendered view; hand edits outside marked blocks are preserved.
- Unit tests for every command (temp dirs). Do not publish to npm yet.
Verify: `pnpm --filter cli test` green; `vibe init` works in an empty temp folder (paste output).

PHASE 7 — Skills / slash-command equivalents (D10)
- First read the official Agent Skills documentation and record the required SKILL.md
  frontmatter fields + source URL in FRESHNESS.md. Do not guess field names.
- Create skills/ (each SKILL.md <=150 lines, one job, explicit inputs/outputs/stop conditions):
    vb-discover   vb-prd   vb-architect   vb-plan-tasks   vb-build-task   vb-verify
    vb-review     vb-debug   vb-handoff   vb-launch-android   vb-launch-web   vb-audit-hallucination
- Each skill must: restate the task, list files it will touch, require a plan before code,
  require failing tests first, forbid new dependencies without approval, and end by calling
  `pnpm verify` and writing a receipt. Map each skill to the Q# it prevents.
- Mirror them as Cursor commands via `vibe sync`.
Verify: a lint script confirms each skill has valid frontmatter and stays within length.

PHASE 8 — Stack profiles (D9)
Create profiles/<name>/{profile.md, rules/*.mdc, verify.config.json, ARCHITECTURE.snippet.md}
for: web-saas (Next.js + Supabase), mobile-expo (Android + iOS), android-kotlin,
flutter, api-python (FastAPI + Postgres), desktop-tauri. Do NOT scaffold apps here;
scaffolding happens in prompt P4 with the OFFICIAL generator of the chosen profile.
- docs/STACK_SELECTION.md: decision matrix (platform, team skill, offline, performance, store
  needs, hiring pool, AI training-data depth, lock-in) -> recommended profile + required ADR.
- Every profile lists: verified commands, test tools, lint/type gates, CI snippet, top 10
  Gotchas for that stack, and its launch checklist link. Mark each version-sensitive line 🔎.
Verify: check-docs passes; each profile has all 5 files.

PHASE 9 — Production launch kits
- docs/launch/ANDROID_PLAY.md, WEB.md, API.md. Every checklist item cites an official source
  URL + checked date in FRESHNESS.md, and says "re-check in the console/dashboard before
  release". Cover: signing, App Bundle, target API requirement, privacy policy, Data safety
  form, account-deletion rules, content rating, closed-testing requirement for new personal
  accounts, pre-launch report, staged rollout, crash reporting, rollback; web: HTTPS/HSTS,
  headers, CSP, SEO, a11y, performance budget, backups + restore drill, monitoring, abuse
  protection, email DNS (SPF/DKIM/DMARC).
- Prompts P8–P10 reference these files instead of duplicating text.
Verify: no checklist item without a source or an explicit UNVERIFIED tag.

PHASE 10 — Evals (D13)
- evals/ with a runner (Node, no deps) and 10 small, deterministic tasks (e.g. add endpoint
  with validation, fix a failing test without editing it, add a migration with RLS test,
  rename without scope creep, handle an expired session). Each task = fixture repo + hidden
  acceptance tests + score (pass/fail, files touched, tests edited?, new deps?).
- Implement the runner and the first 3 tasks fully; open issues for the other 7.
- docs/METRICS.md: first-pass-verify rate, rework %, defect escape rate, hallucination
  incidents. Describe how to run "with kit" vs "without kit". Do NOT invent results; leave
  the results table empty until real runs exist.

PHASE 11 — Dogfood example (D13) — time-boxed
- Using only this repo's prompts, build `examples/walkthrough/`: a tiny real app from P0 to P6
  (PRD, ARCHITECTURE, TASKS, 3 completed tasks with receipts, PROGRESS with real Gotchas).
  Record every prompt weakness you hit as an issue. Fix the prompts, not the example.

PHASE 12 — Community and release
- Rewrite README in English: what/why, 5-minute quick start, workflow diagram (Mermaid),
  the 7 layers, folder map, "Use it in:" table (Cursor, Claude Code, Codex, Copilot, Windsurf,
  Gemini CLI, Lovable/Bolt/Replit/v0 via GitHub sync + AGENTS.md as custom instructions),
  honest "What this cannot guarantee", comparison-with-alternatives section (factual, sourced),
  badges (CI, licence). Add README.hi.md (short Hinglish quick start + link to docs/hi/).
- docs/USE-IN-PLATFORMS.md: step-by-step per platform, with what to paste where.
- Issue forms (bug, "AI gotcha", feature), Discussions categories, CODEOWNERS, SECURITY.md,
  release workflow that tags v1.0.0 and generates notes from CHANGELOG.md.
- Release checklist: all phases merged, CI green on both OSes, FRESHNESS.md rows <90 days,
  check-qa = 150 OK, no UNVERIFIED items in README claims.

FINAL REPORT (after Phase 12)
File tree; metrics before vs after (BLUEPRINT.md lines, AGENTS.md tokens, always-on rules
tokens, QA count, CI time); every UNVERIFIED item; remaining risks; suggested v1.0.0 notes.
Then stop.
```

---

## How to use the finished repo for YOUR app (any platform)

1. **New project:** GitHub → Use this template → clone → open in Cursor (or Claude Code / Codex / Windsurf).
2. **Pick a profile:** read `docs/STACK_SELECTION.md` → write the choice as an ADR.
3. **Discovery → PRD → Architecture → Tasks:** run P0, P1, P2, P3 (or the `vb-*` skills). Commit each output.
4. **Scaffold (P4)** with the official generator, then **DB + Auth (P5)**.
5. **Feature loop (P6):** next task → new chat → attach `@AGENTS.md @docs/PROGRESS.md @docs/ARCHITECTURE.md @docs/tasks/T-xxx.md` → plan → failing tests → implement → `pnpm verify` → PR → CI green → update PROGRESS → close chat.
6. **Hardening (P7), deploy (P8), release (P9/P10):** follow `docs/launch/*`.
7. **On Lovable / Bolt / Replit / v0:** connect the GitHub repo, paste `AGENTS.md` into custom instructions or project knowledge, and treat the repo (not the platform chat) as the source of truth.
