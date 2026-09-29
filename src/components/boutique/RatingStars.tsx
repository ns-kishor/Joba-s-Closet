"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 14,
  className,
  showValue = false,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-label={`Rated ${rating} out of 5`}>
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={cn(
              "shrink-0",
              i <= Math.round(rating) ? "fill-[#d99ea1] text-[#c97f86]" : "fill-transparent text-blush-200",
            )}
          />
        ))}
      </span>
      {showValue && <span className="text-xs font-semibold text-charcoal-soft">{rating.toFixed(1)}</span>}
    </span>
  );
}
