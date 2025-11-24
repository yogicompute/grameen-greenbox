"use client";

import { useState } from "react";
import { mockProducts } from "@/lib/mock-products";
import ProductImageCarousel from "@/components/product-image-carousel";
import ProductDetailsSection from "@/components/product-details-section";
import ProductReviews from "@/components/product-reviews";
import ProductRecommendations from "@/components/product-recommendations";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import {
  Check,
  Star,
  Zap,
  Tag,
  Layers,
  Info,
  Box,
  Slash,
} from "lucide-react";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product =
    mockProducts.find((p) => p.id === params.id) || mockProducts[0];



  // small set of decorative icons to cycle through for feature bullets
  const featureIcons = [Star, Zap, Tag, Layers];

  return (
    <MaxWidthContainer>
      <main className="bg-background min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-2 items-stretch">
            {/* Left: Image Carousel */}
            <div className="h-full flex items-center justify-center">
              {/* constraining carousel so it visually matches the detail column height */}
              <div className="w-full h-full max-h-[700px] rounded-lg overflow-hidden">
                <ProductImageCarousel
                  images={product.images}
                  productTitle={product.title}
                />
              </div>
            </div>

            {/* Right: Details */}
            <div className="h-full flex flex-col">
              {/* card-like container to visually balance the image column */}
              <div className="w-full h-full p-6 bg-card/40 flex flex-col">
                <ProductDetailsSection product={product} />
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-border pt-8 mb-16">
            <div className="space-y-8">
              {/* Description (full width) */}
              <div className="p-6 rounded-lg bg-linear-to-r from-green-50/30 to-transparent border-l-4 border-primary shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                      <Info size={18} />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                      Overview
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Description
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.longDescription}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full shadow-sm">
                        <Check size={14} /> Guaranteed quality
                      </span>
                      <span className="inline-flex items-center gap-2 bg-primary/5 text-primary text-xs px-3 py-1 rounded-full shadow-sm">
                        <Box size={14} /> Packaged safely
                      </span>
                      <span className="inline-flex items-center gap-2 bg-secondary/5 text-secondary text-xs px-3 py-1 rounded-full shadow-sm">
                        <Slash size={14} /> Minimal waste
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features & Specifications: side-by-side on lg screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Features */}
                <div className="p-6 border border-border rounded-lg bg-white/60 shadow-sm h-full flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center bg-linear-to-br from-green-50 to-green-100 text-green-700 rounded-md w-10 h-10 shadow-sm">
                      <Check size={18} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Key Features
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        Why customers love this product
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-3 flex-1 overflow-auto">
                    {product.features.map((feature, idx) => {
                      const Icon = featureIcons[idx % featureIcons.length];
                      return (
                        <li
                          key={idx}
                          className="flex gap-4 items-start group hover:bg-secondary/5 rounded-md p-3 transition-colors"
                        >
                          <div className="shrink-0">
                            <div className="w-9 h-9 rounded-md flex items-center justify-center bg-linear-to-br from-primary/5 to-transparent text-primary shadow-sm">
                              <Icon size={14} />
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-foreground font-medium">
                                {feature}
                              </span>
                              <span className="text-xs text-muted-foreground ml-4">
                                {idx < 2 ? "Top pick" : "Popular"}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {/* subtle supporting copy - keep short to avoid layout noise */}
                              {product.features?.[idx] ?? ""}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-4 text-sm text-muted-foreground">
                    Tip: Hover a feature to see its short note.
                  </div>
                </div>

                {/* Specifications */}
                <div className="p-0 border border-border rounded-lg overflow-hidden h-full flex flex-col shadow-sm">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center bg-slate-100 rounded-md w-10 h-10">
                        <Layers size={18} className="text-slate-700" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-0">
                          Specifications
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                          Quick technical overview
                        </p>
                      </div>
                    </div>

                    
                  </div>

                  <div className="divide-y divide-border overflow-auto flex-1">
                    {Object.entries(product.specifications).map(
                      ([key, value], idx) => (
                        <div
                          key={idx}
                          className={`flex items-center p-4 ${
                            idx % 2 === 0 ? "bg-secondary/5" : "bg-transparent"
                          }`}
                        >
                          <div className="w-1/3 font-semibold text-foreground pr-4">
                            <div className="inline-flex items-center gap-2">
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-primary/10 text-primary text-[10px]">
                                {key.slice(0, 1).toUpperCase()}
                              </span>
                              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                            </div>
                          </div>

                          <div className="w-2/3 text-muted-foreground flex items-center justify-between">
                            <span>{value}</span>
                            <span className="text-xs text-muted-foreground/80 ml-4">
                              {/* small hint if values are numeric vs text */}
                              {typeof value === "number" ? "numeric" : "text"}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="p-4 border-t border-border text-xs text-muted-foreground flex items-center gap-2">
                    <Info size={14} />
                    Note: Specifications are provided by the manufacturer and may vary.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-border pt-8 mb-16">
            <ProductReviews product={product} />
          </div>

          {/* Recommendations */}
          <div className="border-t border-border pt-8">
            <ProductRecommendations currentProductId={product.id} />
          </div>
        </div>
      </main>
    </MaxWidthContainer>
  );
}
