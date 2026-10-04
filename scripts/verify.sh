#!/usr/bin/env bash
# Thin wrapper: the real verify logic lives in verify.mjs (cross-platform).
set -euo pipefail
exec node "$(dirname "$0")/verify.mjs"
