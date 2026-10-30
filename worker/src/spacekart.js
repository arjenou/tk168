const fields = `b.id,b.name,b.email,b.phone,b.tour_name,b.tour_duration,b.tour_date,b.tour_time,
  b.riders,b.notes,b.unit_amount,b.total_amount,b.currency,b.status,b.stripe_session_id,
  b.stripe_payment_id,b.stripe_livemode,b.checkout_expires_at,b.paid_at,b.created_at`;
function bad() { throw Object.assign(new Error("invalid_booking_filter"), { status: 400 }); }
const normalize = (row) => ({ ...row, stripe_livemode: Boolean(row.stripe_livemode) });

export async function listSpacekartBookings(env, params) {
  const mode = params.get("mode") || "live";
  if (!["live", "test"].includes(mode)) bad();
  const where = ["b.stripe_livemode=?"];
  const args = [mode === "live" ? 1 : 0];
  const status = params.get("status") || "";
  if (status) {
    if (!["paid", "pending", "expired"].includes(status)) bad();
    where.push("b.status=?"); args.push(status);
  }
  for (const [key, operator] of [["from", ">="], ["to", "<="]]) {
    const date = params.get(key);
    if (!date) continue;
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,10) !== date) bad();
    where.push(`b.tour_date${operator}?`); args.push(date);
  }
  if (params.get("from") && params.get("to") && params.get("from") > params.get("to")) bad();
  const q = (params.get("q") || "").trim();
  if (q.length > 200) bad();
  if (q) {
    where.push("(b.id LIKE ? ESCAPE '\\' OR b.name LIKE ? ESCAPE '\\' OR b.email LIKE ? ESCAPE '\\' OR b.phone LIKE ? ESCAPE '\\')");
    const term = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
    args.push(term, term, term, term);
  }
  const page = Number(params.get("page") || 1);
  if (!Number.isSafeInteger(page) || page < 1 || page > 100000) bad();
  const predicate = where.join(" AND ");
  const summary = await env.DB.prepare(`SELECT COUNT(*) AS total,
    COALESCE(SUM(b.status='paid'),0) AS paid_count,
    COALESCE(SUM(CASE WHEN b.status='paid' THEN b.riders ELSE 0 END),0) AS paid_riders,
    COALESCE(SUM(CASE WHEN b.status='paid' THEN b.total_amount ELSE 0 END),0) AS paid_amount
    FROM spacekart_bookings b WHERE ${predicate}`).bind(...args).first();
  const { results } = await env.DB.prepare(`SELECT ${fields},
    (SELECT COUNT(*) FROM spacekart_booking_emails e WHERE e.booking_id=b.id AND e.sent_at IS NOT NULL) AS emails_sent
    FROM spacekart_bookings b WHERE ${predicate} ORDER BY b.tour_date DESC,b.tour_time DESC,b.created_at DESC,b.id DESC LIMIT 25 OFFSET ?`)
    .bind(...args, (page-1)*25).all();
  return { bookings: results.map(normalize), summary, page, page_size: 25, pages: Math.max(1,Math.ceil(summary.total/25)) };
}

export async function getSpacekartBooking(env, id) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) bad();
  const row = await env.DB.prepare(`SELECT ${fields} FROM spacekart_bookings b WHERE b.id=?`).bind(id).first();
  if (!row) throw Object.assign(new Error("booking_not_found"), { status: 404 });
  const { results } = await env.DB.prepare("SELECT recipient,sent_at,attempts FROM spacekart_booking_emails WHERE booking_id=? ORDER BY recipient").bind(id).all();
  return { booking: normalize(row), emails: results };
}
