#!/usr/bin/env bash
# Upload legacy inventory PNGs (001.png … 006.png) to R2 so GET /api/media/vehicles/seed/*.png
# serves bytes that match the D1 seed URLs.  Run from anywhere:
#
#   bash worker/schema/upload-seed-vehicle-images.sh
#
# Requires: wrangler CLI, Cloudflare auth, and the six files under assets/images/.
# If you already removed those files from the tree, restore them temporarily:
#   git checkout HEAD -- assets/images/001.png …
#
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WRANGLER_CWD="$(cd "$(dirname "$0")/.." && pwd)"
BUCKET="tk168-media"
for n in 001 002 003 004 005 006; do
  SRC="${ROOT}/assets/images/${n}.png"
  if [[ ! -f "$SRC" ]]; then
    echo "Missing $SRC — restore from git or copy the PNGs before uploading." >&2
    exit 1
  fi
  wrangler r2 object put "${BUCKET}/vehicles/seed/${n}.png" \
    --cwd="$WRANGLER_CWD" \
    --file="$SRC" \
    --content-type="image/png" \
    --remote
done
echo "Uploaded ${BUCKET}/vehicles/seed/001.png … 006.png"
