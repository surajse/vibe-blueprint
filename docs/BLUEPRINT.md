# VIBE-BLUEPRINT.md

### Zero-Drift Vibe Coding Kit

50 Q&A debate → fixes → open-source GitHub repo → Cursor prompts → full stack + architecture + PRD

> **Language note:** Explanation Hinglish me hai. Prompts, rules aur code English me hain, kyunki AI ko English instructions zyada reliable milte hain.

---

## Contents

0. Sach pehle (honest truth)
1. Quick start (10 min)
2. The 50-question debate (psychological + logical)
3. The fix: 7-layer anti-hallucination system
4. GitHub repo design (`vibe-blueprint`) + exact file contents
5. Master Bootstrap Prompt (Cursor builds the repo)
6. Phase prompts P0–P9 (Cursor builds your app A→Z)
7. Reusable prompts (task, debug, recovery, review, audit)
8. How to use this repo on your vibe-coding platform
9. Tech stack decisions
10. Architecture blueprint
11. PRD template
12. Troubleshooting playbook
13. Launch the repo as open source

---

## 0. Sach pehle (honest truth)

- **"Zero galti" kisi bhi AI se guarantee nahi ho sakta.** LLM probabilistic hota hai: woh sabse _plausible_ next token likhta hai, sabse _sahi_ nahi.
- **Realistic goal:** galti hui to **minutes me automatically pakdi jaaye** (tests, types, CI), aur **context chat me nahi, files me rahe**.
- **Formula:**

```
Hallucination ↓  =  Grounding ↑  +  Task size ↓  +  Verification ↑  +  Memory in files
```

- AI ko ek **tez junior developer jise amnesia hai** samjho. Usko roz subah wahi README, rules aur task chahiye, aur uska kaam har baar check hona chahiye.

---

## 1. Quick start (10 min)

1. GitHub pe **public repo** banao: `vibe-blueprint` (MIT license). Settings → "Template repository" ON.
2. Is file ko repo me `docs/BLUEPRINT.md` naam se rakho. Commit karo.
3. Cursor me repo kholo → **Section 5 ka Master Bootstrap Prompt** paste karo.
4. Cursor rules, docs, CI, scripts bana dega. Aap review karke commit karo.
5. Naya app banana ho: **Use this template** → clone → Cursor me open → **Section 6** ke prompts P0 se P9 tak, ek ek karke.

---

## 2. The 50-question debate

Format: **Q** (sawaal) → **A** (root cause) → **Fix** (kya karna hai).

### Part A: Psychological (insaan wali galtiyan), Q1–Q25

**Q1. AI confident bolta hai to hum bina check kiye kyun maan lete hain?**
A: _Automation bias_ + _fluency heuristic_: smooth likha text sach jaisa lagta hai.
Fix: "Trust nothing, run everything." Har claim ke saath command output ya test result maango.

**Q2. "Uber jaisa app bana do" jaise vague prompt kyun fail hote hain?**
A: Ambiguity me AI gaps ko guess se bharta hai. Yahi _specification-level hallucination_ hai.
Fix: PRD + acceptance criteria (Given/When/Then) likho, phir code maango.

**Q3. Hum ek hi prompt me poora app kyun maangte hain?**
A: _Planning fallacy_ + "magic wand" soch.
Fix: Vertical slices. Ek prompt = ek chhota feature, max ~5 files.

**Q4. Hum AI ka code padhte kyun nahi?**
A: _Cognitive offloading_: "chal raha hai, bas."
Fix: Review checklist (Section 7-V) + AI se "explain the diff" + CI gates.

**Q5. Demo chal gaya to production-ready kyun lagta hai?**
A: _Happy-path bias_ / survivorship bias.
Fix: Definition of Done me error, empty, loading, offline, auth-expired states aur tests shaamil karo.

**Q6. Same bug ke fix ka loop kyun chalta rehta hai?**
A: _Sunk-cost fallacy_ + AI ke paas root-cause evidence nahi hota.
Fix: 2 failed attempts ke baad `git reset`, naya chat, logs + repro + root-cause hypothesis ke saath.

**Q7. Hum khud bhool jaate hain, phir AI se yaad rakhne ki umeed kyun?**
A: _Anthropomorphism / ELIZA effect_: AI ko insaan jaisa samajhna.
Fix: Yaad rakhne wali har cheez `AGENTS.md` aur `docs/` me likho.

**Q8. "Maine pehle bataya tha" lekin AI ko yaad nahi, kyun?**
A: Naya chat = naya session. Pichli baatein model ke paas hain hi nahi.
Fix: Docs hi memory hain. Har session `@AGENTS.md @docs/PROGRESS.md` se shuru karo.

**Q9. Requirements baar baar badalne se AI confuse kyun hota hai?**
A: Scope creep: purani aur nayi instructions context me conflict karti hain.
Fix: Change request → pehle PRD update → phir task → phir code.

**Q10. AI har baat pe "haan" kyun bolta hai?**
A: _Sycophancy_: training me user ko khush rakhna reward hota hai.
Fix: Prompt: "Challenge my plan. List 5 ways it fails. Disagree if I'm wrong."

**Q11. Pehla solution mil gaya to usi pe atak kyun jaate hain?**
A: _Anchoring bias_.
Fix: Hamesha 2–3 options + trade-offs maango, phir decision ko ADR me likho.

**Q12. Hum sirf wahi output dekhte hain jo humari soch ko sahi thehraye?**
A: _Confirmation bias_.
Fix: Adversarial prompt: "Try to break this feature. List edge cases and write failing tests."

**Q13. Beginner ko galtiyan dikhti hi nahi, kyun?**
A: _Dunning-Kruger_: pata hi nahi kya nahi pata.
Fix: Objective reviewers lagao: linter, typecheck, tests, CodeQL, aur ek second AI reviewer.

**Q14. Cursor, Lovable, Bolt, v0 sab mix karne se kya hota hai?**
A: Context fragmentation: har tool ke paas alag adhoora version hota hai.
Fix: **GitHub repo = single source of truth.** Platforms sirf uske consumer hain.

**Q15. Security "baad me dekhenge", yeh galat kyun?**
A: _Optimism bias_. AI default me insecure patterns (open DB, secrets in client) likh deta hai.
Fix: `060-security.mdc` always-on, RLS by default, gitleaks + CodeQL CI me.

**Q16. Jaldi ke chakkar me review skip karna kitna risky hai?**
A: _Hurry bias_: bugs baad me 10x mehenge padte hain.
Fix: Gates non-negotiable: `pnpm verify` fail = merge nahi.

**Q17. 3 din ek hi chat chalana kyun nuksaan karta hai?**
A: Chat lamba hone se context dilute, summarize ya truncate hota hai.
Fix: **1 task = 1 chat.** Task khatam → PROGRESS.md update → chat band.

**Q18. "AI sab jaanta hai" (AGI myth) kyun galat hai?**
A: Use aapka private repo, aapka DB schema, aur kal ki library updates nahi pata.
Fix: Grounding do: apne docs, types, library docs, aur actual files.

**Q19. Error copy karke "fix it" likhna kyun kaam nahi karta?**
A: Symptom patch hota hai, root cause nahi.
Fix: Expected vs actual, repro steps, logs, relevant files do, aur pehle "root cause batao, code mat likho".

