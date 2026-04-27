// Journal (LATEST JOURNAL / 最新情報) — single cover image, trilingual text.

const JOURNAL_SELECT = `SELECT id, title_zh, title_ja, title_en,
  category_zh, category_ja, category_en,
  summary_zh, summary_ja, summary_en,
  body_zh, body_ja, body_en,
  image_r2_key, image_url, date_label, display_order, is_published,
  created_at, updated_at
  FROM journal_entries`;

export function rowToJournalObject(row) {
  if (!row) return null;
  const o = {
    id: row.id,
    titleZh: row.title_zh || "",
    titleJa: row.title_ja || "",
    titleEn: row.title_en || "",
    categoryZh: row.category_zh || "",
    categoryJa: row.category_ja || "",
    categoryEn: row.category_en || "",
    summaryZh: row.summary_zh || "",
    summaryJa: row.summary_ja || "",
    summaryEn: row.summary_en || "",
    bodyZh: row.body_zh || "",
    bodyJa: row.body_ja || "",
    bodyEn: row.body_en || "",
    imageR2Key: row.image_r2_key || null,
    imageUrl: row.image_url || null,
    dateLabel: row.date_label || "",
    displayOrder: Number(row.display_order ?? 0),
    isPublished: Number(row.is_published ?? 1) === 1,
  };
  o.images = o.imageUrl
    ? [{ id: 1, url: o.imageUrl, alt: "", isPrimary: true, position: 0 }]
    : [];
  return o;
}

export async function listJournalEntries(env, { includeUnpublished = false } = {}) {
  const filter = includeUnpublished ? "" : "WHERE is_published = 1";
  const { results } = await env.DB.prepare(
    `${JOURNAL_SELECT} ${filter} ORDER BY display_order ASC, id ASC`,
  ).all();
  return (results || []).map(rowToJournalObject);
}

export async function getJournalEntry(env, id) {
  const row = await env.DB.prepare(`${JOURNAL_SELECT} WHERE id = ?`).bind(id).first();
  return rowToJournalObject(row);
}

const CAMEL_PATCH_MAP = {
  titleZh: "title_zh",
  titleJa: "title_ja",
  titleEn: "title_en",
  categoryZh: "category_zh",
  categoryJa: "category_ja",
  categoryEn: "category_en",
  summaryZh: "summary_zh",
  summaryJa: "summary_ja",
  summaryEn: "summary_en",
  bodyZh: "body_zh",
  bodyJa: "body_ja",
  bodyEn: "body_en",
  imageR2Key: "image_r2_key",
  imageUrl: "image_url",
  dateLabel: "date_label",
  displayOrder: "display_order",
  isPublished: "is_published",
};

function normalizeStringField(val) {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  return s === "" ? null : s;
}

export async function createJournalEntry(env, body) {
  const id = String(body?.id || "").trim();
  if (!id) {
    const err = new Error("id is required");
    err.status = 400;
    throw err;
  }
  const titleZh = normalizeStringField(body?.titleZh);
  const titleJa = normalizeStringField(body?.titleJa);
  if (!titleZh && !titleJa) {
    const err = new Error("title_required");
    err.status = 400;
    throw err;
  }
  const d = {
    id,
    title_zh: titleZh,
    title_ja: titleJa,
    title_en: normalizeStringField(body?.titleEn),
    category_zh: normalizeStringField(body?.categoryZh),
    category_ja: normalizeStringField(body?.categoryJa),
    category_en: normalizeStringField(body?.categoryEn),
    summary_zh: normalizeStringField(body?.summaryZh),
    summary_ja: normalizeStringField(body?.summaryJa),
    summary_en: normalizeStringField(body?.summaryEn),
    body_zh: normalizeStringField(body?.bodyZh),
    body_ja: normalizeStringField(body?.bodyJa),
    body_en: normalizeStringField(body?.bodyEn),
    image_r2_key: normalizeStringField(body?.imageR2Key),
    image_url: normalizeStringField(body?.imageUrl),
    date_label: normalizeStringField(body?.dateLabel),
    display_order: Number.isFinite(Number(body?.displayOrder)) ? Number(body.displayOrder) : 0,
    is_published:
      body?.isPublished === false || body?.isPublished === 0 || body?.isPublished === "0" ? 0 : 1,
  };
  const cols = Object.keys(d);
  const ph = cols.map(() => "?").join(", ");
  try {
    await env.DB.prepare(
      `INSERT INTO journal_entries (${cols.join(", ")}) VALUES (${ph})`,
    )
      .bind(...cols.map((c) => d[c]))
      .run();
  } catch (err) {
    if (/UNIQUE/i.test(String(err?.message || ""))) {
      const e = new Error("journal_id_taken");
      e.status = 409;
      throw e;
    }
    throw err;
  }
  return getJournalEntry(env, id);
}

