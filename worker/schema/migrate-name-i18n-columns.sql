-- Add optional Japanese / English display names (vehicles + rentals).
-- Run once on existing D1 databases, e.g.:
--   wrangler d1 execute tk168 --remote --file=schema/migrate-name-i18n-columns.sql

ALTER TABLE vehicles ADD COLUMN name_ja TEXT;
ALTER TABLE vehicles ADD COLUMN name_en TEXT;
ALTER TABLE rentals ADD COLUMN name_ja TEXT;
ALTER TABLE rentals ADD COLUMN name_en TEXT;
