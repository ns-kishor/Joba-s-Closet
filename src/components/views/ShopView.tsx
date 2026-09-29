"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X, HeartCrack } from "lucide-react";
import { useRouter, Link } from "@/lib/router";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/lib/products";
import { ProductGrid } from "@/components/boutique/ProductGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "newest" | "popular" | "price-asc" | "price-desc";

const PRICE_RANGES = [
  { id: "under-150", label: "Under ৳150", min: 0, max: 149 },
  { id: "150-300", label: "৳150 – ৳300", min: 150, max: 300 },
  { id: "300-500", label: "৳300 – ৳500", min: 300, max: 500 },
  { id: "500-plus", label: "৳500+", min: 500, max: Infinity },
] as const;

const SORTS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "popular", label: "Most Popular" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

type Filters = {
  cats: CategoryId[];
  price: string | null;
  inStock: boolean;
  rating4: boolean;
  newOnly: boolean;
  discounted: boolean;
};

const EMPTY: Filters = { cats: [], price: null, inStock: false, rating4: false, newOnly: false, discounted: false };

function FilterPanel({
  filters,
  set,
  onApply,
}: {
  filters: Filters;
  set: (f: Filters) => void;
  onApply?: () => void;
}) {
  const toggleCat = (id: CategoryId) =>
    set({ ...filters, cats: filters.cats.includes(id) ? filters.cats.filter((c) => c !== id) : [...filters.cats, id] });

  return (
    <div className="space-y-7">
      {/* categories */}
      <fieldset>
        <legend className="eyebrow mb-3 text-charcoal">Category</legend>
        <div className="space-y-2.5">
          {CATEGORIES.map((c) => (
            <div key={c.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`cat-${c.id}`}
                checked={filters.cats.includes(c.id)}
                onCheckedChange={() => toggleCat(c.id)}
                className="border-blush-300 data-[state=checked]:border-blush-600 data-[state=checked]:bg-blush-600"
              />
              <Label htmlFor={`cat-${c.id}`} className="cursor-pointer text-sm font-medium text-charcoal-soft">
                {c.name} <span className="text-xs text-stone-gray">({PRODUCTS.filter((p) => p.category === c.id).length})</span>
              </Label>
            </div>
          ))}
        </div>
      </fieldset>

      {/* price */}
      <fieldset>
        <legend className="eyebrow mb-3 text-charcoal">Price</legend>
        <div className="space-y-2">
          {PRICE_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => set({ ...filters, price: filters.price === r.id ? null : r.id })}
              className={cn(
                "w-full rounded-full border px-4 py-2 text-left text-sm font-medium transition",
                filters.price === r.id
                  ? "border-blush-600 bg-blush-100 text-blush-700"
                  : "border-blush-200 bg-white text-charcoal-soft hover:bg-blush-50",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* toggles */}
      <fieldset>
        <legend className="eyebrow mb-3 text-charcoal">More</legend>
        <div className="space-y-2.5">
          {(
            [
              ["inStock", "In stock only"],
              ["rating4", "Rated 4★ & up"],
              ["newOnly", "New arrivals"],
              ["discounted", "On discount"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2.5">
              <Checkbox
                id={`f-${key}`}
                checked={filters[key]}
                onCheckedChange={(v) => set({ ...filters, [key]: v === true })}
                className="border-blush-300 data-[state=checked]:border-blush-600 data-[state=checked]:bg-blush-600"
              />
              <Label htmlFor={`f-${key}`} className="cursor-pointer text-sm font-medium text-charcoal-soft">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </fieldset>

      <Button
        variant="ghost"
        className="w-full rounded-full text-blush-700 hover:bg-blush-100 hover:text-blush-700"
        onClick={() => set(EMPTY)}
      >
        Clear all filters
      </Button>
      {onApply && (
        <Button className="w-full rounded-full bg-blush-600 hover:bg-blush-700" onClick={onApply}>
          Show Results
        </Button>
      )}
    </div>
  );
}

export function ShopView() {
  const { query, navigate } = useRouter();
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState<SortKey>("featured");
  const [sheetOpen, setSheetOpen] = useState(false);

  // derive filters from URL when the deep-link query changes
  // (render-adjust pattern — no cascading effect)
  const urlKey = `${query.category ?? ""}|${query.tag ?? ""}|${query.sort ?? ""}`;
  const [appliedKey, setAppliedKey] = useState<string | null>(null);
  if (appliedKey !== urlKey) {
    setAppliedKey(urlKey);
    const cats = query.category
      ? (query.category.split(",") as CategoryId[]).filter((c) => CATEGORIES.some((x) => x.id === c))
      : [];
    setFilters({
      ...EMPTY,
      cats,
      newOnly: query.tag === "new",
    });
    setSort(
      (["featured", "newest", "popular", "price-asc", "price-desc"] as SortKey[]).includes(query.sort as SortKey)
        ? (query.sort as SortKey)
        : "featured",
    );
  }

  const results = useMemo(() => {
    let list = [...PRODUCTS];
    if (filters.cats.length) list = list.filter((p) => filters.cats.includes(p.category));
    if (filters.price) {
      const r = PRICE_RANGES.find((x) => x.id === filters.price)!;
      list = list.filter((p) => p.price >= r.min && p.price <= r.max);
    }
    if (filters.inStock) list = list.filter((p) => p.stock !== "out");
    if (filters.rating4) list = list.filter((p) => p.rating >= 4);
    if (filters.newOnly) list = list.filter((p) => p.newArrival);
    if (filters.discounted) list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);

    switch (sort) {
      case "newest":
        list.sort((a, b) => Number(b.newArrival ?? false) - Number(a.newArrival ?? false));
        break;
      case "popular":
        list.sort((a, b) => b.popular - a.popular);
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.popular - a.popular);
    }
    return list;
  }, [filters, sort]);

  const heading = (() => {
    if (filters.cats.length === 1) {
      const c = CATEGORIES.find((x) => x.id === filters.cats[0])!;
      return { title: c.name, sub: c.tagline };
    }
    if (filters.newOnly) return { title: "New Arrivals", sub: "Fresh finds, added this season." };
    return { title: "Shop All", sub: "Explore our collection of beauty, jewelry, nails, accessories and everyday essentials." };
  })();

  const activeChips: { label: string; clear: () => void }[] = [
    ...filters.cats.map((c) => ({
      label: CATEGORIES.find((x) => x.id === c)!.name,
      clear: () => setFilters({ ...filters, cats: filters.cats.filter((x) => x !== c) }),
    })),
    ...(filters.price
      ? [{ label: PRICE_RANGES.find((r) => r.id === filters.price)!.label, clear: () => setFilters({ ...filters, price: null }) }]
      : []),
    ...(filters.inStock ? [{ label: "In stock", clear: () => setFilters({ ...filters, inStock: false }) }] : []),
    ...(filters.rating4 ? [{ label: "4★ & up", clear: () => setFilters({ ...filters, rating4: false }) }] : []),
    ...(filters.newOnly ? [{ label: "New arrivals", clear: () => setFilters({ ...filters, newOnly: false }) }] : []),
    ...(filters.discounted ? [{ label: "On discount", clear: () => setFilters({ ...filters, discounted: false }) }] : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
      {/* page header */}
      <header className="text-center">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs font-medium text-stone-gray">
          <Link to="/" className="transition hover:text-blush-600">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-blush-700">Shop</span>
        </nav>
        <h1 className="font-serif text-4xl text-charcoal md:text-5xl">{heading.title}</h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">{heading.sub}</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* desktop filters */}
        <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
          <h2 className="mb-5 font-serif text-xl font-semibold text-charcoal">Filters</h2>
          <FilterPanel filters={filters} set={setFilters} />
        </aside>

        {/* results */}
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-bold text-charcoal">{results.length}</span>{" "}
              {results.length === 1 ? "product" : "products"}
            </p>
            <div className="flex items-center gap-2">
              {/* mobile filter trigger */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-10 rounded-full border-blush-300 font-semibold text-charcoal lg:hidden">
                    <SlidersHorizontal className="mr-2 size-4 text-blush-600" /> Filters
                    {activeChips.length > 0 && (
                      <span className="ml-1.5 grid size-5 place-items-center rounded-full bg-blush-600 text-[10px] font-bold text-white">
                        {activeChips.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto rounded-r-3xl border-0 bg-ivory p-6">
                  <SheetHeader className="p-0 text-left">
                    <SheetTitle className="font-serif text-xl text-charcoal">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel filters={filters} set={setFilters} onApply={() => setSheetOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-10 w-[190px] rounded-full border-blush-200 bg-white text-sm font-medium" aria-label="Sort products">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-blush-100">
                  {SORTS.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="rounded-xl">
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <Badge key={chip.label} variant="secondary" className="gap-1 rounded-full bg-blush-100 py-1 pl-3 pr-1.5 text-xs font-semibold text-blush-700">
                  {chip.label}
                  <button type="button" aria-label={`Remove ${chip.label} filter`} onClick={chip.clear} className="grid size-4 place-items-center rounded-full hover:bg-blush-200">
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              <button type="button" onClick={() => setFilters(EMPTY)} className="ml-1 text-xs font-semibold text-stone-gray underline-offset-4 hover:text-blush-600 hover:underline">
                Clear all
              </button>
            </div>
          )}

          {results.length === 0 ? (
            <div className="grid place-items-center rounded-3xl border border-dashed border-blush-200 bg-white/60 px-6 py-20 text-center">
              <HeartCrack className="size-10 text-blush-300" />
              <h3 className="mt-4 font-serif text-2xl text-charcoal">No matches found</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Try removing a filter or two — the perfect find might be one step back.
              </p>
              <Button className="mt-6 rounded-full bg-blush-600 hover:bg-blush-700" onClick={() => setFilters(EMPTY)}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <ProductGrid products={results} />
          )}
        </div>
      </div>
    </div>
  );
}
