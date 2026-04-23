import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_SESSION_COOKIE = "admin-session";
const LEGACY_ADMIN_COOKIE = "admin-auth";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf-8");
}

function getAdminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "development" && process.env.ADMIN_PASSWORD) {
    console.warn(
      "ADMIN_SESSION_SECRET is not configured. Falling back to ADMIN_PASSWORD for development only."
    );
    return process.env.ADMIN_PASSWORD;
  }

  throw new Error("ADMIN_SESSION_SECRET is not configured");
}

export function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;

  if (password) {
    return password;
  }

  if (process.env.NODE_ENV === "development") {
    return "admin123";
  }

  throw new Error("ADMIN_PASSWORD is not configured");
}

export function verifyAdminPassword(candidatePassword) {
  if (typeof candidatePassword !== "string") {
    return false;
  }

  const actualPassword = getAdminPassword();
  const candidate = Buffer.from(candidatePassword);
  const actual = Buffer.from(actualPassword);

  if (candidate.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(candidate, actual);
}

function signPayload(payload) {
  const secret = getAdminSessionSecret();
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminSessionToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    role: "admin",
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };

  const payloadString = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadString);
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = signPayload(encodedPayload);
  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.role !== "admin") {
      return false;
    }

    if (typeof payload.exp !== "number" || payload.exp <= now) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    if (verifySessionToken(sessionToken)) {
      return true;
    }

    // Maintain compatibility with old sessions in development.
    if (process.env.NODE_ENV === "development") {
      const legacy = cookieStore.get(LEGACY_ADMIN_COOKIE)?.value;
      return legacy === "authenticated";
    }

    return false;
  } catch {
    return false;
  }
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  };
}

export function getAdminCookieNames() {
  return {
    session: ADMIN_SESSION_COOKIE,
    legacy: LEGACY_ADMIN_COOKIE,
  };
}
