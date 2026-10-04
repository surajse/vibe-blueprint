Inputs: @docs/TECH_STACK.md @docs/ARCHITECTURE.md @docs/ENVIRONMENTS.md @.cursor/rules.
Scaffold apps/web (Next.js) and apps/mobile (Expo) and packages/{ui,db,config}
using the OFFICIAL generators (create-next-app, create-expo-app). Do not hand-type
boilerplate. Wire the pnpm workspace (use the `catalog:` versions in
pnpm-workspace.yaml), TS paths, shared Zod package, typed env module (Zod) for each
app, the ESLint layer-boundary rule from docs/ARCHITECTURE.md, Husky + lint-staged +
commitlint. Use `npx expo install` for Expo packages.
Mobile: create apps/mobile/eas.json (development / preview APK / production AAB) and
app.config.ts. Ask me for the Android package name (it is permanent) and write it in
docs/PRD.md. Confirm the Expo SDK you pinned targets Android API 36+ (docs/PLAY_STORE.md).
Verify every API against the official docs for the INSTALLED versions; cite the doc page.
Copy .github/workflows-examples/* into .github/workflows/ only after they work locally.
Run `pnpm verify` and show the real output. Update docs/PROGRESS.md.
