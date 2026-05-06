// TK168 admin SPA — talks to /api/* endpoints served by the worker.
// No framework; vanilla DOM + fetch.  All endpoints use cookie-based auth
// (the server sets an HttpOnly `tk168_admin` cookie on login).
//
// The admin exposes three content areas:
//   * "vehicles"  -> /api/admin/vehicles  (homepage / detail page)
//   * "rentals"   -> /api/admin/rentals   (rental.html fleet)
//   * "journal"   -> /api/admin/journal  (LATEST JOURNAL / 最新情報 on home + about)
// They share most of the editor shell but expose different field sets.

// The admin is served from https://www.tk168.co.jp/admin (Vercel) but the
// data + image APIs live on https://api.tk168.co.jp (Cloudflare Worker).
// Same-origin `/api` is only correct when the page is served by the Worker
// (api.tk168.co.jp, *.workers.dev) or by `wrangler dev` on its default port(s).
// A plain static server on http://localhost:3000 has no /api proxy — use the
// public API host (CORS allows loopback origins on the Worker).
// Override: set window.TK168_ADMIN_API_BASE = "https://…" before loading this script.
const ADMIN_HOST = (typeof location !== "undefined" && location.hostname
  ? location.hostname
  : ""
).toLowerCase();

const WRANGLER_DEV_PORTS = new Set(["8787", "8788"]);

function computeAdminApiBase() {
  if (typeof window !== "undefined" && typeof window.TK168_ADMIN_API_BASE === "string") {
    const t = window.TK168_ADMIN_API_BASE.trim().replace(/\/+$/, "");
    if (t) return t.endsWith("/api") ? t : `${t}/api`;
  }
  if (ADMIN_HOST === "api.tk168.co.jp" || ADMIN_HOST.endsWith(".workers.dev")) return "/api";
  if (ADMIN_HOST === "localhost" || ADMIN_HOST === "127.0.0.1") {
    const p = String(location.port || "");
    if (WRANGLER_DEV_PORTS.has(p)) return "/api";
    return "https://api.tk168.co.jp/api";
  }
  return "https://api.tk168.co.jp/api";
}

const API_BASE = computeAdminApiBase();

/** Origin that serves `/api/*` (Worker). Used so `<img src>` hits the API host when the admin HTML is on www (Vercel). */
function apiOrigin() {
  try {
    if (API_BASE.startsWith("http")) return new URL(API_BASE).origin;
    return new URL(API_BASE, location.origin).origin;
  } catch {
    return location.origin;
  }
}

/** 存库为 `b1.svg` 或 `brands/logos/xx.svg` → 站点根下静态资源 URL（用于管理端预览图） */
function iconFieldPreviewUrl(stored) {
  const raw = String(stored == null ? "" : stored).trim();
  if (!raw) return "";
  let p = raw.replace(/^\/+/, "");
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("assets/images/")) {
    // ok
  } else if (p.startsWith("assets/") && !p.startsWith("assets/images/")) {
    p = p.replace(/^assets\//, "assets/images/");
  } else {
    p = `assets/images/${p}`;
  }
  if (p.startsWith("assets/")) return `/${p}`;
  return p.startsWith("/") ? p : `/${p}`;
}

/** DB stores `/api/media/...`; resolve against the Worker origin when the page is not on that host. */
function resolveMediaUrlForImg(url) {
  if (!url) return "";
  const s = String(url).trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/api/")) {
    try {
      return new URL(s, apiOrigin()).href;
    } catch {
      return s;
    }
  }
  return s;
}

/** Internal vehicle/rental primary key; not shown in admin UI. Prefix v / r + random a-z0-9. */
function generateInventoryId(resourceKey) {
  const prefix = resourceKey === "rentals" ? "r" : resourceKey === "journal" ? "n" : "v";
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const buf = new Uint8Array(14);
  crypto.getRandomValues(buf);
  let tail = "";
  for (let i = 0; i < buf.length; i++) tail += alphabet[buf[i] % alphabet.length];
  return prefix + tail;
}

const ROOT = document.getElementById("adminRoot");

// Shared preset value sets.  Stored as JSON { zh, ja, en }; dropdown options
// set all three.  An empty selection persists as null.
const YES_NO_DASH = [
  { label: "是 / あり / Yes", zh: "是", ja: "あり", en: "Yes" },
  { label: "否 / なし / No", zh: "否", ja: "なし", en: "No" },
  { label: "— / ― / —", zh: "—", ja: "―", en: "—" },
];

const FUEL_GRADE_OPTIONS = [
  { label: "普通汽油 / レギュラー / Regular", zh: "普通汽油", ja: "レギュラー", en: "Regular" },
  { label: "高辛烷汽油 / ハイオク / Premium", zh: "高辛烷汽油", ja: "ハイオク", en: "Premium" },
  { label: "柴油 / 軽油 / Diesel", zh: "柴油", ja: "軽油", en: "Diesel" },
  { label: "电动 / 電気 / Electric", zh: "电动", ja: "電気", en: "Electric" },
];

