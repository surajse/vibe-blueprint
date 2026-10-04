# VIBE-BLUEPRINT.md

### Zero-Drift Vibe Coding Kit

100 Q&A debate → fixes → open-source GitHub repo → Cursor prompts → full stack + architecture + PRD

> **Language note:** Explanation Hinglish me hai. Prompts, rules aur code English me hain, kyunki AI ko English instructions zyada reliable milte hain.

---

## Contents

0. Sach pehle (honest truth)
1. Quick start (10 min)
2. The 100-question debate (psychological + logical)
3. The fix: 7-layer anti-hallucination system
4. GitHub repo design (`vibe-blueprint`)
5. Master Bootstrap Prompt (maintainers only → docs/MAINTAINERS.md)
6. Phase prompts P0–P10 (Cursor builds your app A→Z, then ships to Google Play)
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

## 1. Quick start

### Users — naya app banana hai (99% log yahi hain)

1. GitHub pe **Use this template** → apna repo banao → clone karo.
2. `pnpm install`
3. Cursor (ya koi AI IDE) me kholo → `prompts/P0-discovery.md` se shuru karo, P0 → P10 tak ek-ek karke.
4. Har feature: `docs/TASKS.md` se task chuno → naya chat → `prompts/T-task.md`.

> ⚠️ **Master Bootstrap Prompt mat chalao** — woh repo _banata_ hai. Template se aapka repo
> already bana hua hai; use chalane se files overwrite/duplicate hongi.

### Maintainers — template ko rebuild ya maintain karna hai

1. `docs/MAINTAINERS.md` padho — usme Bootstrap Prompt hai jo real files ko source of truth maanta hai.
2. Changes hamesha real files me karo; is playbook me file contents ki embedded copies mat rakho (Q14).

---

## 2. The 100-question debate

Why AI-assisted coding drifts — and what to do about it — lives in
[`docs/QA.md`](docs/QA.md): 100 questions in Q → A (root cause) → Fix format,
split into psychological (Q1–Q25, Q51–Q75) and logical/technical (Q26–Q50, Q76–Q100).

The short version: LLMs are probabilistic next-token predictors with no built-in
"I don't know" button (Q26). Hallucination drops when grounding goes up, task size
goes down, verification goes up, and memory lives in files (Q100).

## 3. The fix: 7-layer anti-hallucination system

| Layer           | Kya                              | Konsi files / tools                      | Q#                                                               |
| --------------- | -------------------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| L1 Spec         | Kya banana hai, testable form me | `docs/PRD.md`, acceptance criteria       | 2, 9, 22, 54, 57, 58, 63, 70, 91, 92                             |
| L2 Memory       | Context files me, chat me nahi   | `AGENTS.md`, `docs/PROGRESS.md`, ADRs    | 7, 8, 30, 31, 65, 99                                             |
| L3 Rules        | Behaviour ke guardrails          | `.cursor/rules/*.mdc`                    | 20, 21, 32, 38, 39, 51, 52, 55, 64, 75, 76, 77, 84, 85, 86       |
| L4 Grounding    | Real source dena                 | Docs, generated types, Zod, MCP          | 26, 33, 35, 36, 59, 79, 82, 88, 90, 95                           |
| L5 Task slicing | Chhote, bounded kaam             | `docs/TASKS.md`, 1 task = 1 chat         | 3, 17, 29, 40, 53, 60, 67                                        |
| L6 Gates        | Machine verification             | `pnpm verify`, CI, e2e, CodeQL, gitleaks | 4, 5, 41, 46, 47, 61, 69, 71, 78, 80, 81, 83, 87, 89, 94, 96, 97 |
| L7 Review & Ops | Insaan + monitoring              | PR template, Sentry, preview deploys     | 13, 25, 50, 56, 62, 66, 68, 72, 73, 74, 93, 98, 100              |

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

