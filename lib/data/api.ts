"use client";

/**
 * Async data-access layer. Components that perform *transactions* (checkout, login,
 * promo validation) go through these functions, which mimic real API latency.
 *
 * TODO: integrate Postgres/Prisma — replace each function body with a fetch() to an
 * API route (or a server action) backed by Prisma. Signatures stay identical, so the
 * presentation layer does not change.
 * TODO: integrate Stripe — placeOrder() currently simulates payment; in production it
 * should create a Stripe PaymentIntent (or a Tabby/Tamara session) and only create the
 * order after the webhook confirms payment.
 */

import { useDB } from "@/lib/data/db";
import type { Customer, Order, PromoCode } from "@/lib/types";
import { uid } from "@/lib/utils";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function validatePromo(code: string, subtotal: number): Promise<{ ok: true; promo: PromoCode; discount: number } | { ok: false; reason: string }> {
  await delay(250);
  const promo = useDB.getState().promoCodes.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
  if (!promo || !promo.active) return { ok: false, reason: "That code isn't valid." };
  if (new Date(promo.expiresAt) < new Date()) return { ok: false, reason: "That code has expired." };
  if (promo.usedCount >= promo.usageLimit) return { ok: false, reason: "That code has reached its usage limit." };
  if (subtotal < promo.minOrder) return { ok: false, reason: `Minimum order for this code is AED ${promo.minOrder}.` };
  const discount = promo.type === "percent" ? Math.round((subtotal * promo.value) / 100) : promo.value;
  return { ok: true, promo, discount };
}

/** Simulates a payment then writes the order. Also logs a mock email receipt to the console. */
export async function placeOrder(order: Omit<Order, "placedAt" | "status" | "pointsEarned">): Promise<Order> {
  await delay(900); // pretend the payment provider is thinking
  const full: Order = {
    ...order,
    status: "Placed",
    placedAt: new Date().toISOString(),
    pointsEarned: Math.floor(order.total / 10),
  };
  const db = useDB.getState();
  db.addOrder(full);
  if (order.promoCode) db.redeemPromo(order.promoCode);
  db.addLoyaltyPoints(order.customerEmail, full.pointsEarned);

  // Mock email receipt (a real transactional email goes here later, e.g. Resend/SES).
  console.info(
    `%c[mock email] Receipt sent to ${order.customerEmail}`,
    "color:#6D2436;font-weight:bold",
    `\nOrder ${full.id} — AED ${full.total}\nDelivery: ${full.deliveryDate}, ${full.slot}\nItems: ${full.items.map((i) => `${i.qty}x ${i.productName} (${i.size})`).join(", ")}`,
  );
  return full;
}

export async function login(email: string, password: string): Promise<{ ok: true; customer: Customer } | { ok: false; reason: string }> {
  await delay(400);
  const c = useDB.getState().customers.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  if (!c || c.password !== password) return { ok: false, reason: "Email or password doesn't match." };
  return { ok: true, customer: c };
}

export async function register(name: string, email: string, phone: string, password: string): Promise<{ ok: true; customer: Customer } | { ok: false; reason: string }> {
  await delay(500);
  const db = useDB.getState();
  if (db.customers.some((x) => x.email.toLowerCase() === email.trim().toLowerCase()))
    return { ok: false, reason: "An account with that email already exists." };
  const customer: Customer = {
    id: uid("cu"), name, email: email.trim(), phone, password,
    addresses: [], loyaltyPoints: 0, createdAt: new Date().toISOString(),
  };
  db.upsertCustomer(customer);
  return { ok: true, customer };
}
