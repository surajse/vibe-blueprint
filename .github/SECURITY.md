# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems.
Use GitHub's private reporting: **Security → Report a vulnerability** on this repository.
We aim to acknowledge within 72 hours and to ship a fix or mitigation within 30 days for confirmed issues.

## Scope

This repo is a template (prompts, rules, docs, CI). Reports are welcome for:

- CI workflows that could leak secrets or allow privilege escalation
- Prompts/rules that would cause an AI agent to commit secrets or weaken security
- Anything in `scripts/` that executes untrusted input

For the threat model of apps built from this template, see [docs/SECURITY.md](../docs/SECURITY.md).