// Resource descriptors drive the list + editor UIs so we keep a single
// code path for the two inventories.
const RESOURCES = {
  vehicles: {
    key: "vehicles",
    label: "首页车辆",
    apiList: "/admin/vehicles",
    apiItem: (id) => `/admin/vehicles/${encodeURIComponent(id)}`,
    apiImages: (id) => `/admin/vehicles/${encodeURIComponent(id)}/images`,
    apiImage: (id, imgId) =>
      `/admin/vehicles/${encodeURIComponent(id)}/images/${imgId}`,
    apiImagesReorder: (id) => `/admin/vehicles/${encodeURIComponent(id)}/images/reorder`,
    apiStaffPhoto: (id) => `/admin/vehicles/${encodeURIComponent(id)}/staff-photo`,
    listKey: "vehicles",
    itemKey: "vehicle",
    duplicateCode: "vehicle_id_taken",
    headerLabel: "首页车辆管理",
    emptyLabel: "暂无车辆",
    priceColumn: { key: "totalPrice", label: "总价" },
    /** 列表内拖拽调整 displayOrder，与前台首页排序一致 */
    homeDragSort: true,
    homeDragSortHint:
      "拖拽左侧手柄可调整首页展示顺序（保存后立即生效）。搜索时会暂时隐藏手柄。",
    // Editor form groups (new tabbed layout). Each field may declare:
    //   label / placeholder / hint / span (12-col grid): 3|4|6|12
    fieldGroups: [
      {
        id: "basic",
        label: "基本信息",
        fields: [
          {
            key: "brandKey",
            label: "品牌 Key",
            type: "select",
            brandKeyCatalog: true,
            span: 4,
            required: true,
            hint: "自列表选择存库用英文 Key；旧数据若不在列表中会单独出现为一项。",
          },
          { key: "year", label: "年份", placeholder: "2022", span: 4 },
          {
            key: "icon",
            label: "图标",
            type: "select",
            iconCatalog: true,
            span: 4,
            hint: "下拉里为中文品牌名；存库仍为 brands/logos 下的 SVG 路径。",
          },
          { key: "bodyStyle", label: "车身类型", type: "select", optionsCatalog: "bodyStyle", span: 4, hint: "规范选项（中文存库）；首页筛选与卡片展示会按站点语言自动翻译。旧数据不在列表中显示为「当前值」。" },
          { key: "drive", label: "驱动方式", type: "select", optionsCatalog: "drive", span: 4 },
          {
            key: "bodyColor",
            label: "车身颜色",
            type: "select",
            optionsCatalog: "bodyColor",
            span: 4,
            hint: "规范色名（中文）；前台日文/英文界面由站点语言自动翻译。旧数据不在列表中会显示为「当前值」可选留或改选。",
          },
          {
            key: "interiorColor",
            label: "内饰颜色",
            type: "select",
            optionsCatalog: "interiorColor",
            span: 4,
            hint: "与车身颜色共用同一套标准色；存库为中文，前台多语言自动展示对应译名。",
          },
          { key: "seats", label: "座位", type: "select", optionsCatalog: "seats", span: 4 },
          { key: "origin", label: "产地", placeholder: "意大利进口", span: 4 },
        ],
      },
      {
        id: "power",
        label: "动力与价格",
        fields: [
          { key: "displacement", label: "排量", type: "select", optionsCatalog: "displacement", span: 3, hint: "如 4.0L、2.0L Turbo；不在列表中会显示为「当前值」。" },
          { key: "cylinders", label: "发动机缸数", type: "select", optionsCatalog: "cylinders", span: 3, hint: "如 V8、V12；可与排量分开维护。" },
          { key: "mileage", label: "里程（万公里）", placeholder: "", span: 3, hint: "选填。存库为万公里量级约数（0.32≈3200km）；不必填精确公里数。可写「0.5万」或带小数点位数。" },
          { key: "fuel", label: "油種", type: "select", optionsCatalog: "fuel", span: 3 },
          { key: "trans", label: "变速箱", type: "select", optionsCatalog: "trans", span: 3 },
          { key: "totalPrice", label: "支付总额", placeholder: "¥ 1,980,000", hint: "含手续费的显示总价；失焦或保存时自动按日式千分位排版。", span: 4 },
          { key: "basePrice", label: "车辆本体价格", placeholder: "¥ 1,860,000", hint: "失焦或保存时自动按日式千分位排版。", span: 4 },
        ],
      },
    ],
    // Preset rows:
    //   [key, label]                   -> free-text zh / ja / en
    //   [key, label, "select", options] -> dropdown; options are { label, zh, ja, en }
    // Dropdowns are used for the 10 boilerplate status-style fields so
    // operators can't miskey them; the free-text inputs remain for the two
    // per-vehicle description fields (steering / chassis tail).
    presets: [
      ["condDealerWarranty", "店铺质保", "select", YES_NO_DASH],
      ["condOneOwner", "一手车主", "select", YES_NO_DASH],
      ["listingRepairHistory", "修复历", "select", YES_NO_DASH],
      ["listingVehicleInspection", "车检", "select", YES_NO_DASH],
      ["listingLegalMaintenance", "法定整备", "select", YES_NO_DASH],
      ["listingFuelGrade", "油种", "select", FUEL_GRADE_OPTIONS],
      ["highlightSteering", "方向盘"],
      ["highlightChassisTail", "车台末尾号"],
    ],
    emptyDraft: () => ({
      id: "", brandKey: "", name: "", nameJa: "", nameEn: "", year: "", type: "", icon: "",
      mileage: "", displacement: "", cylinders: "", fuel: "汽油", trans: "AT",
      totalPrice: "", basePrice: "",
      bodyStyle: "", drive: "", bodyColor: "", interiorColor: "", seats: "",
      serviceRecord: "", origin: "",
      overviewZh: [""], overviewJa: [""], overviewEn: null,
      benefits: null, features: null,
      condDealerWarranty: { zh: "", ja: "", en: "" },
      condOneOwner: { zh: "", ja: "", en: "" },
      listingRepairHistory: { zh: "", ja: "", en: "" },
      listingVehicleInspection: { zh: "", ja: "", en: "" },
      listingLegalMaintenance: { zh: "", ja: "", en: "" },
      listingFuelGrade: { zh: "", ja: "", en: "" },
      highlightSteering: { zh: "", ja: "", en: "" },
      highlightChassisTail: { zh: "", ja: "", en: "" },
      staffPhotoR2Key: null,
      staffPhotoUrl: null,
      staffMessage: "",
      staffPhone: "",
      displayOrder: 0, isPublished: true, images: [],
    }),
  },

  rentals: {
    key: "rentals",
    label: "レンタル车辆",
    apiList: "/admin/rentals",
    apiItem: (id) => `/admin/rentals/${encodeURIComponent(id)}`,
    apiImages: (id) => `/admin/rentals/${encodeURIComponent(id)}/images`,
    apiImage: (id, imgId) =>
      `/admin/rentals/${encodeURIComponent(id)}/images/${imgId}`,
    apiImagesReorder: (id) => `/admin/rentals/${encodeURIComponent(id)}/images/reorder`,
    apiStaffPhoto: (id) => `/admin/rentals/${encodeURIComponent(id)}/staff-photo`,
    listKey: "rentals",
    itemKey: "rental",
    duplicateCode: "rental_id_taken",
    headerLabel: "レンタル车辆管理",
    emptyLabel: "暂无租赁车辆",
    /** 与 rental.html 车队顺序一致（display_order） */
    homeDragSort: true,
    homeDragSortHint:
      "拖拽左侧手柄可调整租赁页（rental.html）车辆展示顺序（保存后立即生效）。搜索时会暂时隐藏手柄。",
    priceColumn: { key: "dailyRate", label: "日租金(¥)" },
    extraColumns: [
      { key: "rentalStatus", label: "状态", render: (v) => statusLabel(v) },
    ],
    fieldGroups: [
      {
        id: "basic",
        label: "基本信息",
        fields: [
          {
            key: "brandKey",
            label: "品牌 Key",
            type: "select",
            brandKeyCatalog: true,
            span: 4,
            required: true,
            hint: "自列表选择存库用英文 Key；旧数据若不在列表中会单独出现为一项。",
          },
          { key: "year", label: "年份", placeholder: "2022", span: 4 },
          {
            key: "icon",
            label: "图标",
            type: "select",
            iconCatalog: true,
            span: 4,
            hint: "下拉里为中文品牌名；存库仍为 brands/logos 下的 SVG 路径。",
          },
          { key: "bodyStyle", label: "车身类型", type: "select", optionsCatalog: "bodyStyle", span: 4, hint: "规范选项（中文存库）；首页筛选与卡片展示会按站点语言自动翻译。旧数据不在列表中显示为「当前值」。" },
          { key: "drive", label: "驱动方式", type: "select", optionsCatalog: "drive", span: 4 },
          {
            key: "bodyColor",
            label: "车身颜色",
            type: "select",
            optionsCatalog: "bodyColor",
            span: 4,
            hint: "规范色名（中文）；前台日文/英文界面由站点语言自动翻译。旧数据不在列表中会显示为「当前值」可选留或改选。",
          },
          {
            key: "interiorColor",
            label: "内饰颜色",
            type: "select",
            optionsCatalog: "interiorColor",
            span: 4,
            hint: "与车身颜色共用同一套标准色；存库为中文，前台多语言自动展示对应译名。",
          },
          { key: "seats", label: "座位", type: "select", optionsCatalog: "seats", span: 4 },
          { key: "origin", label: "产地", placeholder: "德国进口", span: 4 },
        ],
      },
      {
        id: "power",
        label: "动力",
        fields: [
          { key: "displacement", label: "排量", type: "select", optionsCatalog: "displacement", span: 3, hint: "如 4.0L、2.0L Turbo；不在列表中会显示为「当前值」。" },
          { key: "cylinders", label: "发动机缸数", type: "select", optionsCatalog: "cylinders", span: 3, hint: "如 V8、V12；可与排量分开维护。" },
          { key: "mileage", label: "里程（万公里）", placeholder: "", span: 3, hint: "选填。存库为万公里量级约数（0.32≈3200km）；不必填精确公里数。可写「0.5万」或带小数点位数。" },
          { key: "fuel", label: "油種", type: "select", optionsCatalog: "fuel", span: 3 },
          { key: "trans", label: "变速箱", type: "select", optionsCatalog: "trans", span: 3 },
        ],
      },
      {
        id: "rental",
        label: "租赁条件",
        fields: [
          {
            key: "rentalStatus",
            label: "档期状态",
            type: "select",
            options: [
              { value: "available", label: "可租 (available)" },
              { value: "reserved", label: "已预订 (reserved)" },
              { value: "rented", label: "出租中 (rented)" },
              { value: "unavailable", label: "不可租 (unavailable)" },
            ],
            span: 12,
          },
          { key: "dailyRate", label: "日租金 (¥)", type: "number", placeholder: "5600", span: 4 },
          { key: "deposit", label: "押金 (¥)", type: "number", placeholder: "120000", span: 4 },
          { key: "minDays", label: "最短租期 (天)", type: "number", placeholder: "2", span: 4 },
        ],
      },
    ],
    presets: [],
    emptyDraft: () => ({
      id: "", brandKey: "", name: "", nameJa: "", nameEn: "", year: "", type: "", icon: "",
      mileage: "", displacement: "", cylinders: "", fuel: "汽油", trans: "AT",
      bodyStyle: "", drive: "", bodyColor: "", interiorColor: "",
      seats: "2 座", origin: "",
      dailyRate: 0, deposit: 0, minDays: 1, rentalStatus: "available",
      overviewZh: [""], overviewJa: [""], overviewEn: null,
      benefits: null, features: null,
      staffPhotoR2Key: null,
      staffPhotoUrl: null,
      staffMessage: "",
      staffPhone: "",
      displayOrder: 0, isPublished: true, images: [],
    }),
  },

  journal: {
    key: "journal",
    label: "最新情報",
    listKind: "journal",
    apiList: "/admin/journal",
    apiItem: (id) => `/admin/journal/${encodeURIComponent(id)}`,
    apiCover: (id) => `/admin/journal/${encodeURIComponent(id)}/cover`,
    listKey: "journal",
    itemKey: "entry",
    duplicateCode: "journal_id_taken",
    headerLabel: "LATEST JOURNAL / 最新情報",
    emptyLabel: "暂无资讯",
    homeDragSort: true,
    homeDragSortHint:
      "拖拽左侧手柄可调整首页与关于页「最新情报」的展示顺序（保存后立即生效）。搜索时会暂时隐藏手柄。",
    fieldGroups: [],
    presets: [],
    emptyDraft: () => ({
      id: "",
      titleZh: "",
      titleJa: "",
      titleEn: "",
      categoryZh: "",
      categoryJa: "",
      categoryEn: "",
      summaryZh: "",
      summaryJa: "",
      summaryEn: "",
      bodyZh: "",
      bodyJa: "",
      bodyEn: "",
      dateLabel: "",
      displayOrder: 0,
      isPublished: true,
      images: [],
    }),
  },
};

function statusLabel(status) {
  return (
    { available: "可租", reserved: "已预订", rented: "出租中", unavailable: "不可租" }[
      status
    ] || status || "—"
  );
}

/** 与 js/data.js 中 splitLegacyEngineSpec 行为一致：仅用于后台打开旧数据 */
function splitLegacyEngineCombined(engine) {
  const t = String(engine || "").trim();
  if (!t) return { displacement: "", cylinders: "" };
  const m = t.match(/^([\d.]+\s*L(?:\s+(?:Turbo|Hybrid))?)(?:\s+(.+))?$/i);
  if (m) {
    return { displacement: (m[1] || "").trim(), cylinders: (m[2] || "").trim() };
  }
  return { displacement: t, cylinders: "" };
}

/** 与前台 parseCurrency 一致：只取整数金额（元） */
function parseInventoryPriceDigits(raw) {
  return Number(String(raw ?? "").replace(/[^\d]/g, "")) || 0;
}

/** 日式千分位存库：¥ 1,980,000 */
function formatInventoryPriceYenStyle(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  const n = parseInventoryPriceDigits(s);
  if (!n) return s;
  return `¥ ${n.toLocaleString("ja-JP", { useGrouping: true })}`;
}

function normalizeInventoryDraftForEngine(draft) {
  if (!draft || typeof draft !== "object") return draft;
  let displacement = String(draft.displacement ?? "").trim();
  let cylinders = String(draft.cylinders ?? "").trim();
  if (!displacement && !cylinders && draft.engine) {
    const sp = splitLegacyEngineCombined(draft.engine);
    displacement = sp.displacement;
    cylinders = sp.cylinders;
  }
  const next = { ...draft, displacement, cylinders };
  if (Object.prototype.hasOwnProperty.call(draft, "totalPrice")) {
    next.totalPrice = formatInventoryPriceYenStyle(draft.totalPrice);
  }
  if (Object.prototype.hasOwnProperty.call(draft, "basePrice")) {
    next.basePrice = formatInventoryPriceYenStyle(draft.basePrice);
  }
  return next;
}

function combinedEngineFromDraft(draft) {
  const d = String(draft?.displacement ?? "").trim();
  const c = String(draft?.cylinders ?? "").trim();
  return [d, c].filter(Boolean).join(" ").trim();
}

// -------------------- App state --------------------

const state = {
  user: null,
  // "login" | "list" | "editor" | "users"
  view: "login",
  // "vehicles" | "rentals" | "journal" — which inventory is currently active
  resource: "vehicles",
  // "content" | "specs" | "media" — active editor tab
  editorTab: "content",
  // per-resource caches, keyed by resource name
  items: { vehicles: [], rentals: [], journal: [] },
  users: [],
  editingId: null,
  /** True while creating a row that has not been successfully saved to the list yet. */
  editingIsNew: false,
  editingDraft: null,
  /** 右侧图库：当前大图预览对应的图片 id（null 则显示封面/首图） */
  editingImagePreviewId: null,
  filter: "",
  loading: false,
  toast: null,
};

/** 右侧「封面与图片」大图预览：优先手动选中的缩略图，否则封面（isPrimary） */
function resolveAsidePreviewImage(draft) {
  const imgs = draft?.images || [];
  if (imgs.length === 0) return null;
  const pid = state.editingImagePreviewId;
  if (pid != null) {
    const hit = imgs.find((i) => Number(i.id) === Number(pid));
    if (hit) return hit;
  }
  return imgs.find((i) => i.isPrimary) || imgs[0];
}

/** 新建未保存就返回列表时：若服务端仍是空占位（未发布、无图、无员工照、无有效标题/车型信息），则删除以免列表里留下垃圾行。 */
function shouldAbandonNewDraft(r, item) {
  if (!item || item.isPublished) return false;
  if (r.listKind === "journal") {
    const zh = String(item.titleZh || "").trim();
    const ja = String(item.titleJa || "").trim();
    const hasCover = Boolean(item.imageUrl || (item.images && item.images.length));
    return !hasCover && !zh && !ja;
  }
  const imgs = item.images || [];
  const hasStaff = Boolean(item.staffPhotoUrl);
  const brand = String(item.brandKey || "").trim();
  const name = String(item.name || "").trim();
  return imgs.length === 0 && !hasStaff && !brand && !name;
}

function currentResource() {
  return RESOURCES[state.resource];
}

// -------------------- API helpers --------------------