**Q20. Naming aur conventions define na karne se kya hota hai?**
A: Har generation me alag style, isliye codebase inconsistent ho jata hai.
Fix: Conventions rules me likho aur ESLint/Prettier se enforce karo.

**Q21. Humne AI ko "kya NAHI karna" kyun nahi bataya?**
A: Default AI helpful banne ke liye extra refactor aur dependencies add karta hai.
Fix: Explicit DO-NOT list: no new deps, no refactor, no renames, no test edits.

**Q22. "Done" ka matlab humare aur AI ke liye alag kyun hai?**
A: Success criteria nahi diye.
Fix: Har task me acceptance criteria + verify commands.

**Q23. "You are the world's best engineer" role-prompt kaam karta hai?**
A: Role se style badalta hai, knowledge nahi badhta.
Fix: Role ki jagah grounding, tests aur constraints do.

**Q24. Commit na karne se kya risk hai?**
A: Ek bad agent edit se sab bigad sakta hai, aur wapas jaane ka raasta nahi.
Fix: Branch per task, commit after every green step.

**Q25. Non-technical person verify kaise kare?**
A: Code padhna zaroori nahi, behavior verify karna zaroori hai.
Fix: E2E tests, preview deploy, click-through checklist, Sentry alerts, aur ek second AI "code reviewer".

### Part B: Logical / Technical (model aur tooling), Q26–Q50

**Q26. Hallucination actually hai kya?**
A: LLM next-token predictor hai. Uske paas built-in truth database ya "I don't know" button nahi.
Fix: Grounding (real files, docs, types) + permission: "Agar pata nahi to bolo, guess mat karo."

**Q27. Context window kya hai aur AI bhoolta kyun hai?**
A: Model ek baar me limited tokens dekh sakta hai. Zyada ho to purana hissa kat jata ya summarize hota hai.
Fix: Chhote tasks, naye chats, important cheezein files me.

**Q28. "Lost in the middle" kya hai?**
A: Bahut lambe context me beech wali jankari kamzor padti hai.
Fix: Critical rules context ke start (AGENTS.md) me, aur context chhota rakho.

**Q29. Window ke andar bhi quality kyun girti hai?**
A: _Context rot_: tokens badhne se attention bikhar jata hai, noise badhta hai.
Fix: Curate karo, dump mat karo. Sirf relevant files `@mention` karo.

**Q30. Auto-summarize/compaction se kya khota hai?**
A: Specific details (exact names, edge cases, "yeh mat karna") summary me ghis jaate hain.
Fix: Compaction se pehle decisions `PROGRESS.md` aur ADR me likh do.

**Q31. Har chat blank kyun hota hai?**
A: LLM stateless hai. Persistent memory sirf tool ki feature ya aapki files se aati hai.
Fix: `AGENTS.md` + `docs/PROGRESS.md` + `docs/ARCHITECTURE.md` har session ki entry fee hai.

**Q32. Rules likhe, phir bhi AI follow nahi karta. Kyun?**
A: Common reasons: file `.cursor/rules/` me `.md` hai (sirf `.mdc` recognized), frontmatter galat, `globs` match nahi, ya rule bahut lamba hai.
Fix: `.mdc` + `description/globs/alwaysApply`, rules 500 lines se kam, aur Cursor Settings → Rules me verify karo.

**Q33. AI purani/deprecated API kyun likhta hai?**
A: Training cutoff. Library naye version me change ho chuki hoti hai.
Fix: Versions pin karo, official docs `@Docs`/docs-MCP se do, typecheck chalao.

**Q34. Non-existent npm/pip package kyun suggest karta hai?**
A: Naam plausible lagta hai to generate ho jata hai. Attackers aise naam register kar sakte hain (_slopsquatting_).
Fix: "No new dependency without approval", `npm view <pkg>` se verify, lockfile + Dependabot.

**Q35. Function signature ya field names kyun invent karta hai?**
A: Jo cheez context me nahi, woh pattern se guess hoti hai.
Fix: DB types generate karo (`supabase gen types`), shared Zod schemas, aur "source file padho phir use karo".

**Q36. AI poora codebase kyun nahi "dekhta"?**
A: Agent retrieval/indexing se kuch snippets padhta hai. Isliye wo duplicate functions bana deta hai.
Fix: `ARCHITECTURE.md` me map, "search before create" rule, aur exact files `@mention`.

**Q37. Index stale ya files ignored hon to?**
A: `.gitignore`/`.cursorignore` wali files nahi dikhti, naye changes ka index lag sakta hai.
Fix: Re-index, important file explicitly attach, aur `.cursorignore` sirf secrets/build output ke liye.

**Q38. Rules aur chat instructions conflict karein to?**
A: Cursor me precedence: Team Rules > Project Rules > User Rules. Chat instruction alag layer hai aur contradiction se output random hota hai.
Fix: Ek source of truth, short rules, koi contradiction nahi.

**Q39. Bahut saare rules daalne se kya hota hai?**
A: Instruction overload: AI kuch rules ignore kar deta hai.
Fix: Always-on rules sirf 10–12 aur combined ~2000 tokens ke andar, baaki `globs` se scoped.

**Q40. Agent unrequested refactor kyun karta hai?**
A: Helpful dikhne ki tendency + broad prompt.
Fix: Scope fence: "Touch only: [files]. Forbidden: [files]." + diff review.

**Q41. "Done" bolta hai par run nahi kiya. Kyun?**
A: Text generate karna aasan hai, verify karna tool-call maangta hai.
Fix: Rule: "Done = `pnpm verify` ka actual output paste karo."

**Q42. Mock data, TODO aur fake function kyun chhod deta hai?**
A: Chhota rasta, aur demo jaisa dikhne wala code reward-sa lagta hai.
Fix: "No stubs/mocks in production paths" + e2e tests real local DB pe.

**Q43. Same prompt, alag output kyun?**
A: Sampling randomness.
Fix: Output ko prompt se nahi, **tests** se lock karo. Tests hi deterministic spec hain.

**Q44. IDs, env var names, long strings galat kyun copy hoti hain?**
A: Tokenization aur approximate reproduction.
Fix: Constants, Zod env schema (`env.ts`), codegen. Strings ko hand-type mat karao.

**Q45. Architecture drift kyun hota hai?**
A: Har prompt alag pattern laata hai, aur 20 prompts me spaghetti ban jata hai.
Fix: Layered architecture + ADR + ESLint import boundaries.

**Q46. AI tests ko change karke pass kyun kar deta hai?**
A: Goal "green" dikhna ban jata hai, "correct" nahi.
Fix: Rule: "Never edit tests to pass unless spec changed." Tests pehle commit, test diffs pe human review.

**Q47. Security hallucinations (RLS missing, secrets client me)?**
A: Training data me insecure examples bahut hain.
Fix: Security rules always-on, RLS default, gitleaks, CodeQL, `SECURITY.md` checklist.

**Q48. Parallel agents ek hi file todein to?**
A: Concurrent edits, last-write-wins conflicts.
Fix: Git worktree/branch per task, ek file area ka ek owner, PR se merge.

