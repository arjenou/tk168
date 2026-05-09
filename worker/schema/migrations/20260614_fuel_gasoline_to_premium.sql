-- Align legacy 「汽油」 with new fuel dropdown canonical value (premium for inventory).
UPDATE vehicles SET fuel = '高辛烷汽油' WHERE fuel = '汽油';
UPDATE rentals SET fuel = '高辛烷汽油' WHERE fuel = '汽油';
