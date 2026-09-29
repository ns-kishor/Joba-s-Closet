"use client";

import { Heart } from "lucide-react";
import { Link } from "@/lib/router";
import { useShop, useHasMounted } from "@/lib/store";
import { getProduct } from "@/lib/products";
import { ProductGrid } from "@/components/boutique/ProductGrid";
import { Button } from "@/components/ui/button";

export function WishlistView() {
  const mounted = useHasMounted();
  const wishlist = useShop((s) => s.wishlist);
  const products = mounted
    ? wishlist.map((id) => getProduct(id)).filter((p): p is NonNullable<typeof p> => Boolean(p))
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
      <header className="text-center">
        <h1 className="font-serif text-4xl text-charcoal md:text-5xl">Your Wishlist</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Saved on this device — tap the heart on any product to add more.
        </p>
      </header>

      <div className="mt-10">
        {!mounted ? null : products.length === 0 ? (
          <div className="mx-auto grid max-w-md place-items-center rounded-3xl border border-dashed border-blush-200 bg-white/60 px-6 py-20 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-blush-100">
              <Heart className="size-7 text-blush-600" />
            </span>
            <h2 className="mt-5 font-serif text-2xl text-charcoal">Nothing saved yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Discover something lovely — your wishlist keeps all your favorites in one place.
            </p>
            <Button asChild className="mt-6 rounded-full bg-blush-600 px-8 hover:bg-blush-700">
              <Link to="/shop">Browse the Boutique</Link>
            </Button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
