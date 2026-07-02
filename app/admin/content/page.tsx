"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useDB } from "@/lib/data/db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function AdminContent() {
  const { content, setContent, products } = useDB();
  const active = products.filter((p) => p.active);

  const toggleFeatured = (id: string) => {
    const cur = content.featuredProductIds;
    setContent({
      featuredProductIds: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(0, 8),
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Content</h1>
          <p className="mt-1 text-sm text-ink-mute">Edits save as you type. Open the home page in another tab to watch them land.</p>
        </div>
        <Link href="/" target="_blank" className="flex items-center gap-1.5 text-sm text-wine hover:underline">
          View storefront <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <section className="mt-6 rounded-xl2 border border-line bg-white p-6">
        <h2 className="text-sm font-semibold">Hero</h2>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
            <div>
              <Label htmlFor="ct-title">Headline</Label>
              <Input id="ct-title" className="mt-1.5" value={content.heroTitle} onChange={(e) => setContent({ heroTitle: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ct-accent">Accent word (italic)</Label>
              <Input id="ct-accent" className="mt-1.5" value={content.heroAccent} onChange={(e) => setContent({ heroAccent: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="ct-sub">Subtitle</Label>
            <Textarea id="ct-sub" rows={2} className="mt-1.5" value={content.heroSubtitle} onChange={(e) => setContent({ heroSubtitle: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="ct-img">Hero image URL</Label>
            <Input id="ct-img" className="mt-1.5" value={content.heroImage} onChange={(e) => setContent({ heroImage: e.target.value })} />
          </div>
          <div className="rounded-xl bg-sand p-4">
            <p className="text-xs text-ink-mute">Preview</p>
            <p className="mt-1 font-display text-2xl">
              {content.heroTitle} <em className="text-wine">{content.heroAccent}</em>
            </p>
            <p className="mt-1 text-sm text-ink-soft">{content.heroSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl2 border border-line bg-white p-6">
        <h2 className="text-sm font-semibold">Announcement bar</h2>
        <Input className="mt-3" value={content.announcement} onChange={(e) => setContent({ announcement: e.target.value })} />
        <p className="mt-2 text-xs text-ink-mute">The thin bar above the header. Keep it under ~80 characters.</p>
      </section>

      <section className="mt-6 rounded-xl2 border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Featured products</h2>
          <span className="text-xs text-ink-mute">{content.featuredProductIds.length}/8 selected</span>
        </div>
        <p className="mt-1 text-xs text-ink-mute">Shown in the “Featured this week” row on the home page, in the order selected.</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {active.map((p) => {
            const idx = content.featuredProductIds.indexOf(p.id);
            const on = idx !== -1;
            return (
              <button
                key={p.id}
                onClick={() => toggleFeatured(p.id)}
                aria-pressed={on}
                className={cn(
                  "relative rounded-xl border p-3 text-start text-sm transition-colors",
                  on ? "border-wine bg-blush/60" : "border-line bg-porcelain hover:border-wine/50",
                )}
              >
                {on && (
                  <span className="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-wine text-[10px] font-semibold text-white">
                    {idx + 1}
                  </span>
                )}
                <p className="truncate pe-6 font-medium">{p.name}</p>
                <p className="text-xs text-ink-mute">AED {p.basePrice}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
