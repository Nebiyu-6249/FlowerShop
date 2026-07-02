import type { Metadata } from "next";
import { seedProducts } from "@/lib/data/seed";
import { ProductDetailClient } from "@/components/site/product-detail-client";

interface Props { params: { slug: string } }

export function generateMetadata({ params }: Props): Metadata {
  const p = seedProducts.find((x) => x.slug === params.slug);
  if (!p) return { title: "Product" };
  return {
    title: p.name,
    description: p.description.slice(0, 155),
    openGraph: { title: p.name, description: p.description.slice(0, 155), images: p.images.slice(0, 1) },
  };
}

export default function ProductPage({ params }: Props) {
  return <ProductDetailClient slug={params.slug} />;
}
