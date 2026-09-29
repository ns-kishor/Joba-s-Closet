import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, startSession, toSafeUser } from "@/lib/auth-server";

type Body = { email?: string; password?: string };

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
  }

  try {
    let user = await db.user.findUnique({ where: { email } });

    // If not found in current lambda memory, check the client's jc_vault cookie
    if (!user) {
      const rawVault = req.cookies.get("jc_vault")?.value;
      if (rawVault) {
        try {
          const vault = JSON.parse(Buffer.from(rawVault, "base64url").toString("utf8"));
          const found = vault.find((u: { email?: string }) => u.email?.toLowerCase() === email);
          if (found) {
            user = await db.user.create({
              data: {
                name: found.name,
                email: found.email,
                phone: found.phone,
                passwordHash: found.passwordHash,
              },
            });
          }
        } catch {
          // ignore
        }
      }
    }

    // Same message for unknown email and wrong password (no account enumeration).
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ success: false, error: "Incorrect email or password" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, user: toSafeUser(user) });
    await startSession(res, user.id);
    return res;
  } catch (e) {
    console.error("login failed", e);
    return NextResponse.json({ success: false, error: "Could not sign you in" }, { status: 500 });
  }
}
