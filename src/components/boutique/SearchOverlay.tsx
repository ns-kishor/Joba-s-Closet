"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useRouter, Link } from "@/lib/router";
import { searchProducts } from "@/lib/products";
import { formatBDT, cn } from "@/lib/utils";
import { RatingStars } from "./RatingStars";

const POPULAR = ["bracelet", "necklace", "press-on nails", "lipstick", "scrunchie", "candle"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { navigate } = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // reset query each time the overlay opens (render-adjust pattern)
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setQ("");
  }

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => searchProducts(q).slice(0, 8), [q]);

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-200",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "absolute inset-x-0 top-0 mx-auto max-w-2xl rounded-b-3xl bg-white p-5 shadow-lift transition-transform duration-300 sm:p-7",
          open ? "translate-y-0" : "-translate-y-6",
        )}
      >
        <div className="flex items-center gap-3">
          <Search className="size-5 shrink-0 text-rosegold" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) go(`/product/${results[0].slug}`);
            }}
            placeholder="Search beauty, jewelry, nails..."
            className="w-full bg-transparent text-lg font-medium text-charcoal outline-none placeholder:text-stone-gray/70"
            aria-label="Search products"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid size-9 shrink-0 place-items-center rounded-full text-stone-gray transition hover:bg-blush-50 hover:text-charcoal"
          >
            <X className="size-5" />
          </button>
        </div>

        {!q && (
          <div className="mt-5">
            <p className="eyebrow text-stone-gray">Popular right now</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {POPULAR.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQ(term)}
                  className="rounded-full border border-blush-200 bg-blush-50 px-4 py-1.5 text-sm font-medium text-blush-700 transition hover:bg-blush-100"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {q && (
          <div className="mt-5 max-h-[55vh] overflow-y-auto pr-1 thin-scrollbar">
            {results.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nothing found for &ldquo;{q}&rdquo; — try &ldquo;necklace&rdquo; or &ldquo;nails&rdquo;?
              </p>
            ) : (
              <ul className="divide-y divide-blush-100">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/product/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-2xl p-2.5 transition hover:bg-blush-50"
                    >
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                        <Image src={p.images[0]} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-charcoal">{p.name}</span>
                        <span className="mt-0.5 flex items-center gap-2">
                          <RatingStars rating={p.rating} size={11} />
                          <span className="text-xs text-stone-gray">{p.subcategory}</span>
                        </span>
                      </span>
                      <span className="text-sm font-bold text-charcoal">{formatBDT(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
