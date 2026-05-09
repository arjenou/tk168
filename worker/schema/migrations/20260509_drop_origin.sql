-- Remove deprecated `origin` (产地) column from inventory tables.
-- SQLite 3.35+ / D1: run against existing databases that still have the column.
-- Fresh installs should use schema/schema.sql without these columns.

ALTER TABLE vehicles DROP COLUMN origin;
ALTER TABLE rentals DROP COLUMN origin;
