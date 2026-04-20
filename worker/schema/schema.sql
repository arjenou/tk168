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

CREATE TABLE IF NOT EXISTS sessions (
  token       TEXT PRIMARY KEY,
  user_id     INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL,      -- unix seconds
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
