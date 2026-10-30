export function createSpacekartBookings({ api, root, appShell, bindShell, escapeHtml: esc, isActive }) {
  const filters = { mode: "live", status: "", from: "", to: "", q: "", page: 1 };
  let data = null, loading = false, error = "", detail = null, detailError = "", generation = 0;
  const statuses = { paid: "已付款 · 预约成功", pending: "待付款", expired: "支付已过期" };
  const money = (n) => `¥${Number(n || 0).toLocaleString("ja-JP")}`;
  const stamp = (s) => s ? new Date(s).toLocaleString("zh-CN", { timeZone: "Asia/Tokyo", hour12: false }) : "—";
  const option = (v, label, current) => `<option value="${v}" ${v===current?"selected":""}>${label}</option>`;
  async function load() {
    const id = ++generation;
    loading = true; error = ""; detail = null; detailError = ""; render();
    try {
      const result = await api(`/admin/spacekart-bookings?${new URLSearchParams(filters)}`);
      if (id === generation) data = result;
    } catch { if (id === generation) { data = null; error = "预约加载失败，请重试。"; } }
    finally { if (id === generation) { loading = false; if (isActive()) render(); } }
  }
  function detailHtml() {
    if (detailError) return `<div class="admin-message" role="alert">${esc(detailError)}</div>`;
    if (!detail) return "";
    const b = detail.booking;
    const pair = (label, value) => `<div><dt>${label}</dt><dd>${esc(value || "—")}</dd></div>`;
    return `<section class="admin-card spacekart-detail" aria-labelledby="bookingDetailTitle" tabindex="-1" id="bookingDetail">
      <div class="spacekart-heading"><h2 id="bookingDetailTitle">预约详情</h2><button class="admin-btn admin-btn-sm admin-btn-ghost" id="closeBooking">关闭详情</button></div>
      <dl class="spacekart-fields">${pair("预约编号",b.id)}${pair("环境",b.stripe_livemode?"正式订单":"测试订单")}${pair("付款状态",statuses[b.status])}${pair("预约时间（日本时间）",`${b.tour_date} ${b.tour_time}`)}${pair("客户",b.name)}${pair("邮箱",b.email)}${pair("电话",b.phone)}${pair("路线",`${b.tour_name} · ${b.tour_duration}`)}${pair("人数",b.riders)}${pair("每人金额",money(b.unit_amount))}${pair("订单金额",`${money(b.total_amount)} JPY`)}${pair("创建时间（日本时间）",stamp(b.created_at))}${pair("付款时间（日本时间）",stamp(b.paid_at))}${pair("Stripe 支付编号",b.stripe_payment_id)}${pair("Stripe 结账编号",b.stripe_session_id)}${pair("客户备注",b.notes)}</dl>
      <h3>邮件通知</h3><ul class="spacekart-email-list">${["customer","merchant"].map(to=>{const e=detail.emails.find(e=>e.recipient===to);return `<li>${to==="customer"?"客户":"商家"}：${e?.sent_at?`邮件服务已接收 · ${esc(stamp(e.sent_at))}`:b.status==="paid"?"等待发送或重试":"付款成功后发送"}${e?`（尝试 ${Number(e.attempts)} 次）`:""}</li>`;}).join("")}</ul>
      <p class="spacekart-note">退款请在 Stripe 后台处理。当前预约状态不会自动同步退款结果，订单金额显示原始付款金额。</p>
      <a class="admin-btn admin-btn-sm admin-btn-ghost" href="https://dashboard.stripe.com/${b.stripe_livemode?"":"test/"}payments" target="_blank" rel="noopener noreferrer">打开 Stripe 支付后台 ↗</a>
    </section>`;
  }
  function render() {
    if (!isActive()) return;
    const s = data?.summary;
    root.innerHTML = appShell(`<section class="spacekart-page" aria-busy="${loading}">
      <div class="spacekart-heading"><div><h1>SpaceKart 预约</h1><p class="spacekart-note">预约时间均为日本时间（JST）。仅付款成功的订单计入预约统计。</p></div><button class="admin-btn admin-btn-ghost" id="refreshBookings" ${loading?"disabled":""}>刷新</button></div>
      <form id="bookingFilters" class="spacekart-filters">
        <label>订单环境<select name="mode">${option("live","正式订单",filters.mode)}${option("test","测试订单",filters.mode)}</select></label>
        <label>付款状态<select name="status">${option("","全部状态",filters.status)}${Object.entries(statuses).map(([v,l])=>option(v,l,filters.status)).join("")}</select></label>
        <label>预约开始日期<input name="from" type="date" value="${esc(filters.from)}"></label>
        <label>预约结束日期<input name="to" type="date" value="${esc(filters.to)}"></label>
        <label class="spacekart-search">搜索客户或编号<input name="q" type="search" maxlength="200" placeholder="姓名、邮箱、电话或预约编号" value="${esc(filters.q)}"></label>
        <div class="spacekart-filter-actions"><button class="admin-btn" ${loading?"disabled":""}>查询</button><button type="button" class="admin-btn admin-btn-ghost" id="clearBookings">清空</button></div>
      </form>
      ${filters.mode==="test"?'<p class="admin-message">当前查看测试订单，不代表实际收款。</p>':""}
      <div class="spacekart-summary" aria-live="polite"><div><span>筛选结果</span><strong>${s?.total??"—"}</strong></div><div><span>已付款预约</span><strong>${s?.paid_count??"—"}</strong></div><div><span>已付款人数</span><strong>${s?.paid_riders??"—"}</strong></div><div><span>原始收款金额 · JPY</span><strong>${s?money(s.paid_amount):"—"}</strong></div></div>
      ${error?`<p class="admin-message" role="alert">${esc(error)} <button class="admin-btn admin-btn-sm" id="retryBookings">重试</button></p>`:""}
      ${loading?'<p role="status" class="admin-empty">正在加载预约…</p>':data?.bookings.length?`<div class="admin-table-wrap"><table class="admin-table spacekart-table"><caption class="spacekart-sr-only">SpaceKart 预约列表</caption><thead><tr>${["预约时间 · JST","客户","人数 / 金额","付款状态","邮件通知","操作"].map(x=>`<th scope="col">${x}</th>`).join("")}</tr></thead><tbody>${data.bookings.map(b=>`<tr><td>${esc(b.tour_date)}<br><span class="spacekart-note">${esc(b.tour_time)}</span></td><td>${esc(b.name)}<br><span class="spacekart-note">${esc(b.email)}</span></td><td>${Number(b.riders)} 人<br>${money(b.total_amount)}</td><td><span class="admin-badge ${b.status==="paid"?"is-on":"is-off"}">${statuses[b.status]}</span></td><td>${b.status==="paid"?`${Number(b.emails_sent)} / 2 已发送`:"付款后发送"}</td><td><button class="admin-btn admin-btn-sm admin-btn-ghost" data-booking="${esc(b.id)}" aria-label="查看 ${esc(b.name)} 的预约详情">查看详情</button></td></tr>`).join("")}</tbody></table></div>`:!error?'<div class="admin-empty">没有符合条件的预约。可调整日期、状态或搜索内容后查询。</div>':""}
      ${data&&!loading?`<div class="spacekart-pagination"><span>共 ${s.total} 条 · 第 ${data.page} / ${data.pages} 页</span><div><button class="admin-btn admin-btn-sm admin-btn-ghost" id="previousBookings" ${data.page<=1?"disabled":""}>上一页</button> <button class="admin-btn admin-btn-sm admin-btn-ghost" id="nextBookings" ${data.page>=data.pages?"disabled":""}>下一页</button></div></div>`:""}
      ${detailHtml()}</section>`);
    bindShell();
    root.querySelector("#bookingFilters").onsubmit = async e => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      for (const key of ["mode","status","from","to","q"]) filters[key]=String(form.get(key)||"");
      if (filters.from && filters.to && filters.from>filters.to) { error="开始日期不能晚于结束日期。"; render(); return; }
      filters.page=1; await load();
    };
    for (const id of ["refreshBookings","retryBookings"]) root.querySelector(`#${id}`)?.addEventListener("click", load);
    root.querySelector("#clearBookings").onclick=()=>{Object.assign(filters,{status:"",from:"",to:"",q:"",page:1});load();};
    root.querySelector("#previousBookings")?.addEventListener("click",()=>{filters.page--;load();});
    root.querySelector("#nextBookings")?.addEventListener("click",()=>{filters.page++;load();});
    root.querySelectorAll("[data-booking]").forEach(btn=>btn.onclick=async()=>{
      const id = ++generation; btn.disabled=true; btn.textContent="加载中…";
      try { const result=await api(`/admin/spacekart-bookings/${encodeURIComponent(btn.dataset.booking)}`); if(id!==generation)return; detail=result; detailError=""; }
      catch { if(id!==generation)return; detail=null; detailError="详情加载失败，请重新点击查看。"; }
      if(isActive()){render();root.querySelector("#bookingDetail")?.focus();}
    });
    root.querySelector("#closeBooking")?.addEventListener("click",()=>{detail=null;render();root.querySelector("[data-booking]")?.focus();});
  }
  return { load, render };
}
