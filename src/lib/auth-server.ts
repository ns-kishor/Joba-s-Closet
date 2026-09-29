import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Server-side auth for Joba's Closet.
 * - Passwords: scrypt (Node built-in) with per-user random salt.
 * - Sessions: opaque random token in the `sessions` table, referenced by an
 *   httpOnly cookie (`jc_session`, 30 days). No JWT — easy to revoke.
 */

export const SESSION_COOKIE = "jc_session";
const SESSION_TTL_DAYS = 30;

// ── passwords ───────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const original = Buffer.from(hash, "hex");
  return original.length === test.length && timingSafeEqual(original, test);
}

// ── sessions ────────────────────────────────────────────────────

export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function sessionExpiry(): Date {
  return new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
}

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
};

export function toSafeUser(u: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
}): SafeUser {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, createdAt: u.createdAt };
}

/** Create a DB session row and attach the cookie to the response. */
export async function startSession(res: NextResponse, userId: string) {
  const token = newSessionToken();
  await db.session.create({
    data: { id: token, userId, expiresAt: sessionExpiry() },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
  return token;
}

/** Read the current user from the session cookie (null when guest/expired). */
export async function getSessionUser(req: NextRequest): Promise<SafeUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const session = await db.session.findUnique({
      where: { id: token },
      include: { user: true },
    });
    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await db.session.delete({ where: { id: token } }).catch(() => {});
      return null;
    }
    return toSafeUser(session.user);
  } catch {
    return null;
  }
}

/** Delete the current session row + clear the cookie. */
export async function endSession(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { id: token } }).catch(() => {});
  }
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/** Housekeeping: drop expired sessions (best effort). */
export async function pruneSessions() {
  try {
    await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  } catch {
    // non-fatal
  }
}