async function api(path, options = {}) {
  const opts = { credentials: "include", ...options };
  if (opts.body && !(opts.body instanceof FormData) && typeof opts.body !== "string") {
    opts.headers = { "content-type": "application/json", ...(opts.headers || {}) };
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(API_BASE + path, opts);
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : null;
  if (!res.ok) {
    const fallback =
      res.status === 404
        ? "HTTP 404：当前域名下没有该接口（常见于向 www 请求了 /api/…）。请刷新重试，或使用 https://api.tk168.co.jp/admin 登录。"
        : `HTTP ${res.status}`;
    const err = new Error((data && (data.message || data.error)) || fallback);
    err.status = res.status;
    err.code = data?.error || null;
    throw err;
  }
  return data;
}

// -------------------- Toasts --------------------

function showToast(message, kind = "success", timeout = 2600) {
  state.toast = { message, kind, id: Date.now() };
  renderToasts();
  setTimeout(() => {
    if (state.toast && state.toast.id === state.toast.id) {
      state.toast = null;
      renderToasts();
    }
  }, timeout);
}

function renderToasts() {
  let container = document.querySelector(".admin-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "admin-toast-container";
    document.body.appendChild(container);
  }
  container.innerHTML = "";
  if (!state.toast) return;
  const el = document.createElement("div");
  el.className = `admin-toast is-${state.toast.kind}`;
  el.textContent = state.toast.message;
  container.appendChild(el);
}

// -------------------- Auth boot --------------------

async function boot() {
  try {
    const res = await api("/auth/me");
    state.user = res.user;
    state.view = "list";
    await refreshItems();
  } catch (err) {
    state.user = null;
    state.view = "login";
  }
  ensureHomeInventoryDragDelegate();
  render();
}

// -------------------- Data loading --------------------

async function refreshItems() {
  const r = currentResource();
  state.loading = true;
  render();
  try {
    const res = await api(r.apiList);
    state.items[r.key] = res[r.listKey] || [];
  } catch (err) {
    showToast(`载入${r.label}失败：${err.message}`, "error");
  } finally {
    state.loading = false;
    render();
  }
}

async function refreshUsers() {
  try {
    const res = await api("/admin/users");
    state.users = res.users;
    render();
  } catch (err) {
    showToast(`载入用户失败：${err.message}`, "error");
  }
}

// -------------------- Login view --------------------

function renderLogin() {
  ROOT.innerHTML = `
    <div class="admin-login">
      <div class="admin-login-card">
        <div class="admin-brand">TK168 Admin</div>
        <div class="admin-brand-sub">车辆内容后台</div>
        <form id="loginForm">
          <div class="admin-field">
            <label for="loginUser">用户名</label>
            <input id="loginUser" class="admin-input" type="text" autocomplete="username" required>
          </div>
          <div class="admin-field">
            <label for="loginPass">密码</label>
            <input id="loginPass" class="admin-input" type="password" autocomplete="current-password" required>
          </div>
          <div id="loginMsg"></div>
          <button class="admin-btn admin-btn-primary" type="submit">登录</button>
        </form>
      </div>
    </div>
  `;
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value;
    const msg = document.getElementById("loginMsg");
    msg.innerHTML = "";
    try {
      const res = await api("/auth/login", { method: "POST", body: { username, password } });
      state.user = res.user;
      state.view = "list";
      state.resource = "vehicles";
      await refreshItems();
      render();
    } catch (err) {
      msg.innerHTML = `<div class="admin-message is-error">${
        err.code === "invalid_credentials" ? "用户名或密码不正确" : err.message
      }</div>`;
    }
  });
}

// -------------------- Sidebar --------------------

function navHtml() {
  const onList = state.view === "list" || state.view === "editor";
  const items = [
    {
      id: "nav-vehicles",
      label: RESOURCES.vehicles.label,
      active: onList && state.resource === "vehicles",
      onClick: "vehicles-list",
    },
    {
      id: "nav-rentals",
      label: RESOURCES.rentals.label,
      active: onList && state.resource === "rentals",
      onClick: "rentals-list",
    },
    {
      id: "nav-journal",
      label: RESOURCES.journal.label,
      active: onList && state.resource === "journal",
      onClick: "journal-list",
    },
    {
      id: "nav-users",
      label: "管理员",
      active: state.view === "users",
      onClick: "users",
    },
  ];
  return items
    .map(
      (item) => `
      <button class="admin-nav-item ${item.active ? "is-active" : ""}" data-nav="${item.onClick}">
        ${item.label}
      </button>`,
    )
    .join("");
}

function appShell(inner) {
  return `
    <div class="admin-app">
      <aside class="admin-sidebar">
        <div class="admin-brand">TK168 Admin</div>
        <div class="admin-brand-sub">车辆内容后台</div>
        ${navHtml()}
        <div class="admin-sidebar-footer">
          <div>登录：<strong>${escapeHtml(state.user?.username || "")}</strong></div>
          <button class="admin-btn admin-btn-sm admin-btn-ghost" id="logoutBtn">退出登录</button>
        </div>
      </aside>
      <main class="admin-main">${inner}</main>
    </div>
  `;
}

function bindShell() {
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = btn.dataset.nav;
      state.editingId = null;
      state.editingIsNew = false;
      state.editingDraft = null;
      state.filter = "";
      if (target === "vehicles-list") {
        state.resource = "vehicles";
        state.view = "list";
        await refreshItems();
      } else if (target === "rentals-list") {
        state.resource = "rentals";
        state.view = "list";
        await refreshItems();
      } else if (target === "journal-list") {
        state.resource = "journal";
        state.view = "list";
        await refreshItems();
      } else if (target === "users") {
        state.view = "users";
        await refreshUsers();
      }
      render();
    });
  });
  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {}
    state.user = null;
    state.view = "login";
    render();
  });
}

// -------------------- List view --------------------

function filteredItems() {
  const r = currentResource();
  const items = state.items[state.resource] || [];
  const q = state.filter.trim().toLowerCase();
  if (!q) return items;
  if (r.listKind === "journal") {
    return items.filter((v) =>
      [v.id, v.titleZh, v.titleJa, v.titleEn, v.categoryZh, v.categoryJa, v.categoryEn, v.dateLabel].some(
        (field) => String(field || "").toLowerCase().includes(q),
      ),
    );
  }
  return items.filter((v) =>
    [v.id, v.name, v.nameJa, v.nameEn, v.brandKey, v.type, v.year].some((field) =>
      String(field || "").toLowerCase().includes(q),
    ),
  );
}

function renderList() {
  const r = currentResource();
  const rows = filteredItems();
  const items = state.items[r.key] || [];

  const extraHeadCells = (r.extraColumns || [])
    .map((c) => `<th>${escapeHtml(c.label)}</th>`)
    .join("");

  const dragHint =
    r.homeDragSort && !state.filter.trim()
      ? `<p class="admin-drag-hint">${escapeHtml(
          r.homeDragSortHint ||
            "拖拽左侧手柄可调整展示顺序（保存后立即生效）。搜索时会暂时隐藏手柄。",
        )}</p>`
      : "";
  const dragHead =
    r.homeDragSort && !state.filter.trim()
      ? `<th class="admin-th-drag" scope="col" title="拖拽排序">顺序</th>`
      : "";

  const countUnit = r.listKind === "journal" ? "条" : "台";
  const searchPh = r.listKind === "journal" ? "搜索 标题 / 分类" : "搜索 名称 / 品牌";
  const rowRenderer = r.listKind === "journal" ? journalItemRow : itemRow;
  const tableBlock =
    r.listKind === "journal"
      ? `<table class="admin-table">
            <thead>
              <tr>
                ${dragHead}
                <th style="width:84px;">封面</th>
                <th>标题</th>
                <th>分类</th>
                <th>日期</th>
                <th>状态</th>
                <th style="text-align:right;">操作</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => rowRenderer(row, r)).join("")}
            </tbody>
          </table>`
      : `<table class="admin-table">
            <thead>
              <tr>
                ${dragHead}
                <th style="width:84px;">封面</th>
                <th>名称</th>
                <th>品牌</th>
                <th>年份</th>
                <th>${escapeHtml(r.priceColumn.label)}</th>
                ${extraHeadCells}
                <th>图片</th>
                <th>状态</th>
                <th style="text-align:right;">操作</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => rowRenderer(row, r)).join("")}
            </tbody>
          </table>`;
  const inner = `
    <div class="admin-page-head">
      <h1>${escapeHtml(r.headerLabel)} <span style="color:var(--admin-text-dim);font-size:14px;font-weight:400;">（${items.length} ${countUnit}）</span></h1>
      ${dragHint}
      <div class="admin-toolbar">
        <input id="itemSearch" class="admin-input admin-search" type="search" placeholder="${escapeAttr(searchPh)}" value="${escapeHtml(state.filter)}">
        <button class="admin-btn admin-btn-primary" id="newItemBtn">+ 新增${r.label}</button>
      </div>
    </div>
    <div class="admin-table-wrap">
      ${state.loading
        ? '<div class="admin-loading">加载中…</div>'
        : rows.length === 0
        ? `<div class="admin-empty">${escapeHtml(r.emptyLabel)}</div>`
        : tableBlock}
    </div>
  `;
  ROOT.innerHTML = appShell(inner);
  bindShell();

  const searchInput = document.getElementById("itemSearch");
  searchInput?.addEventListener("input", (event) => {
    state.filter = event.target.value;
    const rr = r.listKind === "journal" ? journalItemRow : itemRow;
    const tbody = document.querySelector(".admin-table tbody");
    if (tbody) tbody.innerHTML = filteredItems().map((row) => rr(row, r)).join("");
    bindRowActions();
  });

  document.getElementById("newItemBtn")?.addEventListener("click", () => {
    state.editingIsNew = true;
    state.editingId = generateInventoryId(r.key);
    const draft = r.emptyDraft();
    draft.id = state.editingId;
    draft.displayOrder = (state.items[r.key] || []).length;
    state.editingDraft = draft;
    state.editingImagePreviewId = null;
    state.view = "editor";
    render();
  });

  bindRowActions();
}

async function persistHomeDisplayOrderAfterDrop(fromId, toId) {
  const r = currentResource();
  if (!r.homeDragSort) return;
  const list = [...(state.items[r.key] || [])];
  const fromIdx = list.findIndex((v) => v.id === fromId);
  const toIdx = list.findIndex((v) => v.id === toId);
  if (fromIdx < 0 || toIdx < 0) return;
  const [removed] = list.splice(fromIdx, 1);
  list.splice(toIdx, 0, removed);
  try {
    await Promise.all(
      list.map((v, i) =>
        api(`${r.apiList}/${encodeURIComponent(v.id)}`, {
          method: "PATCH",
          body: { displayOrder: i },
        }),
      ),
    );
    list.forEach((v, i) => {
      v.displayOrder = i;
    });
    state.items[r.key] = list;
    showToast(
      r.key === "rentals"
        ? "租赁页展示顺序已保存"
        : r.key === "journal"
          ? "最新情報展示顺序已保存"
          : "首页展示顺序已保存",
    );
    render();
  } catch (err) {
    showToast(`保存顺序失败：${err.message}`, "error");
    await refreshItems();
    render();
  }
}

