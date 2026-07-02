"use client";

/**
 * Mock database for the demo.
 *
 * Everything lives in a persisted Zustand store, so the app behaves like it has a real
 * backend: admin edits show up instantly on the storefront and survive a refresh.
 *
 * TODO: integrate Postgres/Prisma — in production this store disappears. Each action below
 * maps 1:1 to a Prisma call behind an API route or server action; the UI never changes
 * because components only talk to lib/data/api.ts and these typed actions.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AddOn, Category, Customer, DeliveryZone, Occasion, Order, Product, PromoCode, Review, SiteContent,
} from "@/lib/types";
import {
  seedAddOns, seedCategories, seedContent, seedCustomers, seedOccasions, seedOrders, seedProducts,
  seedPromos, seedReviews, seedZones,
} from "@/lib/data/seed";
import { uid } from "@/lib/utils";

export interface DBState {
  products: Product[];
  categories: Category[];
  occasions: Occasion[];
  addOns: AddOn[];
  orders: Order[];
  customers: Customer[];
  promoCodes: PromoCode[];
  zones: DeliveryZone[];
  reviews: Review[];
  content: SiteContent;

  // products
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  // taxonomy
  addCategory: (name: string) => void;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addOccasion: (name: string, emoji: string) => void;
  deleteOccasion: (id: string) => void;
  // orders
  addOrder: (o: Order) => void;
  setOrderStatus: (id: string, status: Order["status"]) => void;
  // customers
  upsertCustomer: (c: Customer) => void;
  addLoyaltyPoints: (email: string, pts: number) => void;
  // promos
  upsertPromo: (p: PromoCode) => void;
  deletePromo: (id: string) => void;
  redeemPromo: (code: string) => void;
  // zones
  updateZone: (z: DeliveryZone) => void;
  // content
  setContent: (c: Partial<SiteContent>) => void;
  // demo helper
  resetDemo: () => void;
}

const seedState = () => ({
  products: seedProducts,
  categories: seedCategories,
  occasions: seedOccasions,
  addOns: seedAddOns,
  orders: seedOrders,
  customers: seedCustomers,
  promoCodes: seedPromos,
  zones: seedZones,
  reviews: seedReviews,
  content: seedContent,
});

export const useDB = create<DBState>()(
  persist(
    (set) => ({
      ...seedState(),

      upsertProduct: (p) =>
        set((s) => ({
          products: s.products.some((x) => x.id === p.id)
            ? s.products.map((x) => (x.id === p.id ? p : x))
            : [{ ...p, id: p.id || uid("p") }, ...s.products],
        })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      addCategory: (name) =>
        set((s) => ({
          categories: [...s.categories, { id: uid("c"), name, slug: name.toLowerCase().replace(/\s+/g, "-"), image: s.products[0]?.images[0] ?? "" }],
        })),
      renameCategory: (id, name) =>
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, name } : c)) })),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
      addOccasion: (name, emoji) =>
        set((s) => ({ occasions: [...s.occasions, { id: uid("o"), name, slug: name.toLowerCase().replace(/\s+/g, "-"), emoji }] })),
      deleteOccasion: (id) => set((s) => ({ occasions: s.occasions.filter((o) => o.id !== id) })),

      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      setOrderStatus: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),

      upsertCustomer: (c) =>
        set((s) => ({
          customers: s.customers.some((x) => x.id === c.id)
            ? s.customers.map((x) => (x.id === c.id ? c : x))
            : [...s.customers, c],
        })),
      addLoyaltyPoints: (email, pts) =>
        set((s) => ({
          customers: s.customers.map((c) => (c.email === email ? { ...c, loyaltyPoints: c.loyaltyPoints + pts } : c)),
        })),

      upsertPromo: (p) =>
        set((s) => ({
          promoCodes: s.promoCodes.some((x) => x.id === p.id)
            ? s.promoCodes.map((x) => (x.id === p.id ? p : x))
            : [...s.promoCodes, { ...p, id: p.id || uid("pr") }],
        })),
      deletePromo: (id) => set((s) => ({ promoCodes: s.promoCodes.filter((p) => p.id !== id) })),
      redeemPromo: (code) =>
        set((s) => ({
          promoCodes: s.promoCodes.map((p) => (p.code === code ? { ...p, usedCount: p.usedCount + 1 } : p)),
        })),

      updateZone: (z) => set((s) => ({ zones: s.zones.map((x) => (x.id === z.id ? z : x)) })),

      setContent: (c) => set((s) => ({ content: { ...s.content, ...c } })),

      resetDemo: () => set(() => seedState()),
    }),
    {
      name: "fleuraya-db-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
