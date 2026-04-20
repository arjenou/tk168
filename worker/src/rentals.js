// Rental inventory CRUD.  Independent from `vehicles`: separate D1 rows,
// separate R2 prefix (`rentals/…`), and the admin treats them as distinct
// inventories.  Field set is a rental-focused subset of the vehicle schema
// with extra pricing + status columns.

import { createResource } from "./resource.js";

const RENTAL_COLUMNS = [
  "id", "brand_key", "name", "name_ja", "name_en", "year", "type", "icon",
  "mileage", "engine", "fuel", "trans",
  "body_style", "drive", "body_color", "interior_color", "seats", "origin",
  "daily_rate", "deposit", "min_days", "rental_status",
  "overview_zh", "overview_ja", "overview_en",
  "benefits", "features",
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
  year: "year",
  type: "type",
  icon: "icon",
  mileage: "mileage",
  engine: "engine",
  fuel: "fuel",
  trans: "trans",
  bodyStyle: "body_style",
  drive: "drive",
  bodyColor: "body_color",
  interiorColor: "interior_color",
  seats: "seats",
  origin: "origin",
  dailyRate: "daily_rate",
  deposit: "deposit",
  minDays: "min_days",
  rentalStatus: "rental_status",
  overviewZh: "overview_zh",
  overviewJa: "overview_ja",
  overviewEn: "overview_en",
  benefits: "benefits",
  features: "features",
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
});

export const listRentals = rentalResource.list;
export const getRental = rentalResource.get;
export const createRental = rentalResource.create;
export const updateRental = rentalResource.update;
export const deleteRental = rentalResource.remove;
export const uploadRentalImage = rentalResource.uploadImage;
export const deleteRentalImage = rentalResource.deleteImage;
export const reorderRentalImages = rentalResource.reorderImages;
