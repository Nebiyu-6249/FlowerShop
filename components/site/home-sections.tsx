"use client";

import Link from "next/link";
import { Clock, CreditCard, Leaf, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/product-card";
import { ProductImage } from "@/components/site/product-image";
import { RatingStars } from "@/components/site/rating-stars";
import { SectionHeading } from "@/components/site/section-heading";
import { useDB } from "@/lib/data/db";
import { useI18n } from "@/lib/i18n/provider";
import { formatDate } from "@/lib/utils";
import type { Product } from "@/lib/types";

/* ---------------------------------- Hero --------------------------------- */

export function Hero() {
  const { t } = useI18n();
  const content = useDB((s) => s.content);

  return (
    <section className="container grid items-center gap-8 pb-14 pt-10 lg:grid-cols-2 lg:gap-14 lg:pt-14">
      <div className="order-2 lg:order-none">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-blush px-3 py-1 text-xs font-semibold text-wine-deep">
          <Zap className="h-3.5 w-3.5" /> {t("trust_express")} · Dubai
        </p>
        <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
          {content.heroTitle} <em className="font-light italic text-wine">{content.heroAccent}</em>
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">{content.heroSubtitle}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button size="lg" onClick={() => (window.location.href = "/shop")}>{t("hero_cta")}</Button>
          <Link href="/delivery">
            <Button size="lg" variant="outline">{t("hero_cta2")}</Button>
          </Link>
        </div>
      </div>

      {/* Signature: the arched "florist window" crop */}
      <div className="relative mx-auto w-full max-w-md lg:max-w-none">
        <ProductImage
          src={content.heroImage}
          alt="Seasonal bouquet"
          priority
          sizes="(max-width: 1024px) 90vw, 45vw"
          className="aspect-[4/5] rounded-arch shadow-lift"
        />
        <div className="absolute -bottom-4 rounded-xl2 border border-line bg-white px-4 py-3 shadow-soft ltr:-left-3 rtl:-right-3 sm:px-5">
          <p className="text-xs text-ink-mute">Today in the studio</p>
          <p className="font-display text-sm font-semibold text-ink">Fresh stems from Holland & Kenya 🌷</p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Occasion tiles ----------------------------- */

export function OccasionTiles() {
  const { t } = useI18n();
  const occasions = useDB((s) => s.occasions);

  return (
    <section className="container pb-14">
      <SectionHeading eyebrow={t("nav_occasions")} title={t("shop_by_occasion")} />
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-5">
        {occasions.map((o) => (
          <Link
            key={o.id}
            href={`/shop?occasion=${o.slug}`}
            className="flex min-w-[132px] flex-col items-center gap-2 rounded-t-full rounded-b-xl2 border border-line bg-white px-4 pb-4 pt-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-wine/40 hover:shadow-lift"
          >
            <span className="text-3xl" aria-hidden>{o.emoji}</span>
            <span className="text-[13px] font-medium leading-tight text-ink">{o.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- Trust strip ------------------------------ */

export function TrustStrip() {
  const { t } = useI18n();
  const items = [
    { icon: Clock, title: t("trust_sameday"), d: t("trust_sameday_d") },
    { icon: Zap, title: t("trust_express"), d: t("trust_express_d") },
    { icon: Leaf, title: t("trust_fresh"), d: t("trust_fresh_d") },
    { icon: CreditCard, title: t("trust_secure"), d: t("trust_secure_d") },
  ];
  return (
    <section className="border-y border-line bg-white">
      <div className="container grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
        {items.map((i) => (
          <div key={i.title} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush text-wine">
              <i.icon className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{i.title}</p>
              <p className="text-xs text-ink-mute">{i.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- Product carousel ---------------------------- */

export function ProductRow({ title, eyebrow, products }: { title: string; eyebrow?: string; products: Product[] }) {
  const { t } = useI18n();
  if (!products.length) return null;
  return (
    <section className="container py-14">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        action={
          <Link href="/shop" className="text-sm font-medium text-wine hover:underline">
            {t("view_all")} →
          </Link>
        }
      />
      <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {products.map((p) => (
          <div key={p.id} className="w-[70%] min-w-[220px] max-w-[260px] shrink-0 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- Category shortcuts --------------------------- */

export function CategoryShortcuts() {
  const { t } = useI18n();
  const categories = useDB((s) => s.categories);
  return (
    <section className="container pb-14">
      <SectionHeading eyebrow={t("nav_shop")} title={t("shop_by_category")} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((c) => (
          <Link key={c.id} href={`/shop?category=${c.slug}`} className="group relative overflow-hidden rounded-xl2">
            <ProductImage src={c.image} alt={c.name} className="aspect-square" sizes="(max-width: 640px) 50vw, 25vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />
            <span className="absolute bottom-3 font-display text-lg font-semibold text-white drop-shadow ltr:left-4 rtl:right-4">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- Reviews -------------------------------- */

export function ReviewsSection() {
  const { t } = useI18n();
  const reviews = useDB((s) => s.reviews);
  return (
    <section className="bg-sand/60 py-14">
      <div className="container">
        <SectionHeading eyebrow="★ 4.9 / 5" title={t("reviews_title")} />
        <div className="scrollbar-none -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
          {reviews.slice(0, 8).map((r) => (
            <figure key={r.id} className="min-w-[260px] snap-start rounded-xl2 border border-line bg-white p-5 shadow-soft sm:min-w-0">
              <RatingStars rating={r.rating} />
              <blockquote className="mt-3 text-sm leading-relaxed text-ink-soft">“{r.text}”</blockquote>
              <figcaption className="mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">{r.author}</span>
                <span className="text-ink-mute">{formatDate(r.date)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
