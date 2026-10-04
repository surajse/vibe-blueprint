# Architecture — <Product name>

> Adapted from the blueprint in P2. Every PRD requirement must map to at
> least one table/endpoint/screen (see Traceability in docs/PRD.md §16).

## System diagram

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

## Layering rule (anti-drift)

```
UI component → hook (TanStack Query) → api client → route handler
            → service → repository → DB
```

- An upper layer calls **only the one layer directly below it**.
- Enforced with ESLint `no-restricted-imports` or `dependency-cruiser`.
- No business logic in UI. No SQL in services.

## Folder structure (after P4)

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

## Enforcing the layers (copy into the app's `eslint.config.mjs` at P4)

Layers only help if a machine enforces them. Example for the web app (adjust paths to the real tree):

```js
// apps/web/eslint.config.mjs (excerpt)
export default [
  {
    files: ['src/components/**', 'src/features/**/components/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/server/repositories/**', '**/server/services/**'],
              message: 'UI must not import services/repositories. Go through hooks -> api client.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/server/services/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@supabase/*'],
              message: 'Services must not touch the DB client. Use a repository.',
            },
          ],
        },
      ],
    },
  },
];
```

Add a failing example import to a test or PR description to prove the rule fires.

## Conventions

| Topic              | Standard                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| API envelope (ok)  | `{ "data": ..., "meta": { ... } }`                                                                   |
| API envelope (err) | `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }`                    |
| Status codes       | 200/201, 400 validation, 401 unauth, 403 forbidden, 404, 409 conflict, 429 rate-limit, 500           |
| Pagination         | Cursor-based: `?limit=20&cursor=...`                                                                 |
| IDs                | UUID (v4/v7)                                                                                         |
| Dates              | ISO-8601 UTC; show local on client                                                                   |
| Money              | Integer minor units + currency code (never floats)                                                   |
| Naming             | DB `snake_case`; TS `camelCase`; components `PascalCase`; files `kebab-case`                         |
| Idempotency        | `Idempotency-Key` header on payment/side-effect POSTs                                                |
| Env                | `.env.example` committed; real `.env*` never; Zod-validated `env.ts`, app crashes at boot if invalid |
| Feature flags      | Simple `flags` table or env flag, documented in `docs/ENVIRONMENTS.md`                               |
| Branching          | Trunk-based; short branches `feat/T-012-name`; squash merge; Conventional Commits                    |

## Data model starter (generic; P2 makes it product-specific)

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

## Auth flow

1. Client → Supabase Auth (email/OAuth/magic link) → session (JWT).
2. Web: session cookie via server helper. Mobile: secure storage.
3. API route: verify session server-side → derive `userId` (never trust a client-supplied userId).
4. DB: RLS enforces again (defense in depth).

## Cross-cutting

- **Errors:** custom `AppError(code, status, message)`; one global handler builds the envelope.
- **Logging:** structured JSON, request id, no PII/tokens.
- **Rate limiting:** auth + expensive endpoints.
- **Caching:** TanStack Query client-side; HTTP cache/ISR only on public pages.
- **Background jobs:** Supabase Edge Functions / scheduled jobs; idempotent handlers.
- **i18n/a11y:** externalize strings if multi-language; semantic HTML, contrast, focus.

## Deployment topology

| Env        | Web                   | Mobile                        | DB                           | Trigger                           |
| ---------- | --------------------- | ----------------------------- | ---------------------------- | --------------------------------- |
| local      | `pnpm dev`            | Expo dev client               | Supabase local / dev project | manual                            |
| preview    | Vercel preview per PR | EAS preview build (optional)  | Preview/branch DB            | PR open                           |
| production | Vercel prod           | EAS Build/Submit (Play Store) | Supabase prod                | merge to `main` + manual approval |

Migrations apply via CI, **staging first**. Rollback: Vercel instant rollback + forward-fix
migration (never edit an old migration).

## Testing pyramid

- **Many:** unit (Vitest) for services, utils, Zod schemas.
- **Some:** integration for route handlers + repositories against local DB; **RLS tests mandatory**.
- **Few:** e2e (Playwright web, Maestro mobile) for critical journeys from PRD.
- **Always:** regression test for every bug.

## Security checklist (summary)

RLS everywhere • Zod at every boundary • authz on every route • no secrets in
client/bundle • HTTPS only + security headers • rate limits • dependency audit +
Dependabot • gitleaks • CodeQL • least-privilege API keys • backups + restore drill •
PII minimization • audit logs for sensitive actions.
