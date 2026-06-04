#!/usr/bin/env bash
# Vendor the latest Superpowers skills (github.com/obra/superpowers) into
# .claude/skills/. Run by the update-superpowers-skills GitHub workflow, and
# usable locally to refresh on demand:  bash scripts/sync-superpowers-skills.sh
#
# The vendored skill directories are tracked in
# .claude/skills/.vendored-from-superpowers, so re-running only replaces
# Superpowers' own skills and never clobbers first-party skills you may add to
# .claude/skills/ later.
set -euo pipefail

REPO="${SUPERPOWERS_REPO:-https://github.com/obra/superpowers.git}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_DIR="$ROOT/.claude/skills"
MANIFEST="$SKILLS_DIR/.vendored-from-superpowers"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Cloning $REPO (shallow)…"
git clone --depth 1 "$REPO" "$TMP/superpowers" >/dev/null 2>&1
[ -d "$TMP/superpowers/skills" ] || {
  echo "error: upstream has no skills/ directory" >&2
  exit 1
}

mkdir -p "$SKILLS_DIR"

# Remove previously-vendored skill dirs (from the manifest), leaving first-party
# skills, the manifest, and the license file untouched.
if [ -f "$MANIFEST" ]; then
  while IFS= read -r name; do
    [ -n "$name" ] && rm -rf "${SKILLS_DIR:?}/$name"
  done <"$MANIFEST"
fi

# Copy each upstream skill to the top level and rebuild the manifest.
: >"$MANIFEST"
for dir in "$TMP"/superpowers/skills/*/; do
  name="$(basename "$dir")"
  rm -rf "${SKILLS_DIR:?}/$name"
  cp -R "$dir" "$SKILLS_DIR/$name"
  echo "$name" >>"$MANIFEST"
done
sort -o "$MANIFEST" "$MANIFEST"

# Preserve upstream attribution (Superpowers is MIT-licensed).
cp "$TMP/superpowers/LICENSE" "$SKILLS_DIR/SUPERPOWERS-LICENSE"

echo "Vendored $(wc -l <"$MANIFEST" | tr -d ' ') Superpowers skills into .claude/skills/."
