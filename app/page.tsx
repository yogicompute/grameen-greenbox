import type { Metadata } from "next";
import {
  HeroSection,
  Categories,
  TrendingDeals,
  FeaturedProducts,
  WhyChooseUs,
  Testimonials,
} from "@/components/hero";

export const metadata: Metadata = {
  title: "Home | Grameen GreenBox",
};

export default function page() {

  return (
    <>
      <HeroSection />
      <Categories />
      <TrendingDeals />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}
