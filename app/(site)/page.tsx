import {
  Hero, OccasionTiles, TrustStrip, CategoryShortcuts, ReviewsSection,
} from "@/components/site/home-sections";
import { HomeProductRows } from "@/components/site/home-product-rows";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <OccasionTiles />
      <HomeProductRows />
      <CategoryShortcuts />
      <ReviewsSection />
    </>
  );
}
