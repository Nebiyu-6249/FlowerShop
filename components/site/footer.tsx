"use client";

import Link from "next/link";
import { Flower2 } from "lucide-react";
import { SITE_NAME, SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/config";
import { useI18n } from "@/lib/i18n/provider";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const cols = [
    {
      title: t("nav_shop"),
      links: [
        { href: "/shop", label: "All flowers" },
        { href: "/shop?category=roses", label: "Roses" },
        { href: "/shop?category=flower-boxes", label: "Flower boxes" },
        { href: "/shop?category=plants", label: "Plants" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: t("nav_about") },
        { href: "/contact", label: t("nav_contact") },
        { href: "/delivery", label: "Delivery information" },
        { href: "/faq", label: "FAQ" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/terms", label: "Terms of service" },
        { href: "/privacy", label: "Privacy policy" },
        { href: "/admin", label: "Store admin" },
      ],
    },
  ];

  return (
    <footer className="mt-20 border-t border-line bg-sand/50">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wine text-white">
              <Flower2 className="h-4.5 w-4.5" />
            </span>
            <span className="font-display text-2xl font-semibold text-ink">{SITE_NAME}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">{t("footer_tag")}</p>
          <p className="mt-4 text-sm text-ink-soft">
            {SUPPORT_PHONE}
            <br />
            {SUPPORT_EMAIL}
          </p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink">{c.title}</h3>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-ink-soft transition-colors hover:text-wine">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-ink-mute sm:flex-row">
          <p>© {year} {SITE_NAME}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="rounded border border-line bg-white px-1.5 py-0.5">VISA</span>
            <span className="rounded border border-line bg-white px-1.5 py-0.5">Mastercard</span>
            <span className="rounded border border-line bg-white px-1.5 py-0.5"> Pay</span>
            <span className="rounded border border-line bg-white px-1.5 py-0.5">tabby</span>
            <span className="rounded border border-line bg-white px-1.5 py-0.5">tamara</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
