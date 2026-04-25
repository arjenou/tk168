// TK168 admin SPA — talks to /api/* endpoints served by the worker.
// No framework; vanilla DOM + fetch.  All endpoints use cookie-based auth
// (the server sets an HttpOnly `tk168_admin` cookie on login).
//
// The admin exposes two independent inventories:
//   * "vehicles"  -> /api/admin/vehicles  (homepage / detail page)
//   * "rentals"   -> /api/admin/rentals   (rental.html fleet)
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
  const prefix = resourceKey === "rentals" ? "r" : "v";
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
          { key: "brandKey", label: "品牌 Key", placeholder: "lamborghini", span: 4, required: true },
          { key: "year", label: "年份", placeholder: "2022", span: 4 },
          { key: "type", label: "车型分类", placeholder: "高性能 SUV", span: 4 },
          { key: "icon", label: "图标文件名", placeholder: "b1.svg", hint: "素材文件夹里的小图标", span: 4 },
          { key: "bodyStyle", label: "车身类型", placeholder: "高性能 SUV", span: 4 },
          { key: "drive", label: "驱动方式", placeholder: "四轮驱动", span: 4 },
          { key: "bodyColor", label: "车身颜色", placeholder: "曜石黑", span: 4 },
          { key: "interiorColor", label: "内饰颜色", placeholder: "黑色真皮", span: 4 },
          { key: "seats", label: "座位", placeholder: "5 座", span: 4 },
          { key: "origin", label: "产地", placeholder: "意大利进口", span: 4 },
          { key: "serviceRecord", label: "保养记录", placeholder: "完整在册", span: 4 },
        ],
      },
      {
        id: "power",
        label: "动力与价格",
        fields: [
          { key: "engine", label: "发动机", placeholder: "4.0L V8", span: 6 },
          { key: "mileage", label: "里程 (km)", placeholder: "3,200", span: 3 },
          { key: "fuel", label: "燃料", placeholder: "汽油", span: 3 },
          { key: "trans", label: "变速箱", placeholder: "自动挡", span: 4 },
          { key: "totalPrice", label: "支付总额", placeholder: "¥ 1,980,000", hint: "含手续费的显示总价", span: 4 },
          { key: "basePrice", label: "车辆本体价格", placeholder: "¥ 1,860,000", span: 4 },
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
      ["condNonSmoking", "禁烟车", "select", YES_NO_DASH],
      ["condAuthorizedImport", "正规进口", "select", YES_NO_DASH],
      ["condDealerWarranty", "店铺质保", "select", YES_NO_DASH],
      ["condEcoTaxEligible", "节能减税", "select", YES_NO_DASH],
      ["condOneOwner", "一手车主", "select", YES_NO_DASH],
      ["condRentalUp", "租赁退役", "select", YES_NO_DASH],
      ["listingRepairHistory", "修复历", "select", YES_NO_DASH],
      ["listingVehicleInspection", "车检", "select", YES_NO_DASH],
      ["listingLegalMaintenance", "法定整备", "select", YES_NO_DASH],
      ["listingPeriodicBook", "点检记录簿", "select", YES_NO_DASH],
      ["highlightSteering", "方向盘"],
      ["highlightChassisTail", "车台末尾号"],
    ],
    emptyDraft: () => ({
      id: "", brandKey: "", name: "", nameJa: "", nameEn: "", year: "", type: "", icon: "b1.svg",
      mileage: "", engine: "", fuel: "汽油", trans: "自动挡",
      totalPrice: "", basePrice: "",
      bodyStyle: "", drive: "", bodyColor: "", interiorColor: "", seats: "",
      serviceRecord: "完整在册", origin: "",
      overviewZh: [""], overviewJa: [""], overviewEn: null,
      benefits: null, features: null,
      condNonSmoking: { zh: "", ja: "", en: "" },
      condAuthorizedImport: { zh: "", ja: "", en: "" },
      condDealerWarranty: { zh: "", ja: "", en: "" },
      condEcoTaxEligible: { zh: "", ja: "", en: "" },
      condOneOwner: { zh: "", ja: "", en: "" },
      condRentalUp: { zh: "", ja: "", en: "" },
      listingRepairHistory: { zh: "", ja: "", en: "" },
      listingVehicleInspection: { zh: "", ja: "", en: "" },
      listingLegalMaintenance: { zh: "", ja: "", en: "" },
      listingPeriodicBook: { zh: "", ja: "", en: "" },
      highlightSteering: { zh: "", ja: "", en: "" },
      highlightChassisTail: { zh: "", ja: "", en: "" },
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
          { key: "brandKey", label: "品牌 Key", placeholder: "lamborghini", span: 4, required: true },
          { key: "year", label: "年份", placeholder: "2022", span: 4 },
          { key: "type", label: "车型分类", placeholder: "高性能 SUV", span: 4 },
          { key: "icon", label: "图标文件名", placeholder: "b1.svg", span: 4 },
          { key: "bodyStyle", label: "车身类型", placeholder: "高性能 SUV", span: 4 },
          { key: "drive", label: "驱动方式", placeholder: "四轮驱动", span: 4 },
          { key: "bodyColor", label: "车身颜色", placeholder: "曜石黑", span: 4 },
          { key: "interiorColor", label: "内饰颜色", placeholder: "黑色真皮", span: 4 },
          { key: "seats", label: "座位", placeholder: "2 座", span: 4 },
          { key: "origin", label: "产地", placeholder: "德国进口", span: 4 },
        ],
      },
      {
        id: "power",
        label: "动力",
        fields: [
          { key: "engine", label: "发动机", placeholder: "4.0L V8", span: 6 },
          { key: "mileage", label: "里程 (km)", placeholder: "3,200", span: 3 },
          { key: "fuel", label: "燃料", placeholder: "汽油", span: 3 },
          { key: "trans", label: "变速箱", placeholder: "自动挡", span: 3 },
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
      id: "", brandKey: "", name: "", nameJa: "", nameEn: "", year: "", type: "", icon: "b1.svg",
      mileage: "", engine: "", fuel: "汽油", trans: "自动挡",
      bodyStyle: "", drive: "", bodyColor: "", interiorColor: "",
      seats: "2 座", origin: "",
      dailyRate: 0, deposit: 0, minDays: 1, rentalStatus: "available",
      overviewZh: [""], overviewJa: [""], overviewEn: null,
      benefits: null, features: null,
      displayOrder: 0, isPublished: true, images: [],
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

// -------------------- App state --------------------

const state = {
  user: null,
  // "login" | "list" | "editor" | "users"
  view: "login",
  // "vehicles" | "rentals" — which inventory is currently active
  resource: "vehicles",
  // "content" | "specs" | "media" — active editor tab
  editorTab: "content",
  // per-resource caches, keyed by resource name
  items: { vehicles: [], rentals: [] },
  users: [],
  editingId: null,
  editingDraft: null,
  filter: "",
  loading: false,
  toast: null,
};

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
        <div class="admin-brand-sub">车辆内容后台 · Cloudflare Workers</div>
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
  const items = state.items[state.resource] || [];
  const q = state.filter.trim().toLowerCase();
  if (!q) return items;
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

  const inner = `
    <div class="admin-page-head">
      <h1>${escapeHtml(r.headerLabel)} <span style="color:var(--admin-text-dim);font-size:14px;font-weight:400;">（${items.length} 台）</span></h1>
      ${dragHint}
      <div class="admin-toolbar">
        <input id="itemSearch" class="admin-input admin-search" type="search" placeholder="搜索 名称 / 品牌" value="${escapeHtml(state.filter)}">
        <button class="admin-btn admin-btn-primary" id="newItemBtn">+ 新增${r.label}</button>
      </div>
    </div>
    <div class="admin-table-wrap">
      ${state.loading
        ? '<div class="admin-loading">加载中…</div>'
        : rows.length === 0
        ? `<div class="admin-empty">${escapeHtml(r.emptyLabel)}</div>`
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
              ${rows.map((row) => itemRow(row, r)).join("")}
            </tbody>
          </table>`}
    </div>
  `;
  ROOT.innerHTML = appShell(inner);
  bindShell();

  const searchInput = document.getElementById("itemSearch");
  searchInput?.addEventListener("input", (event) => {
    state.filter = event.target.value;
    const tbody = document.querySelector(".admin-table tbody");
    if (tbody) tbody.innerHTML = filteredItems().map((row) => itemRow(row, r)).join("");
    bindRowActions();
  });

  document.getElementById("newItemBtn")?.addEventListener("click", () => {
    state.editingId = "__new__";
    const draft = r.emptyDraft();
    draft.displayOrder = (state.items[r.key] || []).length;
    state.editingDraft = draft;
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
    showToast(r.key === "rentals" ? "租赁页展示顺序已保存" : "首页展示顺序已保存");
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
  return `
    <tr data-item-id="${escapeAttr(v.id)}">
      ${dragCell}
      <td>${cover ? `<img class="admin-thumb" src="${escapeAttr(cover)}" alt="">` : '<div class="admin-thumb"></div>'}</td>
      <td>
        <div style="font-weight:600;">${escapeHtml(v.name)}</div>
      </td>
      <td>${escapeHtml(v.brandKey || "")}</td>
      <td>${escapeHtml(v.year || "")}</td>
      <td>${escapeHtml(v[r.priceColumn.key] ?? "")}</td>
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
      state.editingId = id;
      state.editingDraft = { ...item, images: [...(item.images || [])] };
      state.view = "editor";
      render();
    });
  });
  document.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.delete;
      const row = (state.items[r.key] || []).find((x) => x.id === id);
      const label = row?.name || id;
      if (!confirm(`确认删除「${label}」？将同时删除其所有图片。`)) return;
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

