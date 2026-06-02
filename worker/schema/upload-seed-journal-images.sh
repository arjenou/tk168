#!/usr/bin/env bash
# Upload LATEST JOURNAL seed cover images to R2 so GET /api/media/journal/seed/*.webp
# serves bytes that match the D1 seed URLs in seed-journal-from-frontend.sql.
#
#   bash worker/schema/upload-seed-journal-images.sh
#
# Requires: wrangler CLI + Cloudflare auth. Source images live alongside this
# script in seed-media/journal/ (committed). After uploading, apply the D1 rows:
#   wrangler d1 execute tk168 --remote --file=schema/seed-journal-from-frontend.sql
set -euo pipefail
WRANGLER_CWD="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$(cd "$(dirname "$0")/seed-media/journal" && pwd)"
BUCKET="tk168-media"
for n in nseed001 nseed002 nseed003; do
  SRC="${SRC_DIR}/${n}.webp"
  if [[ ! -f "$SRC" ]]; then
    echo "Missing $SRC" >&2
    exit 1
  fi
  wrangler r2 object put "${BUCKET}/journal/seed/${n}.webp" \
    --cwd="$WRANGLER_CWD" \
    --file="$SRC" \
    --content-type="image/webp" \
    --remote
done
echo "Uploaded ${BUCKET}/journal/seed/nseed001.webp … nseed003.webp"
