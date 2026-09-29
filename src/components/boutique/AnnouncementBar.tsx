"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="relative bg-charcoal text-blush-100">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-10 py-2 text-center text-[12px] font-medium tracking-wide sm:text-[13px]">
        <Sparkles className="size-3.5 shrink-0 text-blush-300" aria-hidden />
        <span>Affordable Beauty &amp; Style — Starting From ৳100</span>
        <span className="hidden sm:inline text-blush-300/70">·</span>
        <span className="hidden sm:inline">Cash on Delivery across Bangladesh</span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-blush-100/70 transition hover:bg-white/10 hover:text-blush-100"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
