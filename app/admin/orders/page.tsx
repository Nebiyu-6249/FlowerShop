"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDB } from "@/lib/data/db";
import type { OrderStatus } from "@/lib/types";
import { aed, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/site/order-status-badge";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STATUSES: OrderStatus[] = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

export default function AdminOrders() {
  const { orders, setOrderStatus } = useDB();
  const [filter, setFilter] = useState<OrderStatus | "All">("All");

  const list = useMemo(
    () =>
      [...orders]
        .filter((o) => filter === "All" || o.status === filter)
        .sort((a, b) => b.placedAt.localeCompare(a.placedAt)),
    [orders, filter],
  );

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl">Orders</h1>
      <p className="mt-1 text-sm text-ink-mute">Update a status here and the customer&apos;s account page reflects it immediately.</p>

      {/* Filter tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {(["All", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
              filter === s ? "border-wine bg-wine text-white" : "border-line bg-white text-ink-soft hover:border-wine hover:text-wine",
            )}
          >
            {s}{s !== "All" && ` (${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl2 border border-line bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line bg-sand/50 text-xs text-ink-mute">
              <th className="p-3 text-start font-medium">Order</th>
              <th className="p-3 text-start font-medium">Customer</th>
              <th className="p-3 text-start font-medium">Delivery</th>
              <th className="p-3 text-start font-medium">Placed</th>
              <th className="p-3 text-start font-medium">Status</th>
              <th className="p-3 text-end font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0">
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-wine hover:underline">{o.id}</Link>
                  <p className="text-xs text-ink-mute">{o.items.reduce((s, i) => s + i.qty, 0)} items</p>
                </td>
                <td className="p-3">
                  <p>{o.customerName}</p>
                  <p className="text-xs text-ink-mute">{o.customerEmail}</p>
                </td>
                <td className="p-3 text-xs text-ink-soft">
                  <p>{formatDate(o.deliveryDate)}</p>
                  <p className="text-ink-mute">{o.emirate} · {o.slot.includes("Express") ? "Express" : o.slot.split(" (")[0]}</p>
                </td>
                <td className="p-3 text-xs text-ink-mute">{formatDate(o.placedAt)}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={o.status} />
                    <Select
                      aria-label={`Update status for ${o.id}`}
                      className="h-9 w-36 text-xs"
                      value={o.status}
                      onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                  </div>
                </td>
                <td className="p-3 text-end font-medium">{aed(o.total)}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-sm text-ink-mute">No orders with this status.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