**Q49. Mobile (Android) me hallucination zyada kyun lagti hai?**
A: Native modules, SDK version mismatch, permissions, aur build errors AI ko nahi dikhte.
Fix: Expo managed workflow, `npx expo install <pkg>` (compatible versions), EAS build CI me, Maestro e2e, emulator logs paste karo.

**Q50. Kya ek system se hallucination bilkul khatam ho jayega?**
A: Nahi. Yeh probabilistic system hai.
Fix: **Defense in depth:** Spec → Rules → Small tasks → Gates → Review → Monitoring → Rollback. Har layer baaki layers ki galtiyan pakadti hai.

---

## 3. The fix: 7-layer anti-hallucination system

| Layer           | Kya                              | Konsi files / tools                      | Q#                 |
| --------------- | -------------------------------- | ---------------------------------------- | ------------------ |
| L1 Spec         | Kya banana hai, testable form me | `docs/PRD.md`, acceptance criteria       | 2, 9, 22           |
| L2 Memory       | Context files me, chat me nahi   | `AGENTS.md`, `docs/PROGRESS.md`, ADRs    | 7, 8, 30, 31       |
| L3 Rules        | Behaviour ke guardrails          | `.cursor/rules/*.mdc`                    | 20, 21, 32, 38, 39 |
| L4 Grounding    | Real source dena                 | Docs, generated types, Zod, MCP          | 26, 33, 35, 36     |
| L5 Task slicing | Chhote, bounded kaam             | `docs/TASKS.md`, 1 task = 1 chat         | 3, 17, 29, 40      |
| L6 Gates        | Machine verification             | `pnpm verify`, CI, e2e, CodeQL, gitleaks | 4, 5, 41, 46, 47   |
| L7 Review & Ops | Insaan + monitoring              | PR template, Sentry, preview deploys     | 13, 25, 50         |

### Daily loop (har feature ke liye)

```
1. TASKS.md se next task chuno
2. NAYA chat. Attach: @AGENTS.md @docs/PROGRESS.md @docs/ARCHITECTURE.md @docs/tasks/T-xxx.md
3. Pehle PLAN (no code). Plan approve karo
4. Tests pehle (failing), commit
5. Implement (scope fence ke andar)
6. pnpm verify  → actual output dekho
7. AI self-review (Section 7-V) + aapka click-through
8. Commit → PR → CI green
9. PROGRESS.md + ADR update ("Gotchas learned" me AI ki galtiyan likho)
10. Chat band
```

### Golden 12 rules

1. Repo hi memory hai, chat nahi.
2. Pehle PRD, phir architecture, phir tasks, phir code.
3. 1 task = 1 chat = 1 branch.
4. Plan approve karo, tab code.
5. Tests pehle likho.
6. Koi naya dependency bina approval nahi.
7. "Done" = `pnpm verify` ka real output.
8. 2 fail → reset + naya chat + evidence.
9. Scope fence: sirf listed files.
10. Secrets kabhi prompt, chat ya repo me nahi.
11. Har AI galti `Gotchas learned` me jaaye.
12. Production se pehle security + e2e + rollback plan.

---

## 4. GitHub repo design: `vibe-blueprint`

### 4.1 Tree

```
vibe-blueprint/
├── AGENTS.md                     # AI ko har session me padhna hai
├── README.md
├── LICENSE                       # MIT
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CHANGELOG.md
├── .cursorignore
├── .editorconfig  .gitignore  .nvmrc  .prettierrc
├── package.json  pnpm-workspace.yaml  turbo.json  tsconfig.base.json
├── .cursor/
│   ├── rules/
│   │   ├── 000-core.mdc          # alwaysApply
│   │   ├── 010-security.mdc      # alwaysApply
│   │   ├── 020-web-nextjs.mdc    # globs: apps/web/**
│   │   ├── 030-mobile-expo.mdc   # globs: apps/mobile/**
│   │   ├── 040-database.mdc      # globs: supabase/**, packages/db/**
│   │   └── 050-testing.mdc       # globs: **/*.test.*, e2e/**
│   └── mcp.json.example
├── docs/
│   ├── BLUEPRINT.md              # yeh file
│   ├── PRD.md                    # Section 11 template
│   ├── ARCHITECTURE.md           # Section 10
│   ├── TECH_STACK.md             # Section 9
│   ├── DATA_MODEL.md
│   ├── API_CONTRACT.md
│   ├── DESIGN_SYSTEM.md
│   ├── SECURITY.md
│   ├── TESTING.md
│   ├── PROGRESS.md               # living memory
│   ├── TASKS.md
│   ├── decisions/ADR-0000-template.md
│   └── tasks/T-000-template.md
├── prompts/                      # Section 6 + 7 ke prompts, ek ek file
│   ├── P0-discovery.md ... P9-release.md
│   └── T-task.md  D-debug.md  R-recovery.md  V-review.md  H-audit.md  M-memory.md
├── packages/shared/              # walking skeleton: 1 function + 1 test (verify day-0 green)
├── apps/                         # P4 me scaffold hoga (web, mobile)
├── supabase/migrations/
├── scripts/verify.sh
└── .github/
    ├── workflows/ci.yml
    ├── PULL_REQUEST_TEMPLATE.md
    ├── ISSUE_TEMPLATE/{bug.md,feature.md}
    └── dependabot.yml
```

### 4.2 `AGENTS.md` (exact content)

```md
# AGENTS.md — Read this first, every session

## Project

<APP_NAME>: <one-line description>.
Sources of truth: docs/PRD.md (what), docs/ARCHITECTURE.md (how),
docs/TASKS.md (what next), docs/PROGRESS.md (current state + gotchas).

## Session start protocol (mandatory)

1. Read docs/PROGRESS.md and the current task file docs/tasks/T-xxx.md.
2. Restate: the task, acceptance criteria, and the exact files you will touch.
3. If the change touches more than 5 files, STOP and wait for my approval.
4. Search the codebase before creating anything (existing util / component / type?).

## Hard rules

- NEVER invent APIs, packages, env vars, table/column names or file paths.
  Verify by reading the file, the official docs, or `npm view <pkg>`.
  If unsure, say "I don't know — I need X" instead of guessing.
- No new dependency without my approval (state name, why, size, alternatives).
- Scope fence: touch only the files listed in the task. No drive-by refactors,
  renames or formatting changes.
- No placeholders, TODOs, mock data or stubbed functions in production paths.
- Never edit tests to make them pass unless the spec changed (say so explicitly).
- Never read, print or commit secrets or .env* files.
- TypeScript strict. No `any`. No `@ts-ignore` without a comment explaining why.
- Respect layers: UI -> hook -> api client -> route handler -> service
  -> repository -> DB. Never skip a layer.

## Definition of Done (all required)

- `pnpm verify` passes (format, lint, typecheck, test, build). Paste real output.
- New behavior has tests (unit; e2e for user flows).
- Loading, empty, error and offline states handled.
- docs/PROGRESS.md updated; ADR added if a decision was made.

## When stuck

After 2 failed attempts: stop. Summarize what you tried, the evidence (logs),
and 2 hypotheses. Do not attempt a third blind fix.

## Response format for every task

Plan -> Changes (file list) -> Verification output -> Risks/Assumptions -> Next step.
```