/** 在 #adminRoot 上委托一次，避免每次 render 重复绑定 tbody */
function ensureHomeInventoryDragDelegate() {
  if (ROOT.dataset.tk168HomeInventoryDrag === "1") return;
  ROOT.dataset.tk168HomeInventoryDrag = "1";

  let dragSourceId = null;
  let lastOverTr = null;

  const clearOver = () => {
    ROOT.querySelectorAll(".admin-table tbody tr.is-drag-over").forEach((row) =>
      row.classList.remove("is-drag-over"),
    );
    lastOverTr = null;
  };

  const dragActive = () => {
    const r = currentResource();
    return Boolean(r.homeDragSort && !state.filter.trim());
  };

  ROOT.addEventListener("dragstart", (event) => {
    if (!dragActive()) return;
    const handle = event.target.closest(".admin-drag-handle");
    if (!handle) return;
    const tr = handle.closest("tr");
    if (!tr?.dataset.itemId) return;
    dragSourceId = tr.dataset.itemId;
    event.dataTransfer.setData("text/plain", dragSourceId);
    event.dataTransfer.effectAllowed = "move";
    tr.classList.add("is-dragging-source");
  });

  ROOT.addEventListener("dragend", () => {
    ROOT.querySelectorAll(".admin-table tbody tr.is-dragging-source").forEach((row) =>
      row.classList.remove("is-dragging-source"),
    );
    clearOver();
    dragSourceId = null;
  });

  ROOT.addEventListener("dragover", (event) => {
    if (!dragActive() || !dragSourceId) return;
    const tr = event.target.closest(".admin-table tbody tr");
    if (!tr?.dataset.itemId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (lastOverTr && lastOverTr !== tr) lastOverTr.classList.remove("is-drag-over");
    tr.classList.add("is-drag-over");
    lastOverTr = tr;
  });

  ROOT.addEventListener("drop", (event) => {
    if (!dragActive()) return;
    const tr = event.target.closest(".admin-table tbody tr");
    if (!tr?.dataset.itemId) return;
    event.preventDefault();
    clearOver();
    const fromId = event.dataTransfer.getData("text/plain");
    const toId = tr.dataset.itemId;
    if (!fromId || fromId === toId) return;
    void persistHomeDisplayOrderAfterDrop(fromId, toId);
  });
}

function journalItemRow(v, r) {
  const showDrag = Boolean(r.homeDragSort && !state.filter.trim());
  const dragCell = showDrag
    ? `<td class="admin-drag-cell">
        <span class="admin-drag-handle" draggable="true" title="拖拽调整资讯顺序" aria-label="拖拽排序">⋮⋮</span>
      </td>`
    : "";
  const cover = resolveMediaUrlForImg(v.imageUrl || v.images?.[0]?.url || "");
  return `
    <tr data-item-id="${escapeAttr(v.id)}">
      ${dragCell}
      <td>${cover ? `<img class="admin-thumb" src="${escapeAttr(cover)}" alt="">` : '<div class="admin-thumb"></div>'}</td>
      <td>
        <div style="font-weight:600;">${escapeHtml(v.titleZh || v.titleJa || v.titleEn || "—")}</div>
        <div style="color:var(--admin-text-dim);font-size:12px;">${escapeHtml(v.id || "")}</div>
      </td>
      <td>${escapeHtml(v.categoryZh || v.categoryJa || v.categoryEn || "—")}</td>
      <td>${escapeHtml(v.dateLabel || "—")}</td>
      <td>
        <button class="admin-badge ${v.isPublished ? "is-on" : "is-off"}" data-toggle-pub="${escapeAttr(v.id)}" title="点击切换发布状态">
          ${v.isPublished ? "已发布" : "草稿"}
        </button>
      </td>
      <td>
        <div class="admin-actions-cell">
          <button class="admin-btn admin-btn-sm" data-edit="${escapeAttr(v.id)}">编辑</button>
          <button class="admin-btn admin-btn-sm admin-btn-danger" data-delete="${escapeAttr(v.id)}">删除</button>
        </div>
      </td>
    </tr>
  `;
}

function itemRow(v, r) {
  const showDrag = Boolean(r.homeDragSort && !state.filter.trim());
  const dragCell = showDrag
    ? `<td class="admin-drag-cell">
        <span class="admin-drag-handle" draggable="true" title="拖拽调整列表展示顺序" aria-label="拖拽排序">⋮⋮</span>
      </td>`
    : "";
  const cover = resolveMediaUrlForImg(v.images?.[0]?.url || "");
  const extraCells = (r.extraColumns || [])
    .map((c) => `<td>${escapeHtml(c.render ? c.render(v[c.key]) : v[c.key] ?? "")}</td>`)
    .join("");
  const priceKey = r.priceColumn?.key;
  const rawPrice = priceKey != null ? v[priceKey] ?? "" : "";
  const priceCell =
    r.key === "vehicles" && priceKey === "totalPrice"
      ? formatInventoryPriceYenStyle(rawPrice)
      : rawPrice;
  return `
    <tr data-item-id="${escapeAttr(v.id)}">
      ${dragCell}
      <td>${cover ? `<img class="admin-thumb" src="${escapeAttr(cover)}" alt="">` : '<div class="admin-thumb"></div>'}</td>
      <td>
        <div style="font-weight:600;">${escapeHtml(v.name)}</div>
      </td>
      <td>${escapeHtml(v.brandKey || "")}</td>
      <td>${escapeHtml(v.year || "")}</td>
      <td>${escapeHtml(priceCell)}</td>
      ${extraCells}
      <td>${(v.images || []).length}</td>
      <td>
        <button class="admin-badge ${v.isPublished ? "is-on" : "is-off"}" data-toggle-pub="${escapeAttr(v.id)}" title="点击切换发布状态">
          ${v.isPublished ? "已发布" : "草稿"}
        </button>
      </td>
      <td>
        <div class="admin-actions-cell">
          <button class="admin-btn admin-btn-sm" data-edit="${escapeAttr(v.id)}">编辑</button>
          <button class="admin-btn admin-btn-sm admin-btn-danger" data-delete="${escapeAttr(v.id)}">删除</button>
        </div>
      </td>
    </tr>
  `;
}

function bindRowActions() {
  const r = currentResource();
  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.edit;
      const item = (state.items[r.key] || []).find((v) => v.id === id);
      if (!item) return;
      state.editingIsNew = false;
      state.editingId = id;
      state.editingDraft = normalizeInventoryDraftForEngine({
        ...item,
        images: [...(item.images || [])],
      });
      state.editingImagePreviewId = null;
      state.view = "editor";
      render();
    });
  });
  document.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.delete;
      const row = (state.items[r.key] || []).find((x) => x.id === id);
      const label =
        r.listKind === "journal" ? row?.titleZh || row?.titleJa || id : row?.name || id;
      const extraHint = r.listKind === "journal" ? "" : "将同时删除其所有图片。";
      if (!confirm(`确认删除「${label}」？${extraHint}`)) return;
      try {
        await api(r.apiItem(id), { method: "DELETE" });
        showToast("已删除");
        await refreshItems();
      } catch (err) {
        showToast(`删除失败：${err.message}`, "error");
      }
    });
  });
  document.querySelectorAll("[data-toggle-pub]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.togglePub;
      const v = (state.items[r.key] || []).find((x) => x.id === id);
      if (!v) return;
      try {
        await api(r.apiItem(id), {
          method: "PATCH",
          body: { isPublished: !v.isPublished },
        });
        showToast(v.isPublished ? "已下架" : "已发布");
        await refreshItems();
      } catch (err) {
        showToast(`切换失败：${err.message}`, "error");
      }
    });
  });
}

// -------------------- Editor --------------------

/** 与 `assets/images/brands/logos/*.svg` 一致（首页品牌轮盘同款资源） */
const BRAND_LOGO_ICON_FILES = [
  "acura.svg",
  "alfaromeo.svg",
  "amg.svg",
  "astonmartin.svg",
  "audi.svg",
  "bentley.svg",
  "bmw.svg",
  "bugatti.svg",
  "cadillac.svg",
  "chevrolet.svg",
  "chrysler.svg",
  "citroen.svg",
  "corvette.svg",
  "daf.svg",
  "dsautomobiles.svg",
  "ferrari.svg",
  "fiat.svg",
  "ford.svg",
  "honda.svg",
  "hyundai.svg",
  "infiniti.svg",
  "iveco.svg",
  "jaguar.svg",
  "jeep.svg",
  "kia.svg",
  "koenigsegg.svg",
  "lamborghini.svg",
  "landrover.svg",
  "lexus.svg",
  "man.svg",
  "maserati.svg",
  "mazda.svg",
  "mclaren.svg",
  "mercedes.svg",
  "mg.svg",
  "mini.svg",
  "mitsubishi.svg",
  "nissan.svg",
  "opel.svg",
  "peugeot.svg",
  "polestar.svg",
  "porsche.svg",
  "ram.svg",
  "renault.svg",
  "rollsroyce.svg",
  "scania.svg",
  "seat.svg",
  "skoda.svg",
  "smart.svg",
  "subaru.svg",
  "suzuki.svg",
  "tata.svg",
  "tesla.svg",
  "toyota.svg",
  "volkswagen.svg",
  "volvo.svg",
];

/** `*.svg` 文件名 → 中文品牌名（图标下拉仅改展示，存库值仍为 `brands/logos/...`） */
const BRAND_LOGO_FILE_TO_ZH = {
  "acura.svg": "讴歌",
  "alfaromeo.svg": "阿尔法·罗密欧",
  "amg.svg": "梅赛德斯-AMG",
  "astonmartin.svg": "阿斯顿·马丁",
  "audi.svg": "奥迪",
  "bentley.svg": "宾利",
  "bmw.svg": "宝马",
  "bugatti.svg": "布加迪",
  "cadillac.svg": "凯迪拉克",
  "chevrolet.svg": "雪佛兰",
  "chrysler.svg": "克莱斯勒",
  "citroen.svg": "雪铁龙",
  "corvette.svg": "雪佛兰科尔维特",
  "daf.svg": "达夫",
  "dsautomobiles.svg": "DS 汽车",
  "ferrari.svg": "法拉利",
  "fiat.svg": "菲亚特",
  "ford.svg": "福特",
  "honda.svg": "本田",
  "hyundai.svg": "现代",
  "infiniti.svg": "英菲尼迪",
  "iveco.svg": "依维柯",
  "jaguar.svg": "捷豹",
  "jeep.svg": "Jeep",
  "kia.svg": "起亚",
  "koenigsegg.svg": "科尼赛克",
  "lamborghini.svg": "兰博基尼",
  "landrover.svg": "路虎",
  "lexus.svg": "雷克萨斯",
  "man.svg": "曼恩",
  "maserati.svg": "玛莎拉蒂",
  "mazda.svg": "马自达",
  "mclaren.svg": "迈凯伦",
  "mercedes.svg": "奔驰",
  "mg.svg": "MG",
  "mini.svg": "MINI",
  "mitsubishi.svg": "三菱",
  "nissan.svg": "日产",
  "opel.svg": "欧宝",
  "peugeot.svg": "标致",
  "polestar.svg": "极星",
  "porsche.svg": "保时捷",
  "ram.svg": "公羊 Ram",
  "renault.svg": "雷诺",
  "rollsroyce.svg": "劳斯莱斯",
  "scania.svg": "斯堪尼亚",
  "seat.svg": "西雅特",
  "skoda.svg": "斯柯达",
  "smart.svg": "smart",
  "subaru.svg": "斯巴鲁",
  "suzuki.svg": "铃木",
  "tata.svg": "塔塔",
  "tesla.svg": "特斯拉",
  "toyota.svg": "丰田",
  "volkswagen.svg": "大众",
  "volvo.svg": "沃尔沃"
};

