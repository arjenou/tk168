-- Single text field + unit (T / S / other); legacy zh/ja/en merged into text.
ALTER TABLE vehicles ADD COLUMN forced_induction_text TEXT;

UPDATE vehicles
SET forced_induction_text = TRIM(forced_induction_zh)
WHERE (forced_induction_text IS NULL OR TRIM(COALESCE(forced_induction_text, '')) = '')
  AND TRIM(COALESCE(forced_induction_zh, '')) != '';

UPDATE vehicles
SET forced_induction_text = TRIM(forced_induction_ja)
WHERE (forced_induction_text IS NULL OR TRIM(COALESCE(forced_induction_text, '')) = '')
  AND TRIM(COALESCE(forced_induction_ja, '')) != '';

UPDATE vehicles
SET forced_induction_text = TRIM(forced_induction_en)
WHERE (forced_induction_text IS NULL OR TRIM(COALESCE(forced_induction_text, '')) = '')
  AND TRIM(COALESCE(forced_induction_en, '')) != '';
