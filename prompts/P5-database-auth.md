Inputs: @docs/DATA_MODEL.md @docs/SECURITY.md @.cursor/rules/040-database.mdc.
Create Supabase migrations for the tables in DATA_MODEL.md with RLS policies,
indexes and updated_at triggers. Generate TS types. Implement auth (sign up, sign in,
sign out, session refresh, protected routes) on web and mobile, using the typed
env module. Write RLS tests proving: a user cannot read or write another user's
rows; anonymous is denied. Show the test output. No mock auth.
