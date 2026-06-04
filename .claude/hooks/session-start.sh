#!/bin/bash
# SessionStart hook: prepare and validate the repo for an agent session.
#
# In Claude Code on the web the interactive `/plugin` installer is unavailable,
# so this hook provisions the Superpowers plugin's capabilities itself:
#   1. Installs dependencies (npm install).
#   2. Syncs the LATEST Superpowers skills into .claude/skills/ (gitignored —
#      fetched fresh every session so they stay current; never committed).
#   3. Reproduces Superpowers' own SessionStart hook by injecting the
#      `using-superpowers` guidance via hookSpecificOutput.additionalContext.
#   4. Runs fast, NON-BLOCKING readiness checks (warnings only).
#
# Output contract (SessionStart): progress/readiness go to STDERR (shown on
# success); STDOUT carries ONLY the final JSON additionalContext. Mixing plain
# text and JSON on stdout breaks the hook parser, so everything noisy uses log().
set -euo pipefail

# Only run in Claude Code on the web (remote) sessions. Local CLI users get
# Superpowers through the registered marketplace (.claude/settings.json) +
# `/plugin install`, so we leave their environment untouched.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Everything that is not the final JSON object must go to stderr.
log() { echo "$@" >&2; }

log "▶ Installing dependencies (npm install)…"
npm install --no-audit --no-fund >&2

# --- Sync the latest Superpowers skills (best-effort; never blocks) ----------
SP_REPO="https://github.com/obra/superpowers.git"
SKILLS_DIR="$PWD/.claude/skills"
SP_CACHE="$PWD/.claude/.cache/superpowers"

sync_superpowers() {
  mkdir -p "$(dirname "$SP_CACHE")"
  if [ -d "$SP_CACHE/.git" ]; then
    git -C "$SP_CACHE" fetch --depth 1 origin HEAD >/dev/null 2>&1 \
      && git -C "$SP_CACHE" reset --hard FETCH_HEAD >/dev/null 2>&1 || return 1
  else
    rm -rf "$SP_CACHE"
    git clone --depth 1 "$SP_REPO" "$SP_CACHE" >/dev/null 2>&1 || return 1
  fi
  [ -d "$SP_CACHE/skills" ] || return 1

  mkdir -p "$SKILLS_DIR"
  # Replace the previously-synced skills, keeping the .gitignore that marks the
  # directory as hook-managed.
  find "$SKILLS_DIR" -mindepth 1 -maxdepth 1 ! -name '.gitignore' -exec rm -rf {} + 2>/dev/null || true
  cp -R "$SP_CACHE"/skills/. "$SKILLS_DIR"/ || return 1
  # Preserve upstream attribution (Superpowers is MIT-licensed).
  [ -f "$SP_CACHE/LICENSE" ] && cp "$SP_CACHE/LICENSE" "$SKILLS_DIR/SUPERPOWERS-LICENSE" || true
  return 0
}

SP_CONTEXT=""
if sync_superpowers; then
  sp_count=$(find "$SKILLS_DIR" -maxdepth 2 -name SKILL.md 2>/dev/null | wc -l | tr -d ' ')
  log "  ✓ Superpowers skills synced ($sp_count skills → .claude/skills/)"
  sp_skill="$SKILLS_DIR/using-superpowers/SKILL.md"
  [ -f "$sp_skill" ] && SP_CONTEXT="$(cat "$sp_skill")"
else
  log "  ⚠ Superpowers skills sync skipped (offline or git unavailable)"
fi

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

log "✓ Session ready."

# --- Reproduce Superpowers' SessionStart context injection (STDOUT = JSON) ----
# The using-superpowers skill is data we just synced; we inject its content so
# the agent is primed to reach for skills, exactly like the upstream hook does.
if [ -n "$SP_CONTEXT" ]; then
  sp_preamble=$(printf '%s\n' \
    '<EXTREMELY_IMPORTANT>' \
    'You have superpowers. The Superpowers skill library is available via the Skill tool (synced into .claude/skills/). Below is the full content of your "using-superpowers" skill — your guide to finding and using skills. For every other skill, use the Skill tool. Per that skill, this repo'\''s CLAUDE.md and the user'\''s instructions always take precedence over skill guidance.' \
    '</EXTREMELY_IMPORTANT>' \
    '')
  node -e 'process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:"SessionStart",additionalContext:process.argv[1]}}))' \
    "$sp_preamble$SP_CONTEXT"
fi

exit 0