function brandLogoIconLabelZh(storedPath) {
  const p = String(storedPath || "").trim();
  if (!p) return "无";
  const base = p.split("/").pop() || p;
  return BRAND_LOGO_FILE_TO_ZH[base] || base;
}

/**
 * 品牌 Key：按国家分组；存库为英文 slug，与 `admin-brand-key-options.js` 一致。
 */
function buildBrandKeySelectHtml(draftKey, rawValue) {
  const groups = (typeof window !== "undefined" && window.TK168AdminBrandKeyOptionGroups) || [];
  const cur = String(rawValue == null ? "" : rawValue).trim();
  const known = new Set();
  for (const g of groups) {
    for (const o of g.options || []) known.add(String(o.value));
  }
  const parts = [
    `<option value="">${cur ? "（选择其他品牌 / 清空）" : "（选择品牌 Key）"}</option>`,
  ];
  if (cur && !known.has(cur)) {
    parts.push(
      `<option value="${escapeAttr(cur)}" selected>${escapeHtml(`${cur}（当前，未在标准列表）`)}</option>`,
    );
  }
  for (const g of groups) {
    const body = (g.options || [])
      .map((o) => {
        const sel = o.value === cur ? " selected" : "";
        return `<option value="${escapeAttr(o.value)}"${sel}>${escapeHtml(o.label)}</option>`;
      })
      .join("");
    if (!body) continue;
    parts.push(`<optgroup label="${escapeAttr(g.label)}">${body}</optgroup>`);
  }
  return `<select class="admin-input admin-input--brand-key" data-draft="${escapeAttr(
    String(draftKey),
  )}">${parts.join("")}</select>`;
}

/**
 * 下拉选项：存库值仍为 `brands/logos/*.svg`；下拉面展示为中文品牌名（见 `BRAND_LOGO_FILE_TO_ZH`）。
 */
function buildVehicleIconOptions(stored) {
  // 首项为「无」= 不存 icon；不列出 logo_TK168 与 b1 等（旧数据用 unshift 仍可选中）。
  const rows = [{ value: "", label: "无" }];
  for (const file of BRAND_LOGO_ICON_FILES) {
    const zh = BRAND_LOGO_FILE_TO_ZH[file] || file;
    rows.push({ value: `brands/logos/${file}`, label: zh });
  }
  const cur = String(stored == null ? "" : stored).trim();
  if (cur && !rows.some((r) => r.value === cur)) {
    rows.unshift({ value: cur, label: brandLogoIconLabelZh(cur) + "（当前文件）" });
  }
  return rows;
}

// Editor tabs shown at the top of the left column. "specs" only when
// "staff" for 首页车辆 与 レンタル车辆（同一条 icon + 员工区逻辑）。
const EDITOR_TABS = [
  { id: "content", label: "内容" },
  { id: "specs", label: "规格 / 选项", requiresPresets: true },
  { id: "staff", label: "员工介绍区", requiresStaff: true },
  { id: "publish", label: "发布设置" },
];

/** 与 js/admin-vehicle-field-options.js 中 TK168AdminVehicleFieldOptions 的 key 一致 */
function buildAdminVehicleCatalogOptions(catalogKey, stored) {
  const cat = (typeof window !== "undefined" && window.TK168AdminVehicleFieldOptions) || {};
  const base = Array.isArray(cat[catalogKey]) ? cat[catalogKey].slice() : [];
  const cur = String(stored == null ? "" : stored).trim();
  if (cur && !base.some((o) => String(o.value) === cur)) {
    base.unshift({ value: cur, label: `${cur}（当前值）` });
  }
  return [{ value: "", label: "— 未选择 —" }, ...base];
}

function renderEditorField(field, draft) {
  const key = field.key;
  const span = field.span || 6;
  const value = draft[key];
  const hint = field.hint
    ? `<div class="admin-field-hint">${escapeHtml(field.hint)}</div>`
    : "";
  const requiredMark = field.required
    ? ' <span class="admin-required">*</span>'
    : "";

  let control;
  if (field.type === "select") {
    if (field.brandKeyCatalog) {
      control = buildBrandKeySelectHtml(key, draft[key]);
    } else {
    const options = field.iconCatalog
      ? buildVehicleIconOptions(draft[key])
      : field.optionsCatalog
        ? buildAdminVehicleCatalogOptions(field.optionsCatalog, draft[key])
        : (field.options || []);
    const currentVal = field.iconCatalog
      ? String(draft[key] == null ? "" : draft[key]).trim()
      : String(draft[key] == null ? "" : draft[key]).trim();
    const opts = options
      .map(
        (opt) =>
          `<option value="${escapeAttr(opt.value)}" ${
            String(opt.value) === String(currentVal) ? "selected" : ""
          }>${escapeHtml(opt.label)}</option>`,
      )
      .join("");
    if (field.iconCatalog) {
      const preview = iconFieldPreviewUrl(currentVal);
      const hasPreview = Boolean(preview);
      control = `
        <div class="admin-icon-select-row">
          <select class="admin-input" data-draft="${key}" id="adminIconFieldSelect">${opts}</select>
          <div class="admin-icon-preview" aria-hidden="true">
            <img
              id="adminIconPreviewImg"
              class="admin-icon-preview-img${hasPreview ? "" : " is-empty"}"
              ${hasPreview ? `src="${escapeAttr(preview)}"` : ""}
              alt=""
              width="56"
              height="56"
              loading="lazy"
              decoding="async"
              ${hasPreview ? "" : " hidden"}
              onerror="this.classList.add('is-empty'); this.removeAttribute('src'); this.hidden=true;"
            >
          </div>
        </div>`;
    } else {
      control = `<select class="admin-input" data-draft="${key}">${opts}</select>`;
    }
    }
  } else if (field.type === "number") {
    control = `<input class="admin-input" type="number" data-draft="${key}" value="${escapeAttr(value ?? 0)}" placeholder="${escapeAttr(field.placeholder || "")}">`;
  } else {
    control = `<input class="admin-input" type="text" data-draft="${key}" value="${escapeAttr(value ?? "")}" placeholder="${escapeAttr(field.placeholder || "")}">`;
  }

  const wrapClass = field.iconCatalog
    ? " admin-field--icon-row"
    : (field.brandKeyCatalog ? " admin-field--brand-key" : "");
  return `
    <div class="admin-field admin-col-${span}${wrapClass}">
      <label>${escapeHtml(field.label)}${requiredMark}</label>
      ${control}
      ${hint}
    </div>`;
}

function renderEditorGroup(group, draft) {
  const fieldsHtml = group.fields.map((f) => renderEditorField(f, draft)).join("");
  return `
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>${escapeHtml(group.label)}</h3>
        ${group.hint ? `<p>${escapeHtml(group.hint)}</p>` : ""}
      </div>
      <div class="admin-grid-12">${fieldsHtml}</div>
    </section>`;
}

/** 将「品牌 Key」从「基本信息」组抽出，放到上方「品牌与车型」区块，避免运营把品牌写进车型名。 */
function splitBrandKeyFieldForInventory(fieldGroups) {
  if (!Array.isArray(fieldGroups) || fieldGroups.length === 0) {
    return { brandField: null, groupsWithoutBrand: fieldGroups || [] };
  }
  const basic = fieldGroups[0];
  if (!basic || basic.id !== "basic" || !Array.isArray(basic.fields)) {
    return { brandField: null, groupsWithoutBrand: fieldGroups };
  }
  const idx = basic.fields.findIndex((f) => f && f.key === "brandKey");
  if (idx === -1) {
    return { brandField: null, groupsWithoutBrand: fieldGroups };
  }
  const brandField = basic.fields[idx];
  const restFields = basic.fields.filter((_, i) => i !== idx);
  const nextBasic = { ...basic, fields: restFields };
  return {
    brandField,
    groupsWithoutBrand: [nextBasic, ...fieldGroups.slice(1)],
  };
}

function renderJournalContentTab(draft) {
  return `
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>标题 <span class="admin-required">*</span></h3>
        <p>至少填写中文或日文标题其一；日站优先展示日文、中文站展示中文。</p>
      </div>
      <div class="admin-grid-12">
        <div class="admin-field admin-col-4">
          <label>中文</label>
          <input class="admin-input" data-draft="titleZh" value="${escapeAttr(draft.titleZh ?? "")}" placeholder="2026 年最值得期待…">
        </div>
        <div class="admin-field admin-col-4">
          <label>日文</label>
          <input class="admin-input" data-draft="titleJa" value="${escapeAttr(draft.titleJa ?? "")}" placeholder="2026年注目の…">
        </div>
        <div class="admin-field admin-col-4">
          <label>英文</label>
          <input class="admin-input" data-draft="titleEn" value="${escapeAttr(draft.titleEn ?? "")}">
        </div>
      </div>
    </section>
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>分类标签</h3>
        <p>对应首页副标题中的「市场 / 新入库 / 品牌」等，展示在文章卡片角标上。</p>
      </div>
      <div class="admin-grid-12">
        <div class="admin-field admin-col-4">
          <label>中文</label>
          <input class="admin-input" data-draft="categoryZh" value="${escapeAttr(draft.categoryZh ?? "")}" placeholder="行业动态">
        </div>
        <div class="admin-field admin-col-4">
          <label>日文</label>
          <input class="admin-input" data-draft="categoryJa" value="${escapeAttr(draft.categoryJa ?? "")}" placeholder="マーケット情報">
        </div>
        <div class="admin-field admin-col-4">
          <label>英文</label>
          <input class="admin-input" data-draft="categoryEn" value="${escapeAttr(draft.categoryEn ?? "")}" placeholder="Market">
        </div>
      </div>
    </section>
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>摘要 / 导言</h3>
        <p>在首页大卡片上展示；不填则前台该段留空（小卡可能只显示标题）。</p>
      </div>
      <div class="admin-field">
        <label>中文</label>
        <textarea class="admin-textarea" data-draft="summaryZh" rows="3" placeholder="一句话概括…">${escapeHtml(draft.summaryZh ?? "")}</textarea>
      </div>
      <div class="admin-field" style="margin-top:10px;">
        <label>日文</label>
        <textarea class="admin-textarea" data-draft="summaryJa" rows="3">${escapeHtml(draft.summaryJa ?? "")}</textarea>
      </div>
      <div class="admin-field" style="margin-top:10px;">
        <label>英文</label>
        <textarea class="admin-textarea" data-draft="summaryEn" rows="3">${escapeHtml(draft.summaryEn ?? "")}</textarea>
      </div>
    </section>
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>详情全文（选填）</h3>
        <p>可在后续用于独立资讯详情页；当前 about 区由摘要与链接展示。</p>
      </div>
      <div class="admin-field">
        <label>中文</label>
        <textarea class="admin-textarea" data-journal-body="bodyZh" rows="5">${escapeHtml(draft.bodyZh ?? "")}</textarea>
      </div>
      <div class="admin-field" style="margin-top:10px;">
        <label>日文</label>
        <textarea class="admin-textarea" data-journal-body="bodyJa" rows="5">${escapeHtml(draft.bodyJa ?? "")}</textarea>
      </div>
      <div class="admin-field" style="margin-top:10px;">
        <label>英文</label>
        <textarea class="admin-textarea" data-journal-body="bodyEn" rows="5">${escapeHtml(draft.bodyEn ?? "")}</textarea>
      </div>
    </section>
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>展示日期</h3>
        <p>前台日期文案，可填如 <code>2026 · 04 · 08</code> 或 <code>2026.04.08</code>。</p>
      </div>
      <div class="admin-grid-12">
        <div class="admin-field admin-col-6">
          <label>日期字符串</label>
          <input class="admin-input" data-draft="dateLabel" value="${escapeAttr(draft.dateLabel ?? "")}" placeholder="2026 · 04 · 08">
        </div>
      </div>
    </section>
  `;
}

