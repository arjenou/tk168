-- Map legacy Chinese gearbox labels to abbreviation taxonomy (see js/admin-vehicle-field-options.js).

UPDATE vehicles SET trans = 'AT' WHERE trans IN ('自动挡', '手自一体');
UPDATE vehicles SET trans = '6MT' WHERE trans = '手动挡';
UPDATE vehicles SET trans = 'CVT' WHERE trans IN ('CVT无级变速');
UPDATE vehicles SET trans = 'DCT' WHERE trans IN ('双离合');
UPDATE vehicles SET trans = 'Single-Speed（BEV）' WHERE trans IN ('电动车单速');

UPDATE rentals SET trans = 'AT' WHERE trans IN ('自动挡', '手自一体');
UPDATE rentals SET trans = '6MT' WHERE trans = '手动挡';
UPDATE rentals SET trans = 'CVT' WHERE trans IN ('CVT无级变速');
UPDATE rentals SET trans = 'DCT' WHERE trans IN ('双离合');
UPDATE rentals SET trans = 'Single-Speed（BEV）' WHERE trans IN ('电动车单速');
