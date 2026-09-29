import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getProduct, deliveryFor } from "@/lib/products";
import { getSessionUser } from "@/lib/auth-server";

type IncomingItem = { productId: string; qty: number };

type Body = {
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    note?: string;
    zone?: "inside" | "outside";
  };
  items?: IncomingItem[];
};

function makeOrderId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `JC-${suffix}`;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const c = body.customer;
  const items = body.items;

  // ── validation ──────────────────────────────────────────────
  if (!c || !items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ success: false, error: "Missing customer or items" }, { status: 400 });
  }
  const name = c.name?.trim() ?? "";
  const phone = (c.phone ?? "").replace(/[\s-]/g, "");
  const address = c.address?.trim() ?? "";
  const city = c.city?.trim() ?? "";
  const zone = c.zone === "outside" ? "outside" : "inside";

  if (name.length < 3) {
    return NextResponse.json({ success: false, error: "Invalid name" }, { status: 400 });
  }
  if (!/^01[3-9]\d{8}$/.test(phone)) {
    return NextResponse.json({ success: false, error: "Invalid phone number" }, { status: 400 });
  }
  if (address.length < 10 || city.length < 2) {
    return NextResponse.json({ success: false, error: "Invalid address" }, { status: 400 });
  }

  // ── price from server-side catalog (never trust client prices) ──
  const resolved = items
    .map((it) => {
      const product = getProduct(it.productId);
      const qty = Math.max(1, Math.min(99, Math.floor(Number(it.qty) || 0)));
      if (!product || qty <= 0 || product.stock === "out") return null;
      return { product, qty };
    })
    .filter((x): x is { product: NonNullable<ReturnType<typeof getProduct>>; qty: number } => x !== null);

  if (resolved.length === 0) {
    return NextResponse.json({ success: false, error: "No purchasable items" }, { status: 400 });
  }

  const subtotal = resolved.reduce((n, r) => n + r.product.price * r.qty, 0);
  const delivery = deliveryFor(zone, subtotal);
  const total = subtotal + delivery;

  // ── persist (attach to the signed-in account when present) ──
  const user = await getSessionUser(req);
  try {
    const order = await db.order.create({
      data: {
        id: makeOrderId(),
        userId: user?.id ?? null,
        customerName: name,
        phone,
        email: c.email?.trim() || null,
        address,
        city,
        note: c.note?.trim() || null,
        zone,
        status: "confirmed",
        subtotal,
        delivery,
        total,
        items: {
          create: resolved.map((r) => ({
            productId: r.product.id,
            name: r.product.name,
            price: r.product.price,
            qty: r.qty,
            image: r.product.images[0],
          })),
        },
      },
      include: { items: true },
    });

    const res = NextResponse.json({
      success: true,
      order: {
        id: order.id,
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        city: order.city,
        zone: order.zone,
        status: order.status,
        subtotal: order.subtotal,
        delivery: order.delivery,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items.map((it) => ({
          productId: it.productId,
          name: it.name,
          price: it.price,
          qty: it.qty,
          image: it.image,
        })),
      },
    });

    // Save recent orders in a cookie so cross-instance serverless lookups succeed
    try {
      const rawCookie = req.cookies.get("jc_orders")?.value;
      let orderList: any[] = [];
      if (rawCookie) {
        orderList = JSON.parse(Buffer.from(rawCookie, "base64url").toString("utf8"));
      }
      orderList.unshift(order);
      if (orderList.length > 10) orderList = orderList.slice(0, 10);
      res.cookies.set("jc_orders", Buffer.from(JSON.stringify(orderList)).toString("base64url"), {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 3600,
      });
    } catch {
      // non-fatal
    }

    return res;
  } catch (e) {
    console.error("order create failed", e);
    return NextResponse.json({ success: false, error: "Could not save order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  }
  try {
    let order = await db.order.findUnique({
      where: { id: id.toUpperCase() },
      include: { items: true },
    });

    if (!order) {
      // Fallback to cookie storage
      const rawCookie = req.cookies.get("jc_orders")?.value;
      if (rawCookie) {
        try {
          const list = JSON.parse(Buffer.from(rawCookie, "base64url").toString("utf8"));
          order = list.find((o: { id?: string }) => o.id?.toUpperCase() === id.toUpperCase());
        } catch {
          // ignore
        }
      }
    }

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        city: order.city,
        zone: order.zone,
        status: order.status,
        subtotal: order.subtotal,
        delivery: order.delivery,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items.map((it: any) => ({
          productId: it.productId,
          name: it.name,
          price: it.price,
          qty: it.qty,
          image: it.image,
        })),
      },
    });
  } catch (e) {
    console.error("order fetch failed", e);
    return NextResponse.json({ success: false, error: "Lookup failed" }, { status: 500 });
  }
}
