# P2b — UX wireframes (no code)

Inputs: @docs/PRD.md @docs/DESIGN_SYSTEM.md @docs/ARCHITECTURE.md @docs/UX.md (template).
Do NOT write app code. Fill docs/UX.md completely:

1. Screen inventory: every screen/route from the PRD with an ID (SC-001...),
   platform (web / Android), and linked FR-/US- IDs.
2. Navigation map as a Mermaid flowchart (mobile: tabs + stacks; web: routes).
3. For every P0 user journey: a Mermaid flowchart of screens including error,
   empty and offline branches.
4. Low-fi wireframe per screen in ASCII (mobile max 40 columns): layout,
   components (only from DESIGN_SYSTEM), primary action, and the 4 states:
   loading / empty / error / offline.
5. Copy table: every user-facing string (key, English text). No lorem ipsum.
6. Accessibility notes per screen: touch targets >= 48dp, contrast, screen-reader
   labels, focus order.
7. Android specifics: system back behavior, edge-to-edge / safe areas, keyboard
   handling, permission rationale screens, 360dp-wide small-screen check.
8. Traceability table: SC-ID -> FR-ID. Every P0 FR must appear on at least one screen.

Rules: no visual decisions beyond DESIGN_SYSTEM tokens. List open questions.
Challenge any PRD gap that blocks a screen. Wait for my approval before P3.

Human step (optional): wireframes ko Figma/Stitch/v0 jaise tool me hi-fi banao, links `docs/UX.md` me rakho. Hi-fi flows tabhi badle jab PRD update ho.
