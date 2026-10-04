Inputs: @docs/PLAY_STORE.md @docs/PRD.md @docs/SECURITY.md @apps/mobile.
Goal: get the Android app from "works" to "live on Google Play". Do NOT guess policy;
re-check each gate in docs/PLAY_STORE.md against Google's current Play Console Help
and update the file (with date) where reality differs.

1. Confirm targetSdk >= 36, .aab build, 16 KB-compatible native libraries, permissions minimized.
2. Verify the Data safety answers against what the code and SDKs actually collect.
3. Verify account creation has in-app deletion + a web deletion link, and a privacy policy URL.
4. Produce store listing copy and a screenshot/asset checklist (no policy-violating claims).
5. Produce the closed-test plan (12+ testers, 14 continuous days if this is a personal
   account created after 2023-11-13), the staged-rollout plan, and the halt criteria.
   Output a table: gate | evidence (file/command/doc) | status. Mark anything unproven UNVERIFIED.
