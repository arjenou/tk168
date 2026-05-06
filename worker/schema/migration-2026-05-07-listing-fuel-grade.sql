-- Listing fuel octane / grade (油种): JSON {zh,ja,en} consistent with other listing_* fields.
-- Apply on existing DB:
--   wrangler d1 execute tk168 --remote --file=worker/schema/migration-2026-05-07-listing-fuel-grade.sql

ALTER TABLE vehicles ADD COLUMN listing_fuel_grade TEXT;
