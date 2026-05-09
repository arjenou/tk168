/**
 * 增压字段写入前统一处理：与首页车辆（`vehicles`）admin 保存语义一致，
 * `rentals` 复用同一实现，避免两套 coerce 行为分叉。
 *
 * `forced_induction_text` 与旧列 `forced_induction_zh` 写入同一字符串；
 * `forced_induction_unit` 由请求体原样进入 `normalizeInput`（与 vehicles 一致）。
 */
export function coerceForcedInductionFieldsForWrite(body) {
  if (!body || typeof body !== "object") return body;
  const hasText = Object.prototype.hasOwnProperty.call(body, "forcedInductionText");
  const hasZh = Object.prototype.hasOwnProperty.call(body, "forcedInductionZh");
  if (!hasText && !hasZh) return body;
  const rawT = hasText ? body.forcedInductionText : null;
  const rawZ = hasZh ? body.forcedInductionZh : null;
  const t =
    rawT != null && String(rawT).trim() !== ""
      ? String(rawT).trim()
      : rawZ != null && String(rawZ).trim() !== ""
        ? String(rawZ).trim()
        : "";
  return { ...body, forcedInductionText: t, forcedInductionZh: t };
}
