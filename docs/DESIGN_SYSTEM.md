# Design system

> Filled in P2. Tokens first, components second. Every screen in docs/PRD.md §7
> must define its loading / empty / error states.

## Tokens

- **Colors:** `--background`, `--foreground`, `--primary`, `--muted`, `--destructive`, ...
- **Typography:** font family, scale (xs–4xl), weights, line heights
- **Spacing:** 4px base scale
- **Radii / shadows / borders**

## Components

| Component | Source    | States covered             |
| --------- | --------- | -------------------------- |
| Button    | shadcn/ui | default, loading, disabled |
| ...       | ...       | loading, empty, error      |

Rules:

- Server Components by default; `"use client"` only when needed.
- Forms: React Hook Form + Zod schema from `packages/shared`.
- Semantic HTML, labels, focus states (see `.cursor/rules/020-web-nextjs.mdc`).
- No `dangerouslySetInnerHTML` without sanitization.

## Accessibility baseline

- Contrast ratios, keyboard navigation, focus visible, screen-reader labels.
- Verified in P7 hardening (see docs/TESTING.md).
