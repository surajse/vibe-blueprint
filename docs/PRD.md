# PRD — <Product name>

Version: 0.1 Owner: <name> Status: draft | approved Last updated: <date>

## 1. Overview

- Problem statement (who suffers, how, how often):
- Vision (one sentence):
- Why now:

## 2. Target users & personas

| Persona | Description | Top need | Platform |
| ------- | ----------- | -------- | -------- |

## 3. Goals, non-goals, success metrics

- Goals (measurable):
- Non-goals (explicitly NOT doing):
- Success metrics (KPI, baseline, target, date):

## 4. User stories (each with ID)

- US-001: As a <persona>, I want <action>, so that <outcome>.

## 5. Functional requirements

| ID     | Requirement | Priority (P0/P1/P2) | Acceptance criteria (Given/When/Then) |
| ------ | ----------- | ------------------- | ------------------------------------- |
| FR-001 |             | P0                  | Given… When… Then…                    |

## 6. Non-functional requirements

- Performance (e.g. LCP, API p95):
- Availability / reliability:
- Security & privacy (PII, data retention, GDPR/DPDP as applicable):
- Accessibility (WCAG level):
- Localization:
- Offline behavior (mobile):
- Browser/device support (min Android version, browsers):

## 7. Screens / routes

| Screen | Platform | Purpose | States (loading/empty/error) |
| ------ | -------- | ------- | ---------------------------- |

## 8. Data entities (business view)

| Entity | Key fields | Owner | Retention |
| ------ | ---------- | ----- | --------- |

## 9. Integrations

| Service | Purpose | Failure behavior |
| ------- | ------- | ---------------- |

## 10. Monetization & pricing (if any)

## 11. Milestones

| Milestone            | Scope (FR IDs) | Exit criteria | Target date |
| -------------------- | -------------- | ------------- | ----------- |
| M1 Foundation + Auth |                |               |             |
| M2 Core feature      |                |               |             |
| M3 Hardening + Beta  |                |               |             |
| M4 Launch            |                |               |             |

## 12. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |

## 13. Assumptions

## 14. Open questions (never silently decided)

## 15. Definition of Done (product level)

- All P0 FRs pass acceptance tests (automated where possible)
- `pnpm verify` + e2e green; CodeQL/gitleaks clean
- Security checklist complete; RLS tests green
- Monitoring + alerts live; rollback tested
- Docs updated (README, PROGRESS, CHANGELOG)

## 16. Traceability (filled in P2)

| FR ID | Screen | Endpoint | Table | Test |
| ----- | ------ | -------- | ----- | ---- |
