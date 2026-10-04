# Data model

> Filled in P2 from docs/PRD.md. Every table below follows the starter
> pattern in docs/ARCHITECTURE.md: `id`, `created_at`, `updated_at`,
> RLS enabled with policies, indexes on foreign keys and frequent filters.

## Tables

### `<table_name>`

| Column     | Type        | Nullable | Default           | Notes                      |
| ---------- | ----------- | -------- | ----------------- | -------------------------- |
| id         | uuid        | no       | gen_random_uuid() | PK                         |
| user_id    | uuid        | no       | —                 | FK → auth.users(id), owner |
| created_at | timestamptz | no       | now()             |                            |
| updated_at | timestamptz | no       | now()             | trigger-maintained         |

**Relations:**

- ...

**Indexes:**

- `<table>_<column>_idx` — reason

**RLS policies:**

- `select` / `insert` / `update` / `delete`: `auth.uid() = user_id`

**RLS tests** (mandatory, see docs/TESTING.md):

- Owner can read/write own rows: ...
- Another user cannot read/write: ...
- Anonymous is denied: ...

## Migrations

- Schema changes ONLY via new files in `supabase/migrations/`. Never edit old ones.
- After each migration: regenerate TS types (`packages/db`), update this doc.

## Naming

DB `snake_case`; TS `camelCase` (see docs/ARCHITECTURE.md conventions).
