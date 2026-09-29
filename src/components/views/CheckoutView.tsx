"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Banknote, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Link, useRouter } from "@/lib/router";
import { deliveryFor, FREE_DELIVERY_THRESHOLD } from "@/lib/products";
import { formatBDT } from "@/lib/utils";
import { useShop, useHasMounted, cartLines } from "@/lib/store";
import { QuantitySelector } from "@/components/boutique/QuantitySelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Errors = Partial<Record<"name" | "phone" | "address" | "city", string>>;

export function CheckoutView() {
  const mounted = useHasMounted();
  const { cart, clearCart, setLastOrder } = useShop();
  const lines = mounted ? cartLines(cart) : [];
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);

  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", note: "" });
  const [zone, setZone] = useState<"inside" | "outside">("inside");
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);
  const { navigate } = useRouter();

  const delivery = useMemo(() => deliveryFor(zone, subtotal), [zone, subtotal]);
  const total = subtotal + delivery;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((errs) => {
      const map: Partial<Record<keyof typeof form, keyof Errors>> = {
        name: "name", phone: "phone", address: "address", city: "city",
      };
      const key = map[k];
      if (key && errs[key]) {
        const next = { ...errs };
        delete next[key];
        return next;
      }
      return errs;
    });
  };

  const validate = (): Errors => {
    const errs: Errors = {};
    if (form.name.trim().length < 3) errs.name = "Please enter your full name";
    if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, "")))
      errs.phone = "Enter a valid BD mobile number (e.g. 01712345678)";
    if (form.address.trim().length < 10) errs.address = "Please enter your full address";
    if (form.city.trim().length < 2) errs.city = "Please enter your city or area";
    return errs;
  };

  const placeOrder = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please check the highlighted fields");
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { ...form, zone },
          items: cart.map((l) => ({ productId: l.productId, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Order failed");
      const order = data.order as {
        id: string; items: { productId: string; name: string; price: number; qty: number; image: string }[];
      };
      setLastOrder({
        id: order.id,
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        zone,
        items: order.items,
        subtotal,
        delivery,
        total,
        createdAt: new Date().toISOString(),
      });
      clearCart();
      navigate(`/order-confirmation?id=${order.id}`);
    } catch {
      toast.error("Something went wrong placing your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (!mounted) return <div className="min-h-[50vh]" />;

  if (lines.length === 0) {
    return (
      <div className="mx-auto grid max-w-xl place-items-center px-4 py-28 text-center">
        <h1 className="font-serif text-4xl text-charcoal">Nothing to check out yet</h1>
        <p className="mt-3 text-muted-foreground">Add a few favorites to your bag first.</p>
        <Button asChild className="mt-6 rounded-full bg-blush-600 px-8 hover:bg-blush-700">
          <Link to="/shop">Go to Shop</Link>
        </Button>
      </div>
    );
  }

  const field = (key: keyof Errors, node: React.ReactNode, errKey: keyof typeof form) => (
    <div className="space-y-1.5">
      {node}
      {errors[key] && <p className="text-xs font-medium text-destructive">{errors[key]}</p>}
      <span className="sr-only">{errKey}</span>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
      <header className="text-center">
        <h1 className="font-serif text-4xl text-charcoal md:text-5xl">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Guest checkout — no account needed. We&rsquo;ll call to confirm your order.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
        {/* form */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-blush-100 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-charcoal">Delivery Details</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {field(
                "name",
                <>
                  <Label htmlFor="name" className="text-charcoal-soft">Full Name *</Label>
                  <Input id="name" value={form.name} onChange={set("name")} placeholder="e.g. Nusrat Jahan" className="border-blush-200 focus-visible:ring-blush-300" />
                </>,
                "name",
              )}
              {field(
                "phone",
                <>
                  <Label htmlFor="phone" className="text-charcoal-soft">Phone Number *</Label>
                  <Input id="phone" inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" className="border-blush-200 focus-visible:ring-blush-300" />
                </>,
                "phone",
              )}
              <div className="sm:col-span-2">
                <Label htmlFor="email" className="text-charcoal-soft">
                  Email Address <span className="text-stone-gray">(optional)</span>
                </Label>
                <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="border-blush-200 focus-visible:ring-blush-300" />
              </div>
              <div className="sm:col-span-2">
                {field(
                  "address",
                  <>
                    <Label htmlFor="address" className="text-charcoal-soft">Full Address *</Label>
                    <Textarea id="address" value={form.address} onChange={set("address")} placeholder="House / Road / Area" rows={2} className="resize-none border-blush-200 focus-visible:ring-blush-300" />
                  </>,
                  "address",
                )}
              </div>
              {field(
                "city",
                <>
                  <Label htmlFor="city" className="text-charcoal-soft">City / Area *</Label>
                  <Input id="city" value={form.city} onChange={set("city")} placeholder="e.g. Mirpur, Dhaka" className="border-blush-200 focus-visible:ring-blush-300" />
                </>,
                "city",
              )}
              <div className="sm:col-span-2">
                <Label htmlFor="note" className="text-charcoal-soft">
                  Delivery Note <span className="text-stone-gray">(optional)</span>
                </Label>
                <Input id="note" value={form.note} onChange={set("note")} placeholder="Landmark, preferred time..." className="border-blush-200 focus-visible:ring-blush-300" />
              </div>
            </div>
          </section>

          {/* delivery zone */}
          <section className="rounded-3xl border border-blush-100 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-charcoal">Delivery Option</h2>
            <RadioGroup value={zone} onValueChange={(v) => setZone(v as "inside" | "outside")} className="mt-5 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { id: "inside", title: "Inside Dhaka", sub: "1–2 working days", price: deliveryFor("inside", subtotal) },
                  { id: "outside", title: "Outside Dhaka", sub: "2–4 working days", price: deliveryFor("outside", subtotal) },
                ] as const
              ).map((z) => (
                <Label
                  key={z.id}
                  htmlFor={`zone-${z.id}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition",
                    zone === z.id ? "border-blush-600 bg-blush-50" : "border-blush-100 hover:bg-blush-50/60",
                  )}
                >
                  <RadioGroupItem value={z.id} id={`zone-${z.id}`} className="border-blush-300 text-blush-600" />
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-charcoal">{z.title}</span>
                    <span className="block text-xs text-stone-gray">{z.sub}</span>
                  </span>
                  <span className="text-sm font-bold text-blush-700">{z.price === 0 ? "Free" : formatBDT(z.price)}</span>
                </Label>
              ))}
            </RadioGroup>
            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <p className="mt-3 text-xs text-stone-gray">
                Free delivery on orders over {formatBDT(FREE_DELIVERY_THRESHOLD)}.
              </p>
            )}
          </section>

          {/* payment */}
          <section className="rounded-3xl border border-blush-100 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-charcoal">Payment</h2>
            <div className="mt-5 flex items-center gap-4 rounded-2xl border-2 border-blush-600 bg-blush-50 p-4">
              <span className="grid size-11 place-items-center rounded-full bg-blush-100 text-blush-700">
                <Banknote className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-charcoal">Cash on Delivery</p>
                <p className="text-xs leading-relaxed text-stone-gray">
                  Pay in cash when your order arrives at your door.
                </p>
              </div>
              <span className="grid size-6 place-items-center rounded-full bg-blush-600 text-white">
                <ShieldCheck className="size-3.5" />
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-stone-gray">
              More payment methods (bKash, Nagad, cards) are coming soon.
            </p>
          </section>
        </div>

        {/* summary */}
        <aside className="self-start lg:sticky lg:top-24">
          <div className="rounded-3xl border border-blush-100 bg-white p-6 shadow-soft">
            <h2 className="font-serif text-2xl font-semibold text-charcoal">Your Order</h2>
            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1 thin-scrollbar">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-3">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                    <Image src={product.images[0]} alt="" fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-0 -top-0 grid min-w-4.5 place-items-center rounded-bl-lg bg-charcoal/85 px-1 text-[10px] font-bold text-white">
                      {qty}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-charcoal">{product.name}</span>
                    <span className="text-xs text-stone-gray">{formatBDT(product.price)} each</span>
                  </span>
                  <span className="text-[13px] font-bold text-charcoal">{formatBDT(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2.5 border-t border-blush-100 pt-4 text-sm">
              <div className="flex justify-between text-charcoal-soft">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-soft">
                <span>Delivery ({zone === "inside" ? "Inside Dhaka" : "Outside Dhaka"})</span>
                <span className={cn("font-semibold", delivery === 0 ? "text-blush-600" : "text-charcoal")}>
                  {delivery === 0 ? "Free" : formatBDT(delivery)}
                </span>
              </div>
              <div className="flex justify-between border-t border-blush-100 pt-3 text-base">
                <span className="font-semibold text-charcoal">Total</span>
                <span className="font-bold text-charcoal">{formatBDT(total)}</span>
              </div>
            </div>
            <Button
              className="mt-6 h-12 w-full rounded-full bg-blush-600 font-semibold shadow-soft hover:bg-blush-700"
              onClick={placeOrder}
              disabled={placing}
            >
              {placing ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Placing your order...
                </>
              ) : (
                <>
                  <Lock className="mr-2 size-4" /> Place Order
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs leading-relaxed text-stone-gray">
              By placing your order you agree to our{" "}
              <Link to="/policies/terms" className="underline underline-offset-2">Terms</Link> &{" "}
              <Link to="/policies/returns" className="underline underline-offset-2">Return Policy</Link>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
