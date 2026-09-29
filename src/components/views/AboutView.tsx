"use client";

import Image from "next/image";
import { Heart, Leaf, Sparkles, Wallet } from "lucide-react";
import { Link } from "@/lib/router";
import { Reveal } from "@/components/boutique/SectionHeading";
import { Button } from "@/components/ui/button";

const VALUES = [
  {
    icon: Wallet,
    title: "Affordable, always",
    text: "Most of our picks are ৳100–৳300. Pretty things shouldn't need a big budget.",
  },
  {
    icon: Heart,
    title: "Picked with love",
    text: "Every item is chosen as if we're shopping for our best friend — because you are.",
  },
  {
    icon: Leaf,
    title: "Honest descriptions",
    text: "Our jewelry is artificial and fashion jewelry, and we say so proudly. No fake claims, ever.",
  },
  {
    icon: Sparkles,
    title: "Small joys, delivered",
    text: "From a candle's first light to a necklace's little sparkle — delivered to your door.",
  },
];

export function AboutView() {
  return (
    <div className="pb-20">
      {/* hero */}
      <section className="bg-gradient-to-b from-blush-50 to-ivory">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="eyebrow text-rosegold">Our story</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-charcoal text-balance sm:text-5xl">
                A Little More Beauty, A Little More You.
              </h1>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Joba&rsquo;s Closet began with a simple thought: every girl deserves pretty things that don&rsquo;t
                cost a fortune. We&rsquo;re a small online boutique from Bangladesh offering affordable beauty
                essentials, artificial and fashion jewelry, press-on nails, accessories and everyday
                lifestyle picks.
              </p>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                We keep things honest and simple — real photos, clear prices, friendly service and Cash on
                Delivery across the country. No fuss, no fake luxury, just beautiful little things made for
                everyday you.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="h-12 rounded-full bg-blush-600 px-8 font-semibold hover:bg-blush-700">
                  <Link to="/shop">Shop the Boutique</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-blush-300 px-8 font-semibold text-blush-700 hover:bg-blush-100 hover:text-blush-700"
                >
                  <Link to="/contact">Say Hello</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative mx-auto w-full max-w-[400px]">
                <div aria-hidden className="absolute inset-x-4 -bottom-4 top-8 arch border-2 border-blush-200" />
                <div className="relative arch overflow-hidden shadow-lift">
                  <Image
                    src="/images/brand/about.jpg"
                    alt="A cozy vanity corner with beauty products and jewelry"
                    width={864}
                    height={1152}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <Reveal className="mb-10 text-center">
          <p className="eyebrow text-rosegold">What we believe</p>
          <h2 className="mt-2 font-serif text-3xl text-charcoal md:text-4xl">The Joba&rsquo;s Closet Way</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <div className="h-full rounded-3xl border border-blush-100 bg-white p-6 shadow-soft">
                <span className="grid size-12 place-items-center rounded-full bg-blush-100 text-blush-600">
                  <v.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* brand strip */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-[2rem] bg-charcoal px-6 py-12 text-center sm:px-12">
            <p className="eyebrow text-blush-300">Our promise</p>
            <p className="mx-auto mt-4 max-w-2xl font-serif text-2xl leading-snug text-blush-50 text-balance sm:text-3xl">
              &ldquo;Beauty, Style &amp; Little Things You&rsquo;ll Love — honestly described, fairly priced,
              delivered with care.&rdquo;
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