### 4.3 `.cursor/rules/*.mdc`

> **Dhyan:** Rules sirf `.mdc` extension me kaam karte hain. Plain `.md` rules folder me ignore ho jati hai. Har rule 500 lines se chhota rakho. Always-on (`alwaysApply: true`) rules ka combined size ~2000 tokens ke andar rakho — yeh har session ka context budget khate hain.

**`000-core.mdc`**

```md
---
description: Core engineering rules for every task
globs:
alwaysApply: true
---

- Follow AGENTS.md. If a rule here conflicts with it, AGENTS.md wins.
- Plan first, then code. Wait for approval on plans touching >5 files.
- One task per chat. Stay inside the task's allowed-files list.
- Verify before claiming done: run `pnpm verify`, paste the output.
- Prefer existing utilities/components. Search before creating.
- Small, reviewable diffs. Conventional Commits (feat:, fix:, chore:, docs:, test:).
- Say "I don't know" instead of guessing. Cite the file or doc you relied on.
```

**`010-security.mdc`**

```md
---
description: Security baseline, always on
globs:
alwaysApply: true
---

- Never hardcode secrets. Read config via the typed env module only.
- Validate ALL external input with Zod at the boundary (API, forms, webhooks).
- Database: Row Level Security ON for every table; write policies with tests.
- Never trust client-supplied user IDs; derive from the verified session.
- Parameterized queries only. No string-built SQL.
- Never log tokens, passwords, PII.
- Add rate limiting to auth and any expensive endpoint.
- Escape/encode user content; no dangerouslySetInnerHTML without sanitization.
```

**`020-web-nextjs.mdc`**

```md
---
description: Next.js web app conventions
globs: apps/web/**
alwaysApply: false
---

- Next.js App Router, TypeScript strict, Tailwind + shadcn/ui components.
- Server Components by default; add "use client" only when needed.
- Data access only via the service/repository layers, never directly in components.
- Forms: React Hook Form + Zod schema from packages/shared.
- Every route has loading, empty and error UI. Accessibility: semantic HTML, labels, focus states.
- Verify Next.js APIs against the official docs for the INSTALLED version before use.
```

**`030-mobile-expo.mdc`**

```md
---
description: Expo / React Native conventions
globs: apps/mobile/**
alwaysApply: false
---

- Expo managed workflow + Expo Router. No ejecting without an ADR.
- Install packages with `npx expo install <pkg>` so versions match the Expo SDK.
- No native-module code unless the Expo SDK provides it; ask first.
- Handle permissions, offline state, keyboard avoidance, safe areas.
- Reuse validation + types from packages/shared. API calls via the shared api client.
- Test critical flows with Maestro; paste emulator logs when debugging.
```

**`040-database.mdc`**

```md
---
description: Database and migrations
globs: supabase/**, packages/db/**
alwaysApply: false
---

- Schema changes ONLY via new migration files in supabase/migrations. Never edit old ones.
- After each migration: regenerate TS types, update docs/DATA_MODEL.md.
- Every table: primary key, created_at, updated_at, RLS enabled + policies + RLS tests.
- Add indexes for every foreign key and every frequent filter.
- Do not invent column names; read DATA_MODEL.md and the generated types.
```

**`050-testing.mdc`**

```md
---
description: Testing conventions
globs: **/*.test.ts, **/*.test.tsx, e2e/**
alwaysApply: false
---

- Test behavior, not implementation. Arrange-Act-Assert. Descriptive names.
- Never modify an existing test to make it pass unless the spec changed; explain why.
- Unit: Vitest. Web e2e: Playwright. Mobile e2e: Maestro.
- No real network calls in unit tests; e2e uses a local/test database.
- A bug fix must start with a failing regression test.
```

### 4.4 `.cursorignore`

```
.env
.env.*
node_modules/
.next/
.expo/
dist/
build/
coverage/
pnpm-lock.yaml
*.pem
*.key
```

### 4.5 `docs/PROGRESS.md` (living memory)

```md
# PROGRESS — update after EVERY task

## Current state

- Phase: P_ | Branch: ____ | Last green commit: ____

## Done

- [x] T-000 Repo bootstrapped

## In progress

- [ ]

## Decisions (link ADRs)

- ADR-0001:

## Known issues / tech debt

-

## Working commands (verified)

- Install: pnpm install
- Verify: pnpm verify
- Dev web: pnpm --filter web dev

## Gotchas learned (AI mistakes — never repeat)

- <date> AI invented `<thing>`; the correct one is `<thing>`.
```

### 4.6 `docs/tasks/T-000-template.md`

```md
# T-### <Title>

Status: todo | doing | done PRD refs: FR-001, US-002

## Goal (1–2 lines)

## Acceptance criteria

- Given ... When ... Then ...

## Files allowed to touch

-

## Files forbidden

-

## References (docs links, existing files to imitate)

-

## Tests to write first

-

## Verify

- pnpm verify
- <manual click-through steps>
```

### 4.7 `docs/decisions/ADR-0000-template.md`

```md
# ADR-#### <Decision title>

Date: YYYY-MM-DD Status: proposed | accepted | superseded

## Context

## Options considered (with trade-offs)

## Decision

## Consequences
```

### 4.8 `scripts/verify.sh` and root `package.json` scripts

```bash
#!/usr/bin/env bash
set -euo pipefail
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
echo "VERIFY OK"
```

```json
{
  "name": "vibe-blueprint",
  "private": true,
  "packageManager": "pnpm@<pin-exact-version-at-bootstrap>",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "format:check": "prettier --check .",
    "format": "prettier --write .",
    "verify": "bash scripts/verify.sh"
  }
}
```

### 4.9 `.github/workflows/ci.yml`

```yaml
# Action pins last verified 2026-10-04. ALWAYS re-verify majors at bootstrap:
# old action runtimes get retired (e.g. github/codeql-action v3 was removed Dec 2026,
# actions/* v4 still ran on the retired Node 20 runtime).
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7 # pins last verified 2026-10-04; re-verify majors at bootstrap
      - uses: pnpm/action-setup@v6 # reads packageManager from package.json
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm verify

  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v3
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  codeql:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v7
      - uses: github/codeql-action/init@v4
        with:
          languages: javascript-typescript
      - uses: github/codeql-action/analyze@v4
```

### 4.10 `.github/PULL_REQUEST_TEMPLATE.md`

```md
## What & why

Task: T-### PRD refs:

## Checklist

- [ ] `pnpm verify` passes (paste output summary)
- [ ] Tests added/updated (no test edited just to pass)
- [ ] Loading / empty / error states covered
- [ ] No new dependency (or approved + justified)
- [ ] No secrets, no TODO/mock in prod paths
- [ ] docs/PROGRESS.md updated; ADR added if needed
- [ ] Manually clicked through the acceptance criteria

## Risks / assumptions
```

---

## 5. Master Bootstrap Prompt (Cursor builds the repo itself)

**Setup:** Empty repo me `docs/BLUEPRINT.md` (yeh file) rakho. Cursor Agent mode me naya chat kholo. Yeh prompt paste karo.

