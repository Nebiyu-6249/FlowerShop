"use client";

import { useState } from "react";
import Link from "next/link";
import { Flower2, Tag, Trash2, X } from "lucide-react";
import { useDB } from "@/lib/data/db";
import { useCart } from "@/lib/store/cart";
import { useI18n } from "@/lib/i18n/provider";
import { validatePromo } from "@/lib/data/api";
import { aed, formatDate } from "@/lib/utils";
import { ProductImage } from "@/components/site/product-image";
import { QtyInput } from "@/components/site/qty-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { t } = useI18n();
  const { items, promoCode, promoDiscount, deliveryDate, slot, updateQty, remove, applyPromo, clearPromo } = useCart();
  const products = useDB((s) => s.products);
  const addOns = useDB((s) => s.addOns);
  const zones = useDB((s) => s.zones);

  const [code, setCode] = useState("");
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const lines = items
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return null;
      const lineAddOns = line.addOnIds.map((id) => addOns.find((a) => a.id === id)).filter(Boolean) as typeof addOns;
      const unit = product.sizePricing[line.size] + lineAddOns.reduce((s, a) => s + a.price, 0);
      return { line, product, lineAddOns, unit, total: unit * line.qty };
    })
    .filter(Boolean) as { line: (typeof items)[number]; product: (typeof products)[number]; lineAddOns: typeof addOns; unit: number; total: number }[];

  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const dubai = zones.find((z) => z.emirate === "Dubai") ?? zones[0];
  const deliveryFee = dubai ? (dubai.freeOver && subtotal >= dubai.freeOver ? 0 : dubai.fee) : 0;
  const total = Math.max(0, subtotal - promoDiscount) + (subtotal > 0 ? deliveryFee : 0);

  const handleApply = async () => {
    if (!code.trim()) return;
    setChecking(true);
    setPromoMsg(null);
    const res = await validatePromo(code, subtotal);
    if (res.ok) {
      applyPromo(res.promo.code, res.discount);
      setPromoMsg(`Code ${res.promo.code} applied.`);
      setCode("");
    } else {
      setPromoMsg(res.reason);
    }
    setChecking(false);
  };

  if (lines.length === 0) {
    return (
      <div className="container flex flex-col items-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blush">
          <Flower2 className="h-9 w-9 text-wine" />
        </div>
        <h1 className="mt-5 font-display text-2xl">{t("cart_empty")}</h1>
        <p className="mt-1 text-sm text-ink-mute">{t("cart_empty_d")}</p>
        <Link href="/shop" className="mt-6 inline-flex h-11 items-center rounded-full bg-wine px-6 text-sm font-medium text-white hover:bg-wine-deep">
          {t("continue_shopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl">{t("cart")}</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Lines */}
        <div className="space-y-4">
          {lines.map(({ line, product, lineAddOns, unit, total }) => (
            <div key={line.id} className="flex gap-4 rounded-xl2 border border-line bg-white p-4">
              <Link href={`/product/${product.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-sand">
                <ProductImage src={product.images[0]} alt={product.name} sizes="96px" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/product/${product.slug}`} className="font-medium hover:text-wine">{product.name}</Link>
                    <p className="text-xs text-ink-mute">{line.size} · {aed(unit)} each</p>
                  </div>
                  <button onClick={() => remove(line.id)} aria-label="Remove item" className="text-ink-mute transition-colors hover:text-wine">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {lineAddOns.length > 0 && (
                  <p className="mt-1 text-xs text-ink-soft">
                    {lineAddOns.map((a) => `${a.emoji} ${a.name}`).join(" · ")}
                  </p>
                )}
                {line.giftMessage && (
                  <p className="mt-1 rounded-lg bg-blush/50 px-2 py-1 text-xs italic text-wine-deep">“{line.giftMessage}”</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <QtyInput value={line.qty} onChange={(q) => updateQty(line.id, q)} />
                  <p className="font-medium">{aed(total)}</p>
                </div>
              </div>
            </div>
          ))}

          {deliveryDate && (
            <p className="text-xs text-ink-mute">
              Requested delivery: <span className="font-medium text-ink">{formatDate(deliveryDate)}</span>{slot ? `, ${slot}` : ""}. You can change this at checkout.
            </p>
          )}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-xl2 border border-line bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl">Order summary</h2>

          <div className="mt-4 space-y-2 text-sm">
            <Row label={t("subtotal")} value={aed(subtotal)} />
            <Row
              label={t("delivery_fee")}
              value={deliveryFee === 0 ? t("free") : aed(deliveryFee)}
              hint={dubai?.freeOver && subtotal < dubai.freeOver ? `Free over ${aed(dubai.freeOver)} (Dubai)` : "Dubai rate, final fee set at checkout"}
            />
            {promoDiscount > 0 && (
              <div className="flex items-center justify-between text-sage">
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> {promoCode}
                  <button onClick={() => { clearPromo(); setPromoMsg(null); }} aria-label="Remove promo code"><X className="h-3 w-3" /></button>
                </span>
                <span>-{aed(promoDiscount)}</span>
              </div>
            )}
          </div>

          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="font-medium">{t("total")}</span>
            <span className="font-display text-2xl text-wine">{aed(total)}</span>
          </div>

          {/* Promo */}
          <div className="mt-4 flex gap-2">
            <Input placeholder={t("promo_placeholder")} value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleApply()} />
            <Button variant="outline" onClick={handleApply} disabled={checking}>{checking ? "…" : t("apply")}</Button>
          </div>
          {promoMsg && <p className="mt-2 text-xs text-ink-soft">{promoMsg}</p>}
          <p className="mt-1 text-xs text-ink-mute">Try WELCOME10 for 10% off.</p>

          <Link href="/checkout" className="mt-5 flex h-12 items-center justify-center rounded-full bg-wine text-sm font-medium text-white transition-colors hover:bg-wine-deep">
            {t("checkout")}
          </Link>
          <Link href="/shop" className="mt-3 block text-center text-xs text-ink-soft underline-offset-2 hover:underline">
            {t("continue_shopping")}
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-ink-soft">{label}</span>
        <span>{value}</span>
      </div>
      {hint && <p className="text-[11px] text-ink-mute">{hint}</p>}
    </div>
  );
}
