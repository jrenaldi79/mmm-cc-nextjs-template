#!/bin/bash
# SessionStart hook: prepare and validate the repo for an agent session.
# Installs dependencies, then runs fast, NON-BLOCKING readiness checks
# (warnings only — never fails the session).
set -euo pipefail

# Only run in Claude Code on the web (remote) sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

echo "▶ Installing dependencies (npm install)…"
npm install --no-audit --no-fund

# --- Informational readiness checks (guarded; do not block the session) ---
echo "▶ Readiness checks:"

if node scripts/generate-docs.js --check >/dev/null 2>&1; then
  echo "  ✓ CLAUDE.md auto sections current"
else
  echo "  ⚠ CLAUDE.md auto sections stale — run: node scripts/generate-docs.js"
fi

if npm run --silent type-check >/dev/null 2>&1; then
  echo "  ✓ TypeScript type-check passes"
else
  echo "  ⚠ type-check reported issues — run: npm run type-check"
fi

if npm run --silent lint >/dev/null 2>&1; then
  echo "  ✓ ESLint passes"
else
  echo "  ⚠ lint reported issues — run: npm run lint"
fi

echo "✓ Session ready."