```text
ROLE
You are a senior staff engineer and technical writer building an open-source GitHub
template repository named "vibe-blueprint". Its purpose: make AI-assisted ("vibe")
coding reliable by keeping context in files, enforcing strict rules, slicing work
into small tasks, and verifying everything with automated gates.

SOURCE OF TRUTH
Read @docs/BLUEPRINT.md completely before doing anything. It contains the exact
content for AGENTS.md, all .cursor/rules/*.mdc files, .cursorignore, PROGRESS.md,
task and ADR templates, scripts/verify.sh, package.json scripts, CI workflow, PR
template, the prompts (Sections 6 and 7), the stack (Section 9), the architecture
(Section 10) and the PRD template (Section 11).
Do NOT invent anything that is not in it. If something is missing or ambiguous,
STOP and ask me. Do not guess.

HARD CONSTRAINTS
- Copy file contents exactly from BLUEPRINT.md where given. Do not paraphrase them.
- Rules files must use the .mdc extension with frontmatter (description, globs, alwaysApply).
- No dependencies other than: turbo, prettier, typescript, vitest, eslint (+ the
  minimum ESLint TypeScript config packages). Ask before adding anything else.
- Pin exact versions in package.json; verify each package exists with `npm view <pkg> version`.
- No placeholder code. Every script must run. Repo must be GREEN from commit 1.
- Do NOT scaffold apps/web or apps/mobile now (that happens per-project in prompt P4).

PROCESS: work in phases. After each phase, run the verification, show the REAL
output, and wait for me to reply "continue". Never batch phases.

PHASE A — Root config
Create: package.json (scripts as in Section 4.8), pnpm-workspace.yaml (apps/*,
packages/*), turbo.json (tasks: build, lint, typecheck, test, dev), tsconfig.base.json
(strict: true, noUncheckedIndexedAccess: true), .prettierrc, .editorconfig, .gitignore,
.nvmrc (exact Node version, e.g. 24.20.0 — never "lts/*"; record the pin date. Node 24 was active LTS until 2026-10-20, Node 26 became LTS 2026-10-28; re-verify quarterly), eslint config, .cursorignore.
Verify: `pnpm install` succeeds.

PHASE B — Walking skeleton
Create packages/shared with: package.json, tsconfig, src/index.ts exporting one pure
function (e.g. `slugify`), a Vitest test for it, and lint/typecheck/test/build scripts.
Verify: `pnpm verify` passes. Paste the output.

PHASE C — AI guardrails
Create AGENTS.md and the six .cursor/rules/*.mdc files exactly as in Section 4.
Create .cursor/mcp.json.example (placeholder only, no real keys).
Verify: list the files; confirm each rule has valid frontmatter.

PHASE D — Docs
Create docs/: PRD.md (Section 11), ARCHITECTURE.md (Section 10), TECH_STACK.md
(Section 9), DATA_MODEL.md, API_CONTRACT.md, DESIGN_SYSTEM.md, SECURITY.md, TESTING.md,
PROGRESS.md, TASKS.md, decisions/ADR-0000-template.md, tasks/T-000-template.md.
For DATA_MODEL, API_CONTRACT, DESIGN_SYSTEM, SECURITY, TESTING: write structured
templates with headings and fill-in sections derived from Sections 9–10. No lorem ipsum.

PHASE E — Prompts library
Create prompts/P0-discovery.md ... P9-release.md and T-task.md, D-debug.md,
R-recovery.md, V-review.md, H-audit.md, M-memory.md. Content must be exactly the
prompts in Sections 6 and 7.

PHASE F — GitHub automation
Create .github/workflows/ci.yml, PULL_REQUEST_TEMPLATE.md, ISSUE_TEMPLATE/bug.md,
ISSUE_TEMPLATE/feature.md, dependabot.yml (npm + github-actions, weekly).
Check the latest major version of every GitHub Action before pinning.

PHASE G — Community files
Create README.md (what/why, 5-minute quick start, workflow diagram in Mermaid,
folder map, FAQ), LICENSE (MIT), CONTRIBUTING.md, CODE_OF_CONDUCT.md, CHANGELOG.md.

FINAL CHECK
Run `pnpm verify`. Then give me: file tree, any assumptions you made, anything you
could not verify, and suggested first commit message. Then stop.

If at any point a command fails twice, stop and report the evidence. Do not
attempt a third blind fix.
```

---

## 6. Phase prompts P0–P9 (build your app A→Z)

> Har prompt naye chat me, Agent mode me. Pehle `@AGENTS.md @docs/PROGRESS.md` attach karo. Ek phase khatam → review → commit → agla.

### P0 — Discovery (no code)

```text
Do NOT write code. Interview me to define the product.
Ask at most 15 questions in ONE batch, grouped: problem & users, platforms (web /
Android / iOS), core user journeys, monetization, auth & roles, data & integrations,
compliance/privacy, scale & budget, launch deadline.
After my answers, write docs/discovery.md with: summary, assumptions (clearly
marked), risks, and open questions. Challenge weak ideas; tell me where I'm wrong.
Do not decide technology yet.
```

### P1 — PRD

```text
Inputs: @docs/discovery.md @docs/PRD.md (template).
Fill docs/PRD.md completely. Rules:
- Every functional requirement gets an ID (FR-001...) and testable acceptance
  criteria in Given/When/Then form. Every user story gets an ID (US-001...).
- Separate "Assumptions" and "Open questions"; never silently decide.
- Include explicit Non-goals and Out-of-scope.
- No technology choices in the PRD.
Finish by listing the 10 riskiest requirements and why. Wait for my approval.
```

### P2 — Architecture

```text
Inputs: @docs/PRD.md @docs/TECH_STACK.md @docs/ARCHITECTURE.md.
Produce: ARCHITECTURE.md (adapted to this product), DATA_MODEL.md (tables, columns,
types, relations, RLS policy per table), API_CONTRACT.md (every endpoint:
method, path, auth, request/response Zod-style schema, error codes),
DESIGN_SYSTEM.md (tokens, components, states), SECURITY.md (threat model).
Rules: use the stack in TECH_STACK.md. Any deviation needs an ADR with options and
trade-offs. Every PRD requirement must map to at least one table/endpoint/screen:
output a traceability table (FR-ID -> screen -> endpoint -> table). No code.
```

### P3 — Task breakdown

```text
Inputs: @docs/PRD.md @docs/ARCHITECTURE.md @docs/API_CONTRACT.md @docs/tasks/T-000-template.md.
Split the PRD into vertical-slice tasks (UI + API + DB + tests per slice). Each task
<= 1 day, <= 5 files where possible, with dependencies. Create docs/TASKS.md
(ordered list with status) and one docs/tasks/T-###.md per task using the template,
including allowed files, forbidden files, tests to write first and verify steps.
Order: foundation -> auth -> core feature 1 ... -> polish. Flag any task that is too big.
```

### P4 — Scaffold

