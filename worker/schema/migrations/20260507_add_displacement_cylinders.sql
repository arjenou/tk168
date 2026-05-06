-- Add split engine fields to existing TK168 D1 databases (vehicles + rentals).
-- Safe to run once; re-run errors on "duplicate column name" can be ignored.
ALTER TABLE vehicles ADD COLUMN displacement TEXT;
ALTER TABLE vehicles ADD COLUMN cylinders TEXT;
ALTER TABLE rentals ADD COLUMN displacement TEXT;
ALTER TABLE rentals ADD COLUMN cylinders TEXT;
