// PBKDF2 password hashing implemented with the Web Crypto API available in
// Cloudflare Workers.  No external dependency required.

// Cloudflare Workers' Web Crypto implementation caps PBKDF2 iterations at
// 100,000, so stay just under that cap.
const ITERATIONS = 100_000;
const KEY_LENGTH = 32; // bytes -> 256 bits
const HASH = "SHA-256";

function toBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function fromBase64(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function randomSalt(byteLength = 16) {
  const salt = new Uint8Array(byteLength);
  crypto.getRandomValues(salt);
  return toBase64(salt);
}

async function pbkdf2(password, saltBytes) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: ITERATIONS, hash: HASH },
    keyMaterial,
    KEY_LENGTH * 8,
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password, saltB64 = randomSalt()) {
  const saltBytes = fromBase64(saltB64);
  const digest = await pbkdf2(password, saltBytes);
  return { hash: toBase64(digest), salt: saltB64 };
}

export async function verifyPassword(password, hashB64, saltB64) {
  if (!hashB64 || !saltB64) return false;
  const { hash } = await hashPassword(password, saltB64);
  // Constant-time compare.
  if (hash.length !== hashB64.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ hashB64.charCodeAt(i);
  return diff === 0;
}

export function randomToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return toBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
