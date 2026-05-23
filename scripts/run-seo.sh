#!/usr/bin/env bash
# Regenerate SEO artifacts without npm (same as `npm run seo`).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

find_node() {
  if command -v node >/dev/null 2>&1; then
    command -v node
    return
  fi
  for candidate in \
    /opt/homebrew/bin/node \
    /usr/local/bin/node \
    /Applications/Cursor.app/Contents/Resources/app/resources/helpers/node; do
    if [ -x "$candidate" ]; then
      echo "$candidate"
      return
    fi
  done
  echo "Node.js not found." >&2
  echo "Install Node (includes npm): brew install node" >&2
  echo "Or use Cursor's terminal where node may already be on PATH." >&2
  exit 1
}

NODE="$(find_node)"
echo "Using node: $NODE ($("$NODE" --version))"

run() {
  echo "→ $*"
  "$NODE" "$@"
}

run scripts/generate-og-image.js
run scripts/generate-sitemap.js
run scripts/generate-terms-page.js
run scripts/generate-privacy-page.js
run scripts/generate-city-pages.js
run scripts/generate-cities-index.js
run scripts/generate-compare-pages.js
run scripts/generate-relocation-guide.js
run scripts/generate-share-presets.js
run scripts/export-share-data.js
run scripts/sync-index-sections.js
run scripts/sync-static-seo.js

echo "Done. Commit any changed files if needed."
