"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { useDB } from "@/lib/data/db";
import type { OrderStatus } from "@/lib/types";
import { aed, formatDate } from "@/lib/utils";
import { SITE_NAME, SUPPORT_PHONE } from "@/lib/config";
import { OrderStatusBadge } from "@/components/site/order-status-badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const STATUSES: OrderStatus[] = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

export default function AdminOrderDetail({ params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const order = useDB((s) => s.orders.find((o) => o.id === id));
  const setOrderStatus = useDB((s) => s.setOrderStatus);

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <p className="font-display text-2xl">Order not found</p>
        <Link href="/admin/orders" className="mt-2 inline-block text-sm text-wine underline">Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Toolbar, hidden when printing */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/admin/orders" className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-wine">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> All orders
        </Link>
        <div className="flex items-center gap-2">
          <Select
            aria-label="Order status"
            className="h-10 w-44"
            value={order.status}
            onChange={(e) => setOrderStatus(order.id, e.target.value as OrderStatus)}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print slip
          </Button>
        </div>
      </div>

      {/* Delivery slip: styled on screen, clean on paper via @media print rules */}
      <div className="print-slip mt-5 rounded-xl2 border border-line bg-white p-8 print:mt-0 print:rounded-none print:border-0 print:p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-2xl">{SITE_NAME}</p>
            <p className="text-xs text-ink-mute">Delivery slip · {SUPPORT_PHONE}</p>
          </div>
          <div className="text-end">
            <p className="font-semibold">{order.id}</p>
            <p className="text-xs text-ink-mute">Placed {formatDate(order.placedAt)}</p>
            <div className="mt-1 print:hidden"><OrderStatusBadge status={order.status} /></div>
          </div>
        </div>

        <Separator className="my-5" />

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute">Deliver to</p>
            <p className="mt-1.5 text-sm font-medium">{order.customerName}</p>
            <p className="text-sm text-ink-soft">{order.building}</p>
            <p className="text-sm text-ink-soft">{order.area}, {order.emirate}</p>
            <p className="text-sm text-ink-soft">{order.phone}</p>
            {order.addressNotes && <p className="mt-1 text-xs italic text-ink-mute">Note: {order.addressNotes}</p>}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute">Delivery window</p>
            <p className="mt-1.5 text-sm font-medium">{formatDate(order.deliveryDate)}</p>
            <p className="text-sm text-ink-soft">{order.slot}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink-mute">Payment</p>
            <p className="mt-1 text-sm text-ink-soft">{order.paymentMethod} · paid</p>
          </div>
        </div>

        <Separator className="my-5" />

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-ink-mute">
              <th className="pb-2 text-start font-medium">Item</th>
              <th className="pb-2 text-center font-medium">Qty</th>
              <th className="pb-2 text-end font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i, idx) => (
              <tr key={idx} className="border-t border-line align-top">
                <td className="py-2.5">
                  <p className="font-medium">{i.productName} <span className="font-normal text-ink-mute">({i.size})</span></p>
                  {i.addOns.length > 0 && <p className="text-xs text-ink-soft">+ {i.addOns.map((a) => a.name).join(", ")}</p>}
                  {i.giftMessage && (
                    <p className="mt-1 rounded-lg bg-blush/50 px-2 py-1 text-xs italic text-wine-deep print:bg-transparent print:px-0">
                      Card: “{i.giftMessage}”
                    </p>
                  )}
                </td>
                <td className="py-2.5 text-center">{i.qty}</td>
                <td className="py-2.5 text-end">{aed(i.unitPrice * i.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Separator className="my-4" />
        <div className="ms-auto max-w-56 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span>{aed(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-ink-soft">Delivery</span><span>{order.deliveryFee === 0 ? "Free" : aed(order.deliveryFee)}</span></div>
          {order.discount > 0 && <div className="flex justify-between"><span className="text-ink-soft">Discount{order.promoCode ? ` (${order.promoCode})` : ""}</span><span>-{aed(order.discount)}</span></div>}
          <div className="flex justify-between border-t border-line pt-1 font-semibold"><span>Total</span><span>{aed(order.total)}</span></div>
        </div>

        <p className="mt-6 text-center text-[11px] text-ink-mute">
          No prices are shown to the recipient on the gift card. Handle with care, keep upright and chilled.
        </p>
      </div>
    </div>
  );
}