export async function updateJournalEntry(env, id, body) {
  const current = await env.DB.prepare(`${JOURNAL_SELECT} WHERE id = ?`).bind(id).first();
  if (!current) {
    const err = new Error("journal_not_found");
    err.status = 404;
    throw err;
  }
  const row = { ...rowToJournalObject(current) };
  for (const camel of Object.keys(CAMEL_PATCH_MAP)) {
    if (camel in body) {
      if (camel === "isPublished") {
        row.isPublished =
          body.isPublished === true || body.isPublished === 1 || body.isPublished === "1";
      } else if (camel === "displayOrder") {
        row.displayOrder = Number.isFinite(Number(body.displayOrder)) ? Number(body.displayOrder) : 0;
      } else {
        const v = body[camel];
        row[camel] = v === null || v === undefined ? null : v === "" ? null : String(v);
      }
    }
  }
  if (!row.titleZh?.trim() && !row.titleJa?.trim()) {
    const err = new Error("title_required");
    err.status = 400;
    throw err;
  }
  const m = {
    id: row.id,
    title_zh: row.titleZh,
    title_ja: row.titleJa,
    title_en: row.titleEn,
    category_zh: row.categoryZh,
    category_ja: row.categoryJa,
    category_en: row.categoryEn,
    summary_zh: row.summaryZh,
    summary_ja: row.summaryJa,
    summary_en: row.summaryEn,
    body_zh: row.bodyZh,
    body_ja: row.bodyJa,
    body_en: row.bodyEn,
    image_r2_key: row.imageR2Key,
    image_url: row.imageUrl,
    date_label: row.dateLabel,
    display_order: row.displayOrder,
    is_published: row.isPublished ? 1 : 0,
  };
  const keys = Object.keys(m).filter((k) => k !== "id");
  const assignments = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => m[k]);
  const sql = `UPDATE journal_entries SET ${assignments}, updated_at = datetime('now') WHERE id = ?`;
  await env.DB.prepare(sql)
    .bind(...values, id)
    .run();
  return getJournalEntry(env, id);
}

export async function deleteJournalEntry(env, id) {
  const row = await env.DB.prepare("SELECT image_r2_key FROM journal_entries WHERE id = ?")
    .bind(id)
    .first();
  if (!row) return false;
  if (row.image_r2_key && !String(row.image_r2_key).startsWith("seed:")) {
    await env.R2.delete(String(row.image_r2_key)).catch(() => null);
  }
  const res = await env.DB.prepare("DELETE FROM journal_entries WHERE id = ?").bind(id).run();
  return res.meta?.changes > 0;
}

function randomHex(n = 4) {
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  return [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeExt(contentType, filename) {
  const fromName = filename && filename.includes(".")
    ? filename.split(".").pop().toLowerCase()
    : "";
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  const map = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
  };
  return map[String(contentType || "").toLowerCase()] || "bin";
}

export async function clearJournalCover(env, journalId) {
  const row = await env.DB.prepare("SELECT image_r2_key FROM journal_entries WHERE id = ?")
    .bind(journalId)
    .first();
  if (!row) {
    const err = new Error("journal_not_found");
    err.status = 404;
    throw err;
  }
  if (row.image_r2_key && !String(row.image_r2_key).startsWith("seed:")) {
    await env.R2.delete(String(row.image_r2_key)).catch(() => null);
  }
  await env.DB.prepare(
    `UPDATE journal_entries SET image_r2_key = NULL, image_url = NULL, updated_at = datetime('now') WHERE id = ?`,
  )
    .bind(journalId)
    .run();
  return getJournalEntry(env, journalId);
}

async function insertJournalStubIfMissing(env, id) {
  const exists = await env.DB.prepare("SELECT id FROM journal_entries WHERE id = ?").bind(id).first();
  if (exists) return;
  try {
    await env.DB.prepare(
      `INSERT INTO journal_entries (id, is_published, display_order) VALUES (?, 0, 0)`,
    )
      .bind(id)
      .run();
  } catch (err) {
    if (!/UNIQUE/i.test(String(err?.message || ""))) throw err;
  }
}

export async function uploadJournalCover(env, journalId, file) {
  await insertJournalStubIfMissing(env, journalId);
  const exists = await env.DB.prepare("SELECT id, image_r2_key FROM journal_entries WHERE id = ?")
    .bind(journalId)
    .first();
  if (!exists) {
    const err = new Error("journal_not_found");
    err.status = 404;
    throw err;
  }
  if (exists.image_r2_key && !String(exists.image_r2_key).startsWith("seed:")) {
    await env.R2.delete(String(exists.image_r2_key)).catch(() => null);
  }
  const ext = safeExt(file.type, file.name);
  const key = `journal/${journalId}/${Date.now()}-${randomHex(4)}.${ext}`;
  await env.R2.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  const url = `/api/media/${key}`;
  await env.DB.prepare(
    `UPDATE journal_entries SET image_r2_key = ?, image_url = ?, updated_at = datetime('now') WHERE id = ?`,
  )
    .bind(key, url, journalId)
    .run();
  return getJournalEntry(env, journalId);
}
