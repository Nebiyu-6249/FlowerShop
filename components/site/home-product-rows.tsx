"use client";

import { useDB } from "@/lib/data/db";
import { ProductRow } from "@/components/site/home-sections";
import { useI18n } from "@/lib/i18n/provider";

/** Featured + best-seller carousels, driven by the mock DB so admin content edits show up live. */
export function HomeProductRows() {
  const { t } = useI18n();
  const products = useDB((s) => s.products);
  const featuredIds = useDB((s) => s.content.featuredProductIds);

  const active = products.filter((p) => p.active);
  const featured = featuredIds
    .map((id) => active.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 8) as typeof active;
  const best = active.filter((p) => p.bestSeller).slice(0, 8);

  return (
    <>
      <ProductRow eyebrow="Curated" title={t("featured")} products={featured.length ? featured : active.slice(0, 8)} />
      <ProductRow eyebrow="Customer favourites" title={t("best_sellers")} products={best} />
    </>
  );
}
