-- 里程单位：wan=万公里小数存库；km=公里（整数，可与千分位逗号）
ALTER TABLE vehicles ADD COLUMN mileage_unit TEXT DEFAULT 'wan';
ALTER TABLE rentals ADD COLUMN mileage_unit TEXT DEFAULT 'wan';
