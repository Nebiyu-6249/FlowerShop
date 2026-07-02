"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { useDB } from "@/lib/data/db";
import { aed, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/site/order-status-badge";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

export default function AdminDashboard() {
  const orders = useDB((s) => s.orders);
  const products = useDB((s) => s.products);
  const customers = useDB((s) => s.customers);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const avg = orders.length ? Math.round(revenue / orders.length) : 0;
    const lowStock = products.filter((p) => p.active && p.stock <= 5);
    return { revenue, avg, lowStock };
  }, [orders, products]);

  // revenue per day for the last 7 days
  const chart = useMemo(() => {
    const days: { label: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const total = orders.filter((o) => o.placedAt.slice(0, 10) === key).reduce((s, o) => s + o.total, 0);
      days.push({ label: d.toLocaleDateString("en-AE", { weekday: "short" }), total });
    }
    return days;
  }, [orders]);

  const max = Math.max(1, ...chart.map((d) => d.total));
  const recent = [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt)).slice(0, 6);
  const byStatus = STATUSES.map((s) => ({ s, n: orders.filter((o) => o.status === s).length }));

  // simple SVG bar chart, no chart library needed for a demo
  const W = 560, H = 180, PAD = 28;
  const barW = (W - PAD * 2) / chart.length - 14;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-mute">A live view of the store. Everything here updates as orders come in.</p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total revenue" value={aed(stats.revenue)} />
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Avg order value" value={aed(stats.avg)} />
        <Stat label="Customers" value={String(customers.length)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Revenue chart */}
        <section className="rounded-xl2 border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Revenue, last 7 days</h2>
            <span className="text-xs text-ink-mute">{aed(chart.reduce((s, d) => s + d.total, 0))} total</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H + 24}`} className="mt-4 w-full" role="img" aria-label="Bar chart of revenue for the last 7 days">
            {chart.map((d, i) => {
              const h = Math.max(3, (d.total / max) * (H - PAD));
              const x = PAD + i * ((W - PAD * 2) / chart.length) + 7;
              const y = H - h;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={barW} height={h} rx={8} className="fill-wine" opacity={d.total === 0 ? 0.15 : 0.9} />
                  {d.total > 0 && (
                    <text x={x + barW / 2} y={y - 7} textAnchor="middle" className="fill-ink" fontSize="11">
                      {d.total >= 1000 ? `${(d.total / 1000).toFixed(1)}k` : d.total}
                    </text>
                  )}
                  <text x={x + barW / 2} y={H + 16} textAnchor="middle" className="fill-ink" opacity="0.5" fontSize="11">
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </section>

        {/* Status breakdown + low stock */}
        <div className="space-y-6">
          <section className="rounded-xl2 border border-line bg-white p-6">
            <h2 className="text-sm font-semibold">Orders by status</h2>
            <div className="mt-3 space-y-2.5">
              {byStatus.map(({ s, n }) => (
                <div key={s} className="flex items-center gap-3">
                  <OrderStatusBadge status={s} />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                    <div className="h-full rounded-full bg-wine/70" style={{ width: `${orders.length ? (n / orders.length) * 100 : 0}%` }} />
                  </div>
                  <span className="w-6 text-end text-sm">{n}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl2 border border-line bg-white p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Low stock (≤5)
            </h2>
            {stats.lowStock.length === 0 ? (
              <p className="mt-2 text-sm text-ink-mute">All good, nothing running out.</p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-sm">
                {stats.lowStock.slice(0, 5).map((p) => (
                  <li key={p.id} className="flex justify-between gap-2">
                    <span className="truncate text-ink-soft">{p.name}</span>
                    <span className="shrink-0 font-medium text-amber-600">{p.stock} left</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {/* Recent orders */}
      <section className="mt-6 rounded-xl2 border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-wine hover:underline">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-line text-start text-xs text-ink-mute">
                <th className="py-2 text-start font-medium">Order</th>
                <th className="py-2 text-start font-medium">Customer</th>
                <th className="py-2 text-start font-medium">Placed</th>
                <th className="py-2 text-start font-medium">Status</th>
                <th className="py-2 text-end font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="py-2.5">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-wine hover:underline">{o.id}</Link>
                  </td>
                  <td className="py-2.5">{o.customerName}</td>
                  <td className="py-2.5 text-ink-mute">{formatDate(o.placedAt)}</td>
                  <td className="py-2.5"><OrderStatusBadge status={o.status} /></td>
                  <td className="py-2.5 text-end">{aed(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl2 border border-line bg-white p-5">
      <p className="text-xs text-ink-mute">{label}</p>
      <p className="mt-1 font-display text-2xl text-ink">{value}</p>
    </div>
  );
}
