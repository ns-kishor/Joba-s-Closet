"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";
import { getProduct, type Product } from "./products";

export type CartLine = { productId: string; qty: number };

export type OrderSnapshot = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  zone: "inside" | "outside";
  items: { productId: string; name: string; price: number; qty: number; image: string }[];
  subtotal: number;
  delivery: number;
  total: number;
  createdAt: string;
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  lastOrder: OrderSnapshot | null;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setLastOrder: (o: OrderSnapshot) => void;
};

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      lastOrder: null,
      addToCart: (productId, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((l) => l.productId === productId);
          if (existing) {
            return {
              cart: s.cart.map((l) =>
                l.productId === productId ? { ...l, qty: Math.min(l.qty + qty, 99) } : l,
              ),
            };
          }
          return { cart: [...s.cart, { productId, qty }] };
        }),
      setQty: (productId, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((l) => l.productId !== productId)
              : s.cart.map((l) => (l.productId === productId ? { ...l, qty: Math.min(qty, 99) } : l)),
        })),
      removeFromCart: (productId) =>
        set((s) => ({ cart: s.cart.filter((l) => l.productId !== productId) })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId)
            ? s.wishlist.filter((id) => id !== productId)
            : [...s.wishlist, productId],
        })),
      isInWishlist: (productId) => get().wishlist.includes(productId),
      setLastOrder: (o) => set({ lastOrder: o }),
    }),
    { name: "jobas-closet-v1" },
  ),
);

/** Avoid SSR/localStorage hydration mismatches for persisted values. */
const emptySubscribe = () => () => {};
export function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function cartCount(cart: CartLine[]) {
  return cart.reduce((n, l) => n + l.qty, 0);
}

export function cartLines(cart: CartLine[]): { product: Product; qty: number }[] {
  return cart
    .map((l) => ({ product: getProduct(l.productId), qty: l.qty }))
    .filter((x): x is { product: Product; qty: number } => Boolean(x.product));
}
