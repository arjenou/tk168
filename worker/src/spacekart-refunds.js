const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;
const fail = (status, code) => {
  throw Object.assign(new Error(code), { status });
};
const validId = (id) => typeof id === "string" && /^[a-f0-9-]{36}$/i.test(id);
export function refundPolicy(booking, receivedAt, now = Date.now()) {
  const start = Date.parse(
    `${booking.tour_date}T${booking.tour_time}:00+09:00`,
  );
  const received = Date.parse(receivedAt);
  const cutoff = start - FIVE_DAYS;
  return {
    cutoff: new Date(cutoff).toISOString(),
    eligible:
      booking.status === "paid" &&
      Boolean(booking.stripe_payment_id) &&
      Number.isFinite(received) &&
      received <= now &&
      received < cutoff,
  };
}
export async function secretMatches(supplied, expected) {
  if (!supplied || !expected) return false;
  const hash = async (s) =>
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)),
    );
  const [a, b] = await Promise.all([hash(supplied), hash(expected)]);
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
  return d === 0;
}
export function requireRefundOrigin(request) {
  if (
    ![
      "https://www.tk168.co.jp",
      "https://tk168.co.jp",
      "https://api.tk168.co.jp",
    ].includes(request.headers.get("origin")) ||
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    fail(403, "refund_origin_rejected");
}
export async function bookingRefundDetail(env, booking) {
  const request = await env.DB.prepare(
    "SELECT * FROM spacekart_refund_requests WHERE booking_id=?",
  )
    .bind(booking.id)
    .first();
  const { results: refunds } = await env.DB.prepare(
    `SELECT r.*, (SELECT COUNT(*) FROM spacekart_refund_emails e WHERE e.refund_id=r.id AND e.sent_at IS NOT NULL) AS emails_sent FROM spacekart_refunds r WHERE booking_id=? ORDER BY created DESC,id`,
  )
    .bind(booking.id)
    .all();
  return {
    request,
    refunds,
    cutoff: refundPolicy(booking, new Date().toISOString()).cutoff,
    enabled: Boolean(env.SPACEKART_REFUND_SECRET),
  };
}
export async function requestBookingRefund(
  env,
  bookingId,
  body,
  staff,
  sync = false,
) {
  if (!validId(bookingId)) fail(400, "invalid_booking");
  if (!env.SPACEKART_REFUND_SECRET) fail(503, "refund_service_not_configured");
  const booking = await env.DB.prepare(
    "SELECT * FROM spacekart_bookings WHERE id=?",
  )
    .bind(bookingId)
    .first();
  if (!booking) fail(404, "booking_not_found");
  let request = await env.DB.prepare(
    "SELECT * FROM spacekart_refund_requests WHERE booking_id=?",
  )
    .bind(bookingId)
    .first();
  if (!sync) {
    if (
      body.emailVerified !== true ||
      String(body.customerEmail || "")
        .trim()
        .toLowerCase() !== booking.email.toLowerCase()
    )
      fail(400, "verify_customer_email");
    const reason = String(body.reason || "").trim();
    if (!reason || reason.length > 1000) fail(400, "refund_reason_required");
    if (!refundPolicy(booking, body.requestReceivedAt).eligible)
      fail(409, "outside_refund_policy");
    const received = new Date(body.requestReceivedAt).toISOString();
    if (
      request &&
      (request.request_received_at !== received || request.reason !== reason)
    )
      fail(409, "refund_request_already_recorded");
    await env.DB.prepare(
      `INSERT INTO spacekart_refund_requests(id,booking_id,request_received_at,reason,staff_id,staff_username)
      VALUES(?,?,?,?,?,?) ON CONFLICT(booking_id) DO NOTHING`,
    )
      .bind(
        crypto.randomUUID(),
        bookingId,
        received,
        reason,
        staff.id,
        staff.username,
      )
      .run();
    request = await env.DB.prepare(
      "SELECT * FROM spacekart_refund_requests WHERE booking_id=?",
    )
      .bind(bookingId)
      .first();
  }
  if (!request) fail(404, "refund_request_not_found");
  // The financial service reads the immutable request from this D1; the browser cannot supply an amount or payment ID.
  try {
    const response = await fetch(
      "https://moon.tk168.co.jp/api/internal/refunds",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.SPACEKART_REFUND_SECRET}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          requestId: request.id,
          operation: sync ? "sync" : "execute",
        }),
        signal: AbortSignal.timeout(45000),
        redirect: "manual",
      },
    );
    const result = await response.json();
    if (!response.ok) {
      await env.DB.prepare(
        "UPDATE spacekart_refund_requests SET last_error=?,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=?",
      )
        .bind(result.error || "refund_result_needs_sync", request.id)
        .run();
      return { ok: false, error: result.error || "refund_result_needs_sync" };
    }
    return { ok: true, ...result };
  } catch {
    await env.DB.prepare(
      "UPDATE spacekart_refund_requests SET last_error='refund_result_needs_sync',updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=?",
    )
      .bind(request.id)
      .run();
    return { ok: false, error: "refund_result_needs_sync" };
  }
}
export async function refundRpc(env, body) {
  const p = body.payload || {};
  const stmt = (sql, ...args) => env.DB.prepare(sql).bind(...args);
  switch (body.operation) {
    case "getRequest": {
      if (!validId(p.requestId)) fail(400, "invalid_request");
      const request = await stmt(
        "SELECT * FROM spacekart_refund_requests WHERE id=?",
        p.requestId,
      ).first();
      if (!request) fail(404, "refund_request_not_found");
      const booking = await stmt(
        "SELECT * FROM spacekart_bookings WHERE id=?",
        request.booking_id,
      ).first();
      return {
        request,
        booking: {
          ...booking,
          stripe_livemode: Boolean(booking.stripe_livemode),
        },
      };
    }
    case "findByPayment": {
      if (
        !/^pi_[A-Za-z0-9_]+$/.test(p.paymentId || "") ||
        typeof p.liveMode !== "boolean"
      )
        fail(400, "invalid_payment");
      const b = await stmt(
        "SELECT * FROM spacekart_bookings WHERE stripe_payment_id=? AND stripe_livemode=?",
        p.paymentId,
        p.liveMode ? 1 : 0,
      ).first();
      return b ? { ...b, stripe_livemode: Boolean(b.stripe_livemode) } : null;
    }
    case "syncRefunds": {
      if (
        !validId(p.bookingId) ||
        !Array.isArray(p.refunds) ||
        p.refunds.length > 100
      )
        fail(400, "invalid_refunds");
      const b = await stmt(
        "SELECT * FROM spacekart_bookings WHERE id=?",
        p.bookingId,
      ).first();
      if (
        !b ||
        Boolean(b.stripe_livemode) !== p.liveMode ||
        b.stripe_payment_id !== p.paymentId
      )
        fail(409, "refund_identity_mismatch");
      const statements = [];
      for (const r of p.refunds) {
        if (
          !/^re_[A-Za-z0-9_]+$/.test(r.id || "") ||
          !Number.isSafeInteger(r.amount) ||
          r.amount <= 0 ||
          r.amount > b.total_amount ||
          r.currency !== b.currency ||
          ![
            "pending",
            "requires_action",
            "succeeded",
            "failed",
            "canceled",
          ].includes(r.status) ||
          !Number.isSafeInteger(r.created)
        )
          fail(400, "invalid_refund");
        statements.push(
          stmt(
            `INSERT INTO spacekart_refunds(id,booking_id,amount,currency,status,failure_reason,created) VALUES(?,?,?,?,?,?,?)
          ON CONFLICT(id) DO UPDATE SET status=excluded.status,failure_reason=excluded.failure_reason,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')
          WHERE spacekart_refunds.booking_id=excluded.booking_id AND spacekart_refunds.amount=excluded.amount`,
            r.id,
            b.id,
            r.amount,
            r.currency,
            r.status,
            r.failure_reason || null,
            r.created,
          ),
        );
        if (r.status === "succeeded")
          for (const to of ["customer", "merchant"])
            statements.push(
              stmt(
                `INSERT INTO spacekart_refund_emails(refund_id,recipient) SELECT id,? FROM spacekart_refunds WHERE id=? AND booking_id=? AND status='succeeded' ON CONFLICT(refund_id,recipient) DO NOTHING`,
                to,
                r.id,
                b.id,
              ),
            );
      }
      if (statements.length) {
        statements.push(
          stmt(
            "UPDATE spacekart_refund_requests SET status='submitted',last_error=NULL,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE booking_id=?",
            b.id,
          ),
        );
        await env.DB.batch(statements);
      }
      return null;
    }
    case "markReview":
      await stmt(
        "UPDATE spacekart_refund_requests SET status='manual_review',last_error=?,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=?",
        String(p.code || "manual_review").slice(0, 100),
        p.requestId,
      ).run();
      return null;
    case "getRefund": {
      const refund = await stmt(
        "SELECT * FROM spacekart_refunds WHERE id=?",
        String(p.refundId || ""),
      ).first();
      if (!refund) fail(404, "refund_not_found");
      const b = await stmt(
        "SELECT * FROM spacekart_bookings WHERE id=?",
        refund.booking_id,
      ).first();
      return {
        refund,
        booking: { ...b, stripe_livemode: Boolean(b.stripe_livemode) },
      };
    }
    case "claimEmail": {
      if (!["customer", "merchant"].includes(p.recipient))
        fail(400, "invalid_recipient");
      const lease = crypto.randomUUID();
      const r = await stmt(
        `UPDATE spacekart_refund_emails SET lease_id=?,lease_until=unixepoch()+120,attempts=attempts+1
        WHERE refund_id=? AND recipient=? AND sent_at IS NULL AND (lease_until IS NULL OR lease_until<unixepoch())
        AND EXISTS(SELECT 1 FROM spacekart_refunds WHERE id=refund_id AND status='succeeded') RETURNING refund_id`,
        lease,
        p.refundId,
        p.recipient,
      ).first();
      return r ? lease : null;
    }
    case "finishEmail":
      if (
        typeof p.sent !== "boolean" ||
        !["customer", "merchant"].includes(p.recipient)
      )
        fail(400, "invalid_email_result");
      await stmt(
        `UPDATE spacekart_refund_emails SET sent_at=CASE WHEN ? THEN strftime('%Y-%m-%dT%H:%M:%fZ','now') ELSE sent_at END,lease_id=NULL,lease_until=NULL WHERE refund_id=? AND recipient=? AND lease_id=?`,
        p.sent ? 1 : 0,
        p.refundId,
        p.recipient,
        p.leaseId,
      ).run();
      return null;
    case "emailsSent":
      return (
        (
          await stmt(
            "SELECT COUNT(*) AS n FROM spacekart_refund_emails WHERE refund_id=? AND sent_at IS NOT NULL",
            p.refundId,
          ).first()
        ).n === 2
      );
    default:
      fail(400, "invalid_refund_operation");
  }
}