```text
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
│   │   ├── 035-android-play.mdc  # globs: apps/mobile/**, Play release
│   │   ├── 040-database.mdc      # globs: supabase/**, packages/db/**
│   │   └── 050-testing.mdc       # globs: **/*.test.*, e2e/**
│   └── mcp.json.example
├── docs/
│   ├── BLUEPRINT.md              # yeh file — playbook (links, not embeds)
│   ├── MAINTAINERS.md            # template maintainers ke liye
│   ├── QA.md                     # 100-question debate
│   ├── FRESHNESS.md              # dated facts: fact | source | checked
│   ├── PRD.md  ARCHITECTURE.md  TECH_STACK.md
│   ├── DATA_MODEL.md  API_CONTRACT.md  DESIGN_SYSTEM.md
│   ├── SECURITY.md  TESTING.md  OBSERVABILITY.md
│   ├── PROGRESS.md               # living memory
│   ├── TASKS.md  BACKLOG.md  GLOSSARY.md
│   ├── UX.md                     # P2b wireframes
│   ├── DATA_INVENTORY.md         # Play Data Safety ka source
│   ├── ENVIRONMENTS.md  RELEASE.md  RUNBOOK.md  WEB_LAUNCH.md  TOOLING.md
│   ├── PLAY_STORE.md             # verified Play gates
│   ├── decisions/ADR-0000-template.md
│   └── tasks/T-000-template.md
├── prompts/                      # har prompt ek file — wahi authoritative hai
│   ├── P0-discovery.md  P1-prd.md  P2-architecture.md  P2b-ux-wireframes.md
│   ├── P3-tasks.md  P4-scaffold.md  P5-database-auth.md  P6-feature.md
│   ├── P7-hardening.md  P8-deploy.md  P9-release.md  P10-play-store.md
│   └── T-task.md  D-debug.md  R-recovery.md  V-review.md  H-audit.md  M-memory.md
├── packages/shared/              # walking skeleton: 1 function + 1 test (verify day-0 green)
├── apps/                         # P4 me scaffold hoga (web, mobile)
├── supabase/migrations/
├── scripts/verify.mjs            # pnpm verify — cross-platform
└── .github/
    ├── workflows/ci.yml
    ├── workflows/freshness.yml    # quarterly re-verify reminder
    ├── PULL_REQUEST_TEMPLATE.md
    ├── ISSUE_TEMPLATE/{bug.md,feature.md}
    └── dependabot.yml
```

### 4.2 `AGENTS.md` — the source of truth, never a copy

The real file is [`AGENTS.md`](../AGENTS.md) at the repo root: mandatory session-start
protocol, sources of truth, hard rules (never invent APIs/names/paths, scope fence,
no `any`, no placeholders), Definition of Done, stuck protocol.

> This playbook used to embed its content. The copy drifted — it missed the Android/Play
> and public-env rules the real file had. Single source of truth = the real file (Q14).

### 4.3 `.cursor/rules/*.mdc`

Behaviour guardrails live in [`../.cursor/rules/`](../.cursor/rules/) — one `.mdc` file
per concern, with `description`/`globs`/`alwaysApply` frontmatter:

| File                   | Scope                                       |
| ---------------------- | ------------------------------------------- |
| `000-core.mdc`         | alwaysApply — session protocol, scope fence |
| `010-security.mdc`     | alwaysApply — secrets, RLS, uploads, auth   |
| `020-web-nextjs.mdc`   | `apps/web/**`                               |
| `030-mobile-expo.mdc`  | `apps/mobile/**`                            |
| `035-android-play.mdc` | `apps/mobile/**`, Play release              |
| `040-database.mdc`     | `supabase/**`, `packages/db/**`             |
| `050-testing.mdc`      | `**/*.test.*`, `e2e/**`                     |

Always-on rules stay few and short (~2000 tokens combined — heuristic, Q39). A new rule
needs a why + Q# reference, or quarterly review removes it (Q64).

### 4.4 `.cursorignore`

Lives at [`../.cursorignore`](../.cursorignore): secrets, build output, lockfile noise.
Not a security boundary — secrets don't belong in the repo folder at all (Q37).

### 4.5 `docs/PROGRESS.md` (living memory)

Template: [`docs/PROGRESS.md`](PROGRESS.md) — current state, decisions, gotchas, working
commands. Updated at the end of every task; no update = no merge (Q65).

### 4.6 `docs/tasks/T-000-template.md`

Template: [`docs/tasks/T-000-template.md`](tasks/T-000-template.md) — goal, acceptance
criteria, allowed/forbidden files, tests-first, verify steps. One task = one file.

### 4.7 `docs/decisions/ADR-0000-template.md`

Template: [`docs/decisions/ADR-0000-template.md`](decisions/ADR-0000-template.md) —
context, options with trade-offs, decision, consequences. New patterns need an ADR (Q52).

### 4.8 `scripts/verify.mjs` and root `package.json` scripts

`pnpm verify` runs [`../scripts/verify.mjs`](../scripts/verify.mjs): format → lint →
typecheck → test → build → docs-check. Cross-platform (Node, no bash needed). "Done" =
its real output, pasted (Q41).

### 4.9 `.github/workflows/ci.yml`

