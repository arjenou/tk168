-- 油種 fuel_oil_type（レギュラー/ハイオク/軽油/電気）与 燃料 fuel（动力类型七种）分立
ALTER TABLE vehicles ADD COLUMN fuel_oil_type TEXT;
ALTER TABLE rentals ADD COLUMN fuel_oil_type TEXT;

-- 将误存在「燃料」列上的泵牌号迁回油種，燃料改为汽油
UPDATE vehicles SET fuel_oil_type = fuel, fuel = '汽油' WHERE fuel IN ('普通汽油', '高辛烷汽油');
UPDATE rentals SET fuel_oil_type = fuel, fuel = '汽油' WHERE fuel IN ('普通汽油', '高辛烷汽油');

-- 纯电/插电优先标「电动」油種；其余未填默认高级汽油
UPDATE vehicles SET fuel_oil_type = '电动' WHERE (fuel_oil_type IS NULL OR trim(fuel_oil_type) = '') AND fuel IN ('BEV（纯电动车）', 'EREV（增程式电动车）', 'FCEV（氢燃料电池车）', '电动', 'PHEV（插电混动）');
UPDATE rentals SET fuel_oil_type = '电动' WHERE (fuel_oil_type IS NULL OR trim(fuel_oil_type) = '') AND fuel IN ('BEV（纯电动车）', 'EREV（增程式电动车）', 'FCEV（氢燃料电池车）', '电动', 'PHEV（插电混动）');
UPDATE vehicles SET fuel_oil_type = '柴油' WHERE (fuel_oil_type IS NULL OR trim(fuel_oil_type) = '') AND fuel = '柴油';
UPDATE rentals SET fuel_oil_type = '柴油' WHERE (fuel_oil_type IS NULL OR trim(fuel_oil_type) = '') AND fuel = '柴油';
UPDATE vehicles SET fuel_oil_type = '高辛烷汽油' WHERE fuel_oil_type IS NULL OR trim(fuel_oil_type) = '';
UPDATE rentals SET fuel_oil_type = '高辛烷汽油' WHERE fuel_oil_type IS NULL OR trim(fuel_oil_type) = '';
