"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useDB } from "@/lib/data/db";
import { aed, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/site/order-status-badge";
import { Badge } from "@/components/ui/badge";

export default function AdminCustomers() {
  const { customers, orders } = useDB();

  const rows = useMemo(
    () =>
      customers
        .map((c) => {
          const theirs = orders.filter((o) => o.customerEmail.toLowerCase() === c.email.toLowerCase());
          const spend = theirs.reduce((s, o) => s + o.total, 0);
          return { c, theirs: theirs.sort((a, b) => b.placedAt.localeCompare(a.placedAt)), spend };
        })
        .sort((a, b) => b.spend - a.spend),
    [customers, orders],
  );

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl">Customers</h1>
      <p className="mt-1 text-sm text-ink-mute">{customers.length} accounts, ranked by lifetime spend.</p>

      <div className="mt-6 space-y-3">
        {rows.map(({ c, theirs, spend }) => (
          <details key={c.id} className="group rounded-xl2 border border-line bg-white">
            <summary className="flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 p-5 [&::-webkit-details-marker]:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush font-display text-wine-deep">
                {c.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{c.name}</p>
                <p className="truncate text-xs text-ink-mute">{c.email} · {c.phone}</p>
              </div>
              <div className="ms-auto flex items-center gap-4 text-sm">
                <span className="text-ink-soft">{theirs.length} orders</span>
                <Badge tone="blush">{c.loyaltyPoints} pts</Badge>
                <span className="font-display text-lg text-wine">{aed(spend)}</span>
              </div>
            </summary>

            <div className="border-t border-line px-5 py-4">
              {c.addresses.length > 0 && (
                <p className="mb-3 text-xs text-ink-mute">
                  Addresses: {c.addresses.map((a) => `${a.label} (${a.area}, ${a.emirate})`).join(" · ")}
                </p>
              )}
              {theirs.length === 0 ? (
                <p className="text-sm text-ink-mute">No orders yet.</p>
              ) : (
                <ul className="space-y-2">
                  {theirs.map((o) => (
                    <li key={o.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-wine hover:underline">{o.id}</Link>
                      <span className="text-xs text-ink-mute">{formatDate(o.placedAt)}</span>
                      <OrderStatusBadge status={o.status} />
                      <span className="ms-auto">{aed(o.total)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
