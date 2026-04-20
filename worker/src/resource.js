// Generic D1 + R2 resource helpers shared by vehicles/rentals modules.
//
// A `resource` descriptor bundles the table layout (columns, field mapping,
// JSON-encoded columns, required fields) with the companion images table so
// we can keep the admin API surface identical for both vehicle inventories
// while still having fully separate data.  The factory returned from
// `createResource(descriptor)` exposes the same set of handlers that
// `src/index.js` wired up for vehicles.

export function createResource({
  table,                 // main table name, e.g. "vehicles"
  imagesTable,           // image table name, e.g. "vehicle_images"
  imagesFk,              // fk column in image table, e.g. "vehicle_id"
  r2Prefix,              // R2 key prefix, e.g. "vehicles"
  columns,               // array of db column names
  fieldMap,              // camelCase -> snake_case map
  jsonColumns,           // Set of snake_case columns stored as JSON text
  requiredFields,        // array of camelCase required on create
  numericFields,         // array of snake_case columns coerced to integers
  notFoundCode,          // e.g. "vehicle_not_found"
  duplicateCode,         // e.g. "vehicle_id_taken"
}) {
  const reverse = Object.fromEntries(
    Object.entries(fieldMap).map(([c, s]) => [s, c]),
  );

  function rowToObject(row) {
    if (!row) return null;
    const out = {};
    for (const [snake, value] of Object.entries(row)) {
      const camel = reverse[snake] || snake;
      if (jsonColumns.has(snake) && value != null) {
        try { out[camel] = JSON.parse(value); } catch { out[camel] = value; }
      } else {
        out[camel] = value;
      }
    }
    if ("isPublished" in out) out.isPublished = Number(out.isPublished ?? 1) === 1;
    if ("displayOrder" in out) out.displayOrder = Number(out.displayOrder ?? 0);
    return out;
  }

  function normalizeInput(body = {}) {
    const out = {};
    for (const [camel, snake] of Object.entries(fieldMap)) {
      if (!(camel in body)) continue;
      let value = body[camel];
      if (value === "") value = null;
      if (snake === "is_published") {
        value = value === true || value === 1 || value === "1" ? 1 : 0;
      } else if (snake === "display_order" || (numericFields && numericFields.includes(snake))) {
        value = Number(value) || 0;
      } else if (jsonColumns.has(snake)) {
        value = value == null ? null : JSON.stringify(value);
      } else if (value != null) {
        value = String(value);
      }
      out[snake] = value;
    }
    return out;
  }

  function imageRow(row) {
    return {
      id: row.id,
      r2Key: row.r2_key,
      url: row.url,
      alt: row.alt,
      isPrimary: Number(row.is_primary) === 1,
      position: Number(row.position),
    };
  }

  async function list(env, { includeUnpublished = false } = {}) {
    const filter = includeUnpublished ? "" : "WHERE is_published = 1";
    const sql = `SELECT ${columns.join(", ")} FROM ${table}
      ${filter}
      ORDER BY display_order ASC, id ASC`;
    const { results } = await env.DB.prepare(sql).all();
    const items = (results || []).map(rowToObject);
    if (items.length === 0) return items;

    const ids = items.map((v) => v.id);
    const placeholders = ids.map(() => "?").join(",");
    const { results: imageRows } = await env.DB.prepare(
      `SELECT id, ${imagesFk} AS resource_id, r2_key, url, alt, is_primary, position
         FROM ${imagesTable} WHERE ${imagesFk} IN (${placeholders})
         ORDER BY ${imagesFk}, position ASC, id ASC`,
    ).bind(...ids).all();

    const byItem = new Map();
    for (const row of imageRows || []) {
      const key = row.resource_id;
      const arr = byItem.get(key) || [];
      arr.push(imageRow(row));
      byItem.set(key, arr);
    }
    for (const v of items) v.images = byItem.get(v.id) || [];
    return items;
  }

  async function get(env, id) {
    const row = await env.DB.prepare(
      `SELECT ${columns.join(", ")} FROM ${table} WHERE id = ?`,
    ).bind(id).first();
    if (!row) return null;
    const item = rowToObject(row);
    const { results } = await env.DB.prepare(
      `SELECT id, r2_key, url, alt, is_primary, position FROM ${imagesTable}
        WHERE ${imagesFk} = ? ORDER BY position ASC, id ASC`,
    ).bind(id).all();
    item.images = (results || []).map(imageRow);
    return item;
  }

  async function create(env, body) {
    const data = normalizeInput(body);
    for (const camel of requiredFields) {
      const snake = fieldMap[camel];
      if (!data[snake]) {
        const err = new Error(`${camel} is required`);
        err.status = 400;
        throw err;
      }
    }
    const cols = Object.keys(data);
    const ph = cols.map(() => "?").join(", ");
    const sql = `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${ph})`;
    try {
      await env.DB.prepare(sql).bind(...cols.map((c) => data[c])).run();
    } catch (err) {
      if (/UNIQUE/i.test(String(err?.message || ""))) {
        const e = new Error(duplicateCode);
        e.status = 409;
        throw e;
      }
      throw err;
    }
    return get(env, data.id);
  }

  async function update(env, id, body) {
    const data = normalizeInput(body);
    delete data.id;
    const keys = Object.keys(data);
    if (keys.length === 0) return get(env, id);
    const assignments = keys.map((k) => `${k} = ?`).join(", ");
    const sql = `UPDATE ${table} SET ${assignments}, updated_at = datetime('now') WHERE id = ?`;
    const res = await env.DB.prepare(sql).bind(...keys.map((k) => data[k]), id).run();
    if (res.meta && res.meta.changes === 0) {
      const err = new Error(notFoundCode);
      err.status = 404;
      throw err;
    }
    return get(env, id);
  }

  async function remove(env, id) {
    const { results } = await env.DB.prepare(
      `SELECT r2_key FROM ${imagesTable} WHERE ${imagesFk} = ?`,
    ).bind(id).all();
    await Promise.all(
      (results || [])
        .filter((row) => row.r2_key && !row.r2_key.startsWith("seed:"))
        .map((row) => env.R2.delete(row.r2_key).catch(() => null)),
    );
    const res = await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
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
      "image/png": "png", "image/jpeg": "jpg", "image/jpg": "jpg",
      "image/webp": "webp", "image/gif": "gif", "image/avif": "avif",
      "image/svg+xml": "svg",
    };
    return map[String(contentType || "").toLowerCase()] || "bin";
  }

  async function uploadImage(env, resourceId, file, { alt = "" } = {}) {
    const exists = await env.DB.prepare(`SELECT id FROM ${table} WHERE id = ?`)
      .bind(resourceId).first();
    if (!exists) {
      const err = new Error(notFoundCode);
      err.status = 404;
      throw err;
    }
    const ext = safeExt(file.type, file.name);
    const key = `${r2Prefix}/${resourceId}/${Date.now()}-${randomHex(4)}.${ext}`;
    await env.R2.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });
    const url = `/api/media/${key}`;
    const positionRow = await env.DB.prepare(
      `SELECT COALESCE(MAX(position), -1) + 1 AS next_pos FROM ${imagesTable} WHERE ${imagesFk} = ?`,
    ).bind(resourceId).first();
    const position = Number(positionRow?.next_pos || 0);
    const isPrimary = position === 0 ? 1 : 0;
    const result = await env.DB.prepare(
      `INSERT INTO ${imagesTable} (${imagesFk}, r2_key, url, alt, is_primary, position)
       VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
    ).bind(resourceId, key, url, alt || "", isPrimary, position).first();
    return { id: result?.id, r2Key: key, url, alt, isPrimary: isPrimary === 1, position };
  }

  async function deleteImage(env, resourceId, imageId) {
    const row = await env.DB.prepare(
      `SELECT r2_key FROM ${imagesTable} WHERE id = ? AND ${imagesFk} = ?`,
    ).bind(imageId, resourceId).first();
    if (!row) {
      const err = new Error("image_not_found");
      err.status = 404;
      throw err;
    }
    if (row.r2_key && !row.r2_key.startsWith("seed:")) {
      await env.R2.delete(row.r2_key).catch(() => null);
    }
    await env.DB.prepare(`DELETE FROM ${imagesTable} WHERE id = ?`).bind(imageId).run();
    return true;
  }

  async function reorderImages(env, resourceId, orderedIds) {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;
    const stmts = orderedIds.map((imgId, idx) =>
      env.DB.prepare(
        `UPDATE ${imagesTable} SET position = ?, is_primary = ? WHERE id = ? AND ${imagesFk} = ?`,
      ).bind(idx, idx === 0 ? 1 : 0, imgId, resourceId),
    );
    await env.DB.batch(stmts);
  }

  return { list, get, create, update, remove, uploadImage, deleteImage, reorderImages };
}