function renderVehicleStaffSection(draft) {
  const hasImg = Boolean(draft.staffPhotoUrl);
  const imgSrc = hasImg ? escapeAttr(resolveMediaUrlForImg(draft.staffPhotoUrl)) : "";
  return `
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>员工介绍区（选填）</h3>
        <p>对应详情页侧栏「スタッフ紹介」。不填时保持默认图标、团队名称与多语言介绍；可只填写部分项目。</p>
      </div>
      <div class="admin-field">
        <label>担当者照片</label>
        <div class="admin-field-hint" style="margin-bottom:8px;">点击方格选择图片；有图时右上角可移除。留空为默认头像。</div>
        <div class="admin-staff-photo">
          <input
            class="admin-staff-file"
            id="staffPhotoUpload"
            type="file"
            accept="image/*"
            aria-label="选择员工照片"
          >
          <label
            for="staffPhotoUpload"
            class="admin-staff-tile"
          >
            ${
              hasImg
                ? `<img class="admin-staff-tile-img" src="${imgSrc}" alt="" loading="lazy" decoding="async">`
                : `<span class="admin-staff-tile-placeholder">无照片<br><span class="admin-staff-tile-hint">点击上传</span></span>`
            }
          </label>
          ${
            hasImg
              ? `<button
                  type="button"
                  class="admin-staff-remove"
                  id="staffClearStaffPhoto"
                  title="移除照片"
                  aria-label="移除照片"
                >×</button>`
              : ""
          }
        </div>
      </div>
      <div class="admin-field" style="margin-top:10px;">
        <label>个人说明</label>
        <textarea class="admin-textarea" data-draft="staffMessage" rows="3" placeholder="不填则使用前台多语言默认介绍">${escapeHtml(
          draft.staffMessage ?? "",
        )}</textarea>
      </div>
      <div class="admin-field" style="margin-top:10px;">
        <label>联系电话</label>
        <input class="admin-input" data-draft="staffPhone" value="${escapeAttr(
          draft.staffPhone ?? "",
        )}" placeholder="不填则不在此区显示（页面底部仍可用店铺总机）">
      </div>
    </section>
  `;
}

function renderContentTab(r, draft) {
  if (r.listKind === "journal") return renderJournalContentTab(draft);
  const inventoryKeys = new Set(["vehicles", "rentals"]);
  const { brandField, groupsWithoutBrand } = inventoryKeys.has(r.key)
    ? splitBrandKeyFieldForInventory(r.fieldGroups)
    : { brandField: null, groupsWithoutBrand: r.fieldGroups || [] };
  const groupsHtml = (groupsWithoutBrand || [])
    .map((g) => renderEditorGroup(g, draft))
    .join("");

  const overviewZh = Array.isArray(draft.overviewZh) ? draft.overviewZh.join("\n\n") : (draft.overviewZh || "");
  const overviewJa = Array.isArray(draft.overviewJa) ? draft.overviewJa.join("\n\n") : (draft.overviewJa || "");
  const overviewEn = Array.isArray(draft.overviewEn) ? draft.overviewEn.join("\n\n") : (draft.overviewEn || "");

  const brandFieldHtml = brandField
    ? `<div class="admin-grid-12">${renderEditorField({ ...brandField, span: 12 }, draft)}</div>`
    : "";

  return `
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>品牌与车型</h3>
        <p>上方先选品牌。<strong>车型名三栏只填车款本身</strong>（如 Revuelto、Urus S），不要把品牌名写进中文里；旧数据若中文里仍含「品牌 + 空格 + 车款」，前台会自动去掉重复品牌。中文车型名必填；日文 / 英文可空，未填时前台用品牌 + 中文车款推断。</p>
      </div>
      ${brandFieldHtml}
      <div class="admin-grid-12">
        <div class="admin-field admin-col-4">
          <label>车型名（中文）<span class="admin-required">*</span></label>
          <input class="admin-input" data-draft="name" value="${escapeAttr(draft.name ?? "")}" placeholder="例如 Revuelto，勿填「兰博基尼 …」">
        </div>
        <div class="admin-field admin-col-4">
          <label>车型名（日文）</label>
          <input class="admin-input" data-draft="nameJa" value="${escapeAttr(draft.nameJa ?? "")}" placeholder="レヴエルト">
        </div>
        <div class="admin-field admin-col-4">
          <label>车型名（英文）</label>
          <input class="admin-input" data-draft="nameEn" value="${escapeAttr(draft.nameEn ?? "")}" placeholder="Revuelto">
        </div>
      </div>
    </section>

    ${groupsHtml}

    <section class="admin-section">
      <div class="admin-section-head">
        <h3>车辆概述</h3>
        <p>段落之间用空行分隔。英文可留空，前台会自动生成。</p>
      </div>
      <div class="admin-lang-tabs" data-lang-tabs>
        <button type="button" class="admin-lang-tab is-active" data-lang="zh">中文</button>
        <button type="button" class="admin-lang-tab" data-lang="ja">日文</button>
        <button type="button" class="admin-lang-tab" data-lang="en">英文</button>
      </div>
      <div class="admin-lang-pane is-active" data-lang-pane="zh">
        <textarea class="admin-textarea" data-overview="zh" placeholder="先写中文，是前台中文页面的默认展示文字。">${escapeHtml(overviewZh)}</textarea>
      </div>
      <div class="admin-lang-pane" data-lang-pane="ja">
        <textarea class="admin-textarea" data-overview="ja" placeholder="日本語のオーバービュー。">${escapeHtml(overviewJa)}</textarea>
      </div>
      <div class="admin-lang-pane" data-lang-pane="en">
        <textarea class="admin-textarea" data-overview="en" placeholder="English overview (optional).">${escapeHtml(overviewEn)}</textarea>
      </div>
    </section>
  `;
}

function renderSpecsTab(r, draft) {
  const selectRows = r.presets.filter((p) => p[2] === "select");
  const textRows = r.presets.filter((p) => p[2] !== "select");

  const selectHtml = selectRows.map(([key, label, _kind, options]) => {
    const v = draft[key] || {};
    const currentIdx = (options || []).findIndex(
      (opt) => opt.zh === v.zh && opt.ja === v.ja,
    );
    const optionsHtml = [
      `<option value="" ${currentIdx === -1 ? "selected" : ""}>未填</option>`,
      ...(options || []).map(
        (opt, idx) =>
          `<option value="${idx}" ${idx === currentIdx ? "selected" : ""}>${escapeHtml(opt.label)}</option>`,
      ),
    ].join("");
    return `
      <div class="admin-field admin-col-6">
        <label>${escapeHtml(label)}</label>
        <select class="admin-input" data-preset-select="${key}">${optionsHtml}</select>
      </div>`;
  }).join("");

  const textHtml = textRows.map(([key, label]) => {
    const v = draft[key] || {};
    return `
      <div class="admin-preset-text">
        <div class="admin-preset-text-label">${escapeHtml(label)}</div>
        <div class="admin-grid-12">
          <div class="admin-field admin-col-4">
            <label>中文</label>
            <input class="admin-input" data-preset="${key}.zh" value="${escapeAttr(v.zh ?? "")}">
          </div>
          <div class="admin-field admin-col-4">
            <label>日文</label>
            <input class="admin-input" data-preset="${key}.ja" value="${escapeAttr(v.ja ?? "")}">
          </div>
          <div class="admin-field admin-col-4">
            <label>英文</label>
            <input class="admin-input" data-preset="${key}.en" value="${escapeAttr(v.en ?? "")}">
          </div>
        </div>
      </div>`;
  }).join("");

  return `
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>状态选项</h3>
        <p>下拉选择预设好的中 / 日 / 英文案，不会手误。</p>
      </div>
      <div class="admin-grid-12">${selectHtml}</div>
    </section>

    ${textRows.length ? `
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>自由文本</h3>
        <p>每项在中 / 日 / 英分别填写即可。</p>
      </div>
      ${textHtml}
    </section>` : ""}
  `;
}

function renderPublishTab(r, draft) {
  const sortField = r.homeDragSort
    ? ""
    : `
        <div class="admin-field admin-col-6">
          <label>排序</label>
          <input class="admin-input" type="number" data-draft="displayOrder" value="${Number(draft.displayOrder ?? 0)}">
          <div class="admin-field-hint">数字越小越靠前，相同数字按更新时间排序。</div>
        </div>`;
  const orderHint = r.homeDragSort
    ? `<div class="admin-field admin-col-6">
          <label>列表展示顺序</label>
          <div class="admin-field-hint" style="margin-top:2px;">在「${escapeHtml(r.headerLabel)}」列表页拖拽左侧手柄调整并自动保存，无需在此填写数字。</div>
        </div>`
    : "";
  return `
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>${r.homeDragSort ? "发布" : "发布与排序"}</h3>
        <p>新增时系统已生成内部标识；保存写入数据库后前台才按发布状态展示（标识不在前台文案中显示）。</p>
      </div>
      <div class="admin-grid-12">
        <div class="admin-field admin-col-6">
          <label>前台可见</label>
          <label class="admin-switch">
            <input type="checkbox" data-draft="isPublished" ${draft.isPublished ? "checked" : ""}>
            <span>${draft.isPublished ? "已发布" : "已下架"}</span>
          </label>
          <div class="admin-field-hint">${
            r.listKind === "journal"
              ? "关闭后仅你能在后台看到，前台不展示该条资讯。"
              : "关闭后仅你能在后台看到，该车不会出现在前台列表。"
          }</div>
        </div>
        ${orderHint}
        ${sortField}
      </div>
    </section>
  `;
}