// Editor tabs shown at the top of the left column. "specs" only rendered
// when the resource has preset rows (vehicles).
const EDITOR_TABS = [
  { id: "content", label: "内容" },
  { id: "specs", label: "规格 / 选项", requiresPresets: true },
  { id: "publish", label: "发布设置" },
];

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
    const opts = (field.options || [])
      .map(
        (opt) =>
          `<option value="${escapeAttr(opt.value)}" ${opt.value === value ? "selected" : ""}>${escapeHtml(opt.label)}</option>`,
      )
      .join("");
    control = `<select class="admin-input" data-draft="${key}">${opts}</select>`;
  } else if (field.type === "number") {
    control = `<input class="admin-input" type="number" data-draft="${key}" value="${escapeAttr(value ?? 0)}" placeholder="${escapeAttr(field.placeholder || "")}">`;
  } else {
    control = `<input class="admin-input" type="text" data-draft="${key}" value="${escapeAttr(value ?? "")}" placeholder="${escapeAttr(field.placeholder || "")}">`;
  }

  return `
    <div class="admin-field admin-col-${span}">
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

function renderContentTab(r, draft) {
  const groupsHtml = (r.fieldGroups || [])
    .map((g) => renderEditorGroup(g, draft))
    .join("");

  const overviewZh = Array.isArray(draft.overviewZh) ? draft.overviewZh.join("\n\n") : (draft.overviewZh || "");
  const overviewJa = Array.isArray(draft.overviewJa) ? draft.overviewJa.join("\n\n") : (draft.overviewJa || "");
  const overviewEn = Array.isArray(draft.overviewEn) ? draft.overviewEn.join("\n\n") : (draft.overviewEn || "");

  return `
    <section class="admin-section">
      <div class="admin-section-head">
        <h3>车型名称</h3>
        <p>中文必填；日文 / 英文可空，前台会按品牌 + 中文名推断展示。</p>
      </div>
      <div class="admin-grid-12">
        <div class="admin-field admin-col-4">
          <label>中文 <span class="admin-required">*</span></label>
          <input class="admin-input" data-draft="name" value="${escapeAttr(draft.name ?? "")}" placeholder="Urus S">
        </div>
        <div class="admin-field admin-col-4">
          <label>日文</label>
          <input class="admin-input" data-draft="nameJa" value="${escapeAttr(draft.nameJa ?? "")}" placeholder="ウルス S">
        </div>
        <div class="admin-field admin-col-4">
          <label>英文</label>
          <input class="admin-input" data-draft="nameEn" value="${escapeAttr(draft.nameEn ?? "")}" placeholder="Urus S">
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

