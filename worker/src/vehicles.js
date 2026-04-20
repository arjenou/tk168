// Vehicle + image CRUD built on D1 + R2.
// Column naming convention: snake_case in DB, camelCase in JSON payloads.

const VEHICLE_COLUMNS = [
  "id",
  "brand_key",
  "name",
  "year",
  "type",
  "icon",
  "mileage",
  "engine",
  "fuel",
  "trans",
  "total_price",
  "base_price",
  "body_style",
  "drive",
  "body_color",
  "interior_color",
  "seats",
  "service_record",
  "origin",
  "overview_zh",
  "overview_ja",
  "overview_en",
  "benefits",
  "features",
  "cond_non_smoking",
  "cond_authorized_import",
  "cond_dealer_warranty",
  "cond_eco_tax_eligible",
  "cond_one_owner",
  "cond_rental_up",
  "listing_repair_history",
  "listing_vehicle_inspection",
  "listing_legal_maintenance",
  "listing_periodic_book",
  "highlight_steering",
  "highlight_chassis_tail",
  "display_order",
  "is_published",
];

const JSON_COLUMNS = new Set([
  "overview_zh",
  "overview_ja",
  "overview_en",
  "benefits",
  "features",
  "cond_non_smoking",
  "cond_authorized_import",
  "cond_dealer_warranty",
  "cond_eco_tax_eligible",
  "cond_one_owner",
  "cond_rental_up",
  "listing_repair_history",
  "listing_vehicle_inspection",
  "listing_legal_maintenance",
  "listing_periodic_book",
  "highlight_steering",
  "highlight_chassis_tail",
]);

// Mapping between DB snake_case and API camelCase.  Keys the admin sends.
const FIELD_MAP = {
  id: "id",
  brandKey: "brand_key",
  name: "name",
  year: "year",
  type: "type",
  icon: "icon",
  mileage: "mileage",
  engine: "engine",
  fuel: "fuel",
  trans: "trans",
  totalPrice: "total_price",
  basePrice: "base_price",
  bodyStyle: "body_style",
  drive: "drive",
  bodyColor: "body_color",
  interiorColor: "interior_color",
  seats: "seats",
  serviceRecord: "service_record",
  origin: "origin",
  overviewZh: "overview_zh",
  overviewJa: "overview_ja",
  overviewEn: "overview_en",
  benefits: "benefits",
  features: "features",
  condNonSmoking: "cond_non_smoking",
  condAuthorizedImport: "cond_authorized_import",
  condDealerWarranty: "cond_dealer_warranty",
  condEcoTaxEligible: "cond_eco_tax_eligible",
  condOneOwner: "cond_one_owner",
  condRentalUp: "cond_rental_up",
  listingRepairHistory: "listing_repair_history",
  listingVehicleInspection: "listing_vehicle_inspection",
  listingLegalMaintenance: "listing_legal_maintenance",
  listingPeriodicBook: "listing_periodic_book",
  highlightSteering: "highlight_steering",
  highlightChassisTail: "highlight_chassis_tail",
  displayOrder: "display_order",
  isPublished: "is_published",
};

const REVERSE_FIELD_MAP = Object.fromEntries(
  Object.entries(FIELD_MAP).map(([camel, snake]) => [snake, camel]),
);

function rowToVehicle(row) {
  if (!row) return null;
  const out = {};
  for (const [snake, value] of Object.entries(row)) {
    const camel = REVERSE_FIELD_MAP[snake] || snake;
    if (JSON_COLUMNS.has(snake) && value != null) {
      try {
        out[camel] = JSON.parse(value);
      } catch {
        out[camel] = value;
      }
    } else {
      out[camel] = value;
    }
  }
  out.isPublished = Number(out.isPublished ?? 1) === 1;
  out.displayOrder = Number(out.displayOrder ?? 0);
  return out;
}

function normalizeInput(body = {}) {
  const out = {};
  for (const [camel, snake] of Object.entries(FIELD_MAP)) {
    if (!(camel in body)) continue;
    let value = body[camel];
    if (value === "") value = null;
    if (snake === "is_published") {
      value = value === true || value === 1 || value === "1" ? 1 : 0;
    } else if (snake === "display_order") {
      value = Number(value) || 0;
    } else if (JSON_COLUMNS.has(snake)) {
      value = value == null ? null : JSON.stringify(value);
    } else if (value != null) {
      value = String(value);
    }
    out[snake] = value;
  }
  return out;
}

export async function listVehicles(env, { includeUnpublished = false } = {}) {
  const sql = `SELECT ${VEHICLE_COLUMNS.join(", ")} FROM vehicles
    ${includeUnpublished ? "" : "WHERE is_published = 1"}
    ORDER BY display_order ASC, id ASC`;
  const { results } = await env.DB.prepare(sql).all();
  const vehicles = (results || []).map(rowToVehicle);
  if (vehicles.length === 0) return vehicles;

  const ids = vehicles.map((v) => v.id);
  const placeholders = ids.map(() => "?").join(",");
  const { results: imageRows } = await env.DB.prepare(
    `SELECT id, vehicle_id, r2_key, url, alt, is_primary, position
       FROM vehicle_images WHERE vehicle_id IN (${placeholders})
       ORDER BY vehicle_id, position ASC, id ASC`,
  )
    .bind(...ids)
    .all();

  const byVehicle = new Map();
  for (const row of imageRows || []) {
    const list = byVehicle.get(row.vehicle_id) || [];
    list.push({
      id: row.id,
      r2Key: row.r2_key,
      url: row.url,
      alt: row.alt,
      isPrimary: Number(row.is_primary) === 1,
      position: Number(row.position),
    });
    byVehicle.set(row.vehicle_id, list);
  }
  for (const v of vehicles) {
    v.images = byVehicle.get(v.id) || [];
  }
  return vehicles;
}

