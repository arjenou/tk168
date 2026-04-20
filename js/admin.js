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
// When the page is served by the Worker itself (e.g. a preview deploy at
// api.tk168.co.jp/admin, or local `wrangler dev`) we fall back to the
// same-origin /api path so the admin keeps working there too.
const SAME_ORIGIN_API_HOSTS = new Set([
  "api.tk168.co.jp",
  "tk168-api.wangyunjie1101.workers.dev",
  "localhost",
  "127.0.0.1",
]);
const API_BASE = SAME_ORIGIN_API_HOSTS.has(location.hostname)
  ? "/api"
  : "https://api.tk168.co.jp/api";

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
    fields: [
      ["id", "车辆 ID（英文，唯一）"],
      ["brandKey", "品牌 Key（如 lamborghini）"],
      ["name", "车型名称（中文，必填）"],
      ["nameJa", "车型名称（日文，可空；空则前台日文用品牌+中文名推断）"],
      ["nameEn", "车型名称（英文，可空；空则前台英文用品牌+中文名推断）"],
      ["year", "年份"],
      ["type", "车型分类（如 高性能SUV）"],
      ["icon", "图标文件名（如 b1.svg）"],
      ["mileage", "里程（如 3,200）"],
      ["engine", "发动机（如 4.0L V8）"],
      ["fuel", "燃料"],
      ["trans", "变速箱"],
      ["totalPrice", "支付总额（如 ¥ 1,980,000）"],
      ["basePrice", "车辆本体价格"],
      ["bodyStyle", "车身类型"],
      ["drive", "驱动方式"],
      ["bodyColor", "车身颜色"],
      ["interiorColor", "内饰颜色"],
      ["seats", "座位（如 5 座）"],
      ["serviceRecord", "保养记录"],
      ["origin", "产地（如 意大利进口）"],
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
    priceColumn: { key: "dailyRate", label: "日租金(¥)" },
    extraColumns: [
      { key: "rentalStatus", label: "状态", render: (v) => statusLabel(v) },
    ],
    fields: [
      ["id", "租赁车 ID（英文，唯一）"],
      ["brandKey", "品牌 Key（如 lamborghini）"],
      ["name", "车型名称（中文，必填）"],
      ["nameJa", "车型名称（日文，可空）"],
      ["nameEn", "车型名称（英文，可空）"],
      ["year", "年份"],
      ["type", "车型分类"],
      ["icon", "图标文件名（如 b1.svg）"],
      ["mileage", "里程"],
      ["engine", "发动机"],
      ["fuel", "燃料"],
      ["trans", "变速箱"],
      ["bodyStyle", "车身类型"],
      ["drive", "驱动方式"],
      ["bodyColor", "车身颜色"],
      ["interiorColor", "内饰颜色"],
      ["seats", "座位"],
      ["origin", "产地"],
      ["dailyRate", "日租金（JPY / 整数）", "number"],
      ["deposit", "押金（JPY / 整数）", "number"],
      ["minDays", "最短租期（天）", "number"],
      ["rentalStatus", "档期状态 (available / reserved / rented / unavailable)"],
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
    const err = new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
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
      label: "🏠 " + RESOURCES.vehicles.label,
      active: onList && state.resource === "vehicles",
      onClick: "vehicles-list",
    },
    {
      id: "nav-rentals",
      label: "🚗 " + RESOURCES.rentals.label,
      active: onList && state.resource === "rentals",
      onClick: "rentals-list",
    },
    {
      id: "nav-users",
      label: "👤 管理员",
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

  const inner = `
    <div class="admin-page-head">
      <h1>${escapeHtml(r.headerLabel)} <span style="color:var(--admin-text-dim);font-size:14px;font-weight:400;">（${items.length} 台）</span></h1>
      <div class="admin-toolbar">
        <input id="itemSearch" class="admin-input admin-search" type="search" placeholder="搜索 ID / 名称 / 品牌" value="${escapeHtml(state.filter)}">
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
                <th style="width:84px;">封面</th>
                <th>名称 / ID</th>
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

function itemRow(v, r) {
  const cover = resolveMediaUrlForImg(v.images?.[0]?.url || "");
  const extraCells = (r.extraColumns || [])
    .map((c) => `<td>${escapeHtml(c.render ? c.render(v[c.key]) : v[c.key] ?? "")}</td>`)
    .join("");
  return `
    <tr>
      <td>${cover ? `<img class="admin-thumb" src="${escapeAttr(cover)}" alt="">` : '<div class="admin-thumb"></div>'}</td>
      <td>
        <div style="font-weight:600;">${escapeHtml(v.name)}</div>
        <div style="font-size:11px;color:var(--admin-text-muted);">${escapeHtml(v.id)}</div>
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
      if (!confirm(`确认删除 ${id}？将同时删除其所有图片。`)) return;
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

function renderEditor() {
  const r = currentResource();
  const draft = state.editingDraft;
  const isNew = state.editingId === "__new__";

  const mainFields = r.fields.map(([key, label, inputType]) => {
    const value = draft[key];
    const isNumber = inputType === "number";
    return `
      <div class="admin-field">
        <label>${label}</label>
        <input class="admin-input" type="${isNumber ? "number" : "text"}"
               data-draft="${key}"
               value="${escapeAttr(value ?? (isNumber ? 0 : ""))}"
               ${key === "id" && !isNew ? "readonly" : ""}>
      </div>`;
  }).join("");

  const overviewZh = Array.isArray(draft.overviewZh) ? draft.overviewZh.join("\n\n") : (draft.overviewZh || "");
  const overviewJa = Array.isArray(draft.overviewJa) ? draft.overviewJa.join("\n\n") : (draft.overviewJa || "");
  const overviewEn = Array.isArray(draft.overviewEn) ? draft.overviewEn.join("\n\n") : (draft.overviewEn || "");

  const presetFields = r.presets
    .map((row) => {
      const [key, label, kind, options] = row;
      const v = draft[key] || {};

      if (kind === "select") {
        // Match legacy rows that only stored { zh, ja }.
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
          <div class="admin-field" style="margin-bottom:10px;">
            <label style="text-transform:none;font-weight:600;color:var(--admin-text);font-size:13px;letter-spacing:0;">${label}</label>
            <select class="admin-input" data-preset-select="${key}">${optionsHtml}</select>
          </div>`;
      }

      return `
        <div style="margin-bottom:10px;">
          <div style="font-weight:600;color:var(--admin-text);font-size:13px;letter-spacing:0;margin-bottom:8px;">${escapeHtml(label)}</div>
          <div class="admin-preset-lang-row">
            <div class="admin-field"><label>中文</label><input class="admin-input" data-preset="${key}.zh" value="${escapeAttr(v.zh ?? "")}"></div>
            <div class="admin-field"><label>日文</label><input class="admin-input" data-preset="${key}.ja" value="${escapeAttr(v.ja ?? "")}"></div>
            <div class="admin-field"><label>英文</label><input class="admin-input" data-preset="${key}.en" value="${escapeAttr(v.en ?? "")}"></div>
          </div>
          <div style="font-size:11px;color:var(--admin-text-dim);margin-top:4px;">数字或符号三语相同时，可在三栏填相同内容。</div>
        </div>`;
    })
    .join("");

  const presetSection = r.presets.length
    ? `<section class="admin-card">
         <h2>参数 / 规格（中日英）</h2>
         ${presetFields}
       </section>`
    : "";

  const inner = `
    <div class="admin-page-head">
      <h1>${isNew ? `新增${r.label}` : `编辑：${escapeHtml(draft.name || draft.id)}`}</h1>
      <div class="admin-toolbar">
        <button class="admin-btn" id="cancelEdit">返回列表</button>
        <button class="admin-btn admin-btn-primary" id="saveEdit">保存</button>
      </div>
    </div>

    <div class="admin-editor">
      <div>
        <section class="admin-card">
          <h2>基础信息</h2>
          <div class="admin-grid">${mainFields}</div>
          <div style="margin-top:14px;">
            <label class="admin-checkbox">
              <input type="checkbox" data-draft="isPublished" ${draft.isPublished ? "checked" : ""}>
              <span>在前台发布</span>
            </label>
          </div>
          <div class="admin-field" style="margin-top:14px;">
            <label>排序（越小越靠前）</label>
            <input class="admin-input" type="number" data-draft="displayOrder" value="${Number(draft.displayOrder ?? 0)}">
          </div>
        </section>

        <section class="admin-card">
          <h2>车辆概述</h2>
          <div class="admin-field">
            <label>中文概述（段落以空行分隔）</label>
            <textarea class="admin-textarea" data-overview="zh">${escapeHtml(overviewZh)}</textarea>
          </div>
          <div class="admin-field">
            <label>日文概述</label>
            <textarea class="admin-textarea" data-overview="ja">${escapeHtml(overviewJa)}</textarea>
          </div>
          <div class="admin-field">
            <label>英文概述（可留空，留空时自动生成）</label>
            <textarea class="admin-textarea" data-overview="en">${escapeHtml(overviewEn)}</textarea>
          </div>
        </section>

        ${presetSection}
      </div>

      <div>
        <section class="admin-card">
          <h2>图片（第一张自动作为封面）</h2>
          <div class="admin-images" id="imagesGrid">
            ${(draft.images || []).map(imageTile).join("") || '<div class="admin-empty" style="padding:24px;">暂无图片</div>'}
          </div>
          <div class="admin-upload">
            <input id="imageUpload" type="file" accept="image/*" multiple>
            <label for="imageUpload">选择图片上传（可多选）</label>
            <div style="margin-top:8px;color:var(--admin-text-dim);font-size:12px;">支持 JPG / PNG / WEBP / AVIF，单张建议 5MB 以内</div>
          </div>
          ${isNew ? '<div class="admin-message" style="margin-top:12px;color:var(--admin-text-dim);">请先保存，再上传图片。</div>' : ""}
        </section>
      </div>
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
    render();
  });

  document.querySelectorAll("[data-draft]").forEach((input) => {
    input.addEventListener("input", () => {
      const key = input.dataset.draft;
      if (input.type === "checkbox") state.editingDraft[key] = input.checked;
      else if (input.type === "number") state.editingDraft[key] = Number(input.value);
      else state.editingDraft[key] = input.value;
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
  if (!draft.id || !draft.brandKey || !draft.name) {
    showToast("ID / 品牌 / 名称 为必填项", "error");
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
      const res = await api(r.apiList, { method: "POST", body: payload });
      const created = res[r.itemKey];
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
      showToast("该 ID 已存在，请换一个。", "error");
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
