-- TK168 admin database schema (Cloudflare D1 / SQLite)

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vehicles (
  id              TEXT PRIMARY KEY,
  brand_key       TEXT NOT NULL,
  name            TEXT NOT NULL,
  name_ja         TEXT,
  name_en         TEXT,
  year            TEXT,
  type            TEXT,
  icon            TEXT,
  mileage         TEXT,
  engine          TEXT,
  fuel            TEXT,
  trans           TEXT,
  total_price     TEXT,
  base_price      TEXT,
  body_style      TEXT,
  drive           TEXT,
  body_color      TEXT,
  interior_color  TEXT,
  seats           TEXT,
  service_record  TEXT,
  origin          TEXT,
  overview_zh     TEXT,            -- JSON array of strings
  overview_ja     TEXT,            -- JSON array of strings
  overview_en     TEXT,            -- JSON array of strings
  benefits        TEXT,            -- JSON array
  features        TEXT,            -- JSON array
  -- Condition preset fields (JSON {zh,ja,en})
  cond_non_smoking            TEXT,
  cond_authorized_import      TEXT,
  cond_dealer_warranty        TEXT,
  cond_eco_tax_eligible       TEXT,
  cond_one_owner              TEXT,
  cond_rental_up              TEXT,
  listing_repair_history      TEXT,
  listing_vehicle_inspection  TEXT,
  listing_legal_maintenance   TEXT,
  listing_periodic_book       TEXT,
  highlight_steering          TEXT,
  highlight_chassis_tail      TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_published    INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand_key);
CREATE INDEX IF NOT EXISTS idx_vehicles_order ON vehicles(display_order);

CREATE TABLE IF NOT EXISTS vehicle_images (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id    TEXT NOT NULL,
  r2_key        TEXT NOT NULL,       -- object key in R2
  url           TEXT NOT NULL,       -- resolved URL used by the frontend
  alt           TEXT,
  is_primary    INTEGER NOT NULL DEFAULT 0,
  position      INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_images_vehicle ON vehicle_images(vehicle_id, position);

-- Rental inventory (leaselike / short-term rentals).  Kept as a separate
-- table from `vehicles` because the admin treats the two lists as
-- independent stock rooms (a unit is either sold or rented, and the fields
-- that matter - daily_rate, deposit, min_days, rental_status - only apply
-- here).  `rental_images` mirrors vehicle_images.
CREATE TABLE IF NOT EXISTS rentals (
  id              TEXT PRIMARY KEY,
  brand_key       TEXT NOT NULL,
  name            TEXT NOT NULL,
  name_ja         TEXT,
  name_en         TEXT,
  year            TEXT,
  type            TEXT,
  icon            TEXT,
  mileage         TEXT,
  engine          TEXT,
  fuel            TEXT,
  trans           TEXT,
  body_style      TEXT,
  drive           TEXT,
  body_color      TEXT,
  interior_color  TEXT,
  seats           TEXT,
  origin          TEXT,
  daily_rate      INTEGER NOT NULL DEFAULT 0,   -- JPY per day
  deposit         INTEGER NOT NULL DEFAULT 0,   -- JPY
  min_days        INTEGER NOT NULL DEFAULT 1,
  rental_status   TEXT NOT NULL DEFAULT 'available', -- available | reserved | rented | unavailable
  overview_zh     TEXT,
  overview_ja     TEXT,
  overview_en     TEXT,
  benefits        TEXT,
  features        TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_published    INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rentals_brand ON rentals(brand_key);
CREATE INDEX IF NOT EXISTS idx_rentals_order ON rentals(display_order);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(rental_status);

CREATE TABLE IF NOT EXISTS rental_images (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  rental_id   TEXT NOT NULL,
  r2_key      TEXT NOT NULL,
  url         TEXT NOT NULL,
  alt         TEXT,
  is_primary  INTEGER NOT NULL DEFAULT 0,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_rental_images ON rental_images(rental_id, position);

CREATE TABLE IF NOT EXISTS sessions (
  token       TEXT PRIMARY KEY,
  user_id     INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL,      -- unix seconds
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- 首页 / 关于页「LATEST JOURNAL · 最新情報」条目
CREATE TABLE IF NOT EXISTS journal_entries (
  id              TEXT PRIMARY KEY,
  title_zh        TEXT,
  title_ja        TEXT,
  title_en        TEXT,
  category_zh     TEXT,
  category_ja     TEXT,
  category_en     TEXT,
  summary_zh      TEXT,
  summary_ja      TEXT,
  summary_en      TEXT,
  body_zh         TEXT,
  body_ja         TEXT,
  body_en         TEXT,
  image_r2_key    TEXT,
  image_url       TEXT,
  date_label      TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_published    INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_journal_order ON journal_entries(display_order);
CREATE INDEX IF NOT EXISTS idx_journal_published ON journal_entries(is_published, display_order);
