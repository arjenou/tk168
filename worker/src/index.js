import {
  login,
  logout,
  currentUser,
  listUsers,
  createUser,
  updateUserPassword,
  deleteUser,
} from "./auth.js";
import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImage,
  deleteVehicleImage,
  reorderVehicleImages,
} from "./vehicles.js";
import {
  listRentals,
  getRental,
  createRental,
  updateRental,
  deleteRental,
  uploadRentalImage,
  deleteRentalImage,
  reorderRentalImages,
} from "./rentals.js";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function parseAllowedOrigins(env) {
  return String(env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Browsers send Origin: http://localhost:<port> (or 127.0.0.1) when the SPA
// is served from a local dev server while calling the production API host.
// That origin cannot be guessed ahead of time in wrangler.toml, so we allow
// loopback hosts explicitly (only these origins can be sent for same-site
// policy — a random https site cannot spoof localhost).
function isLoopbackDevOrigin(origin) {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

// LAN dev servers (e.g. http://10.x / 192.168.x) are not in wrangler.toml
// and are not "loopback". Without this, browsers block credentialed fetch
// to the production API host with no visible CORS error body ("Failed to fetch").
// Restrict to http: + RFC1918 IPv4 only (same rough trust as local network).
function isPrivateLanHttpOrigin(origin) {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:") return false;
    const h = u.hostname;
    if (h === "localhost" || h === "127.0.0.1") return false;
    const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
    if (!m) return false;
    const o = (i) => Number(m[i]);
    const a = o(1);
    const b = o(2);
    const c = o(3);
    const d = o(4);
    if ([a, b, c, d].some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    return false;
  } catch {
    return false;
  }
}

// Build the CORS headers for a given request/env pair.  The allow-list is
// sourced from CORS_ALLOWED_ORIGINS; we echo the origin only when it matches
// so credentialed fetches work and unknown sites are rejected.
function corsHeaders(request, env) {
  const origin = request.headers.get("origin") || "";
  const allowed = parseAllowedOrigins(env);
  const isAllowed =
    Boolean(origin && allowed.includes(origin)) ||
    isLoopbackDevOrigin(origin) ||
    isPrivateLanHttpOrigin(origin);
  const headers = { vary: "Origin" };
  if (isAllowed) {
    headers["access-control-allow-origin"] = origin;
    headers["access-control-allow-credentials"] = "true";
  }
  return headers;
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(corsHeaders(request, env))) headers.set(k, v);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function preflight(request, env) {
  const reqHeaders = request.headers.get("access-control-request-headers") || "content-type,authorization";
  const reqMethod = request.headers.get("access-control-request-method") || "GET,POST,PUT,PATCH,DELETE";
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders(request, env),
      "access-control-allow-methods": `${reqMethod},OPTIONS`,
      "access-control-allow-headers": reqHeaders,
      "access-control-max-age": "86400",
    },
  });
}

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extra },
  });
}

function error(status, code, message = code) {
  return json({ error: code, message }, status);
}

// Session cookie.  The admin SPA and the public site live on different hosts
// (api.tk168.co.jp vs. www.tk168.co.jp / the same API host when the admin
// SPA is hit directly), so the cookie must be SameSite=None to survive the
// cross-site POST to /api/auth/login.  Secure is required by SameSite=None.
function cookieHeader(token, expiresAt) {
  if (!token) {
    return "tk168_admin=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0";
  }
  const maxAge = Math.max(0, expiresAt - Math.floor(Date.now() / 1000));
  return `tk168_admin=${encodeURIComponent(
    token,
  )}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${maxAge}`;
}

async function requireAuth(env, request) {
  const user = await currentUser(env, request);
  if (!user) {
    const err = new Error("unauthorized");
    err.status = 401;
    throw err;
  }
  return user;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    const err = new Error("invalid_json");
    err.status = 400;
    throw err;
  }
}

