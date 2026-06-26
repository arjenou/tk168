// Shared thumbnail-cache helpers.
//
// Resized list/card covers are cached in R2 under THUMB_CACHE_PREFIX so repeat
// (and burst) requests skip the Cloudflare Images binding, which returns 503s
// when many thumbnails are requested at once. The width list and key scheme
// live here so every caller agrees on exactly which objects exist:
//   - the media route reads/writes them when serving `?w=` requests
//   - the image-delete paths remove them so orphans don't accumulate

export const THUMB_CACHE_PREFIX = "_thumbs";

// Allowed widths for on-the-fly thumbnails. Clamping to a small set keeps the
// number of distinct Images transformations (and R2 cache objects) bounded no
// matter what width the client asks for.
export const MEDIA_THUMB_WIDTHS = [96, 160, 240, 360, 480, 640, 720, 960, 1280];

export function clampThumbWidth(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  for (const w of MEDIA_THUMB_WIDTHS) {
    if (n <= w) return w;
  }
  return MEDIA_THUMB_WIDTHS[MEDIA_THUMB_WIDTHS.length - 1];
}

export function thumbCacheKey(key, width) {
  return `${THUMB_CACHE_PREFIX}/w${width}/${key}.webp`;
}

// Remove every cached thumbnail derived from an original media key. Called when
// the original image is deleted or replaced so stale/orphan thumbs don't pile
// up as more inventory is uploaded over time. Best effort — failures are
// swallowed (a replacement always uses a brand-new key anyway, so a leftover
// thumb is never served for fresh content).
export async function deleteThumbCache(env, key) {
  if (!env?.R2 || !key) return;
  await Promise.all(
    MEDIA_THUMB_WIDTHS.map((w) => env.R2.delete(thumbCacheKey(key, w)).catch(() => null)),
  );
}
