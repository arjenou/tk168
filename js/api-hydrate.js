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
  const JOURNAL_KEY = "tk168:journal:v1";
  const MAX_AGE_MS = 5 * 60 * 1000;

  // Default API host for the production site.  Pages can override by
  // setting `window.TK168_API_BASE` before loading this script.
  // On tk168.co.jp the edge proxies `/api/*` to the Worker; same-origin
  // fetch avoids browser quirks around cross-site requests and matches
  // how `<img src="/api/media/…">` resolves on www.
  function resolveApiBase() {
    if (typeof window.TK168_API_BASE === "string") {
      return window.TK168_API_BASE.replace(/\/+$/, "");
    }
    try {
      const host = String(location.hostname || "").toLowerCase();
      if (host === "tk168.co.jp" || host === "www.tk168.co.jp") {
        return "";
      }
    } catch {
      /* ignore */
    }
    return "https://api.tk168.co.jp";
  }

  const API_BASE = resolveApiBase();

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
      grade: keepMeaningful(v.grade),
      year: keepMeaningful(v.year),
      type: keepMeaningful(v.type),
      icon: keepMeaningful(v.icon),
      photo,
      gallery,
      mileage: keepMeaningful(v.mileage),
      engine: keepMeaningful(v.engine),
      displacement: keepMeaningful(v.displacement),
      cylinders: keepMeaningful(v.cylinders),
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
      staffPhoto: keepMeaningful(toAbsoluteMedia(v.staffPhotoUrl)),
      staffMessage: keepMeaningful(v.staffMessage),
      staffPhone: keepMeaningful(v.staffPhone),
    };
    const out = {};
    for (const [k, val] of Object.entries(raw)) if (val !== undefined) out[k] = val;

    const cond = {};
    [
      ["condDealerWarranty", "dealerWarranty"],
      ["condOneOwner", "oneOwner"],
    ].forEach(([from, to]) => { if (v[from]) cond[to] = v[from]; });

    const listing = {};
    [
      ["listingRepairHistory", "repairHistory"],
      ["listingVehicleInspection", "vehicleInspection"],
      ["listingLegalMaintenance", "legalMaintenance"],
      ["listingFuelGrade", "fuelGrade"],
    ].forEach(([from, to]) => { if (v[from]) listing[to] = v[from]; });

    const highlight = {};
    [
      ["highlightSteering", "steering"],
      ["highlightChassisTail", "chassisTail"],
    ].forEach(([from, to]) => { if (v[from]) highlight[to] = v[from]; });

    return { vehicle: out, condition: cond, listing, highlight };
  }

  /** Rentals: always emit every display field so merge/list refresh clears stale session cache (keepMeaningful omits null → spread-merge kept old copy). */
  function adaptRentalImages(r) {
    const urls =
      Array.isArray(r.images) && r.images.length
        ? r.images.map((img) => toAbsoluteMedia(img.url)).filter(Boolean)
        : [];
    return { gallery: urls, photo: urls[0] || "" };
  }

  function adaptRental(r) {
    const { gallery, photo } = adaptRentalImages(r);
    const str = (v) => (v == null ? "" : String(v).trim());
    const jsonCol = (v) => (v == null ? null : v);

    return {
      id: r.id,
      brandKey: str(r.brandKey),
      name: str(r.name),
      nameJa: str(r.nameJa),
      nameEn: str(r.nameEn),
      grade: str(r.grade),
      year: str(r.year),
      type: str(r.type),
      icon: str(r.icon),
      photo,
      gallery,
      mileage: str(r.mileage),
      engine: str(r.engine),
      displacement: str(r.displacement),
      cylinders: str(r.cylinders),
      fuel: str(r.fuel),
      trans: str(r.trans),
      bodyStyle: str(r.bodyStyle),
      drive: str(r.drive),
      bodyColor: str(r.bodyColor),
      interiorColor: str(r.interiorColor),
      seats: str(r.seats),
      origin: str(r.origin),
      dailyRate: Number(r.dailyRate) || 0,
      deposit: Number(r.deposit) || 0,
      minDays: Number(r.minDays) || 1,
      rentalStatus: r.rentalStatus || "available",
      rentable: true,
      overview: jsonCol(r.overviewZh),
      overviewZh: jsonCol(r.overviewZh),
      overviewJa: jsonCol(r.overviewJa),
      overviewEn: jsonCol(r.overviewEn),
      benefits: jsonCol(r.benefits),
      features: jsonCol(r.features),
      staffPhoto: r.staffPhotoUrl ? str(toAbsoluteMedia(r.staffPhotoUrl)) : "",
      staffMessage: str(r.staffMessage),
      staffPhone: str(r.staffPhone),
    };
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

  function installJournal(journal) {
    window.TK168_API_JOURNAL = (journal || []).map((j) => ({
      ...j,
      imageUrl: j?.imageUrl ? toAbsoluteMedia(j.imageUrl) : j?.imageUrl,
    }));
  }

  // Synchronously expose whatever we have cached.
  const cachedVehicles = readCache(VEHICLE_KEY, "vehicles");
  if (cachedVehicles) installVehicles(cachedVehicles.vehicles);
  const cachedRentals = readCache(RENTAL_KEY, "rentals");
  if (cachedRentals) installRentals(cachedRentals.rentals);
  const cachedJournal = readCache(JOURNAL_KEY, "journal");
  if (cachedJournal) installJournal(cachedJournal.journal);

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
    refresh("journal", "journal", cachedJournal, JOURNAL_KEY, installJournal),
  ]).then((flags) => {
    const diverged = flags.some(Boolean);
    if (!diverged) return;
    if (window.__TK168_HYDRATED_ONCE__) return;
    window.__TK168_HYDRATED_ONCE__ = true;
    // We intentionally do NOT reload here.  Reloading right after the
    // first API fetch completes interrupts the hero/intro videos on the
    // home page (they're kicked off by script.js as soon as the page
    // boots, and their network load races with this fetch).  The cache
    // has just been populated, so the *next* page navigation will pick
    // up the API data synchronously, and individual pages can listen
    // to the `tk168:data-updated` event for live refreshes.
  });

  function vehicleApiRowToSiteFlat(v) {
    const a = adaptVehicle(v);
    return a.vehicle;
  }

  async function fetchPublishedVehicleById(id) {
    const rawId = String(id || "").trim();
    if (!rawId) return null;
    if (!/^https?:$/.test(location.protocol)) return null;
    const sameOrigin = !API_BASE || location.origin === API_BASE;
    const base = API_BASE || "";
    try {
      const endpoint = `${base}/api/vehicles/${encodeURIComponent(rawId)}`;
      const res = await fetch(endpoint, {
        credentials: sameOrigin ? "same-origin" : "omit",
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || !data.vehicle) return null;
      return vehicleApiRowToSiteFlat(data.vehicle);
    } catch {
      return null;
    }
  }

  async function fetchPublishedRentalById(id) {
    const rawId = String(id || "").trim();
    if (!rawId) return null;
    if (!/^https?:$/.test(location.protocol)) return null;
    const sameOrigin = !API_BASE || location.origin === API_BASE;
    const base = API_BASE || "";
    try {
      const endpoint = `${base}/api/rentals/${encodeURIComponent(rawId)}`;
      const res = await fetch(endpoint, {
        credentials: sameOrigin ? "same-origin" : "omit",
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || !data.rental) return null;
      return adaptRental(data.rental);
    } catch {
      return null;
    }
  }

  window.TK168ApiHydrate = {
    fetchPublishedVehicleById,
    fetchPublishedRentalById,
    vehicleApiRowToSiteFlat,
  };
})();
