# Tech stack

> **Version policy:** App-stack libraries (Next.js, Expo, Supabase, Tailwind…) are **not** listed with
> versions on purpose: at P4 take the latest stable from the official generators, **pin the exact
> version**, commit the lockfile, and have the AI verify against the docs. The **toolchain** below is
> pinned and verified. Shared dev-tool versions live in `pnpm-workspace.yaml` (`catalog:`).
> Changing the stack requires an ADR.

| Layer            | Choice                                                          | Anti-hallucination reason                   | Alternative        |
| ---------------- | --------------------------------------------------------------- | ------------------------------------------- | ------------------ |
| Monorepo         | pnpm workspaces + Turborepo                                     | One place for shared types, one `verify`    | Nx                 |
| Language         | TypeScript (strict)                                             | The compiler catches AI mistakes            | n/a                |
| Web              | Next.js (App Router) + React                                    | Large ecosystem, official docs              | Remix, SvelteKit   |
| Styling / UI     | Tailwind CSS + shadcn/ui                                        | Code lives in your repo, the AI can read it | Mantine            |
| Mobile           | Expo (React Native) + Expo Router                               | Managed workflow = fewer native errors      | Flutter            |
| State / fetching | TanStack Query                                                  | One data-fetch pattern                      | SWR                |
| Forms            | React Hook Form + Zod                                           | Shared schema validation                    | n/a                |
| Validation       | Zod (packages/shared)                                           | One schema: web + mobile + API              | Valibot            |
| API              | REST `/api/v1` via Next.js Route Handlers                       | Web and mobile share one contract           | tRPC               |
| Backend/DB       | Supabase (Postgres, Auth, Storage, Realtime)                    | SQL migrations + generated types            | Neon + Auth.js     |
| DB access        | supabase-js + repository layer + generated types                | One way to touch the DB                     | Drizzle / Prisma   |
| Authorization    | Postgres RLS                                                    | DB-level security the AI cannot bypass      | App-level checks   |
| Payments (opt.)  | Stripe (+ webhooks)                                             | Idempotency keys, signed webhooks           | Razorpay           |
| Email (opt.)     | Resend                                                          | Simple API                                  | Postmark           |
| AI/agents (opt.) | Provider-agnostic LLM gateway + Zod tool schemas + eval harness | Prompt versioning, tests for tools          | n/a                |
| Tests            | Vitest, Testing Library, Playwright (web), Maestro (mobile)     | Tests = deterministic spec                  | Jest, Detox        |
| Quality          | ESLint, Prettier, Husky, lint-staged, commitlint                | Ends style debates                          | Biome              |
| CI/CD            | GitHub Actions, CodeQL, gitleaks, Dependabot                    | Machine reviewers                           | GitLab CI          |
| Hosting          | Vercel (web), EAS (mobile), Supabase (data)                     | Preview per PR                              | Cloudflare, Fly.io |
| Observability    | Sentry (errors), PostHog (analytics), `/api/health`             | Production mistakes surface fast            | Datadog            |

## Pinned at bootstrap (2026-10-04, verified via `npm view`)

| Package           | Version | Note                                                                                                          |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| pnpm              | 12.9.1  | `packageManager` field                                                                                        |
| node              | 24.20.0 | `.nvmrc`; active LTS until 2026-10-20, then Node 26 (LTS from 2026-10-28)                                     |
| turbo             | 2.11.7  |                                                                                                               |
| typescript        | 5.9.3   | Latest is 7.x (6.0 also exists). Majors are manual upgrades (Dependabot ignores them) — re-evaluate quarterly |
| vitest            | 4.1.11  | 5.x exists; major upgrade is manual (Dependabot ignores majors) — re-evaluate quarterly                       |
| eslint            | 10.12.0 | Flat config                                                                                                   |
| @eslint/js        | 10.0.1  |                                                                                                               |
| typescript-eslint | 8.71.0  |                                                                                                               |
| prettier          | 3.9.9   |                                                                                                               |

Re-verify quarterly (see README "tested with" date).

## Android / Google Play constraints (verified 2026-10-04)

| Constraint                                | Value                                                             |
| ----------------------------------------- | ----------------------------------------------------------------- |
| Target API level for new apps and updates | **36** (Android 16), required since 2026-08-31                    |
| Existing apps                             | must target **35+** to stay visible to new users on newer Android |
| Upload format                             | Android App Bundle (.aab)                                         |

Details and the full checklist: `docs/PLAY_STORE.md`.