async function handleApi(request, env, url) {
  let path = url.pathname.replace(/^\/api\/?/, "/");
  if (path.length > 1) path = path.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();

  // ---------- Public ----------
  if (path === "/vehicles" && method === "GET") {
    const vehicles = await listVehicles(env, { includeUnpublished: false });
    return json({ vehicles });
  }
  if (path.startsWith("/vehicles/") && method === "GET" && path.split("/").length === 3) {
    const id = decodeURIComponent(path.split("/")[2]);
    const vehicle = await getVehicle(env, id);
    if (!vehicle || !vehicle.isPublished) return error(404, "not_found");
    return json({ vehicle });
  }
  if (path === "/rentals" && method === "GET") {
    const rentals = await listRentals(env, { includeUnpublished: false });
    return json({ rentals });
  }
  if (path.startsWith("/rentals/") && method === "GET" && path.split("/").length === 3) {
    const id = decodeURIComponent(path.split("/")[2]);
    const rental = await getRental(env, id);
    if (!rental || !rental.isPublished) return error(404, "not_found");
    return json({ rental });
  }
  if (path.startsWith("/media/") && method === "GET") {
    const key = decodeURIComponent(path.slice("/media/".length));
    if (!key) return error(400, "missing_key");
    const object = await env.R2.get(key);
    if (!object) return error(404, "not_found");
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    return new Response(object.body, { headers });
  }

  // ---------- Auth ----------
  if (path === "/auth/login" && method === "POST") {
    const { username, password } = await readJson(request);
    if (!username || !password) return error(400, "missing_credentials");
    const result = await login(env, String(username).trim(), String(password));
    if (!result) return error(401, "invalid_credentials");
    return json(
      { user: result.user, token: result.token, expiresAt: result.expiresAt },
      200,
      { "set-cookie": cookieHeader(result.token, result.expiresAt) },
    );
  }
  if (path === "/auth/logout" && method === "POST") {
    const user = await currentUser(env, request);
    if (user?.token) await logout(env, user.token);
    return json({ ok: true }, 200, { "set-cookie": cookieHeader("", 0) });
  }
  if (path === "/auth/me" && method === "GET") {
    const user = await currentUser(env, request);
    if (!user) return error(401, "unauthorized");
    return json({ user: { id: user.id, username: user.username, role: user.role } });
  }

  // ---------- Admin-only ----------
  const me = await requireAuth(env, request);

  // Users
  if (path === "/admin/users" && method === "GET") {
    return json({ users: await listUsers(env) });
  }
  if (path === "/admin/users" && method === "POST") {
    const { username, password, role } = await readJson(request);
    if (!username || !password) return error(400, "missing_fields");
    const user = await createUser(env, { username, password, role });
    return json({ user }, 201);
  }
  {
    const match = /^\/admin\/users\/(\d+)$/.exec(path);
    if (match) {
      const userId = Number(match[1]);
      if (method === "PATCH") {
        const { password } = await readJson(request);
        if (!password) return error(400, "missing_password");
        await updateUserPassword(env, userId, password);
        return json({ ok: true });
      }
      if (method === "DELETE") {
        if (userId === me.id) return error(400, "cannot_delete_self");
        await deleteUser(env, userId);
        return json({ ok: true });
      }
    }
  }

  // Vehicles (admin view includes unpublished)
  if (path === "/admin/vehicles" && method === "GET") {
    return json({ vehicles: await listVehicles(env, { includeUnpublished: true }) });
  }
  if (path === "/admin/vehicles" && method === "POST") {
    const body = await readJson(request);
    const vehicle = await createVehicle(env, body);
    return json({ vehicle }, 201);
  }
  {
    const match = /^\/admin\/vehicles\/([^/]+)$/.exec(path);
    if (match) {
      const id = decodeURIComponent(match[1]);
      if (method === "GET") {
        const vehicle = await getVehicle(env, id);
        if (!vehicle) return error(404, "not_found");
        return json({ vehicle });
      }
      if (method === "PUT" || method === "PATCH") {
        const body = await readJson(request);
        const vehicle = await updateVehicle(env, id, body);
        return json({ vehicle });
      }
      if (method === "DELETE") {
        const ok = await deleteVehicle(env, id);
        if (!ok) return error(404, "not_found");
        return json({ ok: true });
      }
    }
  }

  // Images
  {
    const match = /^\/admin\/vehicles\/([^/]+)\/images$/.exec(path);
    if (match && method === "POST") {
      const vehicleId = decodeURIComponent(match[1]);
      const form = await request.formData();
      const files = form.getAll("file");
      if (files.length === 0) return error(400, "no_file");
      const alts = form.getAll("alt");
      const uploaded = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!(file instanceof File)) continue;
        uploaded.push(
          await uploadVehicleImage(env, vehicleId, file, {
            alt: alts[i] ? String(alts[i]) : "",
          }),
        );
      }
      return json({ images: uploaded }, 201);
    }
    const reorderMatch = /^\/admin\/vehicles\/([^/]+)\/images\/reorder$/.exec(path);
    if (reorderMatch && method === "POST") {
      const vehicleId = decodeURIComponent(reorderMatch[1]);
      const { order } = await readJson(request);
      await reorderVehicleImages(env, vehicleId, order);
      return json({ ok: true });
    }
    const delMatch = /^\/admin\/vehicles\/([^/]+)\/images\/(\d+)$/.exec(path);
    if (delMatch && method === "DELETE") {
      const vehicleId = decodeURIComponent(delMatch[1]);
      const imageId = Number(delMatch[2]);
      await deleteVehicleImage(env, vehicleId, imageId);
      return json({ ok: true });
    }
  }

  // Rentals (parallel to vehicles but a distinct inventory)
  if (path === "/admin/rentals" && method === "GET") {
    return json({ rentals: await listRentals(env, { includeUnpublished: true }) });
  }
  if (path === "/admin/rentals" && method === "POST") {
    const body = await readJson(request);
    const rental = await createRental(env, body);
    return json({ rental }, 201);
  }
  {
    const match = /^\/admin\/rentals\/([^/]+)$/.exec(path);
    if (match) {
      const id = decodeURIComponent(match[1]);
      if (method === "GET") {
        const rental = await getRental(env, id);
        if (!rental) return error(404, "not_found");
        return json({ rental });
      }
      if (method === "PUT" || method === "PATCH") {
        const body = await readJson(request);
        const rental = await updateRental(env, id, body);
        return json({ rental });
      }
      if (method === "DELETE") {
        const ok = await deleteRental(env, id);
        if (!ok) return error(404, "not_found");
        return json({ ok: true });
      }
    }
  }
  {
    const match = /^\/admin\/rentals\/([^/]+)\/images$/.exec(path);
    if (match && method === "POST") {
      const rentalId = decodeURIComponent(match[1]);
      const form = await request.formData();
      const files = form.getAll("file");
      if (files.length === 0) return error(400, "no_file");
      const alts = form.getAll("alt");
      const uploaded = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!(file instanceof File)) continue;
        uploaded.push(
          await uploadRentalImage(env, rentalId, file, {
            alt: alts[i] ? String(alts[i]) : "",
          }),
        );
      }
      return json({ images: uploaded }, 201);
    }
    const reorderMatch = /^\/admin\/rentals\/([^/]+)\/images\/reorder$/.exec(path);
    if (reorderMatch && method === "POST") {
      const rentalId = decodeURIComponent(reorderMatch[1]);
      const { order } = await readJson(request);
      await reorderRentalImages(env, rentalId, order);
      return json({ ok: true });
    }
    const delMatch = /^\/admin\/rentals\/([^/]+)\/images\/(\d+)$/.exec(path);
    if (delMatch && method === "DELETE") {
      const rentalId = decodeURIComponent(delMatch[1]);
      const imageId = Number(delMatch[2]);
      await deleteRentalImage(env, rentalId, imageId);
      return json({ ok: true });
    }
  }

  return error(404, "not_found");
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const isApi = url.pathname === "/api" || url.pathname.startsWith("/api/");

    // CORS preflight for API requests originating from the Vercel frontend.
    if (isApi && request.method === "OPTIONS") {
      return preflight(request, env);
    }

    if (isApi) {
      let response;
      try {
        response = await handleApi(request, env, url);
      } catch (err) {
        const status = err?.status && Number.isInteger(err.status) ? err.status : 500;
        const code = err?.message || "internal_error";
        if (status >= 500) console.error("API error:", err);
        response = error(status, code);
      }
      return withCors(response, request, env);
    }

    // Root of the API host shows a short info page — the admin is now
    // served by Vercel at https://www.tk168.co.jp/admin, so we don't want
    // api.tk168.co.jp/ to look like a real UI.
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(
        "TK168 API — use https://www.tk168.co.jp/admin to manage content.",
        { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } },
      );
    }
    // Static assets (admin.html and friends) are still reachable via the
    // ASSETS binding as an emergency fallback.  Regular users should hit
    // www.tk168.co.jp/admin instead.
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Not found", { status: 404 });
  },
};
