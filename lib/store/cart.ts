"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Size, Slot } from "@/lib/types";
import { uid } from "@/lib/utils";

interface CartState {
  items: CartItem[];
  deliveryDate: string; // ISO date
  slot: Slot;
  promoCode?: string;
  promoDiscount: number;

  add: (item: Omit<CartItem, "id">) => void;
  updateQty: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
  setDelivery: (date: string, slot: Slot) => void;
  applyPromo: (code: string, discount: number) => void;
  clearPromo: () => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      deliveryDate: "",
      slot: "Afternoon (12pm - 5pm)",
      promoCode: undefined,
      promoDiscount: 0,

      add: (item) =>
        set((s) => {
          // merge identical lines (same product, size, add-ons, message)
          const key = (i: Omit<CartItem, "id">) => `${i.productId}|${i.size}|${[...i.addOnIds].sort().join(",")}|${i.giftMessage ?? ""}`;
          const existing = s.items.find((x) => key(x) === key(item));
          if (existing) {
            return { items: s.items.map((x) => (x.id === existing.id ? { ...x, qty: x.qty + item.qty } : x)) };
          }
          return { items: [...s.items, { ...item, id: uid("line") }] };
        }),
      updateQty: (lineId, qty) =>
        set((s) => ({ items: s.items.map((x) => (x.id === lineId ? { ...x, qty: Math.max(1, qty) } : x)) })),
      remove: (lineId) => set((s) => ({ items: s.items.filter((x) => x.id !== lineId) })),
      setDelivery: (deliveryDate, slot) => set({ deliveryDate, slot }),
      applyPromo: (promoCode, promoDiscount) => set({ promoCode, promoDiscount }),
      clearPromo: () => set({ promoCode: undefined, promoDiscount: 0 }),
      clear: () => set({ items: [], promoCode: undefined, promoDiscount: 0 }),
    }),
    { name: "fleuraya-cart-v1", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
