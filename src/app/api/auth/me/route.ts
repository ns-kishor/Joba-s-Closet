import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";

/** Returns the signed-in user, or `{ success: true, user: null }` for guests. */
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ success: true, user: null });
  }
}