function renderEditor() {
  const r = currentResource();
  const draft = state.editingDraft;
  const isNew = state.editingIsNew;

  const availableTabs = EDITOR_TABS.filter(
    (t) =>
      (!t.requiresPresets || (r.presets && r.presets.length > 0)) &&
      (!t.requiresStaff || r.key === "vehicles" || r.key === "rentals"),
  );
  if (!availableTabs.some((t) => t.id === state.editorTab)) {
    state.editorTab = availableTabs[0].id;
  }

  const tabsHtml = availableTabs
    .map(
      (t) =>
        `<button type="button" class="admin-tab ${state.editorTab === t.id ? "is-active" : ""}" data-editor-tab="${t.id}">${escapeHtml(t.label)}</button>`,
    )
    .join("");

  let tabBody = "";
  if (state.editorTab === "content") tabBody = renderContentTab(r, draft);
  else if (state.editorTab === "specs") tabBody = renderSpecsTab(r, draft);
  else if (state.editorTab === "staff")
    tabBody =
      r.key === "vehicles" || r.key === "rentals" ? renderVehicleStaffSection(draft) : "";
  else if (state.editorTab === "publish") tabBody = renderPublishTab(r, draft);

  const primaryImage = (draft.images || []).find((i) => i.isPrimary) || (draft.images || [])[0];
  const imageCount = (draft.images || []).length;
  const asidePreview = r.listKind === "journal" ? null : resolveAsidePreviewImage(draft);
  const selectedThumbId = asidePreview?.id;
  const editorTitle = isNew
    ? `新增${r.label}`
    : r.listKind === "journal"
      ? (draft.titleZh || draft.titleJa || draft.titleEn || "未命名")
      : (draft.name || draft.nameJa || draft.nameEn || "未命名");
  const editorSub =
    r.listKind === "journal" && (draft.dateLabel || draft.id)
      ? `<div class="admin-subtle">${[draft.dateLabel, draft.id].filter(Boolean).map(escapeHtml).join(" · ")}</div>`
      : !isNew && (draft.brandKey || draft.year)
        ? `<div class="admin-subtle">${[draft.brandKey, draft.year].filter(Boolean).map(escapeHtml).join(" · ")}</div>`
        : isNew && draft.id && r.listKind !== "journal"
          ? `<div class="admin-subtle">${escapeHtml(draft.id)}</div>`
          : "";
  const asideBlock =
    r.listKind === "journal"
      ? `<aside class="admin-editor-aside">
        <section class="admin-card">
          <h2>封面图</h2>
          ${
            primaryImage
              ? `<div class="admin-cover-preview"><img src="${escapeAttr(resolveMediaUrlForImg(primaryImage.url))}" alt=""></div>`
              : `<div class="admin-cover-preview admin-cover-empty">暂无封面</div>`
          }
          <div class="admin-cover-meta">首页大卡片与关于页主卡共用此图</div>
          <div class="admin-upload">
            <input id="imageUpload" type="file" accept="image/*">
            <label for="imageUpload">选择一张封面图</label>
            <div style="margin-top:8px;">
              <button type="button" class="admin-btn admin-btn-sm admin-btn-ghost" id="journalClearCover" ${
                !primaryImage ? "disabled" : ""
              }>移除封面</button>
            </div>
            <div style="margin-top:8px;color:var(--admin-text-dim);font-size:12px;">JPG / PNG / WEBP / AVIF，建议 5MB 以内</div>
          </div>
        </section>
      </aside>`
      : `<aside class="admin-editor-aside">
        <section class="admin-card">
          <h2>封面与图片</h2>
          <div class="admin-image-main" id="adminImageMainBlock">
            ${
              asidePreview
                ? `<div class="admin-image-main-frame">
                    <img src="${escapeAttr(resolveMediaUrlForImg(asidePreview.url))}" alt="${escapeAttr(
                    asidePreview.alt || "",
                  )}" loading="lazy" decoding="async">
                  </div>
                  <div class="admin-image-main-bar">
                    ${
                      asidePreview.isPrimary
                        ? '<span class="admin-image-main-status">当前为首页封面</span>'
                        : '<button type="button" class="admin-btn admin-btn-sm admin-btn-primary" id="adminSetCoverBtn">设为首图（首页展示）</button>'
                    }
                  </div>`
                : `<div class="admin-image-main-frame admin-cover-empty">暂未上传图片</div>`
            }
          </div>
          <div class="admin-cover-meta">共 ${imageCount} 张 · 点缩略图切换大图 · 可指定任一张为首页封面</div>
          <div class="admin-images admin-images--thumbs" id="imagesGrid">
            ${(draft.images || []).map((im) => imageTile(im, selectedThumbId)).join("")}
          </div>
          <div class="admin-upload">
            <input id="imageUpload" type="file" accept="image/*" multiple>
            <label for="imageUpload">选择图片上传（可多选）</label>
            <div style="margin-top:8px;color:var(--admin-text-dim);font-size:12px;">JPG / PNG / WEBP / AVIF，单张建议 5MB 以内</div>
          </div>
        </section>
      </aside>`;

  const inner = `
    <div class="admin-page-head">
      <div>
        <div class="admin-crumb"><button class="admin-btn admin-btn-ghost admin-btn-sm" id="cancelEdit">← 返回列表</button></div>
        <h1>${isNew ? `新增${escapeHtml(r.label)}` : escapeHtml(String(editorTitle))}</h1>
        ${editorSub}
      </div>
      <div class="admin-toolbar">
        <span class="admin-badge ${draft.isPublished ? "is-on" : "is-off"}">${draft.isPublished ? "已发布" : "已下架"}</span>
        <button class="admin-btn admin-btn-primary" id="saveEdit">保存</button>
      </div>
    </div>

    <div class="admin-editor">
      <div class="admin-editor-main">
        <div class="admin-tabs">${tabsHtml}</div>
        <div class="admin-tab-body">${tabBody}</div>
      </div>

      ${asideBlock}
    </div>
  `;

  ROOT.innerHTML = appShell(inner);
  bindShell();
  bindEditor();
}

function imageTile(img, selectedPreviewId) {
  const isSel =
    selectedPreviewId != null && Number(selectedPreviewId) === Number(img.id);
  return `
    <div class="admin-image-tile${isSel ? " is-selected" : ""}" data-image="${img.id}" role="button" tabindex="0" title="点击在上方预览">
      <img src="${escapeAttr(resolveMediaUrlForImg(img.url))}" alt="${escapeAttr(img.alt || "")}" loading="lazy" decoding="async">
      ${img.isPrimary ? '<span class="primary-flag">封面</span>' : ""}
      <button type="button" class="remove" title="删除图片" data-remove-image="${img.id}">×</button>
    </div>
  `;
}

function bindEditor() {
  const r = currentResource();
  document.getElementById("cancelEdit").addEventListener("click", async () => {
    const abandonId = state.editingIsNew ? state.editingId : null;
    state.view = "list";
    state.editingId = null;
    state.editingIsNew = false;
    state.editingDraft = null;
    state.editingImagePreviewId = null;
    state.editorTab = "content";
    if (abandonId) {
      try {
        const res = await api(r.apiItem(abandonId));
        const item = res[r.itemKey];
        if (shouldAbandonNewDraft(r, item)) {
          await api(r.apiItem(abandonId), { method: "DELETE" });
        }
      } catch {
        /* 404：尚未写入过数据库 */
      }
      try {
        await refreshItems();
      } catch {
        /* 列表刷新失败时仍回到列表页 */
      }
    }
    render();
  });

  document.querySelectorAll("[data-editor-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.editorTab = btn.dataset.editorTab;
      renderEditor();
    });
  });

  document.querySelectorAll("[data-lang-tabs]").forEach((wrap) => {
    wrap.querySelectorAll("[data-lang]").forEach((tab) => {
      tab.addEventListener("click", () => {
        const lang = tab.dataset.lang;
        wrap.querySelectorAll("[data-lang]").forEach((t) =>
          t.classList.toggle("is-active", t === tab),
        );
        const container = wrap.parentElement;
        container.querySelectorAll("[data-lang-pane]").forEach((pane) => {
          pane.classList.toggle("is-active", pane.dataset.langPane === lang);
        });
      });
    });
  });

  const applyDraftInput = (input) => {
    const key = input.dataset.draft;
    if (input.type === "checkbox") state.editingDraft[key] = input.checked;
    else if (input.type === "number") state.editingDraft[key] = Number(input.value);
    else state.editingDraft[key] = input.value;
  };
  const syncAdminIconPreview = () => {
    const img = document.getElementById("adminIconPreviewImg");
    if (!img) return;
    const url = iconFieldPreviewUrl(state.editingDraft?.icon);
    if (url) {
      img.src = url;
      img.classList.remove("is-empty");
      img.hidden = false;
    } else {
      img.removeAttribute("src");
      img.classList.add("is-empty");
      img.hidden = true;
    }
  };
  document.querySelectorAll("[data-draft]").forEach((input) => {
    const evt = input.tagName === "SELECT" || input.type === "checkbox" ? "change" : "input";
    input.addEventListener(evt, () => {
      applyDraftInput(input);
      if (input.dataset.draft === "icon") syncAdminIconPreview();
      if (input.dataset.draft === "isPublished") {
        // Re-render so the header badge + switch label stay in sync.
        renderEditor();
      }
    });
  });

  document.querySelectorAll('[data-draft="totalPrice"], [data-draft="basePrice"]').forEach((input) => {
    input.addEventListener("blur", () => {
      const key = input.dataset.draft;
      const formatted = formatInventoryPriceYenStyle(input.value);
      input.value = formatted;
      state.editingDraft[key] = formatted;
    });
  });

  document.querySelectorAll("[data-preset]").forEach((input) => {
    input.addEventListener("input", () => {
      const [key, lang] = input.dataset.preset.split(".");
      const current = state.editingDraft[key] || {};
      state.editingDraft[key] = { ...current, [lang]: input.value };
    });
  });

  document.querySelectorAll("[data-preset-select]").forEach((select) => {
    select.addEventListener("change", () => {
      const key = select.dataset.presetSelect;
      const presetRow = currentResource().presets.find((p) => p[0] === key);
      const options = (presetRow && presetRow[3]) || [];
      const idx = select.value === "" ? -1 : Number(select.value);
      if (idx >= 0 && options[idx]) {
        const opt = options[idx];
        state.editingDraft[key] = { zh: opt.zh, ja: opt.ja, en: opt.en ?? "" };
      } else {
        state.editingDraft[key] = { zh: "", ja: "", en: "" };
      }
    });
  });

  document.querySelectorAll("[data-overview]").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      const lang = textarea.dataset.overview;
      const paragraphs = textarea.value
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      if (lang === "en") {
        state.editingDraft.overviewEn = paragraphs.length ? paragraphs : null;
      } else {
        state.editingDraft[lang === "zh" ? "overviewZh" : "overviewJa"] = paragraphs;
      }
    });
  });

  document.querySelectorAll("[data-journal-body]").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      const key = textarea.dataset.journalBody;
      if (key) state.editingDraft[key] = textarea.value;
    });
  });

  document.getElementById("saveEdit").addEventListener("click", saveItem);

  if (r.listKind === "journal" && typeof r.apiCover === "function") {
    document.getElementById("imageUpload")?.addEventListener("change", async (event) => {
      const files = Array.from(event.target.files || []);
      event.target.value = "";
      if (files.length === 0) return;
      const file = files[0];
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await api(r.apiCover(state.editingId), { method: "POST", body: form });
        const entry = res.entry;
        state.editingDraft = { ...entry, images: entry.images || [] };
        const cached = (state.items[r.key] || []).find((v) => v.id === state.editingId);
        if (cached) Object.assign(cached, state.editingDraft);
        renderEditor();
        showToast("封面已更新");
      } catch (err) {
        showToast(`上传失败：${err.message}`, "error");
      }
    });
    document.getElementById("journalClearCover")?.addEventListener("click", async () => {
      if (!confirm("移除封面？")) return;
      try {
        const res = await api(r.apiCover(state.editingId), { method: "DELETE" });
        const entry = res.entry;
        state.editingDraft = { ...entry, images: entry.images || [] };
        const cached = (state.items[r.key] || []).find((v) => v.id === state.editingId);
        if (cached) Object.assign(cached, state.editingDraft);
        renderEditor();
        showToast("已移除封面");
      } catch (err) {
        showToast(`操作失败：${err.message}`, "error");
      }
    });
  } else {
    document.getElementById("imageUpload")?.addEventListener("change", async (event) => {
      const files = Array.from(event.target.files || []);
      event.target.value = "";
      if (files.length === 0) return;
      try {
        const form = new FormData();
        for (const file of files) form.append("file", file);
        const res = await api(r.apiImages(state.editingId), { method: "POST", body: form });
        state.editingDraft.images = [...(state.editingDraft.images || []), ...res.images];
        state.editingImagePreviewId = null;
        const cached = (state.items[r.key] || []).find((v) => v.id === state.editingId);
        if (cached) cached.images = state.editingDraft.images;
        renderEditor();
        showToast(`已上传 ${res.images.length} 张图片`);
      } catch (err) {
        showToast(`上传失败：${err.message}`, "error");
      }
    });

    document.querySelectorAll("[data-remove-image]").forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const imageId = Number(btn.dataset.removeImage);
        if (!confirm("删除这张图片？")) return;
        try {
          await api(r.apiImage(state.editingId, imageId), { method: "DELETE" });
          state.editingDraft.images = state.editingDraft.images.filter((i) => i.id !== imageId);
          state.editingDraft.images.forEach((i, idx) => (i.isPrimary = idx === 0));
          if (state.editingImagePreviewId === imageId) state.editingImagePreviewId = null;
          const cached = (state.items[r.key] || []).find((v) => v.id === state.editingId);
          if (cached) cached.images = state.editingDraft.images;
          renderEditor();
          showToast("已删除图片");
        } catch (err) {
          showToast(`删除失败：${err.message}`, "error");
        }
      });
    });

    if (typeof r.apiImagesReorder === "function") {
      document.getElementById("adminSetCoverBtn")?.addEventListener("click", async () => {
        const preview = resolveAsidePreviewImage(state.editingDraft);
        if (!preview || preview.isPrimary) return;
        const imgs = state.editingDraft.images || [];
        const order = [preview.id, ...imgs.filter((i) => i.id !== preview.id).map((i) => i.id)];
        try {
          await api(r.apiImagesReorder(state.editingId), { method: "POST", body: { order } });
          const res = await api(r.apiItem(state.editingId));
          const item = res[r.itemKey];
          const merged = { ...state.editingDraft, ...item, images: item.images };
          state.editingDraft =
            r.key === "vehicles" || r.key === "rentals"
              ? normalizeInventoryDraftForEngine(merged)
              : merged;
          state.editingImagePreviewId = preview.id;
          const cached = (state.items[r.key] || []).find((v) => v.id === state.editingId);
          if (cached) Object.assign(cached, state.editingDraft);
          renderEditor();
          showToast("已设为首图");
        } catch (err) {
          showToast(`操作失败：${err.message}`, "error");
        }
      });

      document.getElementById("imagesGrid")?.addEventListener("click", (e) => {
        if (e.target.closest("[data-remove-image], .remove")) return;
        const tile = e.target.closest(".admin-image-tile[data-image]");
        if (!tile) return;
        state.editingImagePreviewId = Number(tile.dataset.image);
        renderEditor();
      });
    }
  }

  if (
    (r.key === "vehicles" || r.key === "rentals") &&
    typeof r.apiStaffPhoto === "function"
  ) {
    document.getElementById("staffPhotoUpload")?.addEventListener("change", async (event) => {
      const files = Array.from(event.target.files || []);
      event.target.value = "";
      if (files.length === 0) return;
      const file = files[0];
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await api(r.apiStaffPhoto(state.editingId), { method: "POST", body: form });
        const item = res[r.itemKey];
        state.editingDraft = {
          ...state.editingDraft,
          staffPhotoR2Key: item.staffPhotoR2Key,
          staffPhotoUrl: item.staffPhotoUrl,
        };
        const cached = (state.items[r.key] || []).find((v) => v.id === state.editingId);
        if (cached) {
          cached.staffPhotoR2Key = item.staffPhotoR2Key;
          cached.staffPhotoUrl = item.staffPhotoUrl;
        }
        renderEditor();
        showToast("员工照片已更新");
      } catch (err) {
        showToast(`上传失败：${err.message}`, "error");
      }
    });
    document.getElementById("staffClearStaffPhoto")?.addEventListener("click", async () => {
      if (!confirm("移除员工照片？")) return;
      try {
        const res = await api(r.apiStaffPhoto(state.editingId), { method: "DELETE" });
        const item = res[r.itemKey];
        state.editingDraft = {
          ...state.editingDraft,
          staffPhotoR2Key: item.staffPhotoR2Key,
          staffPhotoUrl: item.staffPhotoUrl,
        };
        const cached = (state.items[r.key] || []).find((v) => v.id === state.editingId);
        if (cached) {
          cached.staffPhotoR2Key = item.staffPhotoR2Key;
          cached.staffPhotoUrl = item.staffPhotoUrl;
        }
        renderEditor();
        showToast("已移除员工照片");
      } catch (err) {
        showToast(`操作失败：${err.message}`, "error");
      }
    });
  }
}

