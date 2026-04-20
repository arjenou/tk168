import { hashPassword, verifyPassword, randomToken } from "./password.js";

const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

async function ensureBootstrapAdmin(env) {
  // If there are no users yet, create one from the BOOTSTRAP_ADMIN_* secrets
  // (or fall back to admin/admin168 so the system is usable out of the box).
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM users").first();
  if (row && Number(row.n) > 0) return;

  const username = (env.BOOTSTRAP_ADMIN_USERNAME || "admin").trim();
  const password = (env.BOOTSTRAP_ADMIN_PASSWORD || "admin168").trim();
  const { hash, salt } = await hashPassword(password);
  await env.DB.prepare(
    "INSERT INTO users (username, password_hash, password_salt, role) VALUES (?, ?, ?, 'admin')",
  )
    .bind(username, hash, salt)
    .run();
}

export async function login(env, username, password) {
  await ensureBootstrapAdmin(env);

  const user = await env.DB.prepare(
    "SELECT id, username, password_hash, password_salt, role FROM users WHERE username = ?",
  )
    .bind(username)
    .first();
  if (!user) return null;

  const ok = await verifyPassword(password, user.password_hash, user.password_salt);
  if (!ok) return null;

  const token = randomToken(32);
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  await env.DB.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
  )
    .bind(token, user.id, expiresAt)
    .run();

  return {
    token,
    expiresAt,
    user: { id: user.id, username: user.username, role: user.role },
  };
}

export async function logout(env, token) {
  if (!token) return;
  await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
}

export function extractToken(request) {
  const header = request.headers.get("authorization") || request.headers.get("Authorization");
  if (header && header.startsWith("Bearer ")) return header.slice(7).trim();
  const cookie = request.headers.get("cookie") || "";
  const match = /(?:^|;\s*)tk168_admin=([^;]+)/.exec(cookie);
  return match ? decodeURIComponent(match[1]) : "";
}

export async function currentUser(env, request) {
  const token = extractToken(request);
  if (!token) return null;

  const row = await env.DB.prepare(
    `SELECT s.expires_at AS expires_at, u.id AS id, u.username AS username, u.role AS role
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token = ?`,
  )
    .bind(token)
    .first();
  if (!row) return null;

  if (Number(row.expires_at) < Math.floor(Date.now() / 1000)) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    return null;
  }
  return { id: row.id, username: row.username, role: row.role, token };
}

export async function listUsers(env) {
  const { results } = await env.DB.prepare(
    "SELECT id, username, role, created_at, updated_at FROM users ORDER BY id ASC",
  ).all();
  return results || [];
}

export async function createUser(env, { username, password, role = "admin" }) {
  const { hash, salt } = await hashPassword(password);
  try {
    const res = await env.DB.prepare(
      "INSERT INTO users (username, password_hash, password_salt, role) VALUES (?, ?, ?, ?) RETURNING id",
    )
      .bind(username, hash, salt, role)
      .first();
    return { id: res?.id, username, role };
  } catch (err) {
    if (/UNIQUE/i.test(String(err?.message || ""))) {
      const e = new Error("username_taken");
      e.status = 409;
      throw e;
    }
    throw err;
  }
}

export async function updateUserPassword(env, userId, newPassword) {
  const { hash, salt } = await hashPassword(newPassword);
  await env.DB.prepare(
    "UPDATE users SET password_hash = ?, password_salt = ?, updated_at = datetime('now') WHERE id = ?",
  )
    .bind(hash, salt, userId)
    .run();
  // Invalidate other sessions for this user on password change.
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId).run();
}

export async function deleteUser(env, userId) {
  await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();
}