```text
Inputs: @docs/TECH_STACK.md @docs/ARCHITECTURE.md @.cursor/rules.
Scaffold apps/web (Next.js) and apps/mobile (Expo) and packages/{ui,db,config}
using the OFFICIAL generators (create-next-app, create-expo-app). Do not hand-type
boilerplate. Wire the pnpm workspace, TS paths, shared Zod package, typed env
module (Zod) for each app, ESLint layer-boundary rule, Husky + lint-staged +
commitlint. Use `npx expo install` for Expo packages.
Verify against the official docs for the INSTALLED versions; cite the doc page.
Run `pnpm verify` and show the real output. Update docs/PROGRESS.md.
```

### P5 — Database + Auth

```text
Inputs: @docs/DATA_MODEL.md @docs/SECURITY.md @.cursor/rules/040-database.mdc.
Create Supabase migrations for the tables in DATA_MODEL.md with RLS policies,
indexes and updated_at triggers. Generate TS types. Implement auth (sign up, sign in,
sign out, session refresh, protected routes) on web and mobile, using the typed
env module. Write RLS tests proving: a user cannot read or write another user's
rows; anonymous is denied. Show the test output. No mock auth.
```

### P6 — Feature loop (repeat for every task)

Use **Section 7-T** (task prompt). Ek task = ek chat = ek branch = ek PR.

### P7 — Hardening

```text
Audit the whole repo against @docs/SECURITY.md and @docs/PRD.md.
Check: RLS coverage on every table, input validation on every endpoint, authz
on every route, rate limiting, secret handling, dependency audit, CORS, headers,
accessibility (labels, contrast, focus, screen reader), loading/empty/error states
on every screen, offline behavior on mobile, performance (bundle size, N+1 queries,
indexes). Output a table: finding | severity | file | fix. Fix Critical/High items
as separate small commits, each with a test. Do not refactor unrelated code.
```

### P8 — Deploy

```text
Set up deployment per @docs/ARCHITECTURE.md section "Deployment":
Vercel for web (preview per PR), Supabase production project with migrations
applied via CI, EAS Build/Update for Android, environment variable matrix
(local / preview / production) documented in docs/ENVIRONMENTS.md, Sentry and
PostHog wired with PII scrubbing, a /api/health endpoint, and database backups.
Do NOT put real secrets in the repo or in chat; produce a checklist of secrets I
must add manually in each dashboard. Verify with a preview deployment checklist.
```

### P9 — Release

```text
Create: release checklist (docs/RELEASE.md), rollback plan, incident runbook,
README for end users, CHANGELOG entry, privacy policy + terms outline (flag that
a lawyer must review), Play Store listing checklist (assets, data-safety form,
screenshots, test track), and a post-launch monitoring plan (alerts, KPIs from PRD).
Run the full e2e suite and a final `pnpm verify`. List anything unverified.
```

---

## 7. Reusable prompts

### T — Task prompt (P6 ka core)

```text
Attach: @AGENTS.md @docs/PROGRESS.md @docs/ARCHITECTURE.md @docs/tasks/T-xxx.md

Task: implement T-xxx exactly as written in its task file.
Step 1 (no code): restate the goal, acceptance criteria, files you will touch, and
any ambiguity. List assumptions. Wait for my "go".
Step 2: write failing tests first. Show them failing.
Step 3: implement, touching only allowed files. No new dependencies, no refactors.
Step 4: run `pnpm verify` and paste the real output.
Step 5: self-review against the checklist in AGENTS.md; list risks.
Step 6: update docs/PROGRESS.md (including any "Gotchas learned").
If anything is unknown, say "I don't know" and ask. Never guess APIs or names.
```

### D — Debug prompt

```text
Attach: @AGENTS.md + the failing file(s) + paste logs.
Problem: <expected> vs <actual>. Repro steps: <steps>. Started after: <commit/change>.
Do NOT write code yet. Give me: (1) the 3 most likely root causes ranked, with the
evidence for each from the logs/code, (2) one cheap experiment to confirm each,
(3) what you need from me. After I confirm the cause, propose the minimal fix
plus a regression test.
```

### R — Context recovery (naya chat ya AI bhatak gaya)

```text
Read @AGENTS.md @docs/PROGRESS.md @docs/ARCHITECTURE.md and the current task file.
Then, without writing code, tell me in <=10 lines: where the project stands, what
the current task is, what is already done, what is forbidden, and what you think
the next step is. List anything that contradicts between these docs. Wait for my confirmation.
```

### V — Review prompt (second-AI reviewer, fresh chat)

```text
Act as a skeptical senior reviewer. Attach the diff (@Git or paste) and
@docs/tasks/T-xxx.md @AGENTS.md.
Check: does it meet every acceptance criterion? scope creep? invented APIs/names?
missing error/empty/loading states? security (authz, validation, secrets)? tests
meaningful (or edited to pass)? performance? Output: Must-fix / Should-fix / Nits,
each with file and line. Do not modify code.
```

### H — Hallucination audit

```text
Audit the last changes for hallucinations. For every external import, package,
function call, env var, table/column and file path introduced: show where it is
defined (file path / official doc URL / `npm view` output). Mark anything you cannot
prove as UNVERIFIED. Then fix or remove all UNVERIFIED items.
```

### M — Memory update (har task ke baad)

```text
Update docs/PROGRESS.md: mark the finished task, update current state, record
decisions (create an ADR if a real choice was made), list new tech debt, add any
verified commands, and add every mistake you made this session to "Gotchas learned"
with the correct fact. Keep it concise. Show the diff.
```

---

## 8. How to use this repo on your vibe-coding platform

### 8.1 Cursor (primary workflow)

1. **Template se naya project:** GitHub → _Use this template_ → naya repo → clone → Cursor me open.
2. **Rules check:** Cursor Settings → Rules me `000-core`, `010-security` always-on dikhne chahiye.
3. **`AGENTS.md`** project root me hona chahiye. Cursor ise automatically padhta hai, aur `CLAUDE.md` bhi isi tarah padhta hai.
4. **P0 → P5** chalao (discovery, PRD, architecture, tasks, scaffold, DB+auth). Har ek ke baad commit.
5. **Feature loop:** `docs/TASKS.md` → next task → naya chat → **Section 7-T** prompt.
6. **Context tools:** `@Files`, `@Folders`, `@Docs`, `@Git` use karo. (Cursor UI jaldi badalta hai, naam thoda alag ho sakta hai.) Docs-MCP ya library docs add karo taki AI latest API dekhe.
7. **Hamesha branch per task:** `feat/T-012-short-name`. PR → CI green → squash merge.
8. **Mobile test:** Android emulator pe `npx expo start`. Crash ho to log paste karo (Prompt D).

### 8.2 Doosre platforms (Lovable, Bolt, Replit, v0, Windsurf, Claude Code)

