CREATE TABLE IF NOT EXISTS spacekart_refund_requests (
  id TEXT PRIMARY KEY NOT NULL,
  booking_id TEXT NOT NULL UNIQUE REFERENCES spacekart_bookings(id),
  request_received_at TEXT NOT NULL,
  reason TEXT NOT NULL,
  staff_id INTEGER NOT NULL,
  staff_username TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing' CHECK(status IN ('processing','submitted','manual_review')),
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS spacekart_refunds (
  id TEXT PRIMARY KEY NOT NULL,
  booking_id TEXT NOT NULL REFERENCES spacekart_bookings(id),
  amount INTEGER NOT NULL CHECK(amount>0),
  currency TEXT NOT NULL CHECK(currency='jpy'),
  status TEXT NOT NULL CHECK(status IN ('pending','requires_action','succeeded','failed','canceled')),
  failure_reason TEXT,
  created INTEGER NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS spacekart_refunds_booking ON spacekart_refunds(booking_id,status);
CREATE TABLE IF NOT EXISTS spacekart_refund_emails (
  refund_id TEXT NOT NULL REFERENCES spacekart_refunds(id),
  recipient TEXT NOT NULL CHECK(recipient IN ('customer','merchant')),
  sent_at TEXT,
  lease_id TEXT,
  lease_until INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(refund_id,recipient)
);
