// Vehicles (on-sale inventory) CRUD, built on the shared resource factory.
// Each vehicle is backed by rows in `vehicles` + `vehicle_images` and R2
// objects under the `vehicles/` prefix.

import { createResource } from "./resource.js";

const VEHICLE_COLUMNS = [
  "id", "brand_key", "name", "year", "type", "icon",
  "mileage", "engine", "fuel", "trans",
  "total_price", "base_price",
  "body_style", "drive", "body_color", "interior_color", "seats",
  "service_record", "origin",
  "overview_zh", "overview_ja", "overview_en",
  "benefits", "features",
  "cond_non_smoking", "cond_authorized_import", "cond_dealer_warranty",
  "cond_eco_tax_eligible", "cond_one_owner", "cond_rental_up",
  "listing_repair_history", "listing_vehicle_inspection",
  "listing_legal_maintenance", "listing_periodic_book",
  "highlight_steering", "highlight_chassis_tail",
  "display_order", "is_published",
];

const VEHICLE_JSON_COLUMNS = new Set([
  "overview_zh", "overview_ja", "overview_en",
  "benefits", "features",
  "cond_non_smoking", "cond_authorized_import", "cond_dealer_warranty",
  "cond_eco_tax_eligible", "cond_one_owner", "cond_rental_up",
  "listing_repair_history", "listing_vehicle_inspection",
  "listing_legal_maintenance", "listing_periodic_book",
  "highlight_steering", "highlight_chassis_tail",
]);

const VEHICLE_FIELD_MAP = {
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
});

export const listVehicles = vehicleResource.list;
export const getVehicle = vehicleResource.get;
export const createVehicle = vehicleResource.create;
export const updateVehicle = vehicleResource.update;
export const deleteVehicle = vehicleResource.remove;
export const uploadVehicleImage = vehicleResource.uploadImage;
export const deleteVehicleImage = vehicleResource.deleteImage;
export const reorderVehicleImages = vehicleResource.reorderImages;
