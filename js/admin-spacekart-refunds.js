const states = {
  paid: "已付款 · 预约成功",
  pending: "待付款",
  expired: "支付已过期",
  refunded: "已全额退款 · 预约已取消",
  refund_pending: "退款处理中 · 待核对",
  partial: "部分退款 · 需人工核对",
};
const refundStatuses = {
  succeeded: "退款成功",
  pending: "退款处理中",
  requires_action: "退款需进一步处理",
  failed: "退款失败",
  canceled: "退款已撤销",
};
export function bookingRefundState(b) {
  if (Number(b.refunded_amount) >= b.total_amount) return "refunded";
  if (Number(b.refund_pending) > 0) return "refund_pending";
  if (Number(b.refunded_amount) > 0) return "partial";
  return b.status;
}
export const bookingStateLabel = (b) =>
  states[bookingRefundState(b)] || b.status;
export function renderRefundSection(detail, esc, money, stamp, notice = "") {
  const b = detail.booking,
    r = detail.refund;
  if (!r) return "";
  const active = r.refunds.some(
    (x) => !["failed", "canceled"].includes(x.status),
  );
  const canSubmit =
    b.status === "paid" &&
    b.stripe_payment_id &&
    !active &&
    (!r.request || (r.request.last_error && r.request.status === "processing"));
  return `<section class="spacekart-refund-section" aria-labelledby="refundSectionTitle"><h3 id="refundSectionTitle">取消与退款</h3>
    <p class="spacekart-note">客户需从预约邮箱发邮件至 auto@tk168.co.jp 申请。以实际收件时间判断：距预约开始超过 5 天（120 小时）全额退款；正好 5 天或以内不退款。客户收到原支付全额，手续费由 TK168 承担。</p>
    <p>本单申请邮件须在 <strong>${esc(stamp(r.cutoff))} JST 之前</strong>收到。</p>
    ${notice ? `<p class="admin-message" role="status">${esc(notice)}</p>` : ""}
    ${r.request ? `<dl class="spacekart-fields"><div><dt>申请邮件收件时间 · JST</dt><dd>${esc(stamp(r.request.request_received_at))}</dd></div><div><dt>操作人员</dt><dd>${esc(r.request.staff_username)}</dd></div><div><dt>退款原因</dt><dd>${esc(r.request.reason)}</dd></div><div><dt>提交记录</dt><dd>${esc(stamp(r.request.created_at))}${r.request.last_error ? " · 结果需核对" : ""}</dd></div></dl>` : ""}
    ${r.refunds.length ? `<ul class="spacekart-email-list">${r.refunds.map((x) => `<li>${esc(x.id)} · ${money(x.amount)} · ${refundStatuses[x.status] || esc(x.status)}${x.status === "succeeded" ? ` · 通知邮件 ${Number(x.emails_sent)} / 2` : ""}${x.failure_reason ? ` · ${esc(x.failure_reason)}` : ""}</li>`).join("")}</ul>` : ""}
    <div class="spacekart-refund-actions">${canSubmit ? `<button class="admin-btn admin-btn-danger" id="openRefund">${!r.enabled ? "查看退款流程（尚未启用）" : r.request ? "核对后重新提交全额退款" : "处理客户邮件 · 全额退款"}</button>` : ""}${r.request ? '<button class="admin-btn admin-btn-ghost" id="syncRefund">同步退款状态</button>' : ""}</div>
    ${!r.enabled ? '<p class="spacekart-note">退款服务尚未启用。</p>' : b.status !== "paid" ? '<p class="spacekart-note">未付款订单无需退款。</p>' : ""}
    <p class="spacekart-note">退款仅退回原支付方式。处理中不表示客户已到账；失败、争议或已有部分退款请人工核对 Stripe。</p>
  </section>`;
}
const localJst = (s) =>
  new Date(Date.parse(s) + 9 * 60 * 60 * 1000).toISOString().slice(0, 19);
