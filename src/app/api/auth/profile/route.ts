import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, toSafeUser, SESSION_COOKIE, newSessionToken } from "@/lib/auth-server";

type Body = { name?: string; phone?: string };

/** Update the signed-in user's profile (name, phone). */
export async function PATCH(req: NextRequest) {
  const current = await getSessionUser(req);
  if (!current) {
    return NextResponse.json({ success: false, error: "Please sign in first" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const phone = body.phone?.replace(/[\s-]/g, "") ?? "";

  if (name.length < 3) {
    return NextResponse.json({ success: false, error: "Please enter your full name" }, { status: 400 });
  }
  if (phone && !/^01[3-9]\d{8}$/.test(phone)) {
    return NextResponse.json(
      { success: false, error: "Enter a valid BD mobile number (e.g. 01712345678)" },
      { status: 400 },
    );
  }

  try {
    const user = await db.user.update({
      where: { id: current.id },
      data: { name, phone: phone || null },
    });
    const safeUser = toSafeUser(user);
    const res = NextResponse.json({ success: true, user: safeUser });

    // Update the session cookie payload so changes persist across Lambdas
    try {
      const raw = req.cookies.get(SESSION_COOKIE)?.value;
      const token = raw?.split(".")[0] || newSessionToken();
      const payload = Buffer.from(JSON.stringify(safeUser)).toString("base64url");
      res.cookies.set(SESSION_COOKIE, `${token}.${payload}`, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    } catch {
      // non-fatal
    }

    return res;
  } catch (e) {
    console.error("profile update failed", e);
    return NextResponse.json({ success: false, error: "Could not update profile" }, { status: 500 });
  }
}
