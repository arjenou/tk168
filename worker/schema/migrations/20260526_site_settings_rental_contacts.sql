-- Site-wide settings (single row id=1). Used for rental page contact lines.
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  rental_contact_phone TEXT NOT NULL DEFAULT '',
  rental_contact_email TEXT NOT NULL DEFAULT '',
  rental_contact_wechat TEXT NOT NULL DEFAULT '',
  rental_contact_whatsapp TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO site_settings (id) VALUES (1);
