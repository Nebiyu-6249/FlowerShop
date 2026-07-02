"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Flower2, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { SITE_NAME } from "@/lib/config";
import { useCart } from "@/lib/store/cart";
import { useDB } from "@/lib/data/db";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function Header() {
  const { t, lang, setLang } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const announcement = useDB((s) => s.content.announcement);

  const [mounted, setMounted] = useState(false); // avoid hydration mismatch on persisted cart count
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const count = mounted ? items.reduce((s, i) => s + i.qty, 0) : 0;

  const nav = [
    { href: "/shop", label: t("nav_shop") },
    { href: "/shop?view=occasions", label: t("nav_occasions") },
    { href: "/delivery", label: t("nav_delivery") },
    { href: "/about", label: t("nav_about") },
    { href: "/contact", label: t("nav_contact") },
  ];

  const submitSearch = () => {
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    setQ("");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* announcement bar */}
      <div className="bg-wine-deep px-4 py-1.5 text-center text-xs font-medium tracking-wide text-blush">
        {announcement}
      </div>

      <div className="border-b border-line bg-porcelain/90 backdrop-blur supports-[backdrop-filter]:bg-porcelain/75">
        <div className="container flex h-16 items-center gap-3">
          {/* mobile menu button */}
          <button
            className="rounded-full p-2 text-ink hover:bg-sand lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* wordmark */}
          <Link href="/" className="flex items-center gap-2" aria-label={`${SITE_NAME} home`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wine text-white">
              <Flower2 className="h-4.5 w-4.5" />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">{SITE_NAME}</span>
          </Link>

          {/* desktop nav */}
          <nav className="ms-6 hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-sand hover:text-ink",
                  pathname === n.href.split("?")[0] && "text-wine",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* search (desktop) */}
          <div className="ms-auto hidden max-w-xs flex-1 items-center md:flex">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute ltr:left-3.5 rtl:right-3.5" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                placeholder={t("search_placeholder")}
                className="h-10 w-full rounded-full border border-line bg-white text-sm text-ink placeholder:text-ink-mute focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/20 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4"
                aria-label={t("search_placeholder")}
              />
            </div>
          </div>

          {/* language toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-wine hover:text-wine"
            aria-label="Toggle language"
          >
            {lang === "en" ? "عربي" : "EN"}
          </button>

          <Link href="/account" aria-label={t("nav_account")} className="hidden rounded-full p-2 text-ink hover:bg-sand sm:block">
            <User className="h-5 w-5" />
          </Link>

          {/* cart */}
          <Link href="/cart" className="relative rounded-full p-2 text-ink hover:bg-sand" aria-label={t("cart")}>
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-wine px-1 text-[11px] font-bold text-white ltr:-right-0.5 rtl:-left-0.5">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 w-[82%] max-w-xs bg-porcelain p-5 shadow-lift ltr:left-0 rtl:right-0">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-xl font-semibold text-ink">{SITE_NAME}</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-full p-2 hover:bg-sand">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative mb-5">
              <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute ltr:left-3.5 rtl:right-3.5" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                placeholder={t("search_placeholder")}
                className="h-11 w-full rounded-full border border-line bg-white text-sm ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 focus:border-wine focus:outline-none"
              />
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {[...nav, { href: "/account", label: t("nav_account") }].map((n) => (
                <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-sand">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
