# API contract

> Filled in P2. Base path: `/api/v1`. Every endpoint validates input with
> Zod at the boundary and returns the standard envelope from
> docs/ARCHITECTURE.md.

## Conventions

- Success: `{ "data": ..., "meta": { ... } }`
- Error: `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }`
- Auth: session verified server-side; `userId` derived from the session, never trusted from the client.
- Pagination: cursor-based `?limit=20&cursor=...`
- Idempotency: `Idempotency-Key` header on POSTs with side effects.

## Endpoints

### `<METHOD> <path>`

- **Auth:** required | optional | none
- **Rate limit:** ...
- **Request** (Zod schema):
  ```ts
  // packages/shared schema name
  ```
- **Responses:**
  - `200` — shape
  - `400` — `VALIDATION_ERROR`
  - `401` — unauthenticated
  - `403` — forbidden
  - `404` — not found
  - `429` — rate limited
- **Errors:** codes used

## Traceability

Every endpoint maps to ≥1 FR ID (see docs/PRD.md §16).
