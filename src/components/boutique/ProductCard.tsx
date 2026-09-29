"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatBDT, discountPct, cn } from "@/lib/utils";
import { useShop } from "@/lib/store";
import { Link } from "@/lib/router";
import { RatingStars } from "./RatingStars";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function ProductCardInner({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickQty, setQuickQty] = useState(1);
  const wished = wishlist.includes(product.id);
  const off = discountPct(product.price, product.originalPrice);
  const soldOut = product.stock === "out";

  const add = (qty = 1) => {
    if (soldOut) {
      toast.error("This one is currently out of stock");
      return;
    }
    addToCart(product.id, qty);
    toast.success("Added to your bag", {
      description: product.name,
      icon: <ShoppingBag className="size-4 text-blush-500" />,
    });
  };

  return (
    <>
      <article className="group relative flex flex-col">
        {/* image */}
        <div className="relative overflow-hidden rounded-2xl bg-cream">
          <Link to={`/product/${product.slug}`} ariaLabel={product.name} className="block">
            <div className="relative aspect-[4/5]">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={cn(
                  "object-cover transition-all duration-500 ease-out group-hover:scale-[1.06]",
                  product.images[1] && "group-hover:opacity-0",
                )}
              />
              {product.images[1] && (
                <Image
                  src={product.images[1]}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:opacity-100"
                />
              )}
            </div>
          </Link>

          {/* badges */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {off !== null && (
              <Badge className="rounded-full bg-blush-600 px-2.5 text-[11px] font-semibold text-white hover:bg-blush-600">
                −{off}%
              </Badge>
            )}
            {product.badge === "new" && (
              <Badge className="rounded-full bg-white/90 px-2.5 text-[11px] font-semibold text-charcoal hover:bg-white/90">
                New
              </Badge>
            )}
            {product.badge === "bestseller" && (
              <Badge className="rounded-full bg-charcoal/85 px-2.5 text-[11px] font-semibold text-white hover:bg-charcoal/85">
                Bestseller
              </Badge>
            )}
            {soldOut && (
              <Badge className="rounded-full bg-charcoal/70 px-2.5 text-[11px] font-semibold text-white hover:bg-charcoal/70">
                Sold Out
              </Badge>
            )}
          </div>

          {/* wishlist */}
          <button
            type="button"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => {
              toggleWishlist(product.id);
              toast(wished ? "Removed from wishlist" : "Saved to your wishlist", {
                icon: wished ? "🤍" : "💖",
              });
            }}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-charcoal shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
          >
            <Heart className={cn("size-4 transition", wished && "fill-blush-600 text-blush-600")} />
          </button>

          {/* hover actions — desktop */}
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
            <Button
              size="sm"
              className="h-9 flex-1 rounded-full bg-white/95 text-charcoal shadow-sm backdrop-blur hover:bg-white"
              onClick={() => add(1)}
              disabled={soldOut}
            >
              <ShoppingBag className="mr-1.5 size-3.5" /> Add to Cart
            </Button>
            <Button
              size="icon"
              aria-label="Quick view"
              className="size-9 rounded-full bg-white/95 text-charcoal shadow-sm backdrop-blur hover:bg-white"
              onClick={() => {
                setQuickQty(1);
                setQuickOpen(true);
              }}
            >
              <Eye className="size-4" />
            </Button>
          </div>
        </div>

        {/* info */}
        <div className="flex flex-1 flex-col gap-1 px-1 pt-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-stone-gray">
            {product.subcategory}
          </p>
          <Link
            to={`/product/${product.slug}`}
            className="line-clamp-1 text-sm font-semibold text-charcoal transition-colors hover:text-blush-600 md:line-clamp-2"
          >
            {product.name}
          </Link>
          <div className="mt-0.5 flex items-center gap-1.5">
            <RatingStars rating={product.rating} size={12} showValue />
            <span className="text-[11px] text-stone-gray">({product.reviews})</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[15px] font-bold text-charcoal">{formatBDT(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-stone-gray line-through">{formatBDT(product.originalPrice)}</span>
            )}
          </div>
          {/* mobile add-to-cart — always visible */}
          <Button
            size="sm"
            className="mt-2 h-9 rounded-full bg-blush-100 text-[13px] font-semibold text-blush-700 hover:bg-blush-200 md:hidden"
            onClick={() => add(1)}
            disabled={soldOut}
          >
            <ShoppingBag className="mr-1.5 size-3.5" /> Add to Cart
          </Button>
        </div>
      </article>

      {/* quick view */}
      <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
        <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-3xl p-0">
          <div className="grid sm:grid-cols-2">
            <div className="relative hidden aspect-[4/5] sm:block">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="400px" />
            </div>
            <div className="flex flex-col gap-3 p-6">
              <DialogHeader className="space-y-1 text-left">
                <p className="eyebrow text-rosegold">{product.subcategory}</p>
                <DialogTitle className="font-serif text-2xl leading-snug text-charcoal">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="sr-only">{product.short}</DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <RatingStars rating={product.rating} showValue />
                <span className="text-xs text-stone-gray">{product.reviews} reviews</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-charcoal">{formatBDT(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-gray line-through">
                    {formatBDT(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{product.short}</p>
              <div className="mt-auto flex items-center gap-3 pt-2">
                <QuantitySelector value={quickQty} onChange={setQuickQty} />
                <Button
                  className="h-11 flex-1 rounded-full bg-blush-600 hover:bg-blush-700"
                  onClick={() => {
                    add(quickQty);
                    setQuickOpen(false);
                  }}
                  disabled={soldOut}
                >
                  Add to Cart
                </Button>
              </div>
              <Link
                to={`/product/${product.slug}`}
                className="text-center text-xs font-semibold text-blush-600 underline-offset-4 hover:underline"
                onClick={() => setQuickOpen(false)}
              >
                View full details →
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const ProductCard = memo(ProductCardInner);
