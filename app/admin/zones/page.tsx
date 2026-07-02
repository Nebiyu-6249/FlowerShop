"use client";

import { useDB } from "@/lib/data/db";
import type { DeliveryZone, Slot } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ALL_SLOTS: Slot[] = [
  "Morning (9am - 12pm)",
  "Afternoon (12pm - 5pm)",
  "Evening (5pm - 9pm)",
  "Express (within 1 hour)",
];

export default function AdminZones() {
  const { zones, updateZone } = useDB();

  const patch = (z: DeliveryZone, changes: Partial<DeliveryZone>) => updateZone({ ...z, ...changes });

  const toggleSlot = (z: DeliveryZone, s: Slot) =>
    patch(z, { slots: z.slots.includes(s) ? z.slots.filter((x) => x !== s) : [...z.slots, s] });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl">Delivery zones</h1>
      <p className="mt-1 text-sm text-ink-mute">
        Fees and slots update the checkout and the public delivery page in real time.
      </p>

      <div className="mt-6 space-y-4">
        {zones.map((z) => (
          <section key={z.id} className="rounded-xl2 border border-line bg-white p-6">
            <h2 className="font-display text-xl">{z.emirate}</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor={`fee-${z.id}`}>Delivery fee (AED)</Label>
                <Input
                  id={`fee-${z.id}`} type="number" min={0} className="mt-1.5"
                  value={z.fee}
                  onChange={(e) => patch(z, { fee: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor={`free-${z.id}`}>Free over (AED, blank = never)</Label>
                <Input
                  id={`free-${z.id}`} type="number" min={0} className="mt-1.5"
                  value={z.freeOver ?? ""}
                  onChange={(e) => patch(z, { freeOver: e.target.value === "" ? undefined : Number(e.target.value) || 0 })}
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor={`areas-${z.id}`}>Areas (comma separated)</Label>
                <Input
                  id={`areas-${z.id}`} className="mt-1.5"
                  value={z.areas.join(", ")}
                  onChange={(e) => patch(z, { areas: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })}
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Time slots</Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {ALL_SLOTS.map((s) => {
                  const on = z.slots.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSlot(z, s)}
                      aria-pressed={on}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs transition-colors",
                        on ? "border-wine bg-wine text-white" : "border-line bg-porcelain text-ink-soft hover:border-wine",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