The real workflow: [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) — verify,
gitleaks secrets scan, CodeQL, dependency audit + review. Least-privilege permissions,
concurrency, timeouts. Dated facts (action majors) live in [`docs/FRESHNESS.md`](FRESHNESS.md),
not in comments.

### 4.10 `.github/PULL_REQUEST_TEMPLATE.md`

Template: [`../.github/PULL_REQUEST_TEMPLATE.md`](../.github/PULL_REQUEST_TEMPLATE.md) —
what & why, checklist (including PROGRESS.md update), risks/assumptions.

## 5. Master Bootstrap Prompt (maintainers only)

The repo-building prompt moved to [`docs/MAINTAINERS.md`](MAINTAINERS.md). It treats the
repo's real files as the source of truth — it reads them, it never copies file contents
out of this playbook. **Do not run it on an app repo** (§1).

## 6. Phase prompts P0–P10 (build your app A→Z)

> Har prompt naye chat me, Agent mode me. Pehle `@AGENTS.md @docs/PROGRESS.md` attach karo.
> Ek phase khatam → review → commit → agla. The file in [`../prompts/`](../prompts/)
> is authoritative, not the one-liner below.

| Prompt                 | Kya karta hai                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `P0-discovery.md`      | No code. Interview (max 15 questions, ek batch) → `docs/discovery.md`                         |
| `P1-prd.md`            | `docs/PRD.md` fill karo: FR-/US- IDs, Given/When/Then acceptance, non-goals                   |
| `P2-architecture.md`   | ARCHITECTURE.md, DATA_MODEL.md, API_CONTRACT.md, DESIGN_SYSTEM.md, SECURITY.md + traceability |
| `P2b-ux-wireframes.md` | UX wireframes: screen inventory, navigation map, low-fi ASCII wireframes, copy table, a11y    |
| `P3-tasks.md`          | PRD ko vertical-slice tasks me todo → `docs/TASKS.md` + `docs/tasks/T-###.md`                 |
| `P4-scaffold.md`       | Official generators se apps/web + apps/mobile scaffold, workspace wiring, `pnpm verify`       |
| `P5-database-auth.md`  | Supabase migrations (RLS, indexes, triggers), generated types, auth, RLS tests                |
| `P6-feature.md`        | Feature loop — Section 7-T use karo. Ek task = ek chat = ek branch = ek PR                    |
| `P7-hardening.md`      | Security + quality audit: finding \| severity \| file \| fix table                            |
| `P8-deploy.md`         | Vercel + Supabase prod + EAS, env matrix, Sentry/PostHog, `/api/health`, backups              |
| `P9-release.md`        | Release checklist, rollback plan, runbook, CHANGELOG, monitoring plan                         |
| `P10-play-store.md`    | Google Play launch — verified gates in [`docs/PLAY_STORE.md`](PLAY_STORE.md)                  |

## 7. Reusable prompts

Each prompt is a file in [`../prompts/`](../prompts/) — that file is authoritative.

| Prompt          | Kab use karo                                                                            |
| --------------- | --------------------------------------------------------------------------------------- |
| `T-task.md`     | P6 ka core: ek task implement karo (tests-first, scope fence, verify, PROGRESS update)  |
| `D-debug.md`    | Bug: pehle 3 ranked root causes + cheap experiments, phir minimal fix + regression test |
| `R-recovery.md` | Naya chat ya AI bhatak gaya: <=10 lines me current state restate karo                   |
| `V-review.md`   | Second-AI reviewer, fresh chat: adversarial review                                      |
| `H-audit.md`    | Hallucination audit: UNVERIFIED claims dhoondo                                          |
| `M-memory.md`   | Har task ke baad: PROGRESS.md + gotchas update                                          |

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

