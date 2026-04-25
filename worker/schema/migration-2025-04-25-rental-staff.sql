-- Run once: wrangler d1 execute <DB> --remote --file=worker/schema/migration-2025-04-25-rental-staff.sql
ALTER TABLE rentals ADD COLUMN staff_photo_r2_key TEXT;
ALTER TABLE rentals ADD COLUMN staff_photo_url TEXT;
ALTER TABLE rentals ADD COLUMN staff_message TEXT;
ALTER TABLE rentals ADD COLUMN staff_phone TEXT;
