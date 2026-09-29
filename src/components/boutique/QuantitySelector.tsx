"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuantitySelector({
  value,
  onChange,
  className,
  small = false,
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
  small?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-blush-200 bg-white",
        small ? "h-8" : "h-11",
        className,
      )}
      role="group"
      aria-label="Quantity selector"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("rounded-full hover:bg-blush-50", small ? "size-8" : "size-11")}
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Decrease quantity"
      >
        <Minus className={small ? "size-3" : "size-4"} />
      </Button>
      <span
        className={cn(
          "min-w-8 text-center font-semibold tabular-nums text-charcoal",
          small ? "text-xs" : "text-sm",
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("rounded-full hover:bg-blush-50", small ? "size-8" : "size-11")}
        onClick={() => onChange(Math.min(99, value + 1))}
        aria-label="Increase quantity"
      >
        <Plus className={small ? "size-3" : "size-4"} />
      </Button>
    </div>
  );
}
