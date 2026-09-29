"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, Menu, Search, ShoppingBag, User, ChevronDown, X } from "lucide-react";
import { Link, useRouter } from "@/lib/router";
import { CATEGORIES } from "@/lib/products";
import { useShop, useHasMounted, cartCount } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/shop", dropdown: true },
  { label: "New Arrivals", to: "/shop?tag=new" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Badge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-blush-600 px-1 text-[10px] font-bold leading-4 text-white",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function IconLink({
  to,
  label,
  children,
  count,
  onClick,
}: {
  to?: string;
  label: string;
  children: React.ReactNode;
  count?: number;
  onClick?: () => void;
}) {
  const cls =
    "relative grid size-10 place-items-center rounded-full text-charcoal transition hover:bg-blush-100 hover:text-blush-700";
  if (onClick || !to) {
    return (
      <button type="button" aria-label={label} className={cls} onClick={onClick}>
        {children}
        {count !== undefined && <Badge count={count} />}
      </button>
    );
  }
  return (
    <Link to={to} ariaLabel={label} className={cls}>
      {children}
      {count !== undefined && <Badge count={count} />}
    </Link>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2" ariaLabel="Joba's Closet — home">
      <span
        className={cn(
          "grid place-items-center rounded-full bg-blush-600 font-serif text-white italic transition-all duration-300",
          compact ? "size-8 text-lg" : "size-9 text-xl",
        )}
        aria-hidden
      >
        J
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif font-semibold text-charcoal transition-all duration-300",
            compact ? "text-lg" : "text-xl md:text-[22px]",
          )}
        >
          Joba&rsquo;s Closet
        </span>
        <span
          className={cn(
            "eyebrow hidden overflow-hidden text-rosegold/80 transition-all duration-300 sm:block",
            compact ? "h-0 opacity-0" : "h-3.5 opacity-100",
          )}
        >
          Beauty · Style · Everyday
        </span>
      </span>
    </Link>
  );
}

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { path, navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useHasMounted();
  const cart = useShop((s) => s.cart);
  const wishlist = useShop((s) => s.wishlist);
  const count = mounted ? cartCount(cart) : 0;
  const wishCount = mounted ? wishlist.length : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to: string) => {
    const base = to.split("?")[0];
    return base === "/" ? path === "/" : path.startsWith(base);
  };

  const openCat = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCatOpen(true);
  };
  const closeCat = () => {
    closeTimer.current = setTimeout(() => setCatOpen(false), 120);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-transparent bg-ivory/90 backdrop-blur-md transition-all duration-300",
        scrolled
          ? "border-border shadow-[0_8px_30px_-18px_rgba(78,52,58,0.25)]"
          : "border-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between gap-3 transition-all duration-300",
            scrolled ? "h-14" : "h-16 md:h-[72px]",
          )}
        >
          {/* mobile: menu */}
          <div className="flex items-center gap-1 lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-full hover:bg-blush-100">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 rounded-r-3xl border-0 bg-ivory p-0">
                <SheetHeader className="border-b border-blush-100 p-5 text-left">
                  <SheetTitle asChild>
                    <div>
                      <Logo />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex h-[calc(100%-92px)] flex-col overflow-y-auto px-4 py-4">
                  <nav className="flex flex-col" aria-label="Mobile">
                    {NAV.filter((n) => !n.dropdown).map((n) => (
                      <Link
                        key={n.label}
                        to={n.to}
                        className={cn(
                          "rounded-xl px-4 py-3 text-[15px] font-medium transition hover:bg-blush-100",
                          isActive(n.to) ? "bg-blush-100 text-blush-700" : "text-charcoal",
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {n.label}
                      </Link>
                    ))}
                    <Accordion type="single" collapsible className="mt-1">
                      <AccordionItem value="cats" className="border-0">
                        <AccordionTrigger className="rounded-xl px-4 py-3 text-[15px] font-medium text-charcoal hover:bg-blush-100 hover:no-underline [&[data-state=open]]:bg-blush-100 [&[data-state=open]]:text-blush-700">
                          Categories
                        </AccordionTrigger>
                        <AccordionContent className="pb-1 pl-2">
                          {CATEGORIES.map((c) => (
                            <Link
                              key={c.id}
                              to={`/shop?category=${c.id}`}
                              className="block rounded-lg px-4 py-2 text-sm text-charcoal-soft transition hover:bg-blush-50 hover:text-blush-700"
                              onClick={() => setMobileOpen(false)}
                            >
                              {c.name}
                              <span className="ml-2 text-xs text-stone-gray">{c.tagline}</span>
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </nav>
                  <div className="my-4 h-px bg-blush-100" />
                  <nav className="flex flex-col" aria-label="Mobile secondary">
                    {[
                      { label: "Account", to: "/account", icon: User },
                      { label: `Wishlist${wishCount ? ` (${wishCount})` : ""}`, to: "/wishlist", icon: Heart },
                      { label: "Contact Us", to: "/contact", icon: X },
                    ].map((n) => (
                      <Link
                        key={n.label}
                        to={n.to}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-charcoal transition hover:bg-blush-100"
                        onClick={() => setMobileOpen(false)}
                      >
                        <n.icon className="size-4 text-rosegold" /> {n.label}
                      </Link>
                    ))}
                  </nav>
                  <p className="mt-auto px-4 pb-2 pt-6 text-xs leading-relaxed text-stone-gray">
                    Affordable beauty &amp; style, starting from ৳100.
                    <br />
                    Cash on Delivery across Bangladesh.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={onOpenSearch}
              className="rounded-full hover:bg-blush-100 lg:hidden"
            >
              <Search className="size-5" />
            </Button>
          </div>

          {/* logo */}
          <Logo compact={scrolled} />

          {/* desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV.map((n) => {
              const base = n.to.split("?")[0];
              return (
                <div
                  key={n.label}
                  className="relative"
                  onMouseEnter={n.dropdown ? openCat : undefined}
                  onMouseLeave={n.dropdown ? closeCat : undefined}
                >
                  <Link
                    to={n.to}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-4 py-2 text-[14px] font-semibold tracking-wide transition-colors",
                      isActive(base) ? "text-blush-700" : "text-charcoal-soft hover:text-blush-600",
                    )}
                    aria-haspopup={n.dropdown ? "true" : undefined}
                  >
                    {n.label}
                    {n.dropdown && (
                      <ChevronDown className={cn("size-3.5 transition-transform", catOpen && "rotate-180")} />
                    )}
                  </Link>
                  {/* categories dropdown */}
                  {n.dropdown && catOpen && (
                    <div className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3">
                      <div className="grid grid-cols-2 gap-1 rounded-3xl border border-blush-100 bg-white p-3 shadow-lift">
                        {CATEGORIES.map((c) => (
                          <Link
                            key={c.id}
                            to={`/shop?category=${c.id}`}
                            className="group/c flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-blush-50"
                            onClick={() => setCatOpen(false)}
                          >
                            <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                              <Image
                                src={c.image}
                                alt=""
                                fill
                                sizes="56px"
                                className="object-cover transition group-hover/c:scale-105"
                              />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-charcoal">{c.name}</span>
                              <span className="block truncate text-xs text-stone-gray">{c.tagline}</span>
                            </span>
                          </Link>
                        ))}
                        <Link
                          to="/shop"
                          className="flex items-center justify-center rounded-2xl bg-blush-50 p-2.5 text-sm font-semibold text-blush-700 transition hover:bg-blush-100"
                          onClick={() => setCatOpen(false)}
                        >
                          Shop everything →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <div className="hidden lg:block">
              <IconLink label="Search" onClick={onOpenSearch}>
                <Search className="size-5" />
              </IconLink>
            </div>
            <div className="hidden sm:block">
              <IconLink to="/account" label="Account">
                <User className="size-5" />
              </IconLink>
            </div>
            <IconLink to="/wishlist" label="Wishlist" count={wishCount}>
              <Heart className="size-5" />
            </IconLink>
            <IconLink
              to="/cart"
              label="Cart"
              count={count}
              onClick={() => {
                if (path === "/cart") navigate("/cart", { keepScroll: false });
              }}
            >
              <ShoppingBag className="size-5" />
            </IconLink>
          </div>
        </div>
      </div>
    </header>
  );
}
