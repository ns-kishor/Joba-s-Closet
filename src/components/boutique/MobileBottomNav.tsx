"use client";

import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { Link, useRouter } from "@/lib/router";
import { useShop, useHasMounted, cartCount } from "@/lib/store";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Home", to: "/", icon: Home },
  { label: "Shop", to: "/shop", icon: LayoutGrid },
  { label: "Wishlist", to: "/wishlist", icon: Heart },
  { label: "Cart", to: "/cart", icon: ShoppingBag },
  { label: "Account", to: "/account", icon: User },
];

export function MobileBottomNav() {
  const { path } = useRouter();
  const mounted = useHasMounted();
  const cart = useShop((s) => s.cart);
  const count = mounted ? cartCount(cart) : 0;

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-blush-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-semibold transition-colors",
                active ? "text-blush-700" : "text-stone-gray hover:text-blush-600",
              )}
              ariaLabel={item.label}
            >
              <span className="relative">
                <item.icon className={cn("size-5", active && "fill-blush-100")} />
                {item.label === "Cart" && count > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid min-w-4 place-items-center rounded-full bg-blush-600 px-1 text-[9px] font-bold leading-4 text-white">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </span>
              {item.label}
              {active && (
                <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-blush-600" aria-hidden />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
