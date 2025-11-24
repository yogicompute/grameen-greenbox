import {
  HeroSection,
  Categories,
  TrendingDeals,
  FeaturedProducts,
  WhyChooseUs,
  Testimonials,
} from "@/components/hero";

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