| Layer                              | Choice                                                          | Anti-hallucination reason                     | Alternative          |
| ---------------------------------- | --------------------------------------------------------------- | --------------------------------------------- | -------------------- |
| Monorepo                           | pnpm workspaces + Turborepo                                     | Ek jagah shared types, ek `verify`            | Nx                   |
| Language                           | TypeScript (strict)                                             | Compiler AI ki galtiyan pakadta hai           | n/a                  |
| Web                                | Next.js (App Router) + React                                    | Bada ecosystem, official docs                 | Remix, SvelteKit     |
| Styling / UI                       | Tailwind CSS + shadcn/ui                                        | Code tumhare repo me, AI padh sakta hai       | Mantine              |
| Mobile                             | Expo (React Native) + Expo Router                               | Managed workflow = kam native errors          | Flutter              |
| State / fetching                   | TanStack Query                                                  | Ek hi data-fetch pattern                      | SWR                  |
| Forms                              | React Hook Form + Zod                                           | Schema shared validation                      | n/a                  |
| Validation                         | Zod (packages/shared)                                           | Ek schema: web + mobile + API                 | Valibot              |
| API                                | REST `/api/v1` via Next.js Route Handlers                       | Web aur mobile ek hi contract use karte hain  | tRPC                 |
| Backend/DB                         | Supabase (Postgres, Auth, Storage, Realtime)                    | SQL migrations + generated types              | Neon + Auth.js       |
| DB access                          | supabase-js + repository layer + generated types                | Ek hi tarika                                  | Drizzle / Prisma     |
| Authorization                      | Postgres RLS                                                    | DB level security, AI bypass nahi kar paata   | App-level checks     |
| Payments (physical goods/services) | Stripe / Razorpay + signed webhooks                             | Idempotency keys, signed webhooks             | n/a                  |
| Payments (digital goods, Android)  | Google Play Billing (direct ya wrapper service)                 | Policy-driven; Stripe yahan galat default hai | n/a                  |
| Push                               | `expo-notifications` + FCM                                      | Official docs, real-device test               | OneSignal            |
| Deep links                         | Android App Links + Expo Router linking                         | `assetlinks.json` se verifiable               | n/a                  |
| Account deletion                   | In-app flow + public web URL                                    | Play policy requirement                       | n/a                  |
| Android health                     | Play Console Android vitals + Sentry                            | Prod crashes/ANRs jaldi dikhein               | Firebase Crashlytics |
| Email (opt.)                       | Resend                                                          | Simple API                                    | Postmark             |
| AI/agents (opt.)                   | Provider-agnostic LLM gateway + Zod tool schemas + eval harness | Prompt versioning, tests for tools            | n/a                  |
| Tests                              | Vitest, Testing Library, Playwright (web), Maestro (mobile)     | Tests = deterministic spec                    | Jest, Detox          |
| Quality                            | ESLint, Prettier, Husky, lint-staged, commitlint                | Style debate khatam                           | Biome                |
| CI/CD                              | GitHub Actions, CodeQL, gitleaks, Dependabot                    | Machine reviewers                             | GitLab CI            |
| Hosting                            | Vercel (web), EAS (mobile), Supabase (data)                     | Preview per PR                                | Cloudflare, Fly.io   |
| Observability                      | Sentry (errors), PostHog (analytics), `/api/health`             | Production galtiyan jaldi dikhein             | Datadog              |

> Note: P2 me har row ko current official docs/policy se verify karke ADR me likho —
> khaas taur par Play Billing vs Stripe (Play Payments policy badalti rehti hai; launch
> se pehle Play Console policy center me verify karo).

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
-- Shared helper: keep updated_at honest
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles: 1-1 with auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles: owner read" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: owner update" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
-- No insert/delete policy on purpose: the row is created by the trigger below
-- and removed by the auth.users cascade.

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create the profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

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
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create trigger items_set_updated_at
  before update on public.items
  for each row execute function public.set_updated_at();
```

> `(select auth.uid())` ko subselect me wrap karna Supabase ka documented performance
> pattern hai (per-row function call ke bajaye ek baar evaluate hota hai). `security definer`
> function me `set search_path = ''` rakho. RLS tests chalao: anon denied, cross-user denied.

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

## 11. PRD template

The template is [`docs/PRD.md`](PRD.md) — 16 sections: overview, personas, goals/non-goals,
user stories, functional + non-functional requirements, screens, data entities,
integrations, monetization, milestones, risks, assumptions, open questions, Definition
of Done, traceability. P1 fills it; P2b adds UX wireframes in [`docs/UX.md`](UX.md).

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
7. Dogfood: is repo se ek chhota real app (e.g. todo) P0→P10 tak bana ke `examples/` me daalo. Isse prompts ki kamiyan pakdi jaati hain.
8. Cursor/tool UI badalte rehte hain: README me "tested with" date likho aur har quarter prompts re-verify karo.

---

**End of blueprint.** Rule yaad rakho: _Repo = memory. Tests = truth. Chhota task = kam hallucination._

---

## Appendix A — v0.2 production hardening (2026-10-04)

Added after a real audit of this repo: see `docs/AUDIT-2026-10-04.md` for every finding, how it
was verified, and what changed. Highlights: `scripts/check-docs.mjs` (dead-reference detector),
pnpm `catalog:` (single version source), hardened CI, Android/Play Store pipeline docs, web launch
checklist, environments/release/runbook/observability docs, cross-tool adapters (`docs/TOOLING.md`).
