-- 将 rentals 表与 schema.sql / vehicles 对齐：
-- 早期建库的 rentals 表缺少 mileage_unit / fuel_oil_type / forced_induction_*
-- 这里逐列 ADD COLUMN，跑过的列再次执行会报错 "duplicate column"，可忽略：
-- 已迁移过的环境直接跳过即可。
ALTER TABLE rentals ADD COLUMN mileage_unit TEXT DEFAULT 'wan';
ALTER TABLE rentals ADD COLUMN fuel_oil_type TEXT;
ALTER TABLE rentals ADD COLUMN forced_induction_text TEXT;
ALTER TABLE rentals ADD COLUMN forced_induction_unit TEXT;
ALTER TABLE rentals ADD COLUMN forced_induction_zh TEXT;
ALTER TABLE rentals ADD COLUMN forced_induction_ja TEXT;
ALTER TABLE rentals ADD COLUMN forced_induction_en TEXT;
