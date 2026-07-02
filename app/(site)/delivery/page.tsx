"use client";

import { Truck, Zap } from "lucide-react";
import { useDB } from "@/lib/data/db";
import { aed } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function DeliveryPage() {
  const zones = useDB((s) => s.zones);

  return (
    <div className="container max-w-4xl py-10 md:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-wine">Delivery</p>
      <h1 className="mt-1 font-display text-3xl md:text-5xl">Across the Emirates, on time</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        Order by 6pm for same-day delivery. Every bouquet travels in a chilled van and is
        photographed on handover.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl2 border border-line bg-white p-5">
          <Truck className="mt-0.5 h-5 w-5 text-wine" />
          <div>
            <p className="text-sm font-semibold">Same-day delivery</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              Order before 6pm and choose a morning, afternoon or evening slot for today.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl2 border border-line bg-white p-5">
          <Zap className="mt-0.5 h-5 w-5 text-wine" />
          <div>
            <p className="text-sm font-semibold">1-hour express <Badge tone="wine" className="ms-1">Dubai</Badge></p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              Need it now? Express delivery reaches central Dubai areas within an hour, 10am to 8pm.
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl">Zones &amp; fees</h2>
      <div className="mt-4 overflow-hidden rounded-xl2 border border-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-sand/60 text-start">
              <th className="p-4 text-start font-medium">Emirate</th>
              <th className="p-4 text-start font-medium">Areas we cover</th>
              <th className="p-4 text-start font-medium">Fee</th>
              <th className="p-4 text-start font-medium">Slots</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr key={z.id} className="border-b border-line last:border-0">
                <td className="p-4 font-medium">{z.emirate}</td>
                <td className="p-4 text-xs text-ink-soft">{z.areas.join(", ")}</td>
                <td className="p-4">
                  {aed(z.fee)}
                  {z.freeOver && <p className="text-[11px] text-sage">Free over {aed(z.freeOver)}</p>}
                </td>
                <td className="p-4 text-xs text-ink-soft">
                  {z.slots.map((s) => (
                    <p key={s}>{s.includes("Express") ? <span className="font-medium text-wine">{s}</span> : s}</p>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-ink-mute">
        Remote areas may take an extra day; we&apos;ll confirm your slot on WhatsApp right after you order.
      </p>
    </div>
  );
}
