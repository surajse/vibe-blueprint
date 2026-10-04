# Using this repo with different AI coding tools

`AGENTS.md` is the single source of truth. Everything else is a thin adapter.

| Tool                         | Reads                                                         | Notes                                                                 |
| ---------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| Cursor                       | `AGENTS.md`, `.cursor/rules/*.mdc`                            | Only `.mdc` rules load. Keep each rule < 500 lines.                   |
| Google Antigravity IDE       | `AGENTS.md` (IDE ≥ 1.20.5), `.agents/rules/`, `GEMINI.md`     | `GEMINI.md` is Antigravity-only and takes precedence over `AGENTS.md` |
| OpenAI Codex (CLI/IDE/app)   | `AGENTS.md`, Agent Skills in `.agents/skills/<name>/SKILL.md` | IDE extension (`openai.chatgpt`) works in VS Code, Cursor, Windsurf   |
| Claude Code                  | `CLAUDE.md` (imports `AGENTS.md`)                             | See root `CLAUDE.md`                                                  |
| Lovable / Bolt / Replit / v0 | Their own "custom instructions / knowledge"                   | Paste `AGENTS.md`; sync code to GitHub; repo stays canonical          |

Shared skill: `.agents/skills/vibe-task-loop/SKILL.md` encodes the one-task-one-chat loop for tools that support Agent Skills.

Tool UIs change quickly — if a path above stops working, check the tool's current docs and update this table.
