"use client";

import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";
import { useDB } from "@/lib/data/db";
import { aed, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const order = useDB((s) => s.orders.find((o) => o.id === decodeURIComponent(params.id)));

  if (!order) {
    return (
      <div className="container py-24 text-center">
        <p className="font-display text-2xl">Order not found</p>
        <Link href="/shop" className="mt-3 inline-block text-sm text-wine underline">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10 md:py-16">
      <div className="rounded-xl2 border border-line bg-white p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto h-14 w-14 text-sage" />
        <h1 className="mt-4 font-display text-3xl">Order placed</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Thank you, {order.customerName.split(" ")[0]}. Your order number is{" "}
          <span className="font-semibold text-wine">{order.id}</span>.
        </p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-ink-mute">
          <Mail className="h-3.5 w-3.5" /> A confirmation email is on its way to {order.customerEmail}.
        </p>

        <div className="mt-6 rounded-xl bg-blush/50 p-4 text-sm">
          <p className="font-medium text-wine-deep">Estimated delivery</p>
          <p className="mt-0.5 text-ink-soft">{formatDate(order.deliveryDate)} · {order.slot}</p>
          <p className="text-xs text-ink-mute">{order.building}, {order.area}, {order.emirate}</p>
        </div>

        <div className="mt-6 text-start">
          <ul className="space-y-2 text-sm">
            {order.items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-3">
                <div>
                  <span>{i.qty}× {i.productName} <span className="text-ink-mute">({i.size})</span></span>
                  {i.addOns.length > 0 && <p className="text-xs text-ink-mute">+ {i.addOns.map((a) => a.name).join(", ")}</p>}
                  {i.giftMessage && <p className="text-xs italic text-wine-deep">“{i.giftMessage}”</p>}
                </div>
                <span className="shrink-0">{aed(i.unitPrice * i.qty)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span>{aed(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Delivery</span><span>{order.deliveryFee === 0 ? "Free" : aed(order.deliveryFee)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-sage"><span>Discount{order.promoCode ? ` (${order.promoCode})` : ""}</span><span>-{aed(order.discount)}</span></div>}
            <div className="flex justify-between pt-1 font-medium"><span>Paid with {order.paymentMethod}</span><span className="font-display text-lg text-wine">{aed(order.total)}</span></div>
          </div>
          <p className="mt-3 rounded-lg bg-sand px-3 py-2 text-xs text-ink-soft">
            You earned <span className="font-semibold text-wine">{order.pointsEarned} loyalty points</span> on this order.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/account" className="inline-flex h-11 items-center rounded-full bg-wine px-6 text-sm font-medium text-white hover:bg-wine-deep">Track order</Link>
          <Link href="/shop" className="inline-flex h-11 items-center rounded-full border border-line bg-white px-6 text-sm font-medium hover:border-wine hover:text-wine">Keep shopping</Link>
        </div>
      </div>
    </div>
  );
}
