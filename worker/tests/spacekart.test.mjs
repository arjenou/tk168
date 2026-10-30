import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { Miniflare } from 'miniflare';
let mf, db;
const paidId=randomUUID();
before(async()=>{
  mf=new Miniflare({ modules:true, modulesRules:[{type:'ESModule',include:['**/*.js']}], scriptPath:'src/index.js', compatibilityDate:'2026-05-01', compatibilityFlags:['nodejs_compat'],d1Databases:['DB'] });
  db=await mf.getD1Database('DB');
  await db.exec("CREATE TABLE users(id INTEGER PRIMARY KEY,username TEXT,role TEXT); CREATE TABLE sessions(token TEXT PRIMARY KEY,user_id INTEGER,expires_at INTEGER); INSERT INTO users VALUES(1,'testadmin','admin'),(2,'viewer','viewer'); INSERT INTO sessions VALUES('test-admin-session',1,9999999999),('test-viewer-session',2,9999999999);");
  await db.exec((await readFile('schema/migrations/20261030_spacekart.sql','utf8')).replace(/\n/g,' '));
  const insert=db.prepare(`INSERT INTO spacekart_bookings(id,input_hash,name,email,phone,tour,tour_name,tour_duration,tour_date,tour_time,riders,notes,unit_amount,total_amount,currency,status,stripe_livemode,checkout_expires_at) VALUES(?,?,?,?,?,'grand','Grand Neon Orbit','90min',?,'18:30',2,'<script>literal note</script>',20000,40000,'jpy',?,?,9999999999)`);
  await db.batch([
    insert.bind(paidId,'hash','Paid Customer','paid@example.com','00000000','2035-11-20','paid',1),
    insert.bind(randomUUID(),'hash','Pending Customer','pending@example.com','00000000','2035-11-21','pending',1),
    insert.bind(randomUUID(),'hash','Test Customer','test@example.com','00000000','2035-11-20','paid',0),
    db.prepare("INSERT INTO spacekart_booking_emails(booking_id,recipient,sent_at,attempts) VALUES(?,'customer','2026-10-30T00:00:00Z',1)").bind(paidId),
  ]);
});
after(async()=>await mf?.dispose());
const request=(query='',token='test-admin-session',method='GET')=>mf.dispatchFetch(`https://api.example.test/api/admin/spacekart-bookings${query}`,{method,headers:token?{authorization:`Bearer ${token}`}:{}});
test('reservation routes require an existing administrator session',async()=>{
  assert.equal((await request('',null)).status,401);
  assert.equal((await request(`/${paidId}`,null)).status,401);
  assert.equal((await request('','test-viewer-session')).status,403);
  assert.equal((await request('','test-admin-session','POST')).status,405);
});
test('live list excludes tests, aggregates paid amounts, and reveals no hash or email lease',async()=>{
  const response=await request();assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
  const data=await response.json();assert.equal(data.summary.total,2);assert.equal(data.summary.paid_count,1);assert.equal(data.summary.paid_amount,40000);assert.equal(data.summary.paid_riders,2);
  assert.ok(data.bookings.every(x=>x.stripe_livemode));assert.equal('input_hash' in data.bookings[0],false);
  assert.equal(data.bookings.find(x=>x.id===paidId).emails_sent,1);
  const testData=await (await request('?mode=test')).json();assert.equal(testData.summary.total,1);assert.equal(testData.bookings[0].name,'Test Customer');
});
test('date/status/customer filters and bound search cannot escape the selected environment',async()=>{
  const data=await(await request('?status=paid&from=2035-11-20&to=2035-11-20&q=paid%40example.com')).json();assert.equal(data.summary.total,1);
  const injection=await(await request("?q="+encodeURIComponent("' OR 1=1 --"))).json();assert.equal(injection.summary.total,0);
  const wildcard=await(await request('?q=%25')).json();assert.equal(wildcard.summary.total,0);
  for(const q of ['?status=refunded','?mode=all','?page=0','?from=2035-02-30','?from=2035-99-99','?from=2035-12-01&to=2035-11-01']) assert.equal((await request(q)).status,400,q);
});
test('details include per-recipient results and missing bookings return 404',async()=>{
  const detail=await(await request('/'+paidId)).json();assert.equal(detail.booking.notes,'<script>literal note</script>');assert.equal(detail.emails[0].attempts,1);assert.equal('lease_id' in detail.emails[0],false);
  assert.equal((await request('/'+randomUUID())).status,404);
});
test('pagination caps response size while retaining the filtered total',async()=>{
  await db.batch(Array.from({length:27},(_,i)=>db.prepare("INSERT INTO spacekart_bookings(id,input_hash,name,email,phone,tour,tour_name,tour_duration,tour_date,tour_time,riders,notes,unit_amount,total_amount,currency,stripe_livemode,checkout_expires_at) VALUES(?,'hash','Page Fixture','page@example.com','0000','grand','Grand','90min','2035-12-01','18:30',1,'',20000,20000,'jpy',1,9999999999)").bind(randomUUID())));
  const first=await(await request('?q=Page%20Fixture')).json();assert.equal(first.summary.total,27);assert.equal(first.bookings.length,25);assert.equal(first.pages,2);
  const second=await(await request('?q=Page%20Fixture&page=2')).json();assert.equal(second.bookings.length,2);assert.ok(!first.bookings.some(a=>second.bookings.some(b=>a.id===b.id)));
});
