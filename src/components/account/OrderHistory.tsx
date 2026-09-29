"use client";

/** Order history list for signed-in users (from GET /api/auth/orders). */
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, Loader2, PackageOpen, RefreshCw } from "lucide-react";
import { Link } from "@/lib/router";
import { formatBDT } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HistoryOrder = {
  id: string;
  status: string;
  zone: string;
  city: string;
  subtotal: number;
  delivery: number;
  total: number;
  createdAt: string;
  items: { productId: string; name: string; price: number; qty: number; image: string }[];
};

const MAX_VISIBLE_ITEMS = 3;

export function OrderHistory({ refreshKey = 0 }: { refreshKey?: number }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<HistoryOrder[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setFailed(false);
    try {
      const res = await fetch("/api/auth/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user?.id, refreshKey]);

  const zoneLabel = (z: string) => (z === "outside" ? "Outside Dhaka" : "Inside Dhaka");

  return (
    <section className="rounded-3xl border border-blush-100 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-semibold text-charcoal">Your Orders</h2>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-xs font-semibold text-blush-700 hover:bg-blush-50"
          onClick={() => load(true)}
          disabled={refreshing || loading}
          aria-label="Refresh order history"
        >
          <RefreshCw className={cn("mr-1 size-3.5", refreshing && "animate-spin")} /> Refresh
        </Button>
      </div>

      {loading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-blush-600" /> Loading your orders...
        </div>
      )}

      {failed && (
        <p className="mt-6 rounded-2xl bg-blush-50 px-4 py-3 text-sm text-blush-700">
          We couldn&rsquo;t load your orders right now. Please refresh, or contact us on Facebook if it
          keeps happening.
        </p>
      )}

      {!loading && !failed && orders?.length === 0 && (
        <div className="mt-6 rounded-2xl bg-blush-50/70 px-5 py-8 text-center">
          <PackageOpen className="mx-auto size-8 text-rosegold" />
          <p className="mt-3 font-serif text-lg text-charcoal">No orders yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
            When you place your first order it will appear here — from ৳100, delivered across
            Bangladesh.
          </p>
          <Button asChild className="mt-4 rounded-full bg-blush-600 px-7 hover:bg-blush-700">
            <Link to="/shop">Start Shopping</Link>
          </Button>
        </div>
      )}

      {!loading && !failed && orders && orders.length > 0 && (
        <ul className="mt-5 space-y-4">
          {orders.map((o) => {
            const open = expanded[o.id];
            const visible = open ? o.items : o.items.slice(0, MAX_VISIBLE_ITEMS);
            const hiddenCount = o.items.length - visible.length;
            return (
              <li key={o.id} className="rounded-2xl border border-blush-100 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-base font-bold text-charcoal">{o.id}</p>
                    <p className="mt-0.5 text-xs text-stone-gray">
                      {new Date(o.createdAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}{" "}
                      · {zoneLabel(o.zone)} · {o.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-bold capitalize text-blush-700">
                      {o.status}
                    </span>
                    <span className="text-sm font-bold text-charcoal">{formatBDT(o.total)}</span>
                  </div>
                </div>

                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {visible.map((it) => (
                    <li key={it.productId} className="flex items-center gap-2.5">
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-cream">
                        <Image src={it.image} alt="" fill sizes="44px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-charcoal">
                          {it.name}
                        </span>
                        <span className="text-xs text-stone-gray">
                          {formatBDT(it.price)} × {it.qty}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                {o.items.length > MAX_VISIBLE_ITEMS && (
                  <button
                    type="button"
                    onClick={() => setExpanded((m) => ({ ...m, [o.id]: !m[o.id] }))}
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-blush-600 hover:text-blush-700"
                  >
                    {open ? "Show less" : `+ ${hiddenCount} more item${hiddenCount === 1 ? "" : "s"}`}
                    <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
