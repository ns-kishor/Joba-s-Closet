"use client";

import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

/** Responsive grid: 2-up mobile · 3-up tablet · 4-up desktop (PRD §14). */
export function ProductGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