export async function getVehicle(env, id) {
  const row = await env.DB.prepare(
    `SELECT ${VEHICLE_COLUMNS.join(", ")} FROM vehicles WHERE id = ?`,
  )
    .bind(id)
    .first();
  if (!row) return null;
  const vehicle = rowToVehicle(row);
  const { results: imageRows } = await env.DB.prepare(
    `SELECT id, r2_key, url, alt, is_primary, position FROM vehicle_images
      WHERE vehicle_id = ? ORDER BY position ASC, id ASC`,
  )
    .bind(id)
    .all();
  vehicle.images = (imageRows || []).map((row) => ({
    id: row.id,
    r2Key: row.r2_key,
    url: row.url,
    alt: row.alt,
    isPrimary: Number(row.is_primary) === 1,
    position: Number(row.position),
  }));
  return vehicle;
}

export async function createVehicle(env, body) {
  const data = normalizeInput(body);
  if (!data.id || !data.brand_key || !data.name) {
    const err = new Error("id, brandKey and name are required");
    err.status = 400;
    throw err;
  }
  const columns = Object.keys(data);
  const placeholders = columns.map(() => "?").join(", ");
  const sql = `INSERT INTO vehicles (${columns.join(", ")}) VALUES (${placeholders})`;
  try {
    await env.DB.prepare(sql)
      .bind(...columns.map((c) => data[c]))
      .run();
  } catch (err) {
    if (/UNIQUE/i.test(String(err?.message || ""))) {
      const e = new Error("vehicle_id_taken");
      e.status = 409;
      throw e;
    }
    throw err;
  }
  return getVehicle(env, data.id);
}

export async function updateVehicle(env, id, body) {
  const data = normalizeInput(body);
  delete data.id; // id must not change through update
  const keys = Object.keys(data);
  if (keys.length === 0) return getVehicle(env, id);
  const assignments = keys.map((k) => `${k} = ?`).join(", ");
  const sql = `UPDATE vehicles SET ${assignments}, updated_at = datetime('now') WHERE id = ?`;
  const stmt = env.DB.prepare(sql).bind(...keys.map((k) => data[k]), id);
  const res = await stmt.run();
  if (res.meta && res.meta.changes === 0) {
    const err = new Error("vehicle_not_found");
    err.status = 404;
    throw err;
  }
  return getVehicle(env, id);
}

export async function deleteVehicle(env, id) {
  // First remove R2 objects.
  const { results } = await env.DB.prepare(
    "SELECT r2_key FROM vehicle_images WHERE vehicle_id = ?",
  )
    .bind(id)
    .all();
  await Promise.all(
    (results || [])
      .filter((row) => row.r2_key && !row.r2_key.startsWith("seed:"))
      .map((row) => env.R2.delete(row.r2_key).catch(() => null)),
  );
  const res = await env.DB.prepare("DELETE FROM vehicles WHERE id = ?").bind(id).run();
  return res.meta?.changes > 0;
}

// ---------- Images ----------

function randomHex(bytes = 8) {
  const buf = new Uint8Array(bytes);
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

export async function uploadVehicleImage(env, vehicleId, file, { alt = "" } = {}) {
  const exists = await env.DB.prepare("SELECT id FROM vehicles WHERE id = ?")
    .bind(vehicleId)
    .first();
  if (!exists) {
    const err = new Error("vehicle_not_found");
    err.status = 404;
    throw err;
  }
  const ext = safeExt(file.type, file.name);
  const key = `vehicles/${vehicleId}/${Date.now()}-${randomHex(4)}.${ext}`;

  await env.R2.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });

  const url = `/api/media/${key}`;
  const positionRow = await env.DB.prepare(
    "SELECT COALESCE(MAX(position), -1) + 1 AS next_pos FROM vehicle_images WHERE vehicle_id = ?",
  )
    .bind(vehicleId)
    .first();
  const position = Number(positionRow?.next_pos || 0);
  const isPrimary = position === 0 ? 1 : 0;
  const result = await env.DB.prepare(
    `INSERT INTO vehicle_images (vehicle_id, r2_key, url, alt, is_primary, position)
     VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
  )
    .bind(vehicleId, key, url, alt || "", isPrimary, position)
    .first();

  return {
    id: result?.id,
    r2Key: key,
    url,
    alt,
    isPrimary: isPrimary === 1,
    position,
  };
}

export async function deleteVehicleImage(env, vehicleId, imageId) {
  const row = await env.DB.prepare(
    "SELECT r2_key FROM vehicle_images WHERE id = ? AND vehicle_id = ?",
  )
    .bind(imageId, vehicleId)
    .first();
  if (!row) {
    const err = new Error("image_not_found");
    err.status = 404;
    throw err;
  }
  if (row.r2_key && !row.r2_key.startsWith("seed:")) {
    await env.R2.delete(row.r2_key).catch(() => null);
  }
  await env.DB.prepare("DELETE FROM vehicle_images WHERE id = ?").bind(imageId).run();
  return true;
}

export async function reorderVehicleImages(env, vehicleId, orderedIds) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;
  const stmts = orderedIds.map((imageId, idx) =>
    env.DB.prepare(
      "UPDATE vehicle_images SET position = ?, is_primary = ? WHERE id = ? AND vehicle_id = ?",
    ).bind(idx, idx === 0 ? 1 : 0, imageId, vehicleId),
  );
  await env.DB.batch(stmts);
}