function renderPublishTab(r, draft, isNew) {
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
        <p>系统会在保存时自动生成内部${escapeHtml(r.label)}标识（不在界面显示）。</p>
      </div>
      <div class="admin-grid-12">
        <div class="admin-field admin-col-6">
          <label>前台可见</label>
          <label class="admin-switch">
            <input type="checkbox" data-draft="isPublished" ${draft.isPublished ? "checked" : ""}>
            <span>${draft.isPublished ? "已发布" : "已下架"}</span>
          </label>
          <div class="admin-field-hint">关闭后仅你能在后台看到，该车不会出现在前台列表。</div>
        </div>
        ${orderHint}
        ${sortField}
      </div>
      ${isNew ? '<div class="admin-message" style="margin-top:14px;">新车辆保存后再回来上传图片。</div>' : ""}
    </section>
  `;
}

function renderEditor() {
  const r = currentResource();
  const draft = state.editingDraft;
  const isNew = state.editingId === "__new__";

  const availableTabs = EDITOR_TABS.filter(
    (t) => !t.requiresPresets || (r.presets && r.presets.length > 0),
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
  else if (state.editorTab === "publish") tabBody = renderPublishTab(r, draft, isNew);

  const primaryImage = (draft.images || []).find((i) => i.isPrimary) || (draft.images || [])[0];
  const imageCount = (draft.images || []).length;

  const inner = `
    <div class="admin-page-head">
      <div>
        <div class="admin-crumb"><button class="admin-btn admin-btn-ghost admin-btn-sm" id="cancelEdit">← 返回列表</button></div>
        <h1>${isNew ? `新增${escapeHtml(r.label)}` : escapeHtml(draft.name || draft.nameJa || draft.nameEn || "未命名")}</h1>
        ${!isNew && (draft.brandKey || draft.year) ? `<div class="admin-subtle">${[draft.brandKey, draft.year].filter(Boolean).map(escapeHtml).join(" · ")}</div>` : ""}
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

      <aside class="admin-editor-aside">
        <section class="admin-card">
          <h2>封面与图片</h2>
          ${primaryImage
            ? `<div class="admin-cover-preview"><img src="${escapeAttr(resolveMediaUrlForImg(primaryImage.url))}" alt="${escapeAttr(primaryImage.alt || "")}"></div>`
            : `<div class="admin-cover-preview admin-cover-empty">暂未上传图片</div>`}
          <div class="admin-cover-meta">共 ${imageCount} 张图片 · 第一张自动作为封面</div>
          <div class="admin-images" id="imagesGrid">
            ${(draft.images || []).map(imageTile).join("") || ""}
          </div>
          <div class="admin-upload">
            <input id="imageUpload" type="file" accept="image/*" multiple ${isNew ? "disabled" : ""}>
            <label for="imageUpload">${isNew ? "保存后可上传" : "选择图片上传（可多选）"}</label>
            <div style="margin-top:8px;color:var(--admin-text-dim);font-size:12px;">JPG / PNG / WEBP / AVIF，单张建议 5MB 以内</div>
          </div>
        </section>
      </aside>
    </div>
  `;

  ROOT.innerHTML = appShell(inner);
  bindShell();
  bindEditor();
}

function imageTile(img) {
  return `
    <div class="admin-image-tile" data-image="${img.id}">
      <img src="${escapeAttr(resolveMediaUrlForImg(img.url))}" alt="${escapeAttr(img.alt || "")}">
      ${img.isPrimary ? '<span class="primary-flag">封面</span>' : ""}
      <button class="remove" title="删除图片" data-remove-image="${img.id}">×</button>
    </div>
  `;
}

function bindEditor() {
  const r = currentResource();
  document.getElementById("cancelEdit").addEventListener("click", () => {
    state.view = "list";
    state.editingId = null;
    state.editingDraft = null;
    state.editorTab = "content";
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
  document.querySelectorAll("[data-draft]").forEach((input) => {
    const evt = input.tagName === "SELECT" || input.type === "checkbox" ? "change" : "input";
    input.addEventListener(evt, () => {
      applyDraftInput(input);
      if (input.dataset.draft === "isPublished") {
        // Re-render so the header badge + switch label stay in sync.
        renderEditor();
      }
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

  document.getElementById("saveEdit").addEventListener("click", saveItem);

  document.getElementById("imageUpload")?.addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;
    if (state.editingId === "__new__") {
      showToast("请先保存再上传图片", "error");
      return;
    }
    try {
      const form = new FormData();
      for (const file of files) form.append("file", file);
      const res = await api(r.apiImages(state.editingId), { method: "POST", body: form });
      state.editingDraft.images = [...(state.editingDraft.images || []), ...res.images];
      const cached = (state.items[r.key] || []).find((v) => v.id === state.editingId);
      if (cached) cached.images = state.editingDraft.images;
      renderEditor();
      showToast(`已上传 ${res.images.length} 张图片`);
    } catch (err) {
      showToast(`上传失败：${err.message}`, "error");
    }
  });

  document.querySelectorAll("[data-remove-image]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const imageId = Number(btn.dataset.removeImage);
      if (!confirm("删除这张图片？")) return;
      try {
        await api(r.apiImage(state.editingId, imageId), { method: "DELETE" });
        state.editingDraft.images = state.editingDraft.images.filter((i) => i.id !== imageId);
        state.editingDraft.images.forEach((i, idx) => (i.isPrimary = idx === 0));
        const cached = (state.items[r.key] || []).find((v) => v.id === state.editingId);
        if (cached) cached.images = state.editingDraft.images;
        renderEditor();
        showToast("已删除图片");
      } catch (err) {
        showToast(`删除失败：${err.message}`, "error");
      }
    });
  });
}

async function saveItem() {
  const r = currentResource();
  const draft = state.editingDraft;
  if (!draft.brandKey || !draft.name) {
    showToast("品牌与中文车型名称为必填项", "error");
    return;
  }

  // Strip empty preset objects so they persist as NULL instead of {zh:"",ja:""}
  const payload = { ...draft };
  r.presets.forEach(([key]) => {
    const v = payload[key];
    if (v && typeof v === "object" && !v.zh && !v.ja && !v.en) payload[key] = null;
  });
  delete payload.images;

  try {
    if (state.editingId === "__new__") {
      let created = null;
      let lastDup = null;
      for (let attempt = 0; attempt < 12; attempt++) {
        payload.id = generateInventoryId(r.key);
        try {
          const res = await api(r.apiList, { method: "POST", body: payload });
          created = res[r.itemKey];
          break;
        } catch (err) {
          if (err.code === r.duplicateCode) {
            lastDup = err;
            continue;
          }
          throw err;
        }
      }
      if (!created) {
        showToast(lastDup ? "创建失败：ID 冲突，请稍后再试" : "创建失败", "error");
        return;
      }
      state.editingId = created.id;
      state.editingDraft = { ...created, images: created.images || [] };
      showToast("已创建。现在可以上传图片。");
    } else {
      const res = await api(r.apiItem(state.editingId), {
        method: "PUT",
        body: payload,
      });
      const updated = res[r.itemKey];
      state.editingDraft = {
        ...updated,
        images: updated.images || state.editingDraft.images,
      };
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
