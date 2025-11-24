'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart, Star } from 'lucide-react'

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Organic Heirloom Tomatoes',
    price: '$8.99',
    rating: 4.8,
    reviews: 124,
    image: '/organic-heirloom-tomatoes.jpg',
    badge: 'Bestseller',
  },
  {
    id: 2,
    name: 'Fresh Spinach & Kale Mix',
    price: '$5.99',
    rating: 4.9,
    reviews: 89,
    image: '/fresh-spinach-kale-mix.jpg',
    badge: 'Organic',
  },
  {
    id: 3,
    name: 'Sweet Organic Carrots',
    price: '$4.49',
    rating: 4.7,
    reviews: 156,
    image: '/sweet-organic-carrots.jpg',
    badge: 'New',
  },
  {
    id: 4,
    name: 'Local Farm Apples',
    price: '$6.99',
    rating: 4.9,
    reviews: 203,
    image: '/local-farm-fresh-apples.jpg',
    badge: 'Seasonal',
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 mb-4">
            Our Selection
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Handpicked selections of our finest organic produce, delivered fresh to your home.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product, index) => (
            <div
              key={product.id}
              className="group animate-fade-in-up bg-white rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all shadow-sm hover:shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product image */}
              <div className="relative h-64 overflow-hidden bg-foreground/5">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  {product.badge}
                </div>
              </div>

              {/* Product info */}
              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-foreground line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-primary text-primary'
                            : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-foreground/60">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price and button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-primary">
                    {product.price}
                  </span>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-secondary text-primary-foreground p-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-in-up">
          <Button size="lg" className="bg-primary hover:bg-secondary text-primary-foreground">
            View All Products
            <ShoppingCart className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
