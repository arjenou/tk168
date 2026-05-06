// Vehicles (on-sale inventory) CRUD, built on the shared resource factory.
// Each vehicle is backed by rows in `vehicles` + `vehicle_images` and R2
// objects under the `vehicles/` prefix.

import { createResource, insertInventoryStubIfMissing } from "./resource.js";

const VEHICLE_COLUMNS = [
  "id", "brand_key", "name", "name_ja", "name_en", "year", "type", "icon",
  "mileage", "engine", "displacement", "cylinders", "fuel", "trans",
  "total_price", "base_price",
  "body_style", "drive", "body_color", "interior_color", "seats",
  "service_record", "origin",
  "overview_zh", "overview_ja", "overview_en",
  "benefits", "features",
  "cond_dealer_warranty",
  "cond_one_owner",
  "listing_repair_history", "listing_vehicle_inspection",
  "listing_legal_maintenance", "listing_fuel_grade",
  "highlight_steering", "highlight_chassis_tail",
  "staff_photo_r2_key", "staff_photo_url", "staff_message", "staff_phone",
  "display_order", "is_published",
];

const VEHICLE_JSON_COLUMNS = new Set([
  "overview_zh", "overview_ja", "overview_en",
  "benefits", "features",
  "cond_dealer_warranty",
  "cond_one_owner",
  "listing_repair_history", "listing_vehicle_inspection",
  "listing_legal_maintenance", "listing_fuel_grade",
  "highlight_steering", "highlight_chassis_tail",
]);

const VEHICLE_FIELD_MAP = {
  id: "id",
  brandKey: "brand_key",
  name: "name",
  nameJa: "name_ja",
  nameEn: "name_en",
  year: "year",
  type: "type",
  icon: "icon",
  mileage: "mileage",
  engine: "engine",
  displacement: "displacement",
  cylinders: "cylinders",
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
  condDealerWarranty: "cond_dealer_warranty",
  condOneOwner: "cond_one_owner",
  listingRepairHistory: "listing_repair_history",
  listingVehicleInspection: "listing_vehicle_inspection",
  listingLegalMaintenance: "listing_legal_maintenance",
  listingFuelGrade: "listing_fuel_grade",
  highlightSteering: "highlight_steering",
  highlightChassisTail: "highlight_chassis_tail",
  staffPhotoR2Key: "staff_photo_r2_key",
  staffPhotoUrl: "staff_photo_url",
  staffMessage: "staff_message",
  staffPhone: "staff_phone",
  displayOrder: "display_order",
  isPublished: "is_published",
};

const vehicleResource = createResource({
  table: "vehicles",
  imagesTable: "vehicle_images",
  imagesFk: "vehicle_id",
  r2Prefix: "vehicles",
  columns: VEHICLE_COLUMNS,
  fieldMap: VEHICLE_FIELD_MAP,
  jsonColumns: VEHICLE_JSON_COLUMNS,
  requiredFields: ["id", "brandKey", "name"],
  notFoundCode: "vehicle_not_found",
  duplicateCode: "vehicle_id_taken",
  stubBeforeUpload: true,
});

export const listVehicles = vehicleResource.list;
export const getVehicle = vehicleResource.get;
export const createVehicle = vehicleResource.create;
export const updateVehicle = vehicleResource.update;
export async function deleteVehicle(env, id) {
  const row = await env.DB.prepare("SELECT staff_photo_r2_key FROM vehicles WHERE id = ?")
    .bind(id)
    .first();
  if (row?.staff_photo_r2_key && !String(row.staff_photo_r2_key).startsWith("seed:")) {
    await env.R2.delete(String(row.staff_photo_r2_key)).catch(() => null);
  }
  return vehicleResource.remove(env, id);
}
export const uploadVehicleImage = vehicleResource.uploadImage;
export const deleteVehicleImage = vehicleResource.deleteImage;
export const reorderVehicleImages = vehicleResource.reorderImages;

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

/** Replace staff portrait image; previous R2 object is removed. */
export async function uploadVehicleStaffPhoto(env, vehicleId, file) {
  await insertInventoryStubIfMissing(env, "vehicles", vehicleId);
  const exists = await env.DB.prepare("SELECT id, staff_photo_r2_key FROM vehicles WHERE id = ?")
    .bind(vehicleId)
    .first();
  if (!exists) {
    const err = new Error("vehicle_not_found");
    err.status = 404;
    throw err;
  }
  if (exists.staff_photo_r2_key && !String(exists.staff_photo_r2_key).startsWith("seed:")) {
    await env.R2.delete(String(exists.staff_photo_r2_key)).catch(() => null);
  }
  const ext = safeExt(file.type, file.name);
  const key = `vehicles/${vehicleId}/staff-${Date.now()}-${randomHex(4)}.${ext}`;
  await env.R2.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  const url = `/api/media/${key}`;
  await env.DB.prepare(
    `UPDATE vehicles SET staff_photo_r2_key = ?, staff_photo_url = ?, updated_at = datetime('now') WHERE id = ?`,
  )
    .bind(key, url, vehicleId)
    .run();
  return getVehicle(env, vehicleId);
}

export async function clearVehicleStaffPhoto(env, vehicleId) {
  const row = await env.DB.prepare("SELECT staff_photo_r2_key FROM vehicles WHERE id = ?")
    .bind(vehicleId)
    .first();
  if (!row) {
    const err = new Error("vehicle_not_found");
    err.status = 404;
    throw err;
  }
  if (row.staff_photo_r2_key && !String(row.staff_photo_r2_key).startsWith("seed:")) {
    await env.R2.delete(String(row.staff_photo_r2_key)).catch(() => null);
  }
  await env.DB.prepare(
    `UPDATE vehicles SET staff_photo_r2_key = NULL, staff_photo_url = NULL, updated_at = datetime('now') WHERE id = ?`,
  )
    .bind(vehicleId)
    .run();
  return getVehicle(env, vehicleId);
}
