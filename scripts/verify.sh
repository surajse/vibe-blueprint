#!/usr/bin/env bash
set -euo pipefail

# Preflight: wrong toolchain = confusing failures. Fail early and clearly.
want_node="$(tr -d 'v\n' < .nvmrc)"
have_node="$(node -p 'process.versions.node')"
if [ "${have_node%%.*}" != "${want_node%%.*}" ]; then
  echo "WARN: Node $have_node, repo expects major ${want_node%%.*} (.nvmrc)." >&2
fi

pnpm check:docs
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
echo "VERIFY OK"
