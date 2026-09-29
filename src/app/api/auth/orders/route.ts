import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth-server";

/** Order history for the signed-in user (newest first). */
export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "Please sign in first" }, { status: 401 });
  }

  try {
    const orders = await db.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    // Merge with any orders saved in cookie for serverless persistence
    const rawCookie = req.cookies.get("jc_orders")?.value;
    if (rawCookie) {
      try {
        const cookieOrders = JSON.parse(Buffer.from(rawCookie, "base64url").toString("utf8"));
        const existingIds = new Set(orders.map((o) => o.id));
        for (const co of cookieOrders) {
          if ((!co.userId || co.userId === user.id) && !existingIds.has(co.id)) {
            orders.push(co);
            existingIds.add(co.id);
          }
        }
      } catch {
        // ignore
      }
    }

    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({
        id: o.id,
        status: o.status,
        zone: o.zone,
        city: o.city,
        subtotal: o.subtotal,
        delivery: o.delivery,
        total: o.total,
        createdAt: o.createdAt,
        items: (o.items || []).map((it: any) => ({
          productId: it.productId,
          name: it.name,
          price: it.price,
          qty: it.qty,
          image: it.image,
        })),
      })),
    });
  } catch (e) {
    console.error("order history failed", e);
    return NextResponse.json({ success: false, error: "Could not load your orders" }, { status: 500 });
  }
}
