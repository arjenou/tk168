-- 在库车辆售出标记：is_sold=1 时前台展示「已售出」标签。
ALTER TABLE vehicles ADD COLUMN is_sold INTEGER NOT NULL DEFAULT 0;
