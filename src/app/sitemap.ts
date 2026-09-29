import type { MetadataRoute } from "next";
import { PRODUCTS, CATEGORIES } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://jobascloset.com";
  const now = new Date();

  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/account",
    "/policies/privacy",
    "/policies/terms",
    "/policies/returns",
    "/policies/delivery",
  ].map((p) => ({
    url: `${base}/#${p || "/"}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.6,
  }));

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${base}/#/shop?category=${c.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${base}/#/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
