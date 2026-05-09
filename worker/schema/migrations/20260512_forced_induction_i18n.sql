-- Multilingual free-text for turbo/supercharger etc. (vehicles only).
ALTER TABLE vehicles ADD COLUMN forced_induction_zh TEXT;
ALTER TABLE vehicles ADD COLUMN forced_induction_ja TEXT;
ALTER TABLE vehicles ADD COLUMN forced_induction_en TEXT;
