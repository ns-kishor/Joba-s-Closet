"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Copy, MapPin, Package, Phone, Truck } from "lucide-react";
import { Link, useRouter } from "@/lib/router";
import { formatBDT } from "@/lib/utils";
import { useShop, useHasMounted, type OrderSnapshot } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function ConfirmationView() {
  const mounted = useHasMounted();
  const { lastOrder } = useShop();
  const { query } = useRouter();
  const [fetched, setFetched] = useState<OrderSnapshot | null>(null);
  const id = query.id;

  // if user refreshes this page, restore order from the API by id
  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders?id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.order) {
          setFetched({
            id: d.order.id,
            name: d.order.customerName,
            phone: d.order.phone,
            address: d.order.address,
            city: d.order.city,
            zone: d.order.zone,
            items: d.order.items,
            subtotal: d.order.subtotal,
            delivery: d.order.delivery,
            total: d.order.total,
            createdAt: d.order.createdAt,
          });
        }
      })
      .catch(() => {});
  }, [id]);

  const order = fetched ?? (mounted ? lastOrder : null);

  if (!mounted) return <div className="min-h-[50vh]" />;

  if (!order) {
    return (
      <div className="mx-auto grid max-w-xl place-items-center px-4 py-28 text-center">
        <h1 className="font-serif text-4xl text-charcoal">No recent order found</h1>
        <p className="mt-3 text-muted-foreground">
          Once you place an order, its confirmation will appear here.
        </p>
        <Button asChild className="mt-6 rounded-full bg-blush-600 px-8 hover:bg-blush-700">
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const est = order.zone === "inside" ? "1–2 working days" : "2–4 working days";

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 md:pt-14">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto grid size-20 place-items-center rounded-full bg-blush-600 shadow-lift"
      >
        <Check className="size-10 text-white" strokeWidth={3} />
      </motion.div>

      <h1 className="mt-6 text-center font-serif text-4xl text-charcoal md:text-5xl">Order Confirmed</h1>
      <p className="mt-3 text-center text-[15px] leading-relaxed text-muted-foreground">
        Thank you for shopping with Joba&rsquo;s Closet, {order.name.split(" ")[0]}!
        <br />
        We&rsquo;ll call you shortly at <strong className="text-charcoal">{order.phone}</strong> to confirm.
      </p>

      <div className="mt-8 overflow-hidden rounded-3xl border border-blush-100 bg-white shadow-soft">
        {/* order id row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-blush-50 px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-gray">Order ID</p>
            <p className="font-mono text-lg font-bold text-charcoal">{order.id}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-blush-300 font-semibold text-blush-700 hover:bg-white"
            onClick={() => {
              navigator.clipboard?.writeText(order.id).catch(() => {});
              toast("Order ID copied");
            }}
          >
            <Copy className="mr-1.5 size-3.5" /> Copy
          </Button>
        </div>

        <div className="p-6">
          {/* items */}
          <ul className="space-y-4">
            {order.items.map((it) => (
              <li key={it.productId} className="flex items-center gap-4">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-cream">
                  <Image src={it.image} alt={it.name} fill sizes="64px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-charcoal">{it.name}</span>
                  <span className="text-xs text-stone-gray">
                    {formatBDT(it.price)} × {it.qty}
                  </span>
                </span>
                <span className="text-sm font-bold text-charcoal">{formatBDT(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>

          <Separator className="my-5 bg-blush-100" />

          {/* totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-charcoal-soft">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal">{formatBDT(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal-soft">
              <span>Delivery</span>
              <span className={order.delivery === 0 ? "font-semibold text-blush-600" : "font-semibold text-charcoal"}>
                {order.delivery === 0 ? "Free" : formatBDT(order.delivery)}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-base">
              <span className="font-semibold text-charcoal">Total (Cash on Delivery)</span>
              <span className="font-bold text-charcoal">{formatBDT(order.total)}</span>
            </div>
          </div>

          <Separator className="my-5 bg-blush-100" />

          {/* delivery info */}
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-rosegold" />
              <div>
                <p className="font-semibold text-charcoal">Delivering to</p>
                <p className="mt-0.5 leading-relaxed text-charcoal-soft">
                  {order.name}, {order.address}, {order.city}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Truck className="mt-0.5 size-4 shrink-0 text-rosegold" />
              <div>
                <p className="font-semibold text-charcoal">Estimated delivery</p>
                <p className="mt-0.5 text-charcoal-soft">
                  {est} · {order.zone === "inside" ? "Inside Dhaka" : "Outside Dhaka"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:col-span-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-rosegold" />
              <div>
                <p className="font-semibold text-charcoal">Need help?</p>
                <p className="mt-0.5 text-charcoal-soft">
                  Call us with your Order ID at <strong>+880 1XXX-XXXXXX</strong> or message us on Facebook.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blush-100 bg-blush-50/60 px-6 py-4">
          <p className="flex items-center gap-2 text-xs leading-relaxed text-charcoal-soft">
            <Package className="size-4 shrink-0 text-rosegold" />
            Keep your Order ID safe — you can use it anytime to check your order status from the Account page.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="h-12 rounded-full bg-blush-600 px-9 font-semibold hover:bg-blush-700">
          <Link to="/shop">Continue Shopping</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 rounded-full border-blush-300 px-9 font-semibold text-blush-700 hover:bg-blush-100 hover:text-blush-700"
        >
          <Link to="/account">Track Order</Link>
        </Button>
      </div>
    </div>
  );
}
