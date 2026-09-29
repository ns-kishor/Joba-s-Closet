import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, hashPassword, verifyPassword } from "@/lib/auth-server";

type Body = { currentPassword?: string; newPassword?: string };

/** Change password — requires the current password. Kills other sessions. */
export async function POST(req: NextRequest) {
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

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { success: false, error: "Both current and new password are required" },
      { status: 400 },
    );
  }
  if (newPassword.length < 6) {
    return NextResponse.json(
      { success: false, error: "New password must be at least 6 characters" },
      { status: 400 },
    );
  }

  try {
    const user = await db.user.findUnique({ where: { id: current.id } });
    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ success: false, error: "Your current password is incorrect" }, { status: 401 });
    }

    await db.user.update({
      where: { id: current.id },
      data: { passwordHash: hashPassword(newPassword) },
    });
    // Security: revoke every other session, keep this one alive.
    const rawCookie = req.cookies.get("jc_session")?.value;
    const token = rawCookie?.split(".")[0];
    await db.session.deleteMany({
      where: { userId: current.id, ...(token ? { id: { not: token } } : {}) },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("password change failed", e);
    return NextResponse.json({ success: false, error: "Could not change password" }, { status: 500 });
  }
}
