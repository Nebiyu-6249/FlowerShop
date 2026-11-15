import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "About us",
  description: "The story behind our Dubai flower studio: hand-tied arrangements, seasonal stems, and same-day delivery across the UAE.",
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-10 md:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-wine">Our story</p>
      <h1 className="mt-1 font-display text-3xl md:text-5xl">A small studio with a big love for stems</h1>

      <div className="mt-8 grid items-start gap-8 md:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4 text-sm leading-relaxed text-ink-soft md:text-base">
          <p>
            {SITE_NAME} started as a two-person atelier in Al Quoz with one delivery bike and a stubborn
            belief: flowers in the UAE shouldn&apos;t look like they came off a conveyor belt. Every bouquet
            that leaves our studio is designed and tied by hand, the same morning it&apos;s delivered.
          </p>
          <p>
            We buy direct from growers in Holland, Kenya and Ecuador, condition every stem overnight in our
            chilled studio, and never let an arrangement sit longer than a day. That&apos;s why we can put a
            7-day freshness guarantee on everything we sell.
          </p>
          <p>
            Today we deliver across all seven emirates, with 1-hour express delivery in central Dubai. But
            we still work like a studio, not a factory: small batches, seasonal menus, and a florist&apos;s
            eye on every order before it goes out the door.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              ["2019", "studio founded"],
              ["48k+", "bouquets delivered"],
              ["4.9★", "average rating"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-xl2 border border-line bg-white p-4 text-center">
                <p className="font-display text-2xl text-wine">{n}</p>
                <p className="mt-0.5 text-xs text-ink-mute">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-arch bg-sand shadow-soft">
          <Image
            src="/images/flowers/rose.jpg"
            alt="Florist arranging a bouquet in the studio"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>

      <div className="mt-12 rounded-xl2 bg-blush/60 p-8 text-center">
        <h2 className="font-display text-2xl">Come say hello</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          Our studio in Al Quoz is open daily 9am to 9pm, or reach us any time on WhatsApp.
        </p>
        <Link href="/contact" className="mt-4 inline-flex h-11 items-center rounded-full bg-wine px-6 text-sm font-medium text-white hover:bg-wine-deep">
          Contact us
        </Link>
      </div>
    </div>
  );
}