async function saveItem() {
  const r = currentResource();
  const draft = state.editingDraft;
  if (r.listKind === "journal") {
    if (!String(draft.titleZh || draft.titleJa || "").trim()) {
      showToast("请填写中文或日文标题", "error");
      return;
    }
  } else if (!draft.brandKey || !draft.name) {
    showToast("品牌与中文车型名称为必填项", "error");
    return;
  }

  // Strip empty preset objects so they persist as NULL instead of {zh:"",ja:""}
  const payload = { ...draft };
  (r.presets || []).forEach(([key]) => {
    const v = payload[key];
    if (v && typeof v === "object" && !v.zh && !v.ja && !v.en) payload[key] = null;
  });
  delete payload.images;
  if (r.key === "vehicles" || r.key === "rentals") {
    payload.engine = combinedEngineFromDraft(payload);
  }
  if (r.key === "vehicles") {
    if (Object.prototype.hasOwnProperty.call(payload, "totalPrice")) {
      payload.totalPrice = formatInventoryPriceYenStyle(payload.totalPrice);
    }
    if (Object.prototype.hasOwnProperty.call(payload, "basePrice")) {
      payload.basePrice = formatInventoryPriceYenStyle(payload.basePrice);
    }
  }
  try {
    if (state.editingIsNew) {
      payload.id = state.editingId;
      let saved = null;
      try {
        const res = await api(r.apiList, { method: "POST", body: payload });
        saved = res[r.itemKey];
      } catch (err) {
        if (err.code === r.duplicateCode) {
          const res = await api(r.apiItem(state.editingId), { method: "PUT", body: payload });
          saved = res[r.itemKey];
        } else {
          throw err;
        }
      }
      state.editingIsNew = false;
      const nextDraft = {
        ...saved,
        images: saved.images || state.editingDraft.images || [],
      };
      state.editingDraft =
        r.key === "vehicles" || r.key === "rentals"
          ? normalizeInventoryDraftForEngine(nextDraft)
          : nextDraft;
      showToast("已创建");
    } else {
      const res = await api(r.apiItem(state.editingId), {
        method: "PUT",
        body: payload,
      });
      const updated = res[r.itemKey];
      const nextUp = {
        ...updated,
        images: updated.images || state.editingDraft.images,
      };
      state.editingDraft =
        r.key === "vehicles" || r.key === "rentals"
          ? normalizeInventoryDraftForEngine(nextUp)
          : nextUp;
      showToast("已保存");
    }
    await refreshItems();
    renderEditor();
  } catch (err) {
    if (err.code === r.duplicateCode) {
      showToast("保存失败：记录标识冲突。", "error");
    } else {
      showToast(`保存失败：${err.message}`, "error");
    }
  }
}

// -------------------- Users view --------------------

function renderUsers() {
  const rows = state.users
    .map(
      (u) => `
    <tr>
      <td>${u.id}</td>
      <td><strong>${escapeHtml(u.username)}</strong></td>
      <td>${escapeHtml(u.role || "admin")}</td>
      <td>${escapeHtml(u.created_at || "")}</td>
      <td>
        <div class="admin-actions-cell">
          <button class="admin-btn admin-btn-sm" data-reset-pw="${u.id}">改密码</button>
          <button class="admin-btn admin-btn-sm admin-btn-danger" data-del-user="${u.id}" ${
            u.id === state.user?.id ? "disabled title='不能删除自己'" : ""
          }>删除</button>
        </div>
      </td>
    </tr>`,
    )
    .join("");

  const inner = `
    <div class="admin-page-head">
      <h1>管理员</h1>
    </div>
    <div class="admin-table-wrap" style="margin-bottom:20px;">
      <table class="admin-table">
        <thead>
          <tr>
            <th style="width:60px;">#</th>
            <th>用户名</th>
            <th>角色</th>
            <th>创建时间</th>
            <th style="text-align:right;">操作</th>
          </tr>
        </thead>
        <tbody>${rows || '<tr><td colspan="5" class="admin-empty">暂无用户</td></tr>'}</tbody>
      </table>
    </div>

    <div class="admin-card" style="max-width:480px;">
      <h2>新增管理员</h2>
      <form id="newUserForm" class="admin-grid">
        <div class="admin-field admin-grid-col-1">
          <label>用户名</label>
          <input id="newUserName" class="admin-input" type="text" required>
        </div>
        <div class="admin-field admin-grid-col-1">
          <label>密码</label>
          <input id="newUserPass" class="admin-input" type="password" required>
        </div>
        <div class="admin-grid-col-1">
          <button type="submit" class="admin-btn admin-btn-primary">创建</button>
        </div>
      </form>
    </div>
  `;

  ROOT.innerHTML = appShell(inner);
  bindShell();

  document.getElementById("newUserForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("newUserName").value.trim();
    const password = document.getElementById("newUserPass").value;
    if (!username || !password) return;
    try {
      await api("/admin/users", { method: "POST", body: { username, password } });
      showToast("管理员已创建");
      await refreshUsers();
    } catch (err) {
      showToast(
        err.code === "username_taken" ? "用户名已存在" : `创建失败：${err.message}`,
        "error",
      );
    }
  });

  document.querySelectorAll("[data-reset-pw]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.resetPw);
      const pw = prompt("输入新密码（至少 6 位）:");
      if (!pw || pw.length < 6) return;
      try {
        await api(`/admin/users/${id}`, { method: "PATCH", body: { password: pw } });
        showToast("密码已更新");
      } catch (err) {
        showToast(`修改失败：${err.message}`, "error");
      }
    });
  });

  document.querySelectorAll("[data-del-user]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.delUser);
      if (!confirm("确认删除该管理员？")) return;
      try {
        await api(`/admin/users/${id}`, { method: "DELETE" });
        showToast("已删除");
        await refreshUsers();
      } catch (err) {
        showToast(`删除失败：${err.message}`, "error");
      }
    });
  });
}

// -------------------- Render dispatcher --------------------

function render() {
  if (!state.user) return renderLogin();
  if (state.view === "editor" && state.editingDraft) return renderEditor();
  if (state.view === "users") return renderUsers();
  return renderList();
}

// -------------------- Utils --------------------

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

boot();
