# Google Play launch guide (Android)

> Facts marked **[verified 2026-10-04]** were checked against Google's Play Console Help on that date.
> Everything else is a checklist from experience — re-verify in Play Console Help before launch
> (policies change every few months). Re-verify this file quarterly.

## 1. Hard gates

| Gate                                                                                                       | Status              |
| ---------------------------------------------------------------------------------------------------------- | ------------------- |
| New apps and app updates must **target Android 16 (API level 36)** or higher (since 2026-08-31)            | **[verified]**      |
| Existing apps must target **API 35+** to stay visible to new users on newer Android versions               | **[verified]**      |
| **Personal** developer accounts created after 2023-11-13: closed test with **≥12 testers for 14 days**     | **[verified]**      |
| Organization accounts are exempt from the closed-test rule (but may need business verification)            | reported, re-verify |
| Upload an **Android App Bundle (.aab)**, not an APK, for production                                        | re-verify           |
| Privacy policy URL, **Data safety** form, content rating questionnaire, target audience, ads declaration   | re-verify           |
| Apps that let users create an account need **in-app account deletion** and a web deletion link             | re-verify           |
| Native libraries must support **16 KB memory page sizes** (use Expo SDK modules; avoid ad-hoc native code) | re-verify           |
| Sensitive permissions (SMS, call log, background location, all-files access…) need a declaration + review  | re-verify           |

Official sources: [Target API requirements](https://support.google.com/googleplay/android-developer/answer/11926878),
[Testing requirements for new personal accounts](https://support.google.com/googleplay/android-developer/answer/14151465).

**Timeline reality check:** budget ~3 weeks for a first launch on a new personal account
(14 days closed test + production-access application + review). Start the closed test as soon as P5 is green.

## 2. Pipeline (Expo + EAS)

```
PR → CI (pnpm verify) → merge main → EAS build (production profile, .aab)
   → eas submit → Play internal track → closed test → production (staged rollout)
```

Example `apps/mobile/eas.json` (created in P4 — pin the CLI version then, and verify every key
against the current EAS docs; do not trust this file from memory):

```json
{
  "cli": { "version": ">= 0.0.0", "appVersionSource": "remote" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal", "android": { "buildType": "apk" } },
    "production": { "autoIncrement": true, "android": { "buildType": "app-bundle" } }
  },
  "submit": {
    "production": { "android": { "track": "internal", "releaseStatus": "draft" } }
  }
}
```

Rules:

- `applicationId` (Android package name) is **permanent** once published. Decide it in P0/P2 and write it in `docs/PRD.md`.
- Never commit keystores or the Play service-account JSON. Use EAS-managed credentials and CI secrets
  (`EXPO_TOKEN`, service account in the EAS dashboard). Enable **Play App Signing**.
- `EXPO_PUBLIC_*` variables are **bundled into the app** — never put secrets there.
- Version: SemVer `versionName` for humans, auto-incremented `versionCode` (remote) for Play.
- Prefer managed workflow; if you must add native code, write an ADR first.

## 3. Pre-launch checklist

**Build & compliance**

- [ ] `targetSdk` = 36 confirmed in the built `.aab` (check Expo SDK release notes for the SDK you pinned)
- [ ] Release `.aab` built from a tagged commit with `pnpm verify` green
- [ ] Permissions minimized; each one justified in the store listing / data safety form
- [ ] Data safety form matches **actual** SDK behavior (Sentry, PostHog, auth, ads, crash reporting)
- [ ] Privacy policy URL live; account-deletion flow works in-app and via web link
- [ ] Content rating, target audience, ads declaration completed

**Quality (real devices + emulator API 36)**

- [ ] Edge-to-edge layout and predictive back work on Android 16
- [ ] Cold start, background/foreground, rotation, low memory, airplane mode, slow network
- [ ] Keyboard, text scaling 200%, TalkBack on the 3 core journeys
- [ ] Maestro e2e green on the production build (`preview` profile APK)
- [ ] Sentry release + sourcemaps uploaded; a deliberate test crash appears in Sentry

**Store listing**

- [ ] App icon 512×512, feature graphic 1024×500, ≥2 phone screenshots (verify current specs in Play Console)
- [ ] Short + full description, no policy-violating claims, correct category and contact email
- [ ] Reviewer access: test account + steps if login is required

## 4. Rollout

1. **Internal** (≤100 testers, no review) → smoke test every build.
2. **Closed** (12+ testers for 14 days on personal accounts) → collect feedback in Play Console.
3. **Production, staged**: 5% → 20% → 50% → 100%. Hold each step ≥24h; halt on crash/ANR regression.
4. Roll **forward** (new build) rather than "undo": Play cannot downgrade installed users.

Targets (our defaults, tune per product): crash-free users ≥ 99.5%, ANR-free ≥ 99.7%,
Android vitals "bad behavior" thresholds not exceeded (see Play Console → Android vitals).
