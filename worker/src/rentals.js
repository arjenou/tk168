// Rental inventory CRUD.  Independent from `vehicles`: separate D1 rows,
// separate R2 prefix (`rentals/…`), and the admin treats them as distinct
// inventories.  Field set is a rental-focused subset of the vehicle schema
// with extra pricing + status columns.

import { createResource, insertInventoryStubIfMissing } from "./resource.js";

const RENTAL_COLUMNS = [
  "id", "brand_key", "name", "name_ja", "name_en", "grade", "year", "type", "icon",
  "mileage", "mileage_unit", "engine", "displacement", "cylinders",
  "forced_induction_text", "forced_induction_unit", "forced_induction_zh", "forced_induction_ja", "forced_induction_en",
  "fuel", "fuel_oil_type", "trans",
  "body_style", "drive", "body_color", "interior_color", "seats",
  "daily_rate", "deposit", "min_days", "rental_status",
  "overview_zh", "overview_ja", "overview_en",
  "benefits", "features",
  "staff_photo_r2_key", "staff_photo_url", "staff_message", "staff_phone",
  "display_order", "is_published",
];

const RENTAL_JSON_COLUMNS = new Set([
  "overview_zh", "overview_ja", "overview_en",
  "benefits", "features",
]);

const RENTAL_NUMERIC_COLUMNS = ["daily_rate", "deposit", "min_days"];

const RENTAL_FIELD_MAP = {
  id: "id",
  brandKey: "brand_key",
  name: "name",
  nameJa: "name_ja",
  nameEn: "name_en",
  grade: "grade",
  year: "year",
  type: "type",
  icon: "icon",
  mileage: "mileage",
  mileageUnit: "mileage_unit",
  engine: "engine",
  displacement: "displacement",
  cylinders: "cylinders",
  forcedInductionText: "forced_induction_text",
  forcedInductionUnit: "forced_induction_unit",
  forcedInductionZh: "forced_induction_zh",
  forcedInductionJa: "forced_induction_ja",
  forcedInductionEn: "forced_induction_en",
  fuel: "fuel",
  fuelOilType: "fuel_oil_type",
  trans: "trans",
  bodyStyle: "body_style",
  drive: "drive",
  bodyColor: "body_color",
  interiorColor: "interior_color",
  seats: "seats",
  dailyRate: "daily_rate",
  deposit: "deposit",
  minDays: "min_days",
  rentalStatus: "rental_status",
  overviewZh: "overview_zh",
  overviewJa: "overview_ja",
  overviewEn: "overview_en",
  benefits: "benefits",
  features: "features",
  staffPhotoR2Key: "staff_photo_r2_key",
  staffPhotoUrl: "staff_photo_url",
  staffMessage: "staff_message",
  staffPhone: "staff_phone",
  displayOrder: "display_order",
  isPublished: "is_published",
};

const rentalResource = createResource({
  table: "rentals",
  imagesTable: "rental_images",
  imagesFk: "rental_id",
  r2Prefix: "rentals",
  columns: RENTAL_COLUMNS,
  fieldMap: RENTAL_FIELD_MAP,
  jsonColumns: RENTAL_JSON_COLUMNS,
  numericFields: RENTAL_NUMERIC_COLUMNS,
  requiredFields: ["id", "brandKey", "name"],
  notFoundCode: "rental_not_found",
  duplicateCode: "rental_id_taken",
  stubBeforeUpload: true,
});

/** 与 `vehicles` 相同：`forced_induction_text` 与 `forced_induction_zh` 同步写入。 */
function coerceForcedInductionFieldsForWrite(body) {
  if (!body || typeof body !== "object") return body;
  const hasText = Object.prototype.hasOwnProperty.call(body, "forcedInductionText");
  const hasZh = Object.prototype.hasOwnProperty.call(body, "forcedInductionZh");
  if (!hasText && !hasZh) return body;
  const rawT = hasText ? body.forcedInductionText : null;
  const rawZ = hasZh ? body.forcedInductionZh : null;
  const t =
    rawT != null && String(rawT).trim() !== ""
      ? String(rawT).trim()
      : rawZ != null && String(rawZ).trim() !== ""
        ? String(rawZ).trim()
        : "";
  return { ...body, forcedInductionText: t, forcedInductionZh: t };
}

export const listRentals = rentalResource.list;
export const getRental = rentalResource.get;
export async function createRental(env, body) {
  return rentalResource.create(env, coerceForcedInductionFieldsForWrite(body));
}
export async function updateRental(env, id, body) {
  return rentalResource.update(env, id, coerceForcedInductionFieldsForWrite(body));
}
export const uploadRentalImage = rentalResource.uploadImage;
export const deleteRentalImage = rentalResource.deleteImage;
export const reorderRentalImages = rentalResource.reorderImages;

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

/** 租赁车辆员工照片，R2 前缀为 `rentals/…` */
export async function uploadRentalStaffPhoto(env, rentalId, file) {
  await insertInventoryStubIfMissing(env, "rentals", rentalId);
  const exists = await env.DB.prepare("SELECT id, staff_photo_r2_key FROM rentals WHERE id = ?")
    .bind(rentalId)
    .first();
  if (!exists) {
    const err = new Error("rental_not_found");
    err.status = 404;
    throw err;
  }
  if (exists.staff_photo_r2_key && !String(exists.staff_photo_r2_key).startsWith("seed:")) {
    await env.R2.delete(String(exists.staff_photo_r2_key)).catch(() => null);
  }
  const ext = safeExt(file.type, file.name);
  const key = `rentals/${rentalId}/staff-${Date.now()}-${randomHex(4)}.${ext}`;
  await env.R2.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  const url = `/api/media/${key}`;
  await env.DB.prepare(
    `UPDATE rentals SET staff_photo_r2_key = ?, staff_photo_url = ?, updated_at = datetime('now') WHERE id = ?`,
  )
    .bind(key, url, rentalId)
    .run();
  return getRental(env, rentalId);
}

export async function clearRentalStaffPhoto(env, rentalId) {
  const row = await env.DB.prepare("SELECT staff_photo_r2_key FROM rentals WHERE id = ?")
    .bind(rentalId)
    .first();
  if (!row) {
    const err = new Error("rental_not_found");
    err.status = 404;
    throw err;
  }
  if (row.staff_photo_r2_key && !String(row.staff_photo_r2_key).startsWith("seed:")) {
    await env.R2.delete(String(row.staff_photo_r2_key)).catch(() => null);
  }
  await env.DB.prepare(
    `UPDATE rentals SET staff_photo_r2_key = NULL, staff_photo_url = NULL, updated_at = datetime('now') WHERE id = ?`,
  )
    .bind(rentalId)
    .run();
  return getRental(env, rentalId);
}

export async function deleteRental(env, id) {
  const row = await env.DB.prepare("SELECT staff_photo_r2_key FROM rentals WHERE id = ?")
    .bind(id)
    .first();
  if (row?.staff_photo_r2_key && !String(row.staff_photo_r2_key).startsWith("seed:")) {
    await env.R2.delete(String(row.staff_photo_r2_key)).catch(() => null);
  }
  return rentalResource.remove(env, id);
}
