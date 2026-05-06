#!/usr/bin/env node
// Generates schema/rental-seed.sql by reading the legacy rentalProfiles
// table in js/data.js and pairing it with the matching baseVehicles entry
// so the new `rentals` D1 table starts with the 10 rentable cars we used
// to surface from rental.html.  Run once as part of the migration:
//
//     node worker/schema/build-rental-seed.mjs
//     wrangler d1 execute tk168 --remote --file=schema/rental-seed.sql

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, "../../js/data.js");
const src = readFileSync(dataPath, "utf8");

function sliceLiteral(source, name, open, close) {
  const marker = `const ${name} = ${open}`;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`Cannot find ${name}`);
  const from = start + marker.length - 1;
  let depth = 0;
  for (let i = from; i < source.length; i++) {
    if (source[i] === open) depth++;
    else if (source[i] === close) {
      depth--;
      if (depth === 0) return source.slice(from, i + 1);
    }
  }
  throw new Error(`Unterminated ${name}`);
}

const defaultBenefits = ["一年质保服务", "支持旧车置换", "可选金融分期", "专属交付顾问"];
const defaultFeatures = ["质检认证", "现车在库", "全国配送", "手续透明", "专人跟进", "售后支持", "急速交付"];

const baseVehicles = new Function(
  "defaultBenefits", "defaultFeatures",
  `return ${sliceLiteral(src, "baseVehicles", "[", "]")};`,
)(defaultBenefits, defaultFeatures);

const rentalProfiles = new Function(
  `return ${sliceLiteral(src, "rentalProfiles", "{", "}")};`,
)();

const vehicleById = new Map(baseVehicles.map((v) => [v.id, v]));

function sqlString(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}
function sqlJson(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
}
function sqlInt(value) {
  if (value === null || value === undefined || value === "") return 0;
  return Number(value) | 0;
}

function engineCombined(v) {
  const d = String(v.displacement ?? "").trim();
  const c = String(v.cylinders ?? "").trim();
  if (d && c) return `${d} ${c}`;
  if (d) return d;
  if (c) return c;
  return String(v.engine ?? "").trim();
}

const rows = [];
let order = 0;
for (const [id, profile] of Object.entries(rentalProfiles)) {
  if (!profile.rentable) continue;
  const v = vehicleById.get(id);
  if (!v) {
    console.warn(`rentalProfiles references unknown vehicle id: ${id}`);
    continue;
  }
  rows.push({
    id,
    brand_key: v.brandKey || v.brand_key || "",
    name: v.name || id,
    name_ja: v.nameJa ?? null,
    name_en: v.nameEn ?? null,
    year: v.year || "",
    type: v.type || "",
    icon: v.icon || "b1.svg",
    mileage: v.mileage || "",
    engine: engineCombined(v),
    displacement: String(v.displacement ?? "").trim(),
    cylinders: String(v.cylinders ?? "").trim(),
    fuel: v.fuel || "",
    trans: v.trans || "",
    body_style: v.bodyStyle || "",
    drive: v.drive || "",
    body_color: v.bodyColor || "",
    interior_color: v.interiorColor || "",
    seats: v.seats || "",
    origin: v.origin || "",
    daily_rate: sqlInt(profile.dailyRate),
    deposit: sqlInt(profile.deposit),
    min_days: sqlInt(profile.minDays) || 1,
    rental_status: profile.rentalStatus || "available",
    overview_zh: Array.isArray(v.overview) ? v.overview : null,
    overview_ja: Array.isArray(v.overviewJa) ? v.overviewJa : null,
    overview_en: Array.isArray(v.overviewEn) ? v.overviewEn : null,
    benefits: v.benefits || defaultBenefits,
    features: v.features || defaultFeatures,
    display_order: order++,
    is_published: 1,
    // We don't migrate images into the new R2 prefix automatically; the
    // admin can upload rental-specific photos.  Legacy filenames are
    // recorded as a reference pointer so we can backfill later.
    _legacyPhotoFilenames: v.gallery || (v.photo ? [v.photo] : []),
  });
}

const out = [];
out.push("-- Rental inventory seed (generated). Migrates rentalProfiles + matching baseVehicle fields into the `rentals` table.");
out.push("DELETE FROM rentals;");
out.push("DELETE FROM rental_images;");
for (const r of rows) {
  const cols = [
    "id", "brand_key", "name", "name_ja", "name_en", "year", "type", "icon",
    "mileage", "engine", "displacement", "cylinders", "fuel", "trans",
    "body_style", "drive", "body_color", "interior_color", "seats", "origin",
    "daily_rate", "deposit", "min_days", "rental_status",
    "overview_zh", "overview_ja", "overview_en",
    "benefits", "features",
    "display_order", "is_published",
  ];
  const values = cols.map((c) => {
    const v = r[c];
    if (c === "daily_rate" || c === "deposit" || c === "min_days" || c === "display_order" || c === "is_published") {
      return String(sqlInt(v));
    }
    if (["overview_zh", "overview_ja", "overview_en", "benefits", "features"].includes(c)) {
      return v == null ? "NULL" : sqlJson(v);
    }
    return sqlString(v);
  });
  out.push(`INSERT INTO rentals (${cols.join(", ")}) VALUES (${values.join(", ")});`);
  // Seed image rows: URL points at Worker /api/media/vehicles/seed/<file>;
  // binary must exist in R2 at that key (see upload-seed-vehicle-images.sh).
  // r2_key uses the `seed:` prefix so cascading deletes skip R2 removal.
  (r._legacyPhotoFilenames || []).forEach((filename, idx) => {
    const file = String(filename).replace(/^.*\//, "");
    const storageKey = `vehicles/seed/${file}`;
    const url = `/api/media/${storageKey}`;
    const r2Key = `seed:${storageKey}`;
    out.push(
      `INSERT INTO rental_images (rental_id, r2_key, url, alt, is_primary, position) VALUES (${sqlString(r.id)}, ${sqlString(r2Key)}, ${sqlString(url)}, '', ${idx === 0 ? 1 : 0}, ${idx});`,
    );
  });
}

const outPath = resolve(__dirname, "rental-seed.sql");
writeFileSync(outPath, out.join("\n") + "\n", "utf8");
console.log(`Wrote ${rows.length} rental rows to ${outPath}`);
