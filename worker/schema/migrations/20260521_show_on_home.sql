-- 首页车辆网格与品牌页解耦：仅 show_on_home=1 的已发布车辆出现在首页。
ALTER TABLE vehicles ADD COLUMN show_on_home INTEGER NOT NULL DEFAULT 1;
