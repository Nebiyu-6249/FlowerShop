"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { ProductImage } from "@/components/site/product-image";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/store/cart";
import { useI18n } from "@/lib/i18n/provider";
import { aed } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const add = useCart((s) => s.add);
  const { t, lang } = useI18n();

  return (
    <div className="group relative animate-fadeUp">
      <Link href={`/product/${product.slug}`} className="block" aria-label={product.name}>
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          priority={priority}
          className="aspect-[4/5] rounded-xl2"
        />
        <div className="absolute top-3 flex gap-1.5 ltr:left-3 rtl:right-3">
          {product.bestSeller && <Badge tone="wine">{t("best_sellers")}</Badge>}
          {product.stock <= 8 && product.stock > 0 && <Badge tone="amber">Only {product.stock} left</Badge>}
          {product.stock === 0 && <Badge tone="sand">Sold out</Badge>}
        </div>
      </Link>

      {/* quick add */}
      <button
        onClick={() =>
          product.stock > 0 &&
          add({ productId: product.id, size: "Standard", qty: 1, addOnIds: [] })
        }
        disabled={product.stock === 0}
        aria-label={`${t("add_to_cart")}: ${product.name}`}
        className="absolute bottom-[86px] flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-wine opacity-0 shadow-soft transition-all hover:bg-wine hover:text-white focus-visible:opacity-100 group-hover:opacity-100 disabled:hidden ltr:right-3 rtl:left-3"
      >
        <ShoppingBag className="h-4.5 w-4.5" />
      </button>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Link href={`/product/${product.slug}`} className="font-display text-[15px] font-semibold leading-snug text-ink hover:text-wine">
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs text-ink-mute">
            {t("price_from")} <span className="font-semibold text-ink-soft">{aed(product.basePrice, lang)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
