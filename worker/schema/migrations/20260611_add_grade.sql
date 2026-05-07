-- Trim / grade label (グレード), free text shown on listing cards and detail.

ALTER TABLE vehicles ADD COLUMN grade TEXT;
ALTER TABLE rentals ADD COLUMN grade TEXT;
