-- Backfill displacement + cylinders from legacy combined `engine` (first space split).
-- Rows like "4.0L V8" → displacement "4.0L", cylinders "V8".
-- Rows like "2.0L Turbo" → displacement "2.0L", cylinders "Turbo" (fix in admin if needed).

UPDATE vehicles
SET
  displacement = TRIM(SUBSTR(engine, 1, INSTR(TRIM(engine) || ' ', ' ') - 1)),
  cylinders = TRIM(SUBSTR(TRIM(engine), INSTR(TRIM(engine), ' ') + 1))
WHERE TRIM(COALESCE(displacement, '')) = ''
  AND TRIM(COALESCE(cylinders, '')) = ''
  AND engine IS NOT NULL
  AND TRIM(engine) != ''
  AND INSTR(TRIM(engine), ' ') > 0;

UPDATE rentals
SET
  displacement = TRIM(SUBSTR(engine, 1, INSTR(TRIM(engine) || ' ', ' ') - 1)),
  cylinders = TRIM(SUBSTR(TRIM(engine), INSTR(TRIM(engine), ' ') + 1))
WHERE TRIM(COALESCE(displacement, '')) = ''
  AND TRIM(COALESCE(cylinders, '')) = ''
  AND engine IS NOT NULL
  AND TRIM(engine) != ''
  AND INSTR(TRIM(engine), ' ') > 0;
