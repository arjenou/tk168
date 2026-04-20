// TK168 API hydrate: runs before data.js and exposes API-sourced vehicle data
// via window.TK168_API_VEHICLES so the existing data.js can switch over to
// live content without an async refactor of every consumer page.
//
// Strategy:
//   1. On each page load, read the cached vehicle snapshot from sessionStorage
//      (if fresh) and expose it synchronously.
//   2. In parallel, fetch `/api/vehicles` in the background.  If the payload
//      differs from what's cached, refresh the cache and emit a
//      `tk168:data-updated` event so pages can re-render.  Detail pages
//      can listen to this event and rebuild their content.
//
// If `/api/vehicles` is unreachable (local file:// preview, offline, or the
// worker is not deployed yet), data.js falls back to its built-in base data.

(() => {
  const STORAGE_KEY = "tk168:vehicles:v1";
  const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

  // Default API host for the production site.  Pages can override by
  // setting `window.TK168_API_BASE` before loading this script (handy for
  // preview deploys or local dev).  An empty string keeps calls
  // same-origin, which is what the admin SPA (served by the worker itself)
  // wants.
  const API_BASE = (typeof window.TK168_API_BASE === "string"
    ? window.TK168_API_BASE
    : "https://api.tk168.co.jp"
  ).replace(/\/+$/, "");

  function readCache() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const payload = JSON.parse(raw);
      if (!payload || !Array.isArray(payload.vehicles)) return null;
      if (Date.now() - Number(payload.savedAt || 0) > MAX_AGE_MS) return payload; // still usable; we'll refresh
      return payload;
    } catch {
      return null;
    }
  }

  function writeCache(vehicles) {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ savedAt: Date.now(), vehicles }),
      );
    } catch {}
  }

  // Convert the API payload into the shape baseVehicles in data.js expects.
  function adaptVehicle(v) {
    const gallery = Array.isArray(v.images) && v.images.length
      ? v.images.map((img) => img.url)
      : v.gallery || (v.photo ? [v.photo] : []);
    const photo = gallery[0] || v.photo || "";

    // data.js `resolveVehicleMediaSource` accepts either a full URL or a bare
    // filename (prefixed with assets/images/).  We pass through whatever the
    // API returned so both seed data (relative assets/) and R2-served URLs
    // (e.g. /api/media/…) work.
    const out = {
      id: v.id,
      brandKey: v.brandKey,
      name: v.name,
      year: v.year || "",
      type: v.type || "",
      icon: v.icon || "b1.svg",
      photo,
      gallery,
      mileage: v.mileage || "",
      engine: v.engine || "",
      fuel: v.fuel || "",
      trans: v.trans || "",
      totalPrice: v.totalPrice || "",
      basePrice: v.basePrice || v.totalPrice || "",
      bodyStyle: v.bodyStyle || "",
      drive: v.drive || "",
      bodyColor: v.bodyColor || "",
      interiorColor: v.interiorColor || "",
      seats: v.seats || "",
      serviceRecord: v.serviceRecord || "",
      origin: v.origin || "",
      overview: Array.isArray(v.overviewZh) ? v.overviewZh : [],
      overviewJa: Array.isArray(v.overviewJa) ? v.overviewJa : [],
      overviewEn: Array.isArray(v.overviewEn) ? v.overviewEn : undefined,
      benefits: v.benefits || undefined,
      features: v.features || undefined,
    };

    // Preset maps (condition / listing / highlight) piggy-back via window
    // globals so data.js can expose them through its getters.
    const cond = {};
    [
      ["condNonSmoking", "nonSmoking"],
      ["condAuthorizedImport", "authorizedImport"],
      ["condDealerWarranty", "dealerWarranty"],
      ["condEcoTaxEligible", "ecoTaxEligible"],
      ["condOneOwner", "oneOwner"],
      ["condRentalUp", "rentalUp"],
    ].forEach(([from, to]) => {
      if (v[from]) cond[to] = v[from];
    });

    const listing = {};
    [
      ["listingRepairHistory", "repairHistory"],
      ["listingVehicleInspection", "vehicleInspection"],
      ["listingLegalMaintenance", "legalMaintenance"],
      ["listingPeriodicBook", "periodicInspectionBook"],
    ].forEach(([from, to]) => {
      if (v[from]) listing[to] = v[from];
    });

    const highlight = {};
    [
      ["highlightSteering", "steering"],
      ["highlightChassisTail", "chassisTail"],
    ].forEach(([from, to]) => {
      if (v[from]) highlight[to] = v[from];
    });

    return { vehicle: out, condition: cond, listing, highlight };
  }

  function installApiData(vehicles) {
    const condition = {};
    const listing = {};
    const highlight = {};
    const flatVehicles = [];
    for (const raw of vehicles) {
      const adapted = adaptVehicle(raw);
      flatVehicles.push(adapted.vehicle);
      if (Object.keys(adapted.condition).length) condition[raw.id] = adapted.condition;
      if (Object.keys(adapted.listing).length) listing[raw.id] = adapted.listing;
      if (Object.keys(adapted.highlight).length) highlight[raw.id] = adapted.highlight;
    }
    window.TK168_API_VEHICLES = flatVehicles;
    window.TK168_API_PRESETS = { condition, listing, highlight };
  }

  // ---- Install cached data synchronously so data.js sees it on boot ----
  const cached = readCache();
  if (cached && Array.isArray(cached.vehicles)) {
    installApiData(cached.vehicles);
  }

  // ---- Fetch fresh data in the background ----
  // Only try on http(s):// pages; file:// previews skip the network call.
  if (/^https?:$/.test(location.protocol)) {
    // Use the same-origin endpoint when the admin SPA is being served by the
    // worker itself (i.e. API_BASE is empty or matches current origin),
    // otherwise hit the public API host (CORS-enabled).
    const endpoint = API_BASE ? `${API_BASE}/api/vehicles` : "/api/vehicles";
    const sameOrigin = !API_BASE || endpoint.startsWith(location.origin);
    fetch(endpoint, {
      credentials: sameOrigin ? "same-origin" : "omit",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || !Array.isArray(data.vehicles)) return;
        const serialised = JSON.stringify(data.vehicles);
        const cachedSerialised = cached ? JSON.stringify(cached.vehicles) : "";
        writeCache(data.vehicles);
        if (serialised !== cachedSerialised) {
          installApiData(data.vehicles);
          document.dispatchEvent(
            new CustomEvent("tk168:data-updated", { detail: { vehicles: data.vehicles } }),
          );
        }
      })
      .catch(() => {
        // Silent: fallback to static data.
      });
  }
})();
