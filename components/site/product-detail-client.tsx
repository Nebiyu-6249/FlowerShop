"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Leaf, Minus, Plus, Truck } from "lucide-react";
import { useDB } from "@/lib/data/db";
import { useCart } from "@/lib/store/cart";
import { useI18n } from "@/lib/i18n/provider";
import type { Size, Slot } from "@/lib/types";
import { aed, addDaysISO, cn, todayISO } from "@/lib/utils";
import { ProductImage } from "@/components/site/product-image";
import { ProductRow } from "@/components/site/home-sections";
import { RatingStars } from "@/components/site/rating-stars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const SIZES: Size[] = ["Standard", "Deluxe", "Premium"];
const GIFT_LIMIT = 200;

export function ProductDetailClient({ slug }: { slug: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const product = useDB((s) => s.products.find((p) => p.slug === slug));
  const products = useDB((s) => s.products);
  const addOns = useDB((s) => s.addOns);
  const reviews = useDB((s) => s.reviews);
  const zones = useDB((s) => s.zones);
  const add = useCart((s) => s.add);
  const setDelivery = useCart((s) => s.setDelivery);

  const [size, setSize] = useState<Size>("Standard");
  const [qty, setQty] = useState(1);
  const [imageIdx, setImageIdx] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [giftMessage, setGiftMessage] = useState("");
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState<Slot>("Afternoon (12pm - 5pm)");
  const [added, setAdded] = useState(false);

  // every slot offered anywhere, so the picker always shows Express where available
  const allSlots = useMemo(() => {
    const set = new Set<Slot>();
    zones.forEach((z) => z.slots.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [zones]);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.active && p.id !== product.id && (p.categoryId === product.categoryId || p.occasionIds.some((o) => product.occasionIds.includes(o))))
      .slice(0, 4);
  }, [products, product]);

  const productReviews = useMemo(
    () => (product ? reviews.filter((r) => r.productId === product.id) : []),
    [reviews, product],
  );

  if (!product) {
    return (
      <div className="container py-24 text-center">
        <p className="font-display text-2xl">We couldn&apos;t find that arrangement</p>
        <Link href="/shop" className="mt-3 inline-block text-sm text-wine underline">Browse the shop</Link>
      </div>
    );
  }

  const unitPrice = product.sizePricing[size] + selectedAddOns.reduce((sum, id) => sum + (addOns.find((a) => a.id === id)?.price ?? 0), 0);
  const avgRating = productReviews.length ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length : 4.8;

  const toggleAddOn = (id: string) =>
    setSelectedAddOns((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const handleAdd = (goToCart = false) => {
    add({ productId: product.id, size, qty, addOnIds: selectedAddOns, giftMessage: giftMessage.trim() || undefined });
    setDelivery(date, slot);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    if (goToCart) router.push("/cart");
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-mute" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-wine">Home</Link>
        <ChevronRight className="h-3 w-3 rtl:rotate-180" />
        <Link href="/shop" className="hover:text-wine">{t("nav_shop")}</Link>
        <ChevronRight className="h-3 w-3 rtl:rotate-180" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-arch bg-sand shadow-soft">
            <ProductImage src={product.images[imageIdx] ?? product.images[0]} alt={product.name} priority />
            {product.bestSeller && <Badge tone="wine" className="absolute start-4 top-4">{t("best_sellers")}</Badge>}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIdx(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "relative h-20 w-16 overflow-hidden rounded-xl border-2 transition-colors",
                    i === imageIdx ? "border-wine" : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <ProductImage src={img} alt="" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy panel */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <RatingStars rating={avgRating} />
            <span className="text-xs text-ink-mute">{productReviews.length || 12} reviews</span>
            {product.stock <= 5 && product.stock > 0 && <Badge tone="amber">Only {product.stock} left</Badge>}
          </div>
          <p className="mt-3 font-display text-2xl text-wine">{aed(unitPrice)}</p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{product.description}</p>

          <Separator className="my-6" />

          {/* Size */}
          <Label className="mb-2 block">{t("size")}</Label>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t("size")}>
            {SIZES.map((s) => (
              <button
                key={s}
                role="radio"
                aria-checked={size === s}
                onClick={() => setSize(s)}
                className={cn(
                  "rounded-xl border p-3 text-center transition-colors",
                  size === s ? "border-wine bg-blush/60" : "border-line bg-white hover:border-wine/50",
                )}
              >
                <p className="text-sm font-medium">{s}</p>
                <p className="text-xs text-ink-mute">{aed(product.sizePricing[s])}</p>
              </button>
            ))}
          </div>

          {/* Add-ons */}
          <Label className="mb-2 mt-6 block">{t("add_ons")}</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {addOns.map((a) => {
              const on = selectedAddOns.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggleAddOn(a.id)}
                  aria-pressed={on}
                  className={cn(
                    "relative rounded-xl border p-3 text-start transition-colors",
                    on ? "border-wine bg-blush/60" : "border-line bg-white hover:border-wine/50",
                  )}
                >
                  {on && <Check className="absolute end-2 top-2 h-4 w-4 text-wine" />}
                  <p className="text-lg">{a.emoji}</p>
                  <p className="mt-1 text-xs font-medium leading-tight">{a.name}</p>
                  <p className="text-xs text-ink-mute">+{aed(a.price)}</p>
                </button>
              );
            })}
          </div>

          {/* Gift message */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="gift">{t("gift_message")}</Label>
              <span className={cn("text-xs", giftMessage.length >= GIFT_LIMIT ? "text-wine" : "text-ink-mute")}>
                {giftMessage.length}/{GIFT_LIMIT}
              </span>
            </div>
            <Textarea
              id="gift"
              rows={3}
              className="mt-2"
              placeholder={t("gift_message_ph")}
              value={giftMessage}
              maxLength={GIFT_LIMIT}
              onChange={(e) => setGiftMessage(e.target.value.slice(0, GIFT_LIMIT))}
            />
          </div>

          {/* Delivery */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="date">{t("delivery_date")}</Label>
              <input
                id="date"
                type="date"
                min={todayISO()}
                max={addDaysISO(30)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none transition-colors focus:border-wine"
              />
            </div>
            <div>
              <Label htmlFor="slot">{t("time_slot")}</Label>
              <Select id="slot" className="mt-2" value={slot} onChange={(e) => setSlot(e.target.value as Slot)}>
                {allSlots.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-sage">
            <Truck className="h-3.5 w-3.5" /> Express 1-hour delivery is available in select Dubai areas.
          </p>

          {/* Qty + CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line bg-white">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center text-ink-soft hover:text-wine"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="flex h-11 w-11 items-center justify-center text-ink-soft hover:text-wine"><Plus className="h-4 w-4" /></button>
            </div>
            <Button size="lg" className="flex-1 min-w-40" onClick={() => handleAdd(false)} disabled={product.stock === 0}>
              {added ? <><Check className="h-4 w-4" /> Added</> : product.stock === 0 ? "Out of stock" : `${t("add_to_cart")} · ${aed(unitPrice * qty)}`}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => handleAdd(true)} disabled={product.stock === 0}>Buy now</Button>
          </div>

          {/* Care tips */}
          <div className="mt-8 rounded-xl2 border border-line bg-white p-5">
            <p className="flex items-center gap-2 text-sm font-semibold"><Leaf className="h-4 w-4 text-sage" /> {t("care_tips")}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{product.careTips}</p>
          </div>
        </div>
      </div>

      {/* Reviews for this product */}
      {productReviews.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl">Reviews</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {productReviews.map((r) => (
              <div key={r.id} className="rounded-xl2 border border-line bg-white p-5">
                <RatingStars rating={r.rating} />
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">“{r.text}”</p>
                <p className="mt-3 text-xs font-medium">{r.author}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-6 -mx-4">
          <ProductRow eyebrow="Pairs well" title={t("related")} products={related} />
        </div>
      )}
    </div>
  );
}
