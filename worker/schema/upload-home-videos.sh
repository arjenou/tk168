#!/usr/bin/env bash
# Upload homepage MP4s to R2 (keys match home.html data-src paths).
# Run from repo root:
#   bash worker/schema/upload-home-videos.sh
#
# Expects:
#   assets/videos/intro-logo-trimmed.mp4
#   assets/videos/hero-main-web540.mp4
# 可选（移动端更小体积；需在 index 上为对应 <video> 加 data-src-mobile 指向 R2 路径后上传）:
#   assets/videos/intro-logo-mobile.mp4   → /api/media/videos/seed/intro-logo-mobile.mp4
#   assets/videos/hero-main-web360.mp4  → /api/media/videos/seed/hero-main-web360.mp4
# If missing (e.g. after removing binaries from git), restore with:
#   git checkout HEAD -- assets/videos/intro-logo-trimmed.mp4 assets/videos/hero-main-web540.mp4
#
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WRANGLER_CWD="$(cd "$(dirname "$0")/.." && pwd)"
BUCKET="tk168-media"
put() {
  local key="$1" file="$2"
  wrangler r2 object put "${BUCKET}/${key}" \
    --cwd="$WRANGLER_CWD" \
    --file="$file" \
    --content-type="video/mp4" \
    --remote
}
put "videos/seed/intro-logo-trimmed.mp4" "${ROOT}/assets/videos/intro-logo-trimmed.mp4"
put "videos/seed/hero-main-web540.mp4" "${ROOT}/assets/videos/hero-main-web540.mp4"
if [[ -f "${ROOT}/assets/videos/intro-logo-mobile.mp4" ]]; then
  put "videos/seed/intro-logo-mobile.mp4" "${ROOT}/assets/videos/intro-logo-mobile.mp4"
  echo "Also uploaded intro-logo-mobile.mp4 (set data-src-mobile on #intro-video)"
fi
if [[ -f "${ROOT}/assets/videos/hero-main-web360.mp4" ]]; then
  put "videos/seed/hero-main-web360.mp4" "${ROOT}/assets/videos/hero-main-web360.mp4"
  echo "Also uploaded hero-main-web360.mp4 (set data-src-mobile on #hero-video)"
fi
echo "Uploaded ${BUCKET}/videos/seed/*.mp4"