export function bindRefundActions({ root, detail, api, esc, money, onResult }) {
  const b = detail.booking,
    r = detail.refund;
  if (!r) return;
  root.querySelector("#syncRefund")?.addEventListener("click", async (e) => {
    e.currentTarget.disabled = true;
    e.currentTarget.textContent = "正在同步…";
    try {
      const result = await api(
        `/admin/spacekart-bookings/${b.id}/refund/sync`,
        { method: "POST", body: {} },
      );
      await onResult(
        result.ok ? "退款状态已同步。" : "结果仍需核对，请稍后再次同步。",
      );
    } catch {
      await onResult("同步失败，请稍后重试；不要重复操作 Stripe。");
    }
  });
  root.querySelector("#openRefund")?.addEventListener("click", () => {
    const trigger = root.querySelector("#openRefund");
    const dialog = document.createElement("dialog");
    dialog.className = "spacekart-refund-dialog";
    dialog.setAttribute("aria-labelledby", "refundDialogTitle");
    dialog.setAttribute("aria-describedby", "refundDialogHelp");
    const existing = r.request;
    dialog.innerHTML = `<form id="confirmRefundForm"><h2 id="refundDialogTitle">确认全额退款</h2><p id="refundDialogHelp">${b.stripe_livemode ? "此操作将提交真实退款。" : "这是测试订单，不会退还真实资金。"}退款后预约取消，客户收到 ${money(b.total_amount)} JPY，手续费由 TK168 承担。</p>
      <dl><dt>预约编号</dt><dd>SK-${esc(b.id.toUpperCase())}</dd><dt>客户 / 预约邮箱</dt><dd>${esc(b.name)} · ${esc(b.email)}</dd><dt>预约开始 · JST</dt><dd>${esc(b.tour_date)} ${esc(b.tour_time)}</dd></dl>
      <label>申请邮件实际收件时间 · 日本时间<input name="received" type="datetime-local" step="1" required value="${esc(localJst(existing?.request_received_at || new Date().toISOString()))}" max="${localJst(new Date().toISOString())}" ${existing ? "readonly" : ""} aria-describedby="refundEligibility"></label>
      <p id="refundEligibility" role="status" class="spacekart-note"></p>
      <label>退款原因<textarea name="reason" rows="3" maxlength="1000" required ${existing ? "readonly" : ""}>${esc(existing?.reason || "")}</textarea></label>
      <label class="spacekart-refund-check"><input type="checkbox" name="verified" required>已核对客户从上述预约邮箱发来的退款申请邮件、实际收件时间及本单信息。</label>
      <p id="refundDialogError" role="alert"></p><div class="spacekart-refund-actions"><button type="button" class="admin-btn admin-btn-ghost" id="cancelRefund" autofocus>取消</button><button class="admin-btn admin-btn-danger" id="submitRefund">确认退还 ${money(b.total_amount)}</button></div>
    </form>`;
    document.body.append(dialog);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let pending = false;
    dialog.addEventListener("cancel", (e) => {
      if (pending) e.preventDefault();
    });
    dialog.addEventListener("close", () => {
      document.body.style.overflow = previousOverflow;
      dialog.remove();
      trigger?.focus();
    });
    dialog.querySelector("#cancelRefund").onclick = () => dialog.close();
    const form = dialog.querySelector("form"),
      received = form.elements.received,
      submit = dialog.querySelector("#submitRefund");
    const validate = () => {
      const timestamp = Date.parse(`${received.value}+09:00`),
        eligible =
          Number.isFinite(timestamp) &&
          timestamp <= Date.now() &&
          timestamp < Date.parse(r.cutoff);
      submit.disabled = !eligible || pending || !r.enabled;
      dialog.querySelector("#refundEligibility").textContent = eligible
        ? "符合超过 5 天的全额退款条件。"
        : "收件时间必须早于退款截止时间，且不能填写未来时间。";
      return eligible;
    };
    received.addEventListener("input", validate);
    validate();
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (!form.reportValidity() || !validate() || pending) return;
      pending = true;
      submit.disabled = true;
      dialog.querySelector("#cancelRefund").disabled = true;
      form.setAttribute("aria-busy", "true");
      submit.textContent = "正在提交退款…";
      try {
        const result = await api(`/admin/spacekart-bookings/${b.id}/refund`, {
          method: "POST",
          body: {
            requestReceivedAt: new Date(
              `${received.value}+09:00`,
            ).toISOString(),
            reason: form.elements.reason.value,
            emailVerified: form.elements.verified.checked,
            customerEmail: b.email,
          },
        });
        dialog.close();
        await onResult(
          result.ok
            ? result.status === "succeeded"
              ? "退款成功，预约已取消。"
              : result.status === "manual_review"
                ? "发现已有退款或争议，请人工核对。"
                : "退款已提交，请查看最新状态。"
            : "退款结果待核对。请先同步状态，确认结果后再决定是否重试。",
        );
      } catch {
        pending = false;
        form.removeAttribute("aria-busy");
        dialog.querySelector("#cancelRefund").disabled = false;
        dialog.querySelector("#refundDialogError").textContent =
          "提交结果待核对。请关闭此窗口并同步退款状态，避免重复操作。";
        submit.textContent = `确认退还 ${money(b.total_amount)}`;
        submit.disabled = true;
      }
    };
    dialog.showModal();
  });
}
