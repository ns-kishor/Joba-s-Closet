"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RouterProvider, useRouter } from "@/lib/router";
import { getProduct } from "@/lib/products";
import { AuthProvider } from "@/lib/auth";
import { AnnouncementBar } from "@/components/boutique/AnnouncementBar";
import { Header } from "@/components/boutique/Header";
import { MobileBottomNav } from "@/components/boutique/MobileBottomNav";
import { Footer } from "@/components/boutique/Footer";
import { SearchOverlay } from "@/components/boutique/SearchOverlay";
import { HomeView } from "@/components/views/HomeView";
import { ShopView } from "@/components/views/ShopView";
import { ProductView } from "@/components/views/ProductView";
import { CartView } from "@/components/views/CartView";
import { CheckoutView } from "@/components/views/CheckoutView";
import { ConfirmationView } from "@/components/views/ConfirmationView";
import { WishlistView } from "@/components/views/WishlistView";
import { AboutView } from "@/components/views/AboutView";
import { ContactView } from "@/components/views/ContactView";
import { AccountView } from "@/components/views/AccountView";
import { PolicyView } from "@/components/views/PolicyView";

const TITLES: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^\/product\/(.+)$/, (m) => (getProduct(m[1])?.name ?? "Product")],
  [/^\/shop$/, () => "Shop All — Beauty, Jewelry, Nails & More"],
  [/^\/cart$/, () => "Your Bag"],
  [/^\/checkout$/, () => "Checkout"],
  [/^\/order-confirmation$/, () => "Order Confirmed"],
  [/^\/wishlist$/, () => "Your Wishlist"],
  [/^\/about$/, () => "About Us"],
  [/^\/contact$/, () => "Contact Us"],
  [/^\/account$/, () => "Account"],
  [/^\/policies\/(\w+)$/, (m) =>
    ({ privacy: "Privacy Policy", terms: "Terms & Conditions", returns: "Return Policy", delivery: "Delivery Information" })[
      m[1] as "privacy"
    ] ?? "Policies",
  ],
  [/^\/$/, () => "Joba's Closet — Affordable Beauty, Jewelry & Style for Women"],
];

function ViewSwitch() {
  const { path } = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    for (const [re, fn] of TITLES) {
      const m = path.match(re);
      if (m) {
        document.title = fn(m);
        return;
      }
    }
  }, [path]);

  const view = (() => {
    let m: RegExpMatchArray | null;
    if (path === "/") return <HomeView />;
    if (path === "/shop") return <ShopView />;
    if ((m = path.match(/^\/product\/([\w-]+)$/))) return <ProductView slug={m[1]} />;
    if (path === "/cart") return <CartView />;
    if (path === "/checkout") return <CheckoutView />;
    if (path === "/order-confirmation") return <ConfirmationView />;
    if (path === "/wishlist") return <WishlistView />;
    if (path === "/about") return <AboutView />;
    if (path === "/contact") return <ContactView />;
    if (path === "/account") return <AccountView />;
    if ((m = path.match(/^\/policies\/(\w+)$/))) return <PolicyView doc={m[1]} />;
    return <HomeView />;
  })();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={path.split("?")[0]}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-[60vh]"
      >
        {view}
      </motion.main>
    </AnimatePresence>
  );
}

export default function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <RouterProvider>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-ivory">
          <AnnouncementBar />
          <Header onOpenSearch={() => setSearchOpen(true)} />
          <ViewSwitch />
          <Footer />
          <MobileBottomNav />
          <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
      </AuthProvider>
    </RouterProvider>
  );
}
