# Environments & configuration

## Matrix

| Env        | Web               | Mobile                         | Database              | Deploy trigger                    |
| ---------- | ----------------- | ------------------------------ | --------------------- | --------------------------------- |
| local      | `pnpm dev`        | Expo dev client / emulator     | Supabase local or dev | manual                            |
| preview    | Vercel per-PR URL | EAS `preview` (APK, internal)  | preview/branch DB     | PR opened                         |
| production | Vercel production | EAS `production` (.aab) → Play | Supabase production   | merge to `main` + manual approval |

## Rules

1. `.env.example` is committed and lists **every** variable (no values). Real `.env*` files are never committed.
2. Every app validates env at boot with a Zod schema (`src/lib/env.ts`); invalid → crash immediately.
3. **Public vs secret:** anything prefixed `NEXT_PUBLIC_` (web) or `EXPO_PUBLIC_` (mobile) is shipped to the client.
   Secrets (service-role keys, Stripe secret, webhook secrets) live only in server-side dashboards/CI secrets.
4. Production secrets are added by a human in each dashboard — never pasted into chat or committed.

## Variable register (fill in P8)

| Variable                    | Used by     | Public? | Local      | Preview       | Production    | Where to set     |
| --------------------------- | ----------- | ------- | ---------- | ------------- | ------------- | ---------------- |
| `SUPABASE_URL`              | web, mobile | yes     | .env.local | Vercel/EAS    | Vercel/EAS    | dashboard        |
| `SUPABASE_ANON_KEY`         | web, mobile | yes     | .env.local | Vercel/EAS    | Vercel/EAS    | dashboard        |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | **NO**  | .env.local | Vercel        | Vercel        | dashboard        |
| `SENTRY_DSN`                | web, mobile | yes     | —          | yes           | yes           | dashboard        |
| `EXPO_TOKEN`                | CI          | **NO**  | —          | GitHub secret | GitHub secret | GitHub → Secrets |

## Feature flags

Simple env flags or a `flags` table; every flag has an owner and a removal date.
