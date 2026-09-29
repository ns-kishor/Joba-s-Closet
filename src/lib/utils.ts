import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format Bangladeshi Taka — e.g. ৳1,250 */
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-IN")}`;
}

export function discountPct(price: number, original?: number): number | null {
  if (!original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
}
