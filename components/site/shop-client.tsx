"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useDB } from "@/lib/data/db";
import { useI18n } from "@/lib/i18n/provider";
import { ProductCard } from "@/components/site/product-card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

const PRICE_BANDS = [
  { id: "0-199", label: "Under AED 200", min: 0, max: 199 },
  { id: "200-399", label: "AED 200 – 399", min: 200, max: 399 },
  { id: "400-599", label: "AED 400 – 599", min: 400, max: 599 },
  { id: "600-9999", label: "AED 600+", min: 600, max: 99999 },
];

const COLORS = ["Red", "Pink", "White", "Yellow", "Purple", "Mixed", "Green"];

export function ShopClient() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();

  const products = useDB((s) => s.products);
  const categories = useDB((s) => s.categories);
  const occasions = useDB((s) => s.occasions);

  const q = params.get("q") ?? "";
  const cat = params.get("category") ?? "";
  const occ = params.get("occasion") ?? "";
  const color = params.get("color") ?? "";
  const price = params.get("price") ?? "";
  const sort = params.get("sort") ?? "best";
  const page = Math.max(1, Number(params.get("page") ?? 1));

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page"); // any filter change resets pagination
    router.push(`/shop?${next.toString()}`, { scroll: key === "page" });
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.active);
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(needle) || p.description.toLowerCase().includes(needle));
    }
    if (cat) list = list.filter((p) => categories.find((c) => c.slug === cat)?.id === p.categoryId);
    if (occ) {
      const o = occasions.find((x) => x.slug === occ);
      if (o) list = list.filter((p) => p.occasionIds.includes(o.id));
    }
    if (color) list = list.filter((p) => p.colors.includes(color));
    if (price) {
      const band = PRICE_BANDS.find((b) => b.id === price);
      if (band) list = list.filter((p) => p.basePrice >= band.min && p.basePrice <= band.max);
    }
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.basePrice - b.basePrice); break;
      case "price-desc": list = [...list].sort((a, b) => b.basePrice - a.basePrice); break;
      case "newest": list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      default: list = [...list].sort((a, b) => Number(b.bestSeller ?? false) - Number(a.bestSeller ?? false));
    }
    return list;
  }, [products, categories, occasions, q, cat, occ, color, price, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = Boolean(q || cat || occ || color || price);

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-wine">Collection</p>
          <h1 className="font-display text-3xl md:text-4xl">
            {occ ? occasions.find((o) => o.slug === occ)?.name : cat ? categories.find((c) => c.slug === cat)?.name : t("nav_shop")}
          </h1>
          <p className="mt-1 text-sm text-ink-mute">{filtered.length} {t("results")}{q ? ` for “${q}”` : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-ink-soft">Sort</label>
          <Select id="sort" value={sort} onChange={(e) => setParam("sort", e.target.value)} className="w-48">
            <option value="best">{t("sort_best")}</option>
            <option value="newest">{t("sort_newest")}</option>
            <option value="price-asc">{t("sort_price_asc")}</option>
            <option value="price-desc">{t("sort_price_desc")}</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters */}
        <aside className="space-y-6 rounded-xl2 border border-line bg-white p-5 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="h-4 w-4" /> {t("filters")}</p>
            {hasFilters && (
              <button onClick={() => router.push("/shop")} className="flex items-center gap-1 text-xs text-wine hover:underline">
                <X className="h-3 w-3" /> {t("clear_filters")}
              </button>
            )}
          </div>

          <FilterGroup label={t("occasion")}>
            {occasions.map((o) => (
              <Chip key={o.id} active={occ === o.slug} onClick={() => setParam("occasion", occ === o.slug ? "" : o.slug)}>
                {o.name}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label={t("category")}>
            {categories.map((c) => (
              <Chip key={c.id} active={cat === c.slug} onClick={() => setParam("category", cat === c.slug ? "" : c.slug)}>
                {c.name}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label={t("price_range")}>
            {PRICE_BANDS.map((b) => (
              <Chip key={b.id} active={price === b.id} onClick={() => setParam("price", price === b.id ? "" : b.id)}>
                {b.label}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label={t("color")}>
            {COLORS.map((c) => (
              <Chip key={c} active={color === c} onClick={() => setParam("color", color === c ? "" : c)}>
                {c}
              </Chip>
            ))}
          </FilterGroup>
        </aside>

        {/* Grid */}
        <div>
          {pageItems.length === 0 ? (
            <div className="rounded-xl2 border border-dashed border-line bg-white p-16 text-center">
              <p className="font-display text-xl">Nothing matches those filters</p>
              <p className="mt-1 text-sm text-ink-mute">Try removing a filter or two.</p>
              <Button variant="outline" className="mt-4" onClick={() => router.push("/shop")}>{t("clear_filters")}</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {pageItems.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {pages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setParam("page", String(n))}
                  aria-current={n === page ? "page" : undefined}
                  className={cn(
                    "h-10 w-10 rounded-full text-sm transition-colors",
                    n === page ? "bg-wine text-white" : "bg-white text-ink-soft border border-line hover:border-wine hover:text-wine",
                  )}
                >
                  {n}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-mute">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition-colors",
        active ? "border-wine bg-wine text-white" : "border-line bg-porcelain text-ink-soft hover:border-wine hover:text-wine",
      )}
    >
      {children}
    </button>
  );
}
