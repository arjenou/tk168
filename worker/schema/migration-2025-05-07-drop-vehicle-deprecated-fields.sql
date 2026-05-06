-- Remove discontinued vehicle preset columns (UI/admin no longer use these).
-- Apply on existing DB:
--   wrangler d1 execute tk168 --remote --file=worker/schema/migration-2025-05-07-drop-vehicle-deprecated-fields.sql
-- Requires SQLite 3.35+ (Cloudflare D1 supports ALTER TABLE DROP COLUMN).

ALTER TABLE vehicles DROP COLUMN cond_non_smoking;
ALTER TABLE vehicles DROP COLUMN cond_authorized_import;
ALTER TABLE vehicles DROP COLUMN cond_eco_tax_eligible;
ALTER TABLE vehicles DROP COLUMN cond_rental_up;
ALTER TABLE vehicles DROP COLUMN listing_periodic_book;
