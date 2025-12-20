'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Star } from 'lucide-react'

interface Product {
  id: number
  name: string
  category: string
  price: number
  images: string[]
  ratings: number
  product_description?: string | null
  review_count?: number
  badge?: string | null
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true)

        // You can tweak query params to express "featured" if your backend supports it.
        // For now, just fetch and pick top 4 by rating.
        const params = new URLSearchParams()
        params.append('sortBy', 'rating')

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()

        if (data.success) {
          const normalized: Product[] = (data.products || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: Number(p.price ?? 0),
            images: Array.isArray(p.images) ? p.images : [p.image || ''],
            ratings: Number(p.ratings ?? p.rating ?? 0),
            product_description: p.product_description ?? null,
            review_count: p.review_count ?? 0,
            badge: p.badge ?? null,
          }))

          // Take top 4 as "featured"
          setProducts(normalized.slice(0, 4))
        }
      } catch (err) {
        console.error('Failed to fetch featured products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-foreground/60">Loading featured products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-foreground/60">No featured products available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group animate-fade-in-up bg-white rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all shadow-sm hover:shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Product image */}
                <div className="relative h-64 overflow-hidden bg-foreground/5">
                  <img
                    src={(product.images && product.images[0]) || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {product.badge}
                    </div>
                  )}
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
                            i < Math.floor(product.ratings)
                              ? 'fill-primary text-primary'
                              : 'text-border'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-foreground/60">
                      {product.ratings.toFixed(1)}{' '}
                      {product.review_count ? `(${product.review_count})` : ''}
                    </span>
                  </div>

                  {/* Price and button */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹{Number(product.price).toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-secondary text-primary-foreground p-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-in-up">
          <Link href="/shop">
            <Button size="lg" className="bg-primary hover:bg-secondary text-primary-foreground">
              View All Products
              <ShoppingCart className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
