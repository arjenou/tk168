-- Per-vehicle / per-rental 360° equirectangular panorama (Insta360-style JPG)

ALTER TABLE vehicles ADD COLUMN panorama_r2_key TEXT;
ALTER TABLE vehicles ADD COLUMN panorama_url TEXT;

ALTER TABLE rentals ADD COLUMN panorama_r2_key TEXT;
ALTER TABLE rentals ADD COLUMN panorama_url TEXT;