| Is repo ka hissa                 | Platform me kahan jaata hai                                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`                      | Custom instructions / Project knowledge / `CLAUDE.md` (Claude Code)                                                                     |
| `docs/PRD.md`, `ARCHITECTURE.md` | Knowledge files ya repo me hi rakho aur prompt me reference do                                                                          |
| `prompts/*.md`                   | Paste karke chalao                                                                                                                      |
| GitHub repo                      | Platform ka GitHub import/sync (jahan available ho). **Repo hi canonical rahe.**                                                        |
| `.github/workflows/ci.yml`       | GitHub pe hi chalega, platform se independent                                                                                           |
| Reusable prompts (stable wale)   | Agent Skills format (`SKILL.md`) me pack karo — 2026 ka cross-platform standard, Cursor / Claude Code / Windsurf sab support karte hain |

**Rule:** platform ke andar jo AI ne banaya, woh GitHub me sync hona chahiye. Platform ke andar bane context (chat history) ko memory mat maano. Har session ke end me `PROGRESS.md` update karo.

### 8.3 Non-technical founder ke liye "verification without reading code"

- Har task ke **acceptance criteria** ko khud app me click karke check karo.
- **Preview deploy link** (PR ke saath) team ya dost ko bhejo.
- Second AI chat me **Prompt V** chalao.
- **Sentry** se production errors ka email aaye.
- Kabhi bhi bina CI green ke merge mat karo.

---

## 9. Tech stack decisions

> **Version policy:** Yahan versions likhe nahi. Bootstrap ke waqt official generators se latest stable lo, **exact version pin** karo, lockfile commit karo, aur AI se docs ke against verify karwao. Stack default hai: badalna ho to ADR likho.

| Layer            | Choice                                                          | Anti-hallucination reason                    | Alternative        |
| ---------------- | --------------------------------------------------------------- | -------------------------------------------- | ------------------ |
| Monorepo         | pnpm workspaces + Turborepo                                     | Ek jagah shared types, ek `verify`           | Nx                 |
| Language         | TypeScript (strict)                                             | Compiler AI ki galtiyan pakadta hai          | n/a                |
| Web              | Next.js (App Router) + React                                    | Bada ecosystem, official docs                | Remix, SvelteKit   |
| Styling / UI     | Tailwind CSS + shadcn/ui                                        | Code tumhare repo me, AI padh sakta hai      | Mantine            |
| Mobile           | Expo (React Native) + Expo Router                               | Managed workflow = kam native errors         | Flutter            |
| State / fetching | TanStack Query                                                  | Ek hi data-fetch pattern                     | SWR                |
| Forms            | React Hook Form + Zod                                           | Schema shared validation                     | n/a                |
| Validation       | Zod (packages/shared)                                           | Ek schema: web + mobile + API                | Valibot            |
| API              | REST `/api/v1` via Next.js Route Handlers                       | Web aur mobile ek hi contract use karte hain | tRPC               |
| Backend/DB       | Supabase (Postgres, Auth, Storage, Realtime)                    | SQL migrations + generated types             | Neon + Auth.js     |
| DB access        | supabase-js + repository layer + generated types                | Ek hi tarika                                 | Drizzle / Prisma   |
| Authorization    | Postgres RLS                                                    | DB level security, AI bypass nahi kar paata  | App-level checks   |
| Payments (opt.)  | Stripe (+ webhooks)                                             | Idempotency keys, signed webhooks            | Razorpay           |
| Email (opt.)     | Resend                                                          | Simple API                                   | Postmark           |
| AI/agents (opt.) | Provider-agnostic LLM gateway + Zod tool schemas + eval harness | Prompt versioning, tests for tools           | n/a                |
| Tests            | Vitest, Testing Library, Playwright (web), Maestro (mobile)     | Tests = deterministic spec                   | Jest, Detox        |
| Quality          | ESLint, Prettier, Husky, lint-staged, commitlint                | Style debate khatam                          | Biome              |
| CI/CD            | GitHub Actions, CodeQL, gitleaks, Dependabot                    | Machine reviewers                            | GitLab CI          |
| Hosting          | Vercel (web), EAS (mobile), Supabase (data)                     | Preview per PR                               | Cloudflare, Fly.io |
| Observability    | Sentry (errors), PostHog (analytics), `/api/health`             | Production galtiyan jaldi dikhein            | Datadog            |

---

## 10. Architecture blueprint

### 10.1 System diagram

```
 ┌──────────────┐     ┌────────────────┐
 │ Mobile (Expo)│     │ Web (Next.js)  │
 └──────┬───────┘     └───────┬────────┘
        │  HTTPS + JWT        │  HTTPS (cookie session)
        └──────────┬──────────┘
                   ▼
        ┌─────────────────────────┐
        │ API  /api/v1  (Route    │  Zod validation, authz, rate limit,
        │ Handlers)               │  error envelope
        └────────────┬────────────┘
                     ▼
              Service layer   (business rules, no DB code)
                     ▼
            Repository layer  (only place that talks to DB)
                     ▼
   ┌────────────────────────────────────────────┐
   │ Supabase: Postgres (RLS) • Auth • Storage   │
   │ Realtime • Edge Functions (async jobs)      │
   └────────────────────────────────────────────┘
        ▲                                ▲
   Stripe / Resend / LLM provider    Sentry • PostHog
   (via integration adapters)        (cross-cutting)
```

### 10.2 Layering rule (anti-drift)

```
UI component → hook (TanStack Query) → api client → route handler
            → service → repository → DB
```

- Upar wali layer sirf **ek neeche wali** layer ko call kare.
- ESLint `no-restricted-imports` ya `dependency-cruiser` se enforce karo.
- Koi business logic UI me nahi. Koi SQL service me nahi.

### 10.3 Folder structure (after P4)

```
apps/
  web/        src/app (routes) • src/components • src/features/<feature>/{hooks,components}
              src/server/{routes-helpers,services,repositories} • src/lib/env.ts
  mobile/     app/ (Expo Router) • src/features • src/lib/{env.ts,api-client.ts}
packages/
  shared/     Zod schemas, types, constants, API client types, utils
  ui/         shared tokens/primitives (if needed)
  db/         generated Supabase types, seed scripts
  config/     eslint, tsconfig, prettier presets
supabase/     migrations/ • seed.sql • config.toml
docs/ • prompts/ • scripts/ • .github/ • .cursor/
```

### 10.4 Conventions (ek hi tarika)

| Topic                  | Standard                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| API envelope (success) | `{ "data": ..., "meta": { ... } }`                                                                 |
| API envelope (error)   | `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }`                  |
| Status codes           | 200/201, 400 validation, 401 unauth, 403 forbidden, 404, 409 conflict, 429 rate-limit, 500         |
| Pagination             | Cursor-based: `?limit=20&cursor=...`                                                               |
| IDs                    | UUID (v4/v7)                                                                                       |
| Dates                  | ISO-8601 UTC; show local on client                                                                 |
| Money                  | Integer minor units + currency code (never floats)                                                 |
| Naming                 | DB `snake_case`; TS `camelCase`; components `PascalCase`; files `kebab-case`                       |
| Idempotency            | `Idempotency-Key` header on payment/side-effect POSTs                                              |
| Env                    | `.env.example` committed; real `.env*` never; Zod-validated `env.ts`, app crash at boot if invalid |
| Feature flags          | Simple `flags` table or env flag, documented in `docs/ENVIRONMENTS.md`                             |
| Branching              | Trunk-based; short branches `feat/T-012-name`; squash merge; Conventional Commits                  |

### 10.5 Data model starter (generic; P2 me product-specific banega)

```sql
-- profiles: 1-1 with auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles: owner read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: owner update" on public.profiles for update using (auth.uid() = id);

-- Pattern for every user-owned table
create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index items_user_id_idx on public.items(user_id);
alter table public.items enable row level security;
create policy "items: owner all" on public.items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

### 10.6 Auth flow

1. Client → Supabase Auth (email/OAuth/magic link) → session (JWT).
2. Web: session cookie via server helper. Mobile: secure storage.
3. API route: verify session server-side → derive `userId` (client-supplied userId kabhi nahi).
4. DB: RLS dobara enforce karta hai (defense in depth).

### 10.7 Cross-cutting

- **Errors:** custom `AppError(code, status, message)`; ek global handler envelope banata hai.
- **Logging:** structured JSON, request id, no PII/tokens.
- **Rate limiting:** auth + expensive endpoints.
- **Caching:** TanStack Query client-side; HTTP cache/ISR sirf public pages pe.
- **Background jobs:** Supabase Edge Functions / scheduled jobs; idempotent handlers.
- **i18n/a11y:** strings externalize karo agar multi-language; semantic HTML, contrast, focus.

### 10.8 Deployment topology

| Env        | Web                   | Mobile                        | DB                           | Trigger                           |
| ---------- | --------------------- | ----------------------------- | ---------------------------- | --------------------------------- |
| local      | `pnpm dev`            | Expo dev client               | Supabase local / dev project | manual                            |
| preview    | Vercel preview per PR | EAS preview build (optional)  | Preview/branch DB            | PR open                           |
| production | Vercel prod           | EAS Build/Submit (Play Store) | Supabase prod                | merge to `main` + manual approval |

Migrations CI se apply hote hain, **pehle staging pe**. Rollback: Vercel instant rollback + forward-fix migration (kabhi purani migration edit nahi).

### 10.9 Testing pyramid

- **Many:** unit (Vitest) for services, utils, Zod schemas.
- **Some:** integration for route handlers + repositories against local DB; **RLS tests mandatory**.
- **Few:** e2e (Playwright web, Maestro mobile) for critical journeys from PRD.
- **Always:** regression test for every bug.

### 10.10 Security checklist (summary)

RLS everywhere • Zod at every boundary • authz on every route • no secrets in client/bundle • HTTPS only + security headers • rate limits • dependency audit + Dependabot • gitleaks • CodeQL • least-privilege API keys • backups + restore drill • PII minimization • audit logs for sensitive actions.

---

## 11. PRD template (`docs/PRD.md`)

```md
# PRD — <Product name>

Version: 0.1 Owner: <name> Status: draft | approved Last updated: <date>

## 1. Overview

- Problem statement (who suffers, how, how often):
- Vision (one sentence):
- Why now:

## 2. Target users & personas

| Persona | Description | Top need | Platform |
| ------- | ----------- | -------- | -------- |

## 3. Goals, non-goals, success metrics

- Goals (measurable):
- Non-goals (explicitly NOT doing):
- Success metrics (KPI, baseline, target, date):

## 4. User stories (each with ID)

- US-001: As a <persona>, I want <action>, so that <outcome>.

## 5. Functional requirements

| ID     | Requirement | Priority (P0/P1/P2) | Acceptance criteria (Given/When/Then) |
| ------ | ----------- | ------------------- | ------------------------------------- |
| FR-001 |             | P0                  | Given… When… Then…                    |

## 6. Non-functional requirements

- Performance (e.g. LCP, API p95):
- Availability / reliability:
- Security & privacy (PII, data retention, GDPR/DPDP as applicable):
- Accessibility (WCAG level):
- Localization:
- Offline behavior (mobile):
- Browser/device support (min Android version, browsers):

## 7. Screens / routes

| Screen | Platform | Purpose | States (loading/empty/error) |
| ------ | -------- | ------- | ---------------------------- |

## 8. Data entities (business view)

| Entity | Key fields | Owner | Retention |
| ------ | ---------- | ----- | --------- |

## 9. Integrations

| Service | Purpose | Failure behavior |
| ------- | ------- | ---------------- |

## 10. Monetization & pricing (if any)

## 11. Milestones

| Milestone            | Scope (FR IDs) | Exit criteria | Target date |
| -------------------- | -------------- | ------------- | ----------- |
| M1 Foundation + Auth |                |               |             |
| M2 Core feature      |                |               |             |
| M3 Hardening + Beta  |                |               |             |
| M4 Launch            |                |               |             |

## 12. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |

## 13. Assumptions

## 14. Open questions (never silently decided)

## 15. Definition of Done (product level)

- All P0 FRs pass acceptance tests (automated where possible)
- `pnpm verify` + e2e green; CodeQL/gitleaks clean
- Security checklist complete; RLS tests green
- Monitoring + alerts live; rollback tested
- Docs updated (README, PROGRESS, CHANGELOG)

## 16. Traceability (filled in P2)

| FR ID | Screen | Endpoint | Table | Test |
| ----- | ------ | -------- | ----- | ---- |
```

---

## 12. Troubleshooting playbook

| Symptom                    | Likely cause                                                                  | Action                                                 |
| -------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------ |
| AI rules ignore kar raha   | `.md` instead of `.mdc`, glob mismatch, rule bahut lamba, ya chat bahut lamba | `.mdc` check, Settings → Rules, naya chat, Prompt R    |
| Naya package suggest kiya  | Slopsquatting / hallucination                                                 | `npm view`, reject, Prompt H                           |
| Purani API likhi           | Training cutoff                                                               | Official docs attach, version pin, typecheck           |
| Same bug 3rd baar          | Evidence nahi                                                                 | `git reset`, naya chat, Prompt D with logs             |
| AI ne tests badal diye     | Test-gaming                                                                   | Revert test diff, rule 050, test diffs pe human review |
| Bahut files badal diye     | Scope fence missing                                                           | Revert, task file me allowed/forbidden files           |
| Chat lamba, AI bhatak raha | Context rot                                                                   | Prompt M → naya chat → Prompt R                        |
| Mobile build fail          | SDK mismatch                                                                  | `npx expo install --check`, EAS build log paste        |
| "Works on my machine"      | Env mismatch                                                                  | `.nvmrc`, lockfile, CI hi truth                        |
| Production error           | Missing edge case                                                             | Sentry stack trace → Prompt D → regression test        |

---

## 13. Launch the repo as open source

1. Repo public, **MIT license**, "Template repository" ON.
2. Topics: `vibe-coding`, `cursor`, `ai-coding`, `prd`, `nextjs`, `expo`, `supabase`, `template`.
3. README me: 5-minute quick start, workflow diagram, demo GIF, FAQ ("zero galti" ka honest answer).
4. Branch protection on `main`: PR required, CI required, no force-push.
5. Issues/Discussions ON; `CONTRIBUTING.md` me "Gotchas learned" contributions welcome.
6. `CHANGELOG.md` + semantic version tags (v0.1.0).
7. Dogfood: is repo se ek chhota real app (e.g. todo) P0→P9 tak bana ke `examples/` me daalo. Isse prompts ki kamiyan pakdi jaati hain.
8. Cursor/tool UI badalte rehte hain: README me "tested with" date likho aur har quarter prompts re-verify karo.

---

**End of blueprint.** Rule yaad rakho: _Repo = memory. Tests = truth. Chhota task = kam hallucination._
