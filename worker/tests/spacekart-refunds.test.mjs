import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { Miniflare } from "miniflare";
import { refundPolicy } from "../src/spacekart-refunds.js";
let mf, db;
const id = randomUUID(),
  key = "local-refund-test-only";
const forwarded = [];
before(async () => {
  mf = new Miniflare({
    modules: true,
    modulesRules: [{ type: "ESModule", include: ["**/*.js"] }],
    scriptPath: "src/index.js",
    compatibilityDate: "2026-05-01",
    compatibilityFlags: ["nodejs_compat"],
    d1Databases: ["DB"],
    bindings: { SPACEKART_REFUND_SECRET: key },
    outboundService: async (request) => {
      forwarded.push({
        url: request.url,
        authorization: request.headers.get("authorization"),
        body: await request.json(),
      });
      return Response.json({ status: "pending" });
    },
  });
  db = await mf.getD1Database("DB");
  await db.exec(
    "CREATE TABLE users(id INTEGER PRIMARY KEY,username TEXT,role TEXT); CREATE TABLE sessions(token TEXT PRIMARY KEY,user_id INTEGER,expires_at INTEGER); INSERT INTO users VALUES(1,'refund-staff','admin'),(2,'viewer','viewer'); INSERT INTO sessions VALUES('admin-token',1,9999999999),('viewer-token',2,9999999999);",
  );
  for (const f of [
    "schema/migrations/20261030_spacekart.sql",
    "schema/migrations/20261030_spacekart_refunds.sql",
  ])
    await db.exec((await readFile(f, "utf8")).replace(/\n/g, " "));
  await db
    .prepare(
      "INSERT INTO spacekart_bookings(id,input_hash,name,email,phone,tour,tour_name,tour_duration,tour_date,tour_time,riders,notes,unit_amount,total_amount,currency,status,stripe_payment_id,stripe_livemode,checkout_expires_at) VALUES(?,'hash','Refund Customer','customer@example.com','00000','grand','Grand Neon Orbit','90 min','2035-11-20','18:30',2,'',20000,40000,'jpy','paid','pi_refund',1,9999999999)",
    )
    .bind(id)
    .run();
});
after(async () => await mf?.dispose());
const submit = (
  body,
  token = "admin-token",
  origin = "https://www.tk168.co.jp",
  suffix = "",
) =>
  mf.dispatchFetch(
    `https://api.tk168.co.jp/api/admin/spacekart-bookings/${id}/refund${suffix}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        origin,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
const rpc = (operation, payload = {}, secret = key) =>
  mf.dispatchFetch("https://api.tk168.co.jp/api/internal/spacekart-refunds", {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ operation, payload }),
  });
test("five-day boundary uses Japan start time and actual email receipt, with no future dates", () => {
  const b = {
    status: "paid",
    stripe_payment_id: "pi_test",
    tour_date: "2035-11-20",
    tour_time: "18:30",
  };
  const boundary = Date.parse("2035-11-15T09:30:00Z"),
    now = Date.parse("2035-11-19T00:00:00Z");
  assert.equal(
    refundPolicy(b, new Date(boundary - 1).toISOString(), now).eligible,
    true,
  );
  assert.equal(
    refundPolicy(b, new Date(boundary).toISOString(), now).eligible,
    false,
  );
  assert.equal(
    refundPolicy(b, new Date(boundary + 1).toISOString(), now).eligible,
    false,
  );
  assert.equal(refundPolicy(b, "2035-11-21T00:00:00Z", now).eligible, false);
});
test("refund mutations require administrator, trusted Origin, JSON and verified customer email", async () => {
  const body = {
    requestReceivedAt: new Date(Date.now() - 1000).toISOString(),
    reason: "Requested by email",
    customerEmail: "customer@example.com",
    emailVerified: true,
  };
  assert.equal((await submit(body, "bad-token")).status, 401);
  assert.equal((await submit(body, "viewer-token")).status, 403);
  assert.equal(
    (await submit(body, "admin-token", "https://evil.example")).status,
    403,
  );
  assert.equal((await submit({ ...body, emailVerified: false })).status, 400);
  assert.equal(
    (await submit({ ...body, customerEmail: "other@example.com" })).status,
    400,
  );
  assert.equal(
    (
      await submit({
        ...body,
        requestReceivedAt: new Date(Date.now() + 60000).toISOString(),
      })
    ).status,
    409,
  );
  assert.equal(forwarded.length, 0);
});
test("staff request is immutable, audited and unique; browser amount/payment ID are never forwarded", async () => {
  const body = {
    requestReceivedAt: new Date(Date.now() - 60000).toISOString(),
    reason: "Customer cancellation email received",
    customerEmail: "customer@example.com",
    emailVerified: true,
    amount: 1,
    paymentId: "pi_unrelated",
  };
  assert.equal((await submit(body)).status, 200);
  assert.equal((await submit(body)).status, 200);
  const rows = (
    await db.prepare("SELECT * FROM spacekart_refund_requests").all()
  ).results;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].staff_username, "refund-staff");
  assert.equal(rows[0].staff_id, 1);
  assert.equal(rows[0].request_received_at, body.requestReceivedAt);
  assert.equal(rows[0].reason, body.reason);
  assert.equal(forwarded.length, 2);
  assert.equal(forwarded[0].authorization, `Bearer ${key}`);
  assert.deepEqual(forwarded[0].body, {
    requestId: rows[0].id,
    operation: "execute",
  });
  assert.equal(forwarded[1].body.requestId, rows[0].id);
  assert.equal(
    (await submit({ ...body, reason: "Change frozen evidence" })).status,
    409,
  );
  assert.equal(
    (await submit({}, "admin-token", "https://www.tk168.co.jp", "/sync"))
      .status,
    200,
  );
  assert.equal(forwarded.at(-1).body.operation, "sync");
});
test("internal refund storage is credential-protected and checks payment identity/environment", async () => {
  assert.equal((await rpc("getRequest", {}, "wrong")).status, 401);
  assert.equal(
    (await rpc("query", { sql: "SELECT * FROM users" })).status,
    400,
  );
  const refunds = [
    {
      id: "re_local",
      amount: 40000,
      currency: "jpy",
      status: "succeeded",
      created: 1,
    },
  ];
  assert.equal(
    (
      await rpc("syncRefunds", {
        bookingId: id,
        paymentId: "pi_wrong",
        liveMode: true,
        refunds,
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await rpc("syncRefunds", {
        bookingId: id,
        paymentId: "pi_refund",
        liveMode: false,
        refunds,
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await rpc("syncRefunds", {
        bookingId: id,
        paymentId: "pi_refund",
        liveMode: true,
        refunds: [{ ...refunds[0], amount: 40001 }],
      })
    ).status,
    400,
  );
});
test("refund state and both mail jobs roll back together, then successful callbacks remain idempotent", async () => {
  const payload = {
    bookingId: id,
    paymentId: "pi_refund",
    liveMode: true,
    refunds: [
      {
        id: "re_local",
        amount: 40000,
        currency: "jpy",
        status: "succeeded",
        created: 1,
      },
    ],
  };
  await db.exec(
    "CREATE TRIGGER reject_refund_merchant BEFORE INSERT ON spacekart_refund_emails WHEN NEW.recipient='merchant' BEGIN SELECT RAISE(ABORT,'test failure'); END;",
  );
  assert.equal((await rpc("syncRefunds", payload)).status, 500);
  assert.equal(
    (await db.prepare("SELECT COUNT(*) AS n FROM spacekart_refunds").first()).n,
    0,
  );
  assert.equal(
    (
      await db
        .prepare("SELECT COUNT(*) AS n FROM spacekart_refund_emails")
        .first()
    ).n,
    0,
  );
  await db.exec("DROP TRIGGER reject_refund_merchant");
  assert.equal((await rpc("syncRefunds", payload)).status, 200);
  assert.equal((await rpc("syncRefunds", payload)).status, 200);
  assert.equal(
    (await db.prepare("SELECT COUNT(*) AS n FROM spacekart_refunds").first()).n,
    1,
  );
  assert.equal(
    (
      await db
        .prepare("SELECT COUNT(*) AS n FROM spacekart_refund_emails")
        .first()
    ).n,
    2,
  );
  const { result: lease } = await (
    await rpc("claimEmail", { refundId: "re_local", recipient: "customer" })
  ).json();
  assert.ok(lease);
  assert.equal(
    (
      await (
        await rpc("claimEmail", { refundId: "re_local", recipient: "customer" })
      ).json()
    ).result,
    null,
  );
  await rpc("finishEmail", {
    refundId: "re_local",
    recipient: "customer",
    leaseId: "wrong",
    sent: true,
  });
  assert.equal(
    (await (await rpc("emailsSent", { refundId: "re_local" })).json()).result,
    false,
  );
  await rpc("finishEmail", {
    refundId: "re_local",
    recipient: "customer",
    leaseId: lease,
    sent: true,
  });
  const { result: merchant } = await (
    await rpc("claimEmail", { refundId: "re_local", recipient: "merchant" })
  ).json();
  await rpc("finishEmail", {
    refundId: "re_local",
    recipient: "merchant",
    leaseId: merchant,
    sent: true,
  });
  assert.equal(
    (await (await rpc("emailsSent", { refundId: "re_local" })).json()).result,
    true,
  );
});
test("fully refunded bookings are excluded from active reservations and can be filtered", async () => {
  const response = await mf.dispatchFetch(
    "https://api.tk168.co.jp/api/admin/spacekart-bookings?status=refunded",
    { headers: { authorization: "Bearer admin-token" } },
  );
  const data = await response.json();
  assert.equal(data.summary.total, 1);
  assert.equal(data.summary.paid_count, 0);
  assert.equal(data.summary.paid_riders, 0);
  assert.equal(data.summary.refunded_amount, 40000);
  assert.equal(data.summary.paid_amount, 40000);
  assert.equal(data.bookings[0].refunded_amount, 40000);
  const active = await (
    await mf.dispatchFetch(
      "https://api.tk168.co.jp/api/admin/spacekart-bookings?status=paid",
      { headers: { authorization: "Bearer admin-token" } },
    )
  ).json();
  assert.equal(active.summary.total, 0);
});
