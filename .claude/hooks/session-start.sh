#!/bin/bash
# SessionStart hook: prepare and validate the repo for an agent session.
#
# Superpowers skills are vendored into .claude/skills/ (committed to the repo and
# refreshed by the update-superpowers-skills GitHub Action), so they are
# auto-discovered in every session — web and local — with NO plugin install and
# NO runtime fetch. This hook additionally reproduces Superpowers' own
# SessionStart behavior by injecting the `using-superpowers` guidance into
# context, read from the LOCAL committed file (no network, no clone).
#
# Output contract (SessionStart): progress/readiness go to STDERR (shown on
# success); STDOUT carries ONLY the final JSON additionalContext. Mixing plain
# text and JSON on stdout breaks the hook parser, so all noise uses log().
set -euo pipefail

# Only run in Claude Code on the web (remote) sessions. The dependency install is
# for the ephemeral web container; local CLI users manage their own env and still
# get the vendored skills via normal skill discovery.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Everything that is not the final JSON object must go to stderr.
log() { echo "$@" >&2; }

log "▶ Installing dependencies (npm install)…"
npm install --no-audit --no-fund >&2

# --- Informational readiness checks (guarded; do not block the session) ------
log "▶ Readiness checks:"

if node scripts/generate-docs.js --check >/dev/null 2>&1; then
  log "  ✓ CLAUDE.md auto sections current"
else
  log "  ⚠ CLAUDE.md auto sections stale — run: node scripts/generate-docs.js"
fi

if npm run --silent type-check >/dev/null 2>&1; then
  log "  ✓ TypeScript type-check passes"
else
  log "  ⚠ type-check reported issues — run: npm run type-check"
fi

if npm run --silent lint >/dev/null 2>&1; then
  log "  ✓ ESLint passes"
else
  log "  ⚠ lint reported issues — run: npm run lint"
fi

sp_count=$(find .claude/skills -maxdepth 2 -name SKILL.md 2>/dev/null | wc -l | tr -d ' ')
log "  ✓ Superpowers skills vendored ($sp_count in .claude/skills/)"
log "✓ Session ready."

# --- Inject the using-superpowers guidance from the LOCAL committed file ------
# Reproduces Superpowers' SessionStart context injection without any network or
# clone — the skill is already on disk (vendored). STDOUT here is JSON only.
sp_skill=".claude/skills/using-superpowers/SKILL.md"
if [ -f "$sp_skill" ]; then
  sp_preamble=$(printf '%s\n' \
    '<EXTREMELY_IMPORTANT>' \
    'You have superpowers. The Superpowers skill library is available via the Skill tool (vendored in .claude/skills/). Below is the full content of your "using-superpowers" skill — your guide to finding and using skills. For every other skill, use the Skill tool. Per that skill, this repo'\''s CLAUDE.md and the user'\''s instructions always take precedence over skill guidance.' \
    '</EXTREMELY_IMPORTANT>' \
    '')
  node -e 'const fs=require("fs");const c=process.argv[1]+fs.readFileSync(process.argv[2],"utf8");process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:"SessionStart",additionalContext:c}}))' \
    "$sp_preamble" "$sp_skill"
fi

exit 0
