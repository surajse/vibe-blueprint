Inputs: @docs/TECH_STACK.md @docs/ARCHITECTURE.md @.cursor/rules.
Scaffold apps/web (Next.js) and apps/mobile (Expo) and packages/{ui,db,config}
using the OFFICIAL generators (create-next-app, create-expo-app). Do not hand-type
boilerplate. Wire the pnpm workspace, TS paths, shared Zod package, typed env
module (Zod) for each app, ESLint layer-boundary rule, Husky + lint-staged +
commitlint. Use `npx expo install` for Expo packages.
Verify against the official docs for the INSTALLED versions; cite the doc page.
Run `pnpm verify` and show the real output. Update docs/PROGRESS.md.
