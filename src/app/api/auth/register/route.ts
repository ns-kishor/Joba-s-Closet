import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, startSession, toSafeUser, pruneSessions } from "@/lib/auth-server";

type Body = { name?: string; email?: string; phone?: string; password?: string };

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const phone = body.phone?.replace(/[\s-]/g, "") ?? "";
  const password = body.password ?? "";

  if (name.length < 3) {
    return NextResponse.json({ success: false, error: "Please enter your full name" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ success: false, error: "Please enter a valid email address" }, { status: 400 });
  }
  if (phone && !/^01[3-9]\d{8}$/.test(phone)) {
    return NextResponse.json(
      { success: false, error: "Enter a valid BD mobile number (e.g. 01712345678)" },
      { status: 400 },
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { success: false, error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Try signing in." },
        { status: 409 },
      );
    }

    const passwordHash = hashPassword(password);
    const user = await db.user.create({
      data: { name, email, phone: phone || null, passwordHash },
    });

    const res = NextResponse.json({ success: true, user: toSafeUser(user) });
    await startSession(res, user.id);

    // Save to user vault cookie so login works across serverless restarts
    try {
      const rawVault = req.cookies.get("jc_vault")?.value;
      let vault: Array<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        passwordHash: string;
      }> = [];
      if (rawVault) {
        vault = JSON.parse(Buffer.from(rawVault, "base64url").toString("utf8"));
      }
      vault = vault.filter((u) => u.email?.toLowerCase() !== email.toLowerCase());
      vault.push({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        passwordHash: user.passwordHash,
      });
      res.cookies.set("jc_vault", Buffer.from(JSON.stringify(vault)).toString("base64url"), {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 3600,
      });
    } catch {
      // non-fatal
    }

    pruneSessions();
    return res;
  } catch (e) {
    console.error("register failed", e);
    return NextResponse.json({ success: false, error: "Could not create account" }, { status: 500 });
  }
}
