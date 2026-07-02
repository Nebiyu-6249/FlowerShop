import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopClient } from "@/components/site/shop-client";

export const metadata: Metadata = {
  title: "Shop flowers & gifts",
  description: "Browse hand-tied bouquets, flower boxes, plants and gifts. Filter by occasion, flower type, colour and price. Same-day delivery across the UAE.",
};

export default function ShopPage() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
