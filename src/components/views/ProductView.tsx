"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronRight,
  Heart,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import { Link, useRouter } from "@/lib/router";
import {
  getProduct,
  relatedProducts,
  deliveryFor,
  FREE_DELIVERY_THRESHOLD,
  DELIVERY,
} from "@/lib/products";
import { formatBDT, discountPct, cn } from "@/lib/utils";
import { useShop } from "@/lib/store";
import { RatingStars } from "@/components/boutique/RatingStars";
import { QuantitySelector } from "@/components/boutique/QuantitySelector";
import { Reveal } from "@/components/boutique/SectionHeading";
import { ProductGrid } from "@/components/boutique/ProductGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

function ProductJsonLd({ id }: { id: string }) {
  const p = getProduct(id);
  if (!p) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.images,
    description: p.description,
    category: `${p.category} > ${p.subcategory}`,
    brand: { "@type": "Brand", name: "Joba's Closet" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: p.reviews,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: p.price,
      availability:
        p.stock === "out" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function ProductView({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const { navigate } = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  const related = useMemo(() => (product ? relatedProducts(product, 4) : []), [product]);

  if (!product) {
    return (
      <div className="mx-auto grid max-w-7xl place-items-center px-4 py-28 text-center">
        <h1 className="font-serif text-4xl text-charcoal">Product not found</h1>
        <p className="mt-3 text-muted-foreground">It may have sold out or the link changed.</p>
        <Button asChild className="mt-6 rounded-full bg-blush-600 px-8 hover:bg-blush-700">
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const wished = wishlist.includes(product.id);
  const off = discountPct(product.price, product.originalPrice);
  const soldOut = product.stock === "out";

  const add = () => {
    if (soldOut) return;
    addToCart(product.id, qty);
    toast.success("Added to your bag", { description: product.name });
  };
  const buyNow = () => {
    if (soldOut) return;
    addToCart(product.id, qty);
    navigate("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pt-10">
      <ProductJsonLd id={product.id} />

      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-xs font-medium text-stone-gray">
        <Link to="/" className="transition hover:text-blush-600">Home</Link>
        <ChevronRight className="size-3" />
        <Link to="/shop" className="transition hover:text-blush-600">Shop</Link>
        <ChevronRight className="size-3" />
        <Link to={`/shop?category=${product.category}`} className="capitalize transition hover:text-blush-600">
          {product.category}
        </Link>
        <ChevronRight className="size-3" />
        <span className="line-clamp-1 text-blush-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* ── gallery ── */}
        <div>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-cream shadow-soft">
            <div className="relative aspect-[4/5]">
              <Image
                key={product.images[imgIdx]}
                src={product.images[imgIdx]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {off !== null && (
              <Badge className="absolute left-4 top-4 rounded-full bg-blush-600 px-3 py-1 text-xs font-semibold text-white">
                Save {off}%
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                  onClick={() => setImgIdx(i)}
                  className={cn(
                    "relative size-20 overflow-hidden rounded-2xl border-2 bg-cream transition",
                    i === imgIdx ? "border-blush-600" : "border-transparent opacity-75 hover:opacity-100",
                  )}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── info ── */}
        <div>
          <p className="eyebrow text-rosegold">{product.subcategory}</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-charcoal sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <RatingStars rating={product.rating} showValue />
            <span className="text-sm text-stone-gray">{product.reviews} reviews</span>
            {product.badge === "bestseller" && (
              <Badge variant="secondary" className="rounded-full bg-charcoal text-[11px] font-semibold text-white">
                Bestseller
              </Badge>
            )}
            {product.badge === "new" && (
              <Badge variant="secondary" className="rounded-full bg-blush-100 text-[11px] font-semibold text-blush-700">
                New
              </Badge>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-charcoal">{formatBDT(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-stone-gray line-through">{formatBDT(product.originalPrice)}</span>
            )}
            {off !== null && (
              <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-bold text-blush-700">
                You save {formatBDT((product.originalPrice ?? 0) - product.price)}
              </span>
            )}
          </div>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{product.description}</p>

          {soldOut ? (
            <p className="mt-6 inline-flex rounded-full bg-blush-100 px-4 py-2 text-sm font-semibold text-blush-700">
              Currently out of stock — check back soon!
            </p>
          ) : (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <QuantitySelector value={qty} onChange={setQty} />
              <Button
                className="h-11 min-w-40 flex-1 rounded-full bg-blush-600 font-semibold shadow-soft hover:bg-blush-700 sm:flex-none sm:px-8"
                onClick={add}
              >
                <ShoppingBag className="mr-2 size-4" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                className="h-11 flex-1 rounded-full border-blush-400 font-semibold text-blush-700 hover:bg-blush-100 hover:text-blush-700 sm:flex-none sm:px-8"
                onClick={buyNow}
              >
                <Zap className="mr-2 size-4" /> Buy Now
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                className="size-11 shrink-0 rounded-full border-blush-200 hover:bg-blush-50"
                onClick={() => {
                  toggleWishlist(product.id);
                  toast(wished ? "Removed from wishlist" : "Saved to your wishlist", {
                    icon: wished ? "🤍" : "💖",
                  });
                }}
              >
                <Heart className={cn("size-4", wished && "fill-blush-600 text-blush-600")} />
              </Button>
            </div>
          )}

          {/* trust strip */}
          <div className="mt-7 grid grid-cols-3 gap-2 rounded-3xl border border-blush-100 bg-white p-4 text-center">
            {[
              { icon: Truck, title: `৳${DELIVERY.inside}+ delivery`, sub: "free over ৳1,500" },
              { icon: ShieldCheck, title: "Quality checked", sub: "before dispatch" },
              { icon: RotateCcw, title: "7-day returns", sub: "easy & simple" },
            ].map((t) => (
              <div key={t.title} className="px-1">
                <t.icon className="mx-auto size-5 text-rosegold" />
                <p className="mt-1.5 text-xs font-bold text-charcoal">{t.title}</p>
                <p className="text-[11px] text-stone-gray">{t.sub}</p>
              </div>
            ))}
          </div>

          {/* details accordion */}
          <Accordion type="multiple" defaultValue={["details"]} className="mt-7 rounded-3xl border border-blush-100 bg-white px-5">
            <AccordionItem value="details" className="border-blush-100">
              <AccordionTrigger className="font-serif text-lg font-semibold text-charcoal hover:no-underline">
                Product Details
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-charcoal-soft">
                <dl className="grid grid-cols-[96px_1fr] gap-x-4 gap-y-2.5 pt-1">
                  {product.details.material && (
                    <>
                      <dt className="font-semibold text-charcoal">Material</dt>
                      <dd>{product.details.material}</dd>
                    </>
                  )}
                  {product.details.size && (
                    <>
                      <dt className="font-semibold text-charcoal">Size</dt>
                      <dd>{product.details.size}</dd>
                    </>
                  )}
                  {product.details.color && (
                    <>
                      <dt className="font-semibold text-charcoal">Color</dt>
                      <dd>{product.details.color}</dd>
                    </>
                  )}
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care" className="border-blush-100">
              <AccordionTrigger className="font-serif text-lg font-semibold text-charcoal hover:no-underline">
                Care Instructions
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-charcoal-soft">
                {product.details.care ?? "Handle with love and store safely."}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery" className="border-0">
              <AccordionTrigger className="font-serif text-lg font-semibold text-charcoal hover:no-underline">
                Delivery &amp; Returns
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm leading-relaxed text-charcoal-soft">
                <p>
                  Inside Dhaka: {formatBDT(DELIVERY.inside)} · Outside Dhaka: {formatBDT(DELIVERY.outside)} ·
                  Free delivery on orders over {formatBDT(FREE_DELIVERY_THRESHOLD)}.
                </p>
                <p>
                  Orders are confirmed by phone and delivered within 1–2 working days inside Dhaka, 2–4 days outside.
                  Easy 7-day return on unused items in original condition — see our{" "}
                  <Link to="/policies/returns" className="font-semibold text-blush-600 underline-offset-4 hover:underline">
                    Return Policy
                  </Link>
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-16 md:mt-24">
          <Reveal>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="eyebrow text-rosegold">You may also love</p>
                <h2 className="mt-1 font-serif text-3xl text-charcoal">Complete the Look</h2>
              </div>
              <Button asChild variant="ghost" className="hidden rounded-full font-semibold text-blush-700 hover:bg-blush-100 sm:inline-flex">
                <Link to={`/shop?category=${product.category}`}>View all →</Link>
              </Button>
            </div>
          </Reveal>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
