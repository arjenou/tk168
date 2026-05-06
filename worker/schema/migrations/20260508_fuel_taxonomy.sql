-- Normalize vehicle/rental `fuel` to new taxonomy (zh labels with abbrev in parentheses).
UPDATE vehicles SET fuel = 'HEV（混动）' WHERE fuel IN ('油电混动', 'Hybrid');
UPDATE vehicles SET fuel = 'PHEV（插电混动）' WHERE fuel = '插电混动';
UPDATE vehicles SET fuel = 'BEV（纯电动车）' WHERE fuel IN ('纯电动', 'EV');
UPDATE vehicles SET fuel = 'EREV（增程式电动车）' WHERE fuel IN ('增程式', '增程式电动车');

UPDATE rentals SET fuel = 'HEV（混动）' WHERE fuel IN ('油电混动', 'Hybrid');
UPDATE rentals SET fuel = 'PHEV（插电混动）' WHERE fuel = '插电混动';
UPDATE rentals SET fuel = 'BEV（纯电动车）' WHERE fuel IN ('纯电动', 'EV');
UPDATE rentals SET fuel = 'EREV（增程式电动车）' WHERE fuel IN ('增程式', '增程式电动车');
