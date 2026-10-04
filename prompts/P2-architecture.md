Inputs: @docs/PRD.md @docs/TECH_STACK.md @docs/ARCHITECTURE.md.
Produce: ARCHITECTURE.md (adapted to this product), DATA_MODEL.md (tables, columns,
types, relations, RLS policy per table), API_CONTRACT.md (every endpoint:
method, path, auth, request/response Zod-style schema, error codes),
DESIGN_SYSTEM.md (tokens, components, states), SECURITY.md (threat model).
Rules: use the stack in TECH_STACK.md. Any deviation needs an ADR with options and
trade-offs. Every PRD requirement must map to at least one table/endpoint/screen:
output a traceability table (FR-ID -> screen -> endpoint -> table). No code.
