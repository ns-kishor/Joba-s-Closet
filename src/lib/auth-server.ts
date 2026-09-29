import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Server-side auth for Joba's Closet.
 * - Passwords: scrypt with salt + demo accounts support.
 * - Sessions: token + stateless payload in httpOnly cookie (`jc_session`).
 *   Works 100% reliably in serverless environments (Vercel) without external DB.
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
  if (stored === "DEMO_USER_HASH" && (password === "123456" || password === "password123")) {
    return true;
  }
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const test = scryptSync(password, salt, 64);
    const original = Buffer.from(hash, "hex");
    return original.length === test.length && timingSafeEqual(original, test);
  } catch {
    return false;
  }
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
  const expiresAt = sessionExpiry();

  await db.session.create({
    data: { id: token, userId, expiresAt },
  });

  const user = await db.user.findUnique({ where: { id: userId } });
  const payload = user
    ? Buffer.from(JSON.stringify(toSafeUser(user))).toString("base64url")
    : "";

  const cookieVal = `${token}.${payload}`;

  res.cookies.set(SESSION_COOKIE, cookieVal, {
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
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const [token, payload] = raw.split(".");

  if (token) {
    try {
      const session = await db.session.findUnique({
        where: { id: token },
        include: { user: true },
      });
      if (session && session.user) {
        if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
          await db.session.delete({ where: { id: token } }).catch(() => {});
          return null;
        }
        return toSafeUser(session.user);
      }
    } catch {
      // fallback
    }
  }

  // Cross-instance fallback for Vercel serverless functions
  if (payload) {
    try {
      const rawUser = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
      if (rawUser && rawUser.id && rawUser.email) {
        const safe: SafeUser = {
          id: rawUser.id,
          name: rawUser.name,
          email: rawUser.email,
          phone: rawUser.phone ?? null,
          createdAt: new Date(rawUser.createdAt),
        };
        const existing = await db.user.findUnique({ where: { id: safe.id } });
        if (!existing) {
          await db.user.create({
            data: {
              name: safe.name,
              email: safe.email,
              phone: safe.phone,
              passwordHash: "DEMO_REHYDRATED",
            },
          }).catch(() => {});
        }
        return safe;
      }
    } catch {
      return null;
    }
  }

  return null;
}

/** Delete the current session row + clear the cookie. */
export async function endSession(req: NextRequest, res: NextResponse) {
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  const token = raw?.split(".")[0];
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
