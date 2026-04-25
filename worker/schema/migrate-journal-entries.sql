-- Add journal (LATEST JOURNAL) table for admin CRUD + public feed.
-- Apply: npx wrangler d1 execute DB --file=schema/migrate-journal-entries.sql
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
