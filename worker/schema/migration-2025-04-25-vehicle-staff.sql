-- Run once on existing D1 databases: wrangler d1 execute tk168 --remote --file=worker/schema/migration-2025-04-25-vehicle-staff.sql
ALTER TABLE vehicles ADD COLUMN staff_photo_r2_key TEXT;
ALTER TABLE vehicles ADD COLUMN staff_photo_url TEXT;
ALTER TABLE vehicles ADD COLUMN staff_message TEXT;
ALTER TABLE vehicles ADD COLUMN staff_phone TEXT;
