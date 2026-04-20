// TK168 API hydrate: runs before data.js and exposes API-sourced data
// via `window.TK168_API_VEHICLES`, `window.TK168_API_PRESETS` and
// `window.TK168_API_RENTALS` so data.js can drop its hard-coded fixtures
// without an async refactor of every consumer page.
//
// Strategy per inventory ("vehicles" and "rentals"):
//   1. On page load, synchronously expose the cached snapshot from
//      sessionStorage so data.js has something to work with immediately.
//   2. In parallel, fetch the fresh payload from the Worker and cache it.
//      If it differs from the cached copy, swap the globals and — on the
//      first divergence of the session — reload so the rendered page
//      reflects the new data (since data.js consumes the globals at boot).
//
// If the Worker is unreachable (local file:// preview, offline, etc.),
// data.js falls back to its built-in defaults.

(() => {
  const VEHICLE_KEY = "tk168:vehicles:v1";
  const RENTAL_KEY = "tk168:rentals:v1";
  const MAX_AGE_MS = 5 * 60 * 1000;

  // Default API host for the production site.  Pages can override by
  // setting `window.TK168_API_BASE` before loading this script.
  const API_BASE = (typeof window.TK168_API_BASE === "string"
    ? window.TK168_API_BASE
    : "https://api.tk168.co.jp"
  ).replace(/\/+$/, "");

  function readCache(storageKey, listKey) {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return null;
      const payload = JSON.parse(raw);
      if (!payload || !Array.isArray(payload[listKey])) return null;
      return payload;
    } catch {
      return null;
    }
  }

  function writeCache(storageKey, listKey, items) {
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ savedAt: Date.now(), [listKey]: items }),
      );
    } catch {}
  }

  function toAbsoluteMedia(raw) {
    const s = String(raw || "").trim();
    if (!s) return "";
    if (/^(?:https?:)?\/\//.test(s) || s.startsWith("data:") || s.startsWith("blob:")) return s;
    if (s.startsWith("/api/") && API_BASE) return `${API_BASE}${s}`;
    return s;
  }

  function keepMeaningful(value) {
    if (value === null || value === undefined) return undefined;
    if (typeof value === "string" && value.trim() === "") return undefined;
    if (Array.isArray(value) && value.length === 0) return undefined;
    return value;
  }

  function adaptImages(v) {
    const gallery = Array.isArray(v.images) && v.images.length
      ? v.images.map((img) => toAbsoluteMedia(img.url)).filter(Boolean)
      : null;
    return {
      gallery: gallery && gallery.length ? gallery : undefined,
      photo: gallery && gallery.length ? gallery[0] : undefined,
    };
  }

  function adaptVehicle(v) {
    const { gallery, photo } = adaptImages(v);
    const raw = {
      id: v.id,
      brandKey: keepMeaningful(v.brandKey),
      name: keepMeaningful(v.name),
      nameJa: keepMeaningful(v.nameJa),
      nameEn: keepMeaningful(v.nameEn),
      year: keepMeaningful(v.year),
      type: keepMeaningful(v.type),
      icon: keepMeaningful(v.icon),
      photo,
      gallery,
      mileage: keepMeaningful(v.mileage),
      engine: keepMeaningful(v.engine),
      fuel: keepMeaningful(v.fuel),
      trans: keepMeaningful(v.trans),
      totalPrice: keepMeaningful(v.totalPrice),
      basePrice: keepMeaningful(v.basePrice),
      bodyStyle: keepMeaningful(v.bodyStyle),
      drive: keepMeaningful(v.drive),
      bodyColor: keepMeaningful(v.bodyColor),
      interiorColor: keepMeaningful(v.interiorColor),
      seats: keepMeaningful(v.seats),
      serviceRecord: keepMeaningful(v.serviceRecord),
      origin: keepMeaningful(v.origin),
      overview: keepMeaningful(v.overviewZh),
      overviewZh: keepMeaningful(v.overviewZh),
      overviewJa: keepMeaningful(v.overviewJa),
      overviewEn: keepMeaningful(v.overviewEn),
      benefits: keepMeaningful(v.benefits),
      features: keepMeaningful(v.features),
    };
    const out = {};
    for (const [k, val] of Object.entries(raw)) if (val !== undefined) out[k] = val;

    const cond = {};
    [
      ["condNonSmoking", "nonSmoking"],
      ["condAuthorizedImport", "authorizedImport"],
      ["condDealerWarranty", "dealerWarranty"],
      ["condEcoTaxEligible", "ecoTaxEligible"],
      ["condOneOwner", "oneOwner"],
      ["condRentalUp", "rentalUp"],
    ].forEach(([from, to]) => { if (v[from]) cond[to] = v[from]; });

    const listing = {};
    [
      ["listingRepairHistory", "repairHistory"],
      ["listingVehicleInspection", "vehicleInspection"],
      ["listingLegalMaintenance", "legalMaintenance"],
      ["listingPeriodicBook", "periodicInspectionBook"],
    ].forEach(([from, to]) => { if (v[from]) listing[to] = v[from]; });

    const highlight = {};
    [
      ["highlightSteering", "steering"],
      ["highlightChassisTail", "chassisTail"],
    ].forEach(([from, to]) => { if (v[from]) highlight[to] = v[from]; });

    return { vehicle: out, condition: cond, listing, highlight };
  }

  function adaptRental(r) {
    const { gallery, photo } = adaptImages(r);
    const raw = {
      id: r.id,
      brandKey: keepMeaningful(r.brandKey),
      name: keepMeaningful(r.name),
      nameJa: keepMeaningful(r.nameJa),
      nameEn: keepMeaningful(r.nameEn),
      year: keepMeaningful(r.year),
      type: keepMeaningful(r.type),
      icon: keepMeaningful(r.icon),
      photo,
      gallery,
      mileage: keepMeaningful(r.mileage),
      engine: keepMeaningful(r.engine),
      fuel: keepMeaningful(r.fuel),
      trans: keepMeaningful(r.trans),
      bodyStyle: keepMeaningful(r.bodyStyle),
      drive: keepMeaningful(r.drive),
      bodyColor: keepMeaningful(r.bodyColor),
      interiorColor: keepMeaningful(r.interiorColor),
      seats: keepMeaningful(r.seats),
      origin: keepMeaningful(r.origin),
      dailyRate: Number(r.dailyRate) || 0,
      deposit: Number(r.deposit) || 0,
      minDays: Number(r.minDays) || 1,
      rentalStatus: r.rentalStatus || "available",
      rentable: true,
      overview: keepMeaningful(r.overviewZh),
      overviewZh: keepMeaningful(r.overviewZh),
      overviewJa: keepMeaningful(r.overviewJa),
      overviewEn: keepMeaningful(r.overviewEn),
      benefits: keepMeaningful(r.benefits),
      features: keepMeaningful(r.features),
    };
    const out = {};
    for (const [k, val] of Object.entries(raw)) if (val !== undefined) out[k] = val;
    return out;
  }

  function installVehicles(vehicles) {
    const condition = {};
    const listing = {};
    const highlight = {};
    const flat = [];
    for (const v of vehicles) {
      const a = adaptVehicle(v);
      flat.push(a.vehicle);
      if (Object.keys(a.condition).length) condition[v.id] = a.condition;
      if (Object.keys(a.listing).length) listing[v.id] = a.listing;
      if (Object.keys(a.highlight).length) highlight[v.id] = a.highlight;
    }
    window.TK168_API_VEHICLES = flat;
    window.TK168_API_PRESETS = { condition, listing, highlight };
  }

  function installRentals(rentals) {
    window.TK168_API_RENTALS = rentals.map(adaptRental);
  }

  // Synchronously expose whatever we have cached.
  const cachedVehicles = readCache(VEHICLE_KEY, "vehicles");
  if (cachedVehicles) installVehicles(cachedVehicles.vehicles);
  const cachedRentals = readCache(RENTAL_KEY, "rentals");
  if (cachedRentals) installRentals(cachedRentals.rentals);

  if (!/^https?:$/.test(location.protocol)) return;

  const sameOrigin = !API_BASE || location.origin === API_BASE;
  const base = API_BASE || "";

  async function refresh(path, listKey, cached, storageKey, installer) {
    try {
      const endpoint = `${base}/api/${path}`;
      const res = await fetch(endpoint, {
        credentials: sameOrigin ? "same-origin" : "omit",
        cache: "no-store",
      });
      if (!res.ok) return false;
      const data = await res.json();
      const items = data && data[listKey];
      if (!Array.isArray(items)) return false;
      const serialised = JSON.stringify(items);
      const cachedSerialised = cached ? JSON.stringify(cached[listKey]) : "";
      writeCache(storageKey, listKey, items);
      if (serialised !== cachedSerialised) {
        installer(items);
        document.dispatchEvent(
          new CustomEvent("tk168:data-updated", { detail: { [listKey]: items } }),
        );
        return true; // diverged
      }
      return false;
    } catch {
      return false;
    }
  }

  Promise.all([
    refresh("vehicles", "vehicles", cachedVehicles, VEHICLE_KEY, installVehicles),
    refresh("rentals", "rentals", cachedRentals, RENTAL_KEY, installRentals),
  ]).then((flags) => {
    const diverged = flags.some(Boolean);
    if (!diverged) return;
    if (window.__TK168_HYDRATED_ONCE__) return;
    window.__TK168_HYDRATED_ONCE__ = true;
    // Only reload when we had cached data already rendered; on a first
    // visit (no cache) the globals are fresh and the page will render
    // correctly without reloading.
    if (cachedVehicles || cachedRentals) location.reload();
  });
})();
