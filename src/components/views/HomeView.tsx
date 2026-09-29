"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  BadgePercent,
  CheckCircle2,
  Facebook,
  Instagram,
  MessageCircleHeart,
  Music2,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "@/lib/router";
import {
  CATEGORIES,
  featuredProducts,
  newArrivals,
  REVIEW_HIGHLIGHTS,
  getProduct,
  type Product,
} from "@/lib/products";
import { formatBDT, discountPct, cn } from "@/lib/utils";
import { ProductGrid } from "@/components/boutique/ProductGrid";
import { SectionHeading, Reveal } from "@/components/boutique/SectionHeading";
import { RatingStars } from "@/components/boutique/RatingStars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

/* ───────────────────────────── Hero ───────────────────────────── */
const HERO_PICK_IDS = ["j03", "b01", "n01", "a03"];
const HERO_PICKS = HERO_PICK_IDS.map((id) => getProduct(id)).filter(
  (p): p is Product => Boolean(p) && p!.stock !== "out",
);

function HeroProductTile({ product }: { product: Product }) {
  const off = discountPct(product.price, product.originalPrice);
  return (
    <Link
      to={`/product/${product.slug}`}
      className={cn(
        "group block overflow-hidden rounded-2xl bg-white text-left shadow-soft ring-1 ring-blush-100/80",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-400",
      )}
    >
      {/* rectangle image with rounded corners */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 45vw, 200px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {off !== null && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-blush-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm">
            −{off}%
          </span>
        )}
      </div>
      {/* name + price */}
      <div className="px-3 py-2.5">
        <p className="truncate text-xs font-semibold text-charcoal transition-colors group-hover:text-blush-600 sm:text-[13px]">
          {product.name}
        </p>
        <p className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[13px] font-bold text-blush-600 sm:text-sm">{formatBDT(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-stone-gray line-through">{formatBDT(product.originalPrice)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blush-50 via-ivory to-ivory">
      {/* soft decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-blush-100/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-nude/40 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 md:pb-20 md:pt-16 lg:grid-cols-2 lg:gap-14">
        {/* copy */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          <p className="eyebrow text-rosegold">Beauty · Style · Everyday</p>
          <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.12] text-charcoal text-balance sm:text-5xl md:text-6xl">
            Your Little World of{" "}
            <span className="relative inline-block italic text-blush-600">
              Beauty
              <svg
                aria-hidden
                viewBox="0 0 120 12"
                className="absolute -bottom-1 left-0 w-full text-blush-300"
                preserveAspectRatio="none"
              >
                <path d="M2 9C30 3 80 3 118 8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            &amp; Style
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base lg:mx-0">
            Discover beautiful accessories, beauty essentials and everyday favorites — all in one place.
            Thoughtfully picked, honestly described, and starting from just ৳100.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button
              asChild
              className="h-12 rounded-full bg-blush-600 px-8 text-[15px] font-semibold shadow-soft hover:bg-blush-700"
            >
              <Link to="/shop">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-blush-300 px-8 text-[15px] font-semibold text-blush-700 hover:bg-blush-100 hover:text-blush-700"
            >
              <Link to="/shop?category=jewelry">Explore Collection</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-charcoal-soft lg:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-blush-500" /> Quality checked before dispatch
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="size-4 text-blush-500" /> Delivery inside &amp; outside Dhaka
            </span>
          </div>
        </motion.div>

        {/* product collage — rectangle tiles, rounded corners */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-1 mx-auto w-full max-w-[400px] lg:order-2"
        >
          {/* soft backdrop panel */}
          <div aria-hidden className="absolute -inset-x-3 top-8 -bottom-2 rounded-[2.5rem] bg-blush-100/60 sm:-inset-x-5 sm:top-10 sm:-bottom-4" />

          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            {/* left column */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {HERO_PICKS[0] && <HeroProductTile product={HERO_PICKS[0]} />}
              {HERO_PICKS[1] && <HeroProductTile product={HERO_PICKS[1]} />}
            </div>
            {/* right column — staggered down for an editorial feel */}
            <div className="flex flex-col gap-3 pt-6 sm:gap-4 sm:pt-10">
              {HERO_PICKS[2] && <HeroProductTile product={HERO_PICKS[2]} />}
              {HERO_PICKS[3] && <HeroProductTile product={HERO_PICKS[3]} />}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute -left-2 bottom-0 rounded-full bg-white/95 py-1.5 pl-3.5 pr-4 shadow-soft backdrop-blur sm:-left-4"
          >
            <p className="whitespace-nowrap text-[11px] font-medium text-charcoal-soft sm:text-xs">
              Starting from <span className="font-serif text-sm font-bold text-blush-600 sm:text-base">৳100</span>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="absolute -right-1 top-0 flex items-center gap-1.5 rounded-full bg-white/95 py-1 pl-2 pr-2.5 shadow-soft backdrop-blur sm:-right-4 sm:top-4 sm:gap-2 sm:py-2 sm:pl-2.5 sm:pr-4"
          >
            <RatingStars rating={4.8} size={13} />
            <span className="whitespace-nowrap text-[10px] font-semibold text-charcoal-soft sm:text-xs">Loved by our girls</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── Category tiles ───────────────────────── */
function CategoryTiles() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
      <SectionHeading
        eyebrow="Browse by mood"
        title="Shop by Category"
        subtitle="Five little corners of the boutique — each filled with favorites under ৳500."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.06}>
            <Link to={`/shop?category=${c.id}`} className="group block text-center">
              <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-full border-4 border-white shadow-soft transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-lift">
                <Image
                  src={c.image}
                  alt={`${c.name} collection at Joba's Closet`}
                  fill
                  sizes="(max-width: 640px) 45vw, 200px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-charcoal/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal transition-colors group-hover:text-blush-600">
                {c.name}
              </h3>
              <p className="mt-0.5 text-xs text-stone-gray">{c.tagline}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Featured products ───────────────────────── */
function Featured() {
  return (
    <section className="bg-white/60 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Handpicked with love"
          title="Picked For You"
          subtitle="Our current favorites — the pieces our girls keep coming back for."
        />
        <ProductGrid products={featuredProducts().slice(0, 8)} />
        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-full border-blush-300 px-8 font-semibold text-blush-700 hover:bg-blush-100 hover:text-blush-700"
          >
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Promo banner ───────────────────────── */
function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
      <Reveal>
        <div className="overflow-hidden rounded-[2rem] bg-charcoal shadow-lift">
          <div className="grid items-center lg:grid-cols-2">
            <div className="relative h-64 sm:h-80 lg:h-auto lg:min-h-[380px]">
              <Image
                src="/images/brand/promo-jewelry.jpg"
                alt="Gold-tone imitation jewelry arranged on cream silk"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative p-8 text-center sm:p-12 lg:text-left">
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-blush-700/30 blur-3xl" />
              <p className="eyebrow text-blush-300">The Jewelry Edit</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight text-blush-50 sm:text-4xl">
                Little Things. <span className="italic">Big Style.</span>
              </h3>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-blush-100/80 lg:mx-0">
                Gold-tone, silver-tone and imitation pearl pieces — carefully described, honestly priced,
                and pretty enough to wear every single day.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button asChild className="h-11 rounded-full bg-blush-50 px-7 font-semibold text-charcoal hover:bg-white">
                  <Link to="/shop?category=jewelry">Shop Jewelry</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-blush-300/60 bg-transparent px-7 font-semibold text-blush-100 hover:bg-white/10 hover:text-white"
                >
                  <Link to="/shop?category=nails">Shop Nails</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────────────────── New arrivals ───────────────────────── */
function NewArrivals() {
  return (
    <section className="bg-white/60 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Fresh this week"
          title="New Arrivals"
          subtitle="Just landed — be the first to love them."
        />
        <ProductGrid products={newArrivals(8)} />
      </div>
    </section>
  );
}

/* ───────────────────────── Trust / why shop ───────────────────────── */
const TRUST = [
  {
    icon: BadgePercent,
    title: "Affordable Prices",
    text: "Beautiful products at accessible prices — most finds are ৳100 to ৳300.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Checked",
    text: "Every order is checked before dispatch so it reaches you just right.",
  },
  {
    icon: Sparkles,
    title: "Easy Ordering",
    text: "No account needed. Order in minutes and pay cash on delivery.",
  },
  {
    icon: MessageCircleHeart,
    title: "Friendly Support",
    text: "Questions? Message us on Facebook or WhatsApp — we reply quickly.",
  },
];

function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
      <SectionHeading eyebrow="Why Joba's Closet" title="Why Shop With Us" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {TRUST.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.06}>
            <div className="h-full rounded-3xl border border-blush-100 bg-white p-6 text-center shadow-soft transition-transform duration-300 hover:-translate-y-1">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-blush-100 text-blush-600">
                <t.icon className="size-6" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Reviews ───────────────────────── */
function Reviews() {
  return (
    <section className="bg-gradient-to-b from-ivory via-blush-50 to-ivory py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Real reviews, real girls"
          title="Loved by Our Customers"
          subtitle="Only genuine reviews from customers who received their orders."
        />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {REVIEW_HIGHLIGHTS.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 0.06}>
              <figure className="flex h-full flex-col rounded-3xl border border-blush-100 bg-white/90 p-6 shadow-soft">
                <RatingStars rating={r.rating} />
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-charcoal-soft">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 border-t border-blush-100 pt-4">
                  <p className="text-sm font-bold text-charcoal">{r.name}</p>
                  <p className="mt-0.5 text-xs text-stone-gray">purchased · {r.product}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Social ───────────────────────── */
function SocialSection() {
  const strip = ["/images/brand/promo-beauty.jpg", "/images/products/necklace-1.jpg", "/images/products/presson-1.jpg", "/images/brand/promo-jewelry.jpg", "/images/products/handbag-1.jpg", "/images/products/candle-1.jpg"];
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
      <SectionHeading
        eyebrow="@jobascloset"
        title="Follow Joba's Closet"
        subtitle="New arrivals, styling ideas and little behind-the-scenes moments — join us on Facebook."
      />
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
        {strip.map((src, i) => (
          <Reveal key={src} delay={i * 0.04}>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Joba's Closet on Facebook"
              className="group relative block aspect-square overflow-hidden rounded-2xl bg-cream"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 grid place-items-center bg-charcoal/0 transition group-hover:bg-charcoal/35">
                <Facebook className="size-6 text-white opacity-0 transition group-hover:opacity-100" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="h-11 rounded-full bg-[#1877f2] px-7 font-semibold hover:bg-[#166fe0]">
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer noopener">
            <Facebook className="mr-2 size-4" /> Follow on Facebook
          </a>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-full border-blush-300 px-7 font-semibold text-blush-700 hover:bg-blush-100 hover:text-blush-700">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer noopener">
            <Instagram className="mr-2 size-4" /> Instagram
          </a>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-full border-blush-300 px-7 font-semibold text-blush-700 hover:bg-blush-100 hover:text-blush-700">
          <a href="https://www.tiktok.com" target="_blank" rel="noreferrer noopener">
            <Music2 className="mr-2 size-4" /> TikTok
          </a>
        </Button>
      </div>
    </section>
  );
}

/* ───────────────────────── Newsletter ───────────────────────── */
function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-blush-100 px-6 py-12 text-center sm:px-12">
          <div aria-hidden className="pointer-events-none absolute -left-12 -top-12 size-44 rounded-full bg-white/50 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-10 size-56 rounded-full bg-blush-200/70 blur-3xl" />
          <p className="eyebrow text-rosegold">Stay in the loop</p>
          <h3 className="mx-auto mt-3 max-w-lg font-serif text-3xl leading-snug text-charcoal text-balance">
            Be first to see new arrivals &amp; little treats
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-soft">
            Join the Joba&rsquo;s Closet list for early access to new collections and subscriber-only offers.
            No spam — pinky promise.
          </p>
          <form
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                toast.error("Please enter a valid email address");
                return;
              }
              setEmail("");
              toast.success("You're on the list! 💌", {
                description: "Watch your inbox for new arrivals and offers.",
              });
            }}
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="h-12 flex-1 rounded-full border-white bg-white px-5 text-[15px] shadow-sm focus-visible:ring-blush-300"
            />
            <Button type="submit" className="h-12 rounded-full bg-blush-600 px-7 font-semibold hover:bg-blush-700">
              Subscribe <Send className="ml-1.5 size-4" />
            </Button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}

export function HomeView() {
  return (
    <>
      <Hero />
      <CategoryTiles />
      <Featured />
      <PromoBanner />
      <NewArrivals />
      <TrustSection />
      <Reviews />
      <SocialSection />
      <Newsletter />
    </>
  );
}
