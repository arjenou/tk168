CREATE TABLE IF NOT EXISTS spacekart_bookings (
  id TEXT PRIMARY KEY NOT NULL,
  input_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  tour TEXT NOT NULL,
  tour_name TEXT NOT NULL,
  tour_duration TEXT NOT NULL,
  tour_date TEXT NOT NULL,
  tour_time TEXT NOT NULL,
  riders INTEGER NOT NULL CHECK (riders BETWEEN 1 AND 6),
  notes TEXT NOT NULL,
  unit_amount INTEGER NOT NULL CHECK (unit_amount > 0),
  total_amount INTEGER NOT NULL CHECK (total_amount = unit_amount * riders),
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired')),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_id TEXT,
  stripe_livemode INTEGER NOT NULL CHECK (stripe_livemode IN (0, 1)),
  checkout_expires_at INTEGER NOT NULL,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS spacekart_bookings_email_created
  ON spacekart_bookings (email, created_at);
CREATE INDEX IF NOT EXISTS spacekart_bookings_mode_date
  ON spacekart_bookings (stripe_livemode, tour_date, tour_time);
CREATE INDEX IF NOT EXISTS spacekart_bookings_mode_created
  ON spacekart_bookings (stripe_livemode, created_at);
CREATE TABLE IF NOT EXISTS spacekart_booking_emails (
  booking_id TEXT NOT NULL REFERENCES spacekart_bookings(id),
  recipient TEXT NOT NULL CHECK (recipient IN ('customer', 'merchant')),
  sent_at TEXT,
  lease_id TEXT,
  lease_until INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (booking_id, recipient)
);
