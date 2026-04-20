-- Point legacy static asset paths to R2-backed Worker URLs (vehicles/seed/*.png).
-- Safe to run multiple times (only rows matching old URLs are updated).

UPDATE vehicle_images SET url = '/api/media/vehicles/seed/001.png', r2_key = 'seed:vehicles/seed/001.png' WHERE url = 'assets/images/001.png';
UPDATE vehicle_images SET url = '/api/media/vehicles/seed/002.png', r2_key = 'seed:vehicles/seed/002.png' WHERE url = 'assets/images/002.png';
UPDATE vehicle_images SET url = '/api/media/vehicles/seed/003.png', r2_key = 'seed:vehicles/seed/003.png' WHERE url = 'assets/images/003.png';
UPDATE vehicle_images SET url = '/api/media/vehicles/seed/004.png', r2_key = 'seed:vehicles/seed/004.png' WHERE url = 'assets/images/004.png';
UPDATE vehicle_images SET url = '/api/media/vehicles/seed/005.png', r2_key = 'seed:vehicles/seed/005.png' WHERE url = 'assets/images/005.png';
UPDATE vehicle_images SET url = '/api/media/vehicles/seed/006.png', r2_key = 'seed:vehicles/seed/006.png' WHERE url = 'assets/images/006.png';

UPDATE rental_images SET url = '/api/media/vehicles/seed/001.png', r2_key = 'seed:vehicles/seed/001.png' WHERE url = 'assets/images/001.png';
UPDATE rental_images SET url = '/api/media/vehicles/seed/002.png', r2_key = 'seed:vehicles/seed/002.png' WHERE url = 'assets/images/002.png';
UPDATE rental_images SET url = '/api/media/vehicles/seed/003.png', r2_key = 'seed:vehicles/seed/003.png' WHERE url = 'assets/images/003.png';
UPDATE rental_images SET url = '/api/media/vehicles/seed/004.png', r2_key = 'seed:vehicles/seed/004.png' WHERE url = 'assets/images/004.png';
UPDATE rental_images SET url = '/api/media/vehicles/seed/005.png', r2_key = 'seed:vehicles/seed/005.png' WHERE url = 'assets/images/005.png';
UPDATE rental_images SET url = '/api/media/vehicles/seed/006.png', r2_key = 'seed:vehicles/seed/006.png' WHERE url = 'assets/images/006.png';
