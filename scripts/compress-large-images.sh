#!/usr/bin/env bash
# Compress large raster assets in-place (JPEG/WebP/PNG). Requires: sips, cwebp, pngquant.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MAX_EDGE="${MAX_EDGE:-2200}"
JPEG_QUALITY="${JPEG_QUALITY:-78}"
WEBP_QUALITY="${WEBP_QUALITY:-82}"
PNG_QUALITY="${PNG_QUALITY:-70-85}"
# Default 200 KiB — skips already-small about/regions JPGs (~160–200 KiB).
MIN_BYTES="${MIN_BYTES:-200000}"

compress_jpeg() {
  local f="$1" tmp="${f}.tmp.$$"
  local w h maxd
  w="$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/ {print $2}')"
  h="$(sips -g pixelHeight "$f" 2>/dev/null | awk '/pixelHeight/ {print $2}')"
  maxd="$w"
  [[ -n "$h" && "$h" -gt "$maxd" ]] && maxd="$h"
  # macOS `sips -Z` upscales images smaller than the limit — only downscale when needed.
  if [[ -n "$maxd" && "$maxd" -gt "$MAX_EDGE" ]]; then
    sips -Z "$MAX_EDGE" "$f" --out "$tmp" >/dev/null
  else
    cp "$f" "$tmp"
  fi
  sips -s format jpeg -s formatOptions "$JPEG_QUALITY" "$tmp" --out "$tmp" >/dev/null
  mv "$tmp" "$f"
}

compress_webp() {
  local f="$1" tmp="${f}.tmp.$$"
  # sips cannot write WebP; re-encode with cwebp (optionally downscale via dwebp→sips if needed).
  cwebp -q "$WEBP_QUALITY" -m 6 -af "$f" -o "$tmp" 2>/dev/null
  mv "$tmp" "$f"
}

compress_png() {
  local f="$1" tmp="${f}.tmp.$$" pq="${f}.pq.$$"
  local w h maxd
  w="$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/ {print $2}')"
  h="$(sips -g pixelHeight "$f" 2>/dev/null | awk '/pixelHeight/ {print $2}')"
  maxd="$w"
  [[ -n "$h" && "$h" -gt "$maxd" ]] && maxd="$h"
  if [[ -n "$maxd" && "$maxd" -gt "$MAX_EDGE" ]]; then
    sips -Z "$MAX_EDGE" "$f" --out "$tmp" >/dev/null
  else
    cp "$f" "$tmp"
  fi
  if pngquant --quality="$PNG_QUALITY" --speed 1 --strip --force --output "$pq" "$tmp" 2>/dev/null; then
    mv "$pq" "$f"
    rm -f "$tmp"
  else
    mv "$tmp" "$f"
  fi
}

cd "$ROOT"
# BSD find: -size +Nc = larger than N bytes
while IFS= read -r -d '' f; do
  sz=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null)
  ext="${f##*.}"
  ext_lc=$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')
  echo "Compressing ($sz B) -> $f"
  case "$ext_lc" in
    jpg|jpeg) compress_jpeg "$f" ;;
    webp) compress_webp "$f" ;;
    png) compress_png "$f" ;;
    *) echo "  skip unknown .$ext_lc" ;;
  esac
  newsz=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null)
  echo "  -> $newsz B"
done < <(find "$ROOT/assets" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' -o -iname '*.png' \) -size "+${MIN_BYTES}c" -print0)

echo "Done."
