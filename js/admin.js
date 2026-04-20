// TK168 admin SPA — talks to /api/* endpoints served by the worker.
// No framework; vanilla DOM + fetch.  All endpoints use cookie-based auth
// (the server sets an HttpOnly `tk168_admin` cookie on login).

const API_BASE = "/api";
const ROOT = document.getElementById("adminRoot");

const state = {
  user: null,
  view: "login",          // 'login' | 'vehicles' | 'editor' | 'users'
  vehicles: [],
  users: [],
  editingId: null,        // vehicle id when editing
  editingDraft: null,     // working copy of the vehicle
  filter: "",
  loading: false,
  toast: null,
};

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
    state.view = "vehicles";
    await refreshVehicles();
  } catch (err) {
    state.user = null;
    state.view = "login";
  }
  render();
}

// -------------------- Data loading --------------------

async function refreshVehicles() {
  state.loading = true;
  render();
  try {
    const res = await api("/admin/vehicles");
    state.vehicles = res.vehicles;
  } catch (err) {
    showToast(`载入车辆失败：${err.message}`, "error");
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
      state.view = "vehicles";
      await refreshVehicles();
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
  const items = [
    { id: "vehicles", label: "车辆管理" },
    { id: "users",    label: "管理员" },
  ];
  return items
    .map(
      (item) => `
      <button class="admin-nav-item ${state.view === item.id || (item.id === "vehicles" && state.view === "editor") ? "is-active" : ""}" data-nav="${item.id}">
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
      state.view = target;
      state.editingId = null;
      if (target === "users") await refreshUsers();
      if (target === "vehicles") await refreshVehicles();
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

// -------------------- Vehicle list view --------------------

function filterVehicles() {
  const q = state.filter.trim().toLowerCase();
  if (!q) return state.vehicles;
  return state.vehicles.filter((v) =>
    [v.id, v.name, v.brandKey, v.type, v.year].some((field) =>
      String(field || "").toLowerCase().includes(q),
    ),
  );
}

function renderVehicleList() {
  const rows = filterVehicles();
  const inner = `
    <div class="admin-page-head">
      <h1>车辆管理 <span style="color:var(--admin-text-dim);font-size:14px;font-weight:400;">（${state.vehicles.length} 台）</span></h1>
      <div class="admin-toolbar">
        <input id="vehicleSearch" class="admin-input admin-search" type="search" placeholder="搜索 ID / 名称 / 品牌" value="${escapeHtml(state.filter)}">
        <button class="admin-btn admin-btn-primary" id="newVehicleBtn">+ 新增车辆</button>
      </div>
    </div>
    <div class="admin-table-wrap">
      ${state.loading
        ? '<div class="admin-loading">加载中…</div>'
        : rows.length === 0
        ? '<div class="admin-empty">未找到匹配的车辆。</div>'
        : `<table class="admin-table">
            <thead>
              <tr>
                <th style="width:84px;">封面</th>
                <th>名称 / ID</th>
                <th>品牌</th>
                <th>年份</th>
                <th>总价</th>
                <th>图片</th>
                <th>状态</th>
                <th style="text-align:right;">操作</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(vehicleRow).join("")}
            </tbody>
          </table>`}
    </div>
  `;
  ROOT.innerHTML = appShell(inner);
  bindShell();

  const searchInput = document.getElementById("vehicleSearch");
  searchInput?.addEventListener("input", (event) => {
    state.filter = event.target.value;
    const tbody = document.querySelector(".admin-table tbody");
    if (tbody) tbody.innerHTML = filterVehicles().map(vehicleRow).join("");
    bindRowActions();
  });

  document.getElementById("newVehicleBtn")?.addEventListener("click", () => {
    state.editingId = "__new__";
    state.editingDraft = emptyVehicle();
    state.view = "editor";
    render();
  });

  bindRowActions();
}

function bindRowActions() {
  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.edit;
      const vehicle = state.vehicles.find((v) => v.id === id);
      if (!vehicle) return;
      state.editingId = id;
      state.editingDraft = { ...vehicle, images: [...(vehicle.images || [])] };
      state.view = "editor";
      render();
    });
  });
  document.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.delete;
      if (!confirm(`确认删除车辆 ${id}？将同时删除其所有图片。`)) return;
      try {
        await api(`/admin/vehicles/${encodeURIComponent(id)}`, { method: "DELETE" });
        showToast("已删除");
        await refreshVehicles();
      } catch (err) {
        showToast(`删除失败：${err.message}`, "error");
      }
    });
  });
  document.querySelectorAll("[data-toggle-pub]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.togglePub;
      const v = state.vehicles.find((x) => x.id === id);
      if (!v) return;
      try {
        await api(`/admin/vehicles/${encodeURIComponent(id)}`, {
          method: "PATCH",
          body: { isPublished: !v.isPublished },
        });
        showToast(v.isPublished ? "已下架" : "已发布");
        await refreshVehicles();
      } catch (err) {
        showToast(`切换失败：${err.message}`, "error");
      }
    });
  });
}

function vehicleRow(v) {
  const cover = v.images?.[0]?.url || "";
  return `
    <tr>
      <td>${cover ? `<img class="admin-thumb" src="${escapeAttr(cover)}" alt="">` : '<div class="admin-thumb"></div>'}</td>
      <td>
        <div style="font-weight:600;">${escapeHtml(v.name)}</div>
        <div style="font-size:11px;color:var(--admin-text-muted);">${escapeHtml(v.id)}</div>
      </td>
      <td>${escapeHtml(v.brandKey || "")}</td>
      <td>${escapeHtml(v.year || "")}</td>
      <td>${escapeHtml(v.totalPrice || "")}</td>
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

function emptyVehicle() {
  return {
    id: "",
    brandKey: "",
    name: "",
    year: "",
    type: "",
    icon: "b1.svg",
    mileage: "",
    engine: "",
    fuel: "汽油",
    trans: "自动挡",
    totalPrice: "",
    basePrice: "",
    bodyStyle: "",
    drive: "",
    bodyColor: "",
    interiorColor: "",
    seats: "",
    serviceRecord: "完整在册",
    origin: "",
    overviewZh: [""],
    overviewJa: [""],
    overviewEn: null,
    benefits: null,
    features: null,
    condNonSmoking: { zh: "", ja: "" },
    condAuthorizedImport: { zh: "", ja: "" },
    condDealerWarranty: { zh: "", ja: "" },
    condEcoTaxEligible: { zh: "", ja: "" },
    condOneOwner: { zh: "", ja: "" },
    condRentalUp: { zh: "", ja: "" },
    listingRepairHistory: { zh: "", ja: "" },
    listingVehicleInspection: { zh: "", ja: "" },
    listingLegalMaintenance: { zh: "", ja: "" },
    listingPeriodicBook: { zh: "", ja: "" },
    highlightSteering: { zh: "", ja: "" },
    highlightChassisTail: { zh: "", ja: "" },
    displayOrder: state.vehicles.length,
    isPublished: true,
    images: [],
  };
}

// -------------------- Editor --------------------

const FIELD_ROWS = [
  // [key, label, kind?]
  ["id", "车辆 ID（英文，唯一）"],
  ["brandKey", "品牌 Key（如 lamborghini）"],
  ["name", "车型名称（中文）"],
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
];

const PRESET_ROWS = [
  ["condNonSmoking", "禁烟车"],
  ["condAuthorizedImport", "正规进口"],
  ["condDealerWarranty", "店铺质保"],
  ["condEcoTaxEligible", "节能减税"],
  ["condOneOwner", "一手车主"],
  ["condRentalUp", "租赁退役"],
  ["listingRepairHistory", "修复历"],
  ["listingVehicleInspection", "车检"],
  ["listingLegalMaintenance", "法定整备"],
  ["listingPeriodicBook", "点检记录簿"],
  ["highlightSteering", "方向盘"],
  ["highlightChassisTail", "车台末尾号"],
];

function renderEditor() {
  const draft = state.editingDraft;
  const isNew = state.editingId === "__new__";

  const mainFields = FIELD_ROWS.map(([key, label]) => `
    <div class="admin-field">
      <label>${label}</label>
      <input class="admin-input" data-draft="${key}" value="${escapeAttr(draft[key] ?? "")}" ${
        key === "id" && !isNew ? "readonly" : ""
      }>
    </div>`).join("");

  const overviewZh = Array.isArray(draft.overviewZh) ? draft.overviewZh.join("\n\n") : (draft.overviewZh || "");
  const overviewJa = Array.isArray(draft.overviewJa) ? draft.overviewJa.join("\n\n") : (draft.overviewJa || "");
  const overviewEn = Array.isArray(draft.overviewEn) ? draft.overviewEn.join("\n\n") : (draft.overviewEn || "");

  const presetFields = PRESET_ROWS.map(([key, label]) => {
    const v = draft[key] || {};
    return `
      <div class="admin-grid" style="margin-bottom:6px;">
        <div class="admin-field admin-grid-col-1" style="grid-column:span 2;margin-bottom:-4px;"><label style="text-transform:none;font-weight:600;color:var(--admin-text);font-size:13px;letter-spacing:0;">${label}</label></div>
        <div class="admin-field"><label>中文</label><input class="admin-input" data-preset="${key}.zh" value="${escapeAttr(v.zh ?? "")}"></div>
        <div class="admin-field"><label>日文</label><input class="admin-input" data-preset="${key}.ja" value="${escapeAttr(v.ja ?? "")}"></div>
      </div>`;
  }).join("");

  const inner = `
    <div class="admin-page-head">
      <h1>${isNew ? "新增车辆" : `编辑：${escapeHtml(draft.name || draft.id)}`}</h1>
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

        <section class="admin-card">
          <h2>参数 / 规格</h2>
          ${presetFields}
        </section>
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
          ${isNew ? '<div class="admin-message" style="margin-top:12px;color:var(--admin-text-dim);">请先保存车辆，再上传图片。</div>' : ""}
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
      <img src="${escapeAttr(img.url)}" alt="${escapeAttr(img.alt || "")}">
      ${img.isPrimary ? '<span class="primary-flag">封面</span>' : ""}
      <button class="remove" title="删除图片" data-remove-image="${img.id}">×</button>
    </div>
  `;
}

function bindEditor() {
  document.getElementById("cancelEdit").addEventListener("click", () => {
    state.view = "vehicles";
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

  document.getElementById("saveEdit").addEventListener("click", saveVehicle);

  document.getElementById("imageUpload")?.addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;
    if (state.editingId === "__new__") {
      showToast("请先保存车辆再上传图片", "error");
      return;
    }
    try {
      const form = new FormData();
      for (const file of files) form.append("file", file);
      const res = await api(
        `/admin/vehicles/${encodeURIComponent(state.editingId)}/images`,
        { method: "POST", body: form },
      );
      state.editingDraft.images = [...(state.editingDraft.images || []), ...res.images];
      // also update the cached vehicle
      const cached = state.vehicles.find((v) => v.id === state.editingId);
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
        await api(
          `/admin/vehicles/${encodeURIComponent(state.editingId)}/images/${imageId}`,
          { method: "DELETE" },
        );
        state.editingDraft.images = state.editingDraft.images.filter((i) => i.id !== imageId);
        // re-compute primary flag
        state.editingDraft.images.forEach((i, idx) => (i.isPrimary = idx === 0));
        const cached = state.vehicles.find((v) => v.id === state.editingId);
        if (cached) cached.images = state.editingDraft.images;
        renderEditor();
        showToast("已删除图片");
      } catch (err) {
        showToast(`删除失败：${err.message}`, "error");
      }
    });
  });
}

async function saveVehicle() {
  const draft = state.editingDraft;
  if (!draft.id || !draft.brandKey || !draft.name) {
    showToast("ID / 品牌 / 名称 为必填项", "error");
    return;
  }

  // Strip empty preset objects so they persist as NULL instead of {zh:"",ja:""}
  const payload = { ...draft };
  PRESET_ROWS.forEach(([key]) => {
    const v = payload[key];
    if (v && typeof v === "object" && !v.zh && !v.ja && !v.en) payload[key] = null;
  });
  delete payload.images;

  try {
    if (state.editingId === "__new__") {
      const res = await api("/admin/vehicles", { method: "POST", body: payload });
      state.editingId = res.vehicle.id;
      state.editingDraft = { ...res.vehicle, images: res.vehicle.images || [] };
      showToast("车辆已创建。现在可以上传图片。");
    } else {
      const res = await api(`/admin/vehicles/${encodeURIComponent(state.editingId)}`, {
        method: "PUT",
        body: payload,
      });
      state.editingDraft = { ...res.vehicle, images: res.vehicle.images || state.editingDraft.images };
      showToast("已保存");
    }
    await refreshVehicles();
    renderEditor();
  } catch (err) {
    if (err.code === "vehicle_id_taken") {
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
  return renderVehicleList();
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
