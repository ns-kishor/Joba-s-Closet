"use client";

import Image from "next/image";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "@/lib/router";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/products";
import { formatBDT } from "@/lib/utils";
import { useShop, useHasMounted, cartLines } from "@/lib/store";
import { QuantitySelector } from "@/components/boutique/QuantitySelector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function CartView() {
  const mounted = useHasMounted();
  const { cart, setQty, removeFromCart, toggleWishlist, clearCart } = useShop();
  const lines = mounted ? cartLines(cart) : [];
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  if (!mounted) return <div className="min-h-[50vh]" />;

  if (lines.length === 0) {
    return (
      <div className="mx-auto grid max-w-xl place-items-center px-4 py-28 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-blush-100">
          <ShoppingBag className="size-9 text-blush-600" />
        </span>
        <h1 className="mt-6 font-serif text-4xl text-charcoal">Your bag is empty</h1>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          Fill it with little things you love — beauty picks, jewelry and everyday favorites from ৳100.
        </p>
        <Button asChild className="mt-7 h-12 rounded-full bg-blush-600 px-9 font-semibold hover:bg-blush-700">
          <Link to="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
      <header className="text-center">
        <h1 className="font-serif text-4xl text-charcoal md:text-5xl">Your Bag</h1>
        <p className="mt-2 text-muted-foreground">{lines.length} {lines.length === 1 ? "item" : "items"} saved for you</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        {/* items */}
        <div className="space-y-4">
          {lines.map(({ product, qty }) => (
            <article
              key={product.id}
              className="flex gap-4 rounded-3xl border border-blush-100 bg-white p-4 shadow-soft sm:gap-6 sm:p-5"
            >
              <Link to={`/product/${product.slug}`} className="relative block size-24 shrink-0 overflow-hidden rounded-2xl bg-cream sm:size-28">
                <Image src={product.images[0]} alt={product.name} fill sizes="112px" className="object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-stone-gray">{product.subcategory}</p>
                    <Link to={`/product/${product.slug}`} className="mt-0.5 line-clamp-2 block text-[15px] font-semibold text-charcoal hover:text-blush-600">
                      {product.name}
                    </Link>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${product.name} from bag`}
                    onClick={() => {
                      removeFromCart(product.id);
                      toast("Removed from bag", { description: product.name });
                    }}
                    className="grid size-8 shrink-0 place-items-center rounded-full text-stone-gray transition hover:bg-blush-100 hover:text-blush-700"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <QuantitySelector value={qty} onChange={(v) => setQty(product.id, v)} small />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-stone-gray transition hover:text-blush-600"
                      onClick={() => {
                        toggleWishlist(product.id);
                        removeFromCart(product.id);
                        toast("Moved to wishlist 💖");
                      }}
                    >
                      <Heart className="size-3.5" /> Move to wishlist
                    </button>
                    <p className="text-[15px] font-bold text-charcoal">{formatBDT(product.price * qty)}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
          <div className="flex justify-between pt-2">
            <Button asChild variant="ghost" className="rounded-full font-semibold text-blush-700 hover:bg-blush-100">
              <Link to="/shop">← Continue shopping</Link>
            </Button>
            <Button variant="ghost" className="rounded-full text-stone-gray hover:bg-blush-100 hover:text-blush-700" onClick={clearCart}>
              Clear bag
            </Button>
          </div>
        </div>

        {/* summary */}
        <aside className="self-start lg:sticky lg:top-24">
          <div className="rounded-3xl border border-blush-100 bg-white p-6 shadow-soft">
            <h2 className="font-serif text-2xl font-semibold text-charcoal">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-charcoal-soft">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-soft">
                <span>Delivery charge</span>
                <span className="text-stone-gray">calculated at checkout</span>
              </div>
              {remaining > 0 && (
                <p className="rounded-2xl bg-blush-50 px-4 py-3 text-xs leading-relaxed text-blush-700">
                  Add {formatBDT(remaining)} more to unlock <strong>free delivery!</strong>
                </p>
              )}
              {remaining === 0 && (
                <p className="rounded-2xl bg-blush-50 px-4 py-3 text-xs font-semibold text-blush-700">
                  🎉 You&rsquo;ve unlocked free delivery!
                </p>
              )}
              <Separator className="bg-blush-100" />
              <div className="flex justify-between text-base">
                <span className="font-semibold text-charcoal">Total (est.)</span>
                <span className="font-bold text-charcoal">{formatBDT(subtotal)}</span>
              </div>
            </div>
            <Button asChild className="mt-6 h-12 w-full rounded-full bg-blush-600 font-semibold shadow-soft hover:bg-blush-700">
              <Link to="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <p className="mt-3 text-center text-xs text-stone-gray">Cash on Delivery available · No account needed</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
