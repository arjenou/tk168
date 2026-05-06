-- Convert legacy mileage stored as whole kilometers (e.g. 3,200 / 90) into
-- 万公里-style decimals (e.g. 0.32 / 0.009), matching js/data.js parseMileage.
-- Skips values that already contain 「万」 or that look like wan decimals (has
-- a dot and numeric value < 1000).

UPDATE vehicles
SET mileage = printf(
    '%g',
    CAST(
      REPLACE(REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', '')
      AS REAL
    ) / 10000.0
  )
WHERE mileage IS NOT NULL
  AND TRIM(mileage) != ''
  AND mileage NOT LIKE '%万%'
  AND REPLACE(
    REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
  ) NOT IN ('', '.', '-')
  AND (
    REPLACE(
      REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
    ) NOT GLOB '*[^0-9]*'
    OR (
      INSTR(
        REPLACE(
          REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
        ),
        '.'
      ) > 0
      AND CAST(
        REPLACE(
          REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
        ) AS REAL
      ) >= 1000
    )
  )
  AND NOT (
    INSTR(
      REPLACE(
        REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
      ),
      '.'
    ) > 0
    AND CAST(
      REPLACE(
        REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
      ) AS REAL
    ) < 1000
    AND CAST(
      REPLACE(
        REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
      ) AS REAL
    ) > 0
  );

UPDATE rentals
SET mileage = printf(
    '%g',
    CAST(
      REPLACE(REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', '')
      AS REAL
    ) / 10000.0
  )
WHERE mileage IS NOT NULL
  AND TRIM(mileage) != ''
  AND mileage NOT LIKE '%万%'
  AND REPLACE(
    REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
  ) NOT IN ('', '.', '-')
  AND (
    REPLACE(
      REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
    ) NOT GLOB '*[^0-9]*'
    OR (
      INSTR(
        REPLACE(
          REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
        ),
        '.'
      ) > 0
      AND CAST(
        REPLACE(
          REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
        ) AS REAL
      ) >= 1000
    )
  )
  AND NOT (
    INSTR(
      REPLACE(
        REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
      ),
      '.'
    ) > 0
    AND CAST(
      REPLACE(
        REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
      ) AS REAL
    ) < 1000
    AND CAST(
      REPLACE(
        REPLACE(REPLACE(TRIM(mileage), ',', ''), '，', ''), ' ', ''
      ) AS REAL
    ) > 0
  );
