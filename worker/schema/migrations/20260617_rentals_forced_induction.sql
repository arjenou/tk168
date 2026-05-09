-- 租赁表与库存车对齐：增压系统（单语 text + unit + 旧版 i18n 列）
ALTER TABLE rentals ADD COLUMN forced_induction_text TEXT;
ALTER TABLE rentals ADD COLUMN forced_induction_unit TEXT;
ALTER TABLE rentals ADD COLUMN forced_induction_zh TEXT;
ALTER TABLE rentals ADD COLUMN forced_induction_ja TEXT;
ALTER TABLE rentals ADD COLUMN forced_induction_en TEXT;
